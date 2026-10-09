import type { Review } from '@/types/product'

/**
 * Avaliações de produto.
 *
 * Este arquivo tinha sete avaliações escritas à mão, seis marcadas como
 * "compra verificada", e uma nota fixa por produto com contagem inventada.
 * Nada disso vinha de comprador. Saiu tudo (H-06).
 *
 * Enquanto não existir o sistema de avaliações reais (história U-05), as duas
 * funções devolvem vazio, e a PDP não mostra estrelas, nota, "micro-review"
 * nem a seção de avaliações. NÃO preencha com texto de exemplo: avaliação
 * fabricada é publicidade enganosa (CDC, art. 37).
 */

export function getProductReviews(_productHandle: string): Review[] {
  return []
}

export function getProductRating(_productHandle: string): {
  average: number
  count: number
} {
  return { average: 0, count: 0 }
}
