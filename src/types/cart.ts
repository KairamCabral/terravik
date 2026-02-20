/**
 * Tipos normalizados do Carrinho
 */

import type { ProductImage } from './product'

export interface SubscriptionData {
  isSubscription: boolean
  purchaseMode: 'one-time' | 'subscription'
  frequency?: number           // 30 | 45 | 60 | 90
  subscriptionPrice?: number   // Preço com desconto
  discountPercent?: number     // Porcentagem de desconto
  nextDeliveryDate?: string    // Data da próxima entrega (ISO)
}

export interface CartItem {
  id: string
  quantity: number
  variantId: string
  variantTitle: string
  productId: string
  productHandle: string
  productTitle: string
  price: number                // Preço base
  totalPrice: number           // Preço total (considerando desconto se assinatura)
  currency: string
  image: ProductImage | null
  options: Record<string, string>
  
  // NOVOS CAMPOS DE ASSINATURA
  subscription?: SubscriptionData
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  subtotal: number
  total: number
  tax: number
  currency: string
  items: CartItem[]
  
  // NOVOS CAMPOS
  hasSubscription?: boolean      // Tem pelo menos um item de assinatura?
  subscriptionCount?: number     // Quantos itens são assinatura?
  subscriptionSubtotal?: number  // Subtotal apenas de assinaturas
}
