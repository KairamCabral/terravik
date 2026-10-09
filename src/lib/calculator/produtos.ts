import type { Product } from '@/types/product'
import { PRODUCT_HANDLE_MAP } from '@/lib/utils/constants'

export type IdDaCalculadora = keyof typeof PRODUCT_HANDLE_MAP

/**
 * Acha no catálogo recebido do servidor o produto que a calculadora recomendou.
 * Sem React e sem mock: serve em client e em server.
 */
export function produtoDaCalculadora(
  catalogo: Product[],
  id: IdDaCalculadora
): Product | null {
  const handle = PRODUCT_HANDLE_MAP[id]
  return catalogo.find((p) => p.handle === handle) ?? null
}
