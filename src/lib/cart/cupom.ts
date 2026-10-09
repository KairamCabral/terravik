import type { Cart } from '@/types/cart'

/**
 * Cupom aplicado, lido do carrinho que a Shopify devolveu.
 *
 * Quem valida o cupom é a Shopify (`cartDiscountCodesUpdate`). Nada aqui
 * calcula desconto: `discountAmount` é a soma do que a Shopify alocou no
 * nível do carrinho. Cupom de produto ou de frete entra com zero aqui, porque
 * o desconto de produto já vem no preço da linha e o de frete só aparece no
 * checkout.
 */
export interface AppliedCoupon {
  code: string
  discountAmount: number
}

export function cupomDoCarrinho(cart: Cart | null | undefined): AppliedCoupon | null {
  const aplicado = cart?.discountCodes?.find((d) => d.applicable)
  if (!aplicado) return null
  return { code: aplicado.code, discountAmount: cart?.couponDiscount ?? 0 }
}
