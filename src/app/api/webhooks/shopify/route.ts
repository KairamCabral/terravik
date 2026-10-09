// src/app/api/webhooks/shopify/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { iguaisEmTempoConstante } from '@/lib/seguranca/comparar';
import { dadosDeEnvio, emailDoPedido, itensDoPedido } from '@/lib/shopify/pedido';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';

// Verificar assinatura do webhook
function verifyWebhook(body: string, signature: string): boolean {
  // Sem segredo, nada passa. O ambiente onde a variável não foi definida é
  // justamente o ambiente onde ninguém está olhando.
  if (!SHOPIFY_WEBHOOK_SECRET) {
    console.error('[webhooks/shopify] SHOPIFY_WEBHOOK_SECRET não configurado. Webhook recusado.');
    return false;
  }
  const hash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');
  return iguaisEmTempoConstante(hash, signature);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('X-Shopify-Hmac-Sha256') || '';
    const topic = request.headers.get('X-Shopify-Topic') || '';

    // Verificar assinatura
    if (!verifyWebhook(body, signature)) {
      console.error('Webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(body);

    // Processar por tipo de webhook
    switch (topic) {
      case 'orders/create':
      case 'orders/updated':
      // orders/fulfilled traz o pedido inteiro com o array de fulfillments,
      // igual a orders/updated depois do despacho. O mesmo handler serve.
      case 'orders/fulfilled':
      case 'orders/partially_fulfilled':
        await handleOrderWebhook(data);
        break;

      case 'customers/create':
      case 'customers/update':
        await handleCustomerWebhook(data);
        break;

      case 'products/create':
      case 'products/update':
      case 'products/delete':
        revalidateTag('products');
        break;

      case 'collections/create':
      case 'collections/update':
      case 'collections/delete':
        revalidateTag('collections');
        break;

      case 'inventory_levels/update':
      case 'inventory_levels/connect':
      case 'inventory_levels/disconnect':
        revalidateTag('products');
        break;

      case 'app/uninstalled':
        console.log('App uninstalled');
        break;

      default:
        console.log(`Unhandled webhook topic: ${topic}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Handler para webhooks de pedidos
async function handleOrderWebhook(order: Record<string, unknown>) {
  const orderId = order.id as number;
  const email = emailDoPedido(order);
  const totalPrice = order.total_price as string;
  const currency = order.currency as string;
  const financialStatus = order.financial_status as string;
  const fulfillmentStatus = order.fulfillment_status as string | null;
  const orderNumber = order.order_number as number | undefined;
  const createdAt = order.created_at as string;
  const envio = dadosDeEnvio(order);

  console.log(`Processing order webhook: ${orderId}`);

  // Buscar usuário pelo email.
  //
  // Comprar sem ter conta no site é o caminho normal: o pedido entra sem dono,
  // com customer_email, e é adotado quando a pessoa criar a conta (trigger
  // trg_profiles_vincular_pedidos_novo, no banco).
  const { data: profile } = email
    ? await supabaseAdmin.from('profiles').select('id').eq('email', email).maybeSingle()
    : { data: null };

  // Upsert do pedido.
  //
  // user_id só entra quando o perfil foi encontrado: mandar null desfaria, no
  // próximo orders/updated, o vínculo que o banco já tinha feito.
  const { error: erroUpsert } = await supabaseAdmin
    .from('orders_sync')
    .upsert({
      shopify_order_id: orderId.toString(),
      shopify_order_number: orderNumber?.toString() ?? null,
      ...(profile?.id ? { user_id: profile.id } : {}),
      customer_email: email,
      total_price: parseFloat(totalPrice),
      currency: currency,
      status: financialStatus,
      fulfillment_status: fulfillmentStatus,
      line_items: itensDoPedido(order.line_items),
      shopify_created_at: createdAt,
      synced_at: new Date().toISOString(),
      // Rastreio, despacho e entrega: só as chaves que vieram no payload.
      ...envio,
    }, {
      onConflict: 'shopify_order_id',
    });

  // Erro aqui precisa virar 500: a Shopify reenvia o webhook, e sem isso um
  // rastreio que o banco recusou sumiria com resposta 200.
  if (erroUpsert) {
    throw new Error(`orders_sync upsert: ${erroUpsert.message}`);
  }

  // Se for primeira compra, dar achievement
  if (profile?.id) {
    const { count } = await supabaseAdmin
      .from('orders_sync')
      .select('id', { count: 'exact' })
      .eq('user_id', profile.id);

    if (count === 1) {
      await grantAchievement(profile.id, 'first_purchase');
    }
  }

  // Registrar métrica
  await recordMetric('orders_created', 1);
}

// Handler para webhooks de clientes
async function handleCustomerWebhook(customer: Record<string, unknown>) {
  const customerId = customer.id as number;
  const email = customer.email as string;
  const firstName = customer.first_name as string;
  const lastName = customer.last_name as string;
  const phone = customer.phone as string | null;

  console.log(`Processing customer webhook: ${customerId}`);

  // Buscar perfil existente pelo email
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (existingProfile) {
    // Só grava o que veio preenchido. Cliente que comprou só com e-mail chega
    // com first_name, last_name e phone nulos: gravar tudo deixava "null null"
    // como nome e apagava o telefone cadastrado no site.
    const nome = [firstName, lastName].filter(Boolean).join(' ').trim();
    const atualizacao: {
      shopify_customer_id: string;
      shopify_email: string;
      updated_at: string;
      full_name?: string;
      phone?: string;
    } = {
      shopify_customer_id: customerId.toString(),
      shopify_email: email,
      updated_at: new Date().toISOString(),
    };
    if (nome) atualizacao.full_name = nome;
    if (phone) atualizacao.phone = phone;

    await supabaseAdmin
      .from('profiles')
      .update(atualizacao)
      .eq('id', existingProfile.id);
  }
}

// Função auxiliar para conceder conquistas
async function grantAchievement(userId: string, achievementCode: string) {
  const { data: achievement } = await supabaseAdmin
    .from('achievements')
    .select('id, xp_reward')
    .eq('code', achievementCode)
    .single();

  if (!achievement) return;

  // Verificar se já tem
  const { data: existing } = await supabaseAdmin
    .from('user_achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('achievement_id', achievement.id)
    .single();

  if (existing) return;

  // Conceder achievement
  await supabaseAdmin
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievement.id,
    });

  // Adicionar XP
  if (achievement.xp_reward) {
    await supabaseAdmin.rpc('add_user_xp', {
      p_user_id: userId,
      p_xp_amount: achievement.xp_reward,
    });
  }

  // Criar notificação
  await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'achievement',
      title: 'Nova conquista desbloqueada!',
      message: `Você ganhou a conquista e ${achievement.xp_reward} XP!`,
      // /minha-conta/conquistas não existe neste projeto. A rota é esta.
      action_url: '/academia/conquistas',
    });
}

// Função auxiliar para registrar métricas
async function recordMetric(metricType: string, value: number, metadata = {}) {
  const today = new Date().toISOString().split('T')[0];

  // Tentar buscar métrica existente para o dia
  const { data: existing } = await supabaseAdmin
    .from('admin_metrics')
    .select('id, value')
    .eq('date', today)
    .eq('metric_type', metricType)
    .single();

  if (existing) {
    // Incrementar valor existente
    await supabaseAdmin
      .from('admin_metrics')
      .update({
        value: existing.value + value,
        metadata,
      })
      .eq('id', existing.id);
  } else {
    // Criar nova entrada
    await supabaseAdmin
      .from('admin_metrics')
      .insert({
        date: today,
        metric_type: metricType,
        value,
        metadata,
      });
  }
}
