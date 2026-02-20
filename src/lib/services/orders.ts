// src/lib/services/orders.ts
// DONO: Shopify (cache no Supabase via orders_sync)
// Estratégia: Cache First → Shopify Fallback

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type OrderSync = Database['public']['Tables']['orders_sync']['Row']

export interface OrderDisplay {
  id: string
  orderNumber: string
  shopifyOrderId: string
  date: string
  total: number
  currency: string
  status: string
  fulfillmentStatus: string | null
  itemCount: number
  items: Array<{
    title: string
    quantity: number
    price: string
  }>
  trackingNumber?: string | null
  trackingUrl?: string | null
  trackingCompany?: string | null
  shopifyUrl?: string
}

/**
 * Buscar pedidos do usuário (cache no Supabase)
 * Source of Truth: Shopify (via webhook → orders_sync)
 */
export async function getUserOrders(userId: string): Promise<OrderDisplay[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders_sync')
    .select('*')
    .eq('user_id', userId)
    .order('shopify_created_at', { ascending: false })

  if (error || !data) return []

  return data.map(mapOrderToDisplay)
}

/**
 * Buscar pedido específico
 */
export async function getOrderById(
  userId: string,
  orderId: string
): Promise<OrderDisplay | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders_sync')
    .select('*')
    .eq('user_id', userId)
    .eq('id', orderId)
    .single()

  if (error || !data) return null

  return mapOrderToDisplay(data)
}

function mapOrderToDisplay(order: OrderSync): OrderDisplay {
  const lineItems = (order.line_items as Array<Record<string, unknown>>) || []
  const shopifyOrderId = order.shopify_order_id
  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || ''

  return {
    id: order.id,
    orderNumber: order.shopify_order_number || shopifyOrderId,
    shopifyOrderId: shopifyOrderId,
    date: order.shopify_created_at || order.created_at || '',
    total: order.total_price || 0,
    currency: order.currency || 'BRL',
    status: order.status || 'pending',
    fulfillmentStatus: order.fulfillment_status,
    itemCount: lineItems.reduce(
      (acc, item) => acc + (Number(item.quantity) || 0),
      0
    ),
    items: lineItems.map((item) => ({
      title: String(item.title || ''),
      quantity: Number(item.quantity || 0),
      price: String(item.price || '0'),
    })),
    trackingNumber: (order as OrderSync & { tracking_number?: string }).tracking_number ?? null,
    trackingUrl: (order as OrderSync & { tracking_url?: string }).tracking_url ?? null,
    trackingCompany: (order as OrderSync & { tracking_company?: string }).tracking_company ?? null,
    shopifyUrl: shopifyOrderId && shopifyDomain 
      ? `https://${shopifyDomain}/account/orders/${shopifyOrderId}`
      : undefined,
  }
}
