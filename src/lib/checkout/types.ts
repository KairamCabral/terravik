/**
 * Tipos do Checkout Híbrido Terravik
 */

import type { ShippingOption, ShippingAddress } from '@/lib/shipping/types'
import type { AppliedCoupon } from '@/lib/shipping/coupon'
import type { Cart } from '@/types/cart'

export interface CheckoutCustomer {
  email: string
  fullName: string
  cpf: string
  phone: string
  razaoSocial?: string
  inscricaoEstadual?: string
}

export interface CheckoutAddress extends ShippingAddress {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface CheckoutFormData {
  customer: CheckoutCustomer
  address: CheckoutAddress
  shipping: ShippingOption | null
  coupon: AppliedCoupon | null
}

export type CheckoutStep = 'info' | 'shipping' | 'payment'

export interface CheckoutState {
  step: CheckoutStep
  customer: CheckoutCustomer
  address: Partial<CheckoutAddress>
  shipping: ShippingOption | null
  coupon: AppliedCoupon | null
  isAddressLoading: boolean
  isSubmitting: boolean
  errors: Partial<Record<string, string>>
  timerSeconds: number
}

export interface OrderConfirmation {
  orderId: string
  orderNumber: string
  date: string
  estimatedDelivery: string
  customer: CheckoutCustomer
  address: CheckoutAddress
  items: Cart['items']
  subtotal: number
  shipping: ShippingOption
  coupon: AppliedCoupon | null
  total: number
  xpEarned: number
}
