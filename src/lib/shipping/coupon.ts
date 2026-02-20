// src/lib/shipping/coupon.ts
//
// Sistema de cupons preparado para integração com Shopify.
//
// SHOPIFY: Quando integrar, usar a mutation `cartDiscountCodesUpdate`
// e ler `cart.discountCodes` + `cart.discountAllocations` do retorno.
// O mock abaixo simula esse comportamento localmente.

// ─── Tipos ───────────────────────────────────────────────────

export type CouponType = 'percentage' | 'fixed_amount' | 'free_shipping'

export interface Coupon {
  code: string
  type: CouponType
  value: number                  // % ou valor fixo em R$
  minPurchase?: number           // Compra mínima para ativar
  maxDiscount?: number           // Teto de desconto (para %)
  description: string            // Ex: "10% de desconto"
  expiresAt?: string             // ISO date
  usageLimit?: number            // Limite de usos
  applicableProducts?: string[]  // IDs de produtos (vazio = todos)
  active: boolean
}

export interface AppliedCoupon {
  code: string
  type: CouponType
  description: string
  discountAmount: number         // Valor calculado do desconto
}

export interface CouponValidationResult {
  valid: boolean
  coupon?: AppliedCoupon
  error?: string
}

// ─── Códigos públicos (usados em banners, etc.) ───────────────

export const FIRST_PURCHASE_COUPON_CODE = 'PRIMEIRACOMPRA'

// ─── Mock coupons (remover quando integrar Shopify) ──────────

const MOCK_COUPONS: Coupon[] = [
  {
    code: 'TERRAVIK10',
    type: 'percentage',
    value: 10,
    description: '10% de desconto',
    active: true,
  },
  {
    code: FIRST_PURCHASE_COUPON_CODE,
    type: 'percentage',
    value: 15,
    maxDiscount: 50,
    description: '15% off (máx R$ 50)',
    active: true,
  },
  {
    code: 'FRETEGRATIS',
    type: 'free_shipping',
    value: 0,
    description: 'Frete grátis',
    active: true,
  },
  {
    code: 'DESCONTO20',
    type: 'fixed_amount',
    value: 20,
    minPurchase: 100,
    description: 'R$ 20 de desconto',
    active: true,
  },
]

// ─── Validação ───────────────────────────────────────────────

/**
 * Valida e calcula o desconto de um cupom.
 *
 * SHOPIFY: Substituir esta função por uma chamada a
 * `cartDiscountCodesUpdate(cartId, [code])` e ler o retorno.
 * A Shopify valida automaticamente e retorna `discountAllocations`.
 */
export async function validateCoupon(
  code: string,
  cartSubtotal: number
): Promise<CouponValidationResult> {
  // Normalizar código
  const normalizedCode = code.trim().toUpperCase()

  if (!normalizedCode) {
    return { valid: false, error: 'Informe um código de cupom' }
  }

  // Simular latência de API
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Buscar cupom
  const coupon = MOCK_COUPONS.find(
    (c) => c.code === normalizedCode && c.active
  )

  if (!coupon) {
    return { valid: false, error: 'Cupom inválido ou expirado' }
  }

  // Verificar compra mínima
  if (coupon.minPurchase && cartSubtotal < coupon.minPurchase) {
    return {
      valid: false,
      error: `Compra mínima de R$ ${coupon.minPurchase.toFixed(2).replace('.', ',')}`,
    }
  }

  // Verificar expiração
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: 'Cupom expirado' }
  }

  // Calcular desconto
  let discountAmount = 0

  switch (coupon.type) {
    case 'percentage':
      discountAmount = (cartSubtotal * coupon.value) / 100
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount)
      }
      break
    case 'fixed_amount':
      discountAmount = Math.min(coupon.value, cartSubtotal)
      break
    case 'free_shipping':
      discountAmount = 0 // Frete grátis é tratado separadamente
      break
  }

  // Arredondar
  discountAmount = Math.round(discountAmount * 100) / 100

  return {
    valid: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      description: coupon.description,
      discountAmount,
    },
  }
}

/**
 * Remove o cupom aplicado.
 *
 * SHOPIFY: Chamar `cartDiscountCodesUpdate(cartId, [])` para limpar.
 */
export async function removeCoupon(): Promise<void> {
  // Simular latência
  await new Promise((resolve) => setTimeout(resolve, 200))
}
