// src/app/api/sync/orders/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { dadosDeEnvio, emailDoPedido, itensDoPedido } from '@/lib/shopify/pedido';

const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '';
const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-10';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação admin via header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verificar se o usuário é admin via Supabase
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!SHOPIFY_ADMIN_TOKEN || !SHOPIFY_STORE) {
      return NextResponse.json(
        { error: 'Shopify credentials not configured' },
        { status: 500 }
      );
    }

    // Buscar pedidos do Shopify
    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&limit=250`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const { orders } = await response.json();

    // Processar cada pedido
    let synced = 0;
    let falhas = 0;
    for (const order of orders ?? []) {
      const email = emailDoPedido(order);

      // Buscar usuário pelo email
      const { data: userProfile } = email
        ? await supabaseAdmin.from('profiles').select('id').eq('email', email).maybeSingle()
        : { data: null };

      // Upsert do pedido.
      //
      // user_id só entra quando o perfil foi encontrado. Mandar null aqui
      // desfaria, a cada sincronização, o vínculo que o banco fez sozinho
      // (trigger em profiles) para quem criou conta depois de comprar.
      const { error: erroUpsert } = await supabaseAdmin
        .from('orders_sync')
        .upsert({
          shopify_order_id: order.id.toString(),
          shopify_order_number: order.order_number?.toString(),
          ...(userProfile?.id ? { user_id: userProfile.id } : {}),
          customer_email: email,
          total_price: parseFloat(order.total_price),
          currency: order.currency,
          status: order.financial_status,
          fulfillment_status: order.fulfillment_status,
          // Mesmo formato do webhook. Antes esta rota gravava só
          // {id, title, quantity, price}: todo pedido do histórico entrava
          // sem product_id, que é o que liga o pedido a um produto.
          line_items: itensDoPedido(order.line_items),
          shopify_created_at: order.created_at,
          synced_at: new Date().toISOString(),
          ...dadosDeEnvio(order),
        }, {
          onConflict: 'shopify_order_id',
        });

      if (erroUpsert) {
        falhas++;
        console.error('[sync/orders] Falha ao gravar pedido:', erroUpsert.message);
        continue;
      }

      synced++;
    }

    // Adota os pedidos que acabaram de ganhar customer_email e cujo dono já
    // tem conta com o mesmo e-mail escrito com outra caixa.
    const { error: erroVinculo } = await supabaseAdmin.rpc('vincular_pedidos_orfaos');
    if (erroVinculo) {
      console.error('[sync/orders] Falha ao vincular pedidos órfãos:', erroVinculo.message);
    }

    return NextResponse.json({
      success: true,
      synced,
      falhas,
      message: `${synced} pedidos sincronizados`,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
