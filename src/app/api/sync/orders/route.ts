// src/app/api/sync/orders/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '';
const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';

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
      `https://${SHOPIFY_STORE}/admin/api/2024-01/orders.json?status=any&limit=250`,
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
    for (const order of orders) {
      // Buscar usuário pelo email
      const { data: userProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', order.email)
        .maybeSingle();

      // Upsert do pedido
      await supabaseAdmin
        .from('orders_sync')
        .upsert({
          shopify_order_id: order.id.toString(),
          shopify_order_number: order.order_number?.toString(),
          user_id: userProfile?.id || null,
          total_price: parseFloat(order.total_price),
          currency: order.currency,
          status: order.financial_status,
          fulfillment_status: order.fulfillment_status,
          line_items: order.line_items.map((item: Record<string, unknown>) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
          shopify_created_at: order.created_at,
          synced_at: new Date().toISOString(),
        }, {
          onConflict: 'shopify_order_id',
        });

      synced++;
    }

    return NextResponse.json({
      success: true,
      synced,
      message: `${synced} pedidos sincronizados`,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
