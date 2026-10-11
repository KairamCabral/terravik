// src/lib/shipping/order-bump.ts
//
// "Leve junto" do carrinho e do checkout.
//
// Aqui ficam só as REGRAS: qual produto oferecer para quem tem qual produto no
// carrinho, e com que frase. Nome, variante, preço e foto vêm do catálogo
// (GET /api/catalogo-leve), nunca escritos à mão: o preço daqui já divergiu do
// catálogo uma vez, e as variantes antigas (400 g, 1 kg) deixaram de existir.
//
// A ordem segue a linha do tempo impressa nas embalagens:
//
//   1 Raiz Forte (firmar raiz)
//       → 2 Verde Rápido (devolver cor)
//           → 3 Resistência Total (recuperar vigor)
//
// As frases só dizem o que está em docs/produtos-fatos-do-rotulo.md.

import type { ProdutoLeve } from '@/app/api/catalogo-leve/route'
import type { OrderBumpProduct } from './types'

interface RegraDeBump {
  /** Handle do produto oferecido. */
  oferece: string
  /** Handles que, no carrinho, ativam a oferta. */
  quandoTem: string[]
  /** Frase de cross-sell. */
  pitch: string
  /** Menor aparece primeiro. */
  priority: number
}

const REGRAS: RegraDeBump[] = [
  // ── Tem Raiz Forte ──
  {
    oferece: 'verde-rapido',
    quandoTem: ['raiz-forte'],
    pitch: 'Próximo passo: devolva a cor do gramado',
    priority: 1,
  },
  {
    oferece: 'resistencia-total',
    quandoTem: ['raiz-forte'],
    pitch: 'Grama resistente à seca, ao sol e ao pisoteio',
    priority: 2,
  },

  // ── Tem Verde Rápido ──
  {
    oferece: 'resistencia-total',
    quandoTem: ['verde-rapido'],
    pitch: 'Depois da cor, a força: seca, sol e pisoteio',
    priority: 1,
  },
  {
    oferece: 'raiz-forte',
    quandoTem: ['verde-rapido'],
    pitch: 'Tem falhas no gramado? Fósforo e cálcio na raiz',
    priority: 2,
  },

  // ── Tem Resistência Total ──
  {
    oferece: 'verde-rapido',
    quandoTem: ['resistencia-total'],
    pitch: 'Gramado amarelado? Devolva a cor',
    priority: 1,
  },
  {
    oferece: 'raiz-forte',
    quandoTem: ['resistencia-total'],
    pitch: 'Vai reformar ou recuperar falhas? Firme a raiz',
    priority: 2,
  },
]

/**
 * Escolhe o melhor "leve junto" para o carrinho.
 *
 * Regras:
 * 1. O produto oferecido NÃO pode já estar no carrinho
 * 2. Pelo menos um gatilho precisa estar no carrinho
 * 3. Ordena por prioridade (menor = melhor)
 * 4. Só oferece o que o catálogo tem, com variante e à venda
 *
 * As regras casam por HANDLE: o id do produto é `mock-p1` no catálogo de
 * exemplo e um gid na Shopify, o handle é o mesmo nos dois. O catálogo traduz
 * os ids do carrinho em handles.
 *
 * Devolve `null` enquanto o catálogo não chegou (lista vazia).
 */
export function getSmartBumpProduct(
  cartProductIds: string[],
  catalogo: ProdutoLeve[]
): OrderBumpProduct | null {
  if (cartProductIds.length === 0 || catalogo.length === 0) return null

  const noCarrinho = new Set(
    catalogo.filter((p) => cartProductIds.includes(p.id)).map((p) => p.handle)
  )
  if (noCarrinho.size === 0) return null

  const candidatas = REGRAS.filter(
    (regra) => !noCarrinho.has(regra.oferece) && regra.quandoTem.some((h) => noCarrinho.has(h))
  ).sort((a, b) => a.priority - b.priority)

  for (const regra of candidatas) {
    const produto = catalogo.find((p) => p.handle === regra.oferece)
    if (!produto || !produto.available) continue
    if (!produto.variantId || produto.variantPrice === null || !produto.image) continue

    const price = produto.variantPrice
    // Desconto só existe se o catálogo disser: preço de comparação maior que o preço.
    const compareAtPrice =
      produto.variantCompareAtPrice !== null && produto.variantCompareAtPrice > price
        ? produto.variantCompareAtPrice
        : null

    return {
      id: produto.id,
      variantId: produto.variantId,
      handle: produto.handle,
      title: produto.title,
      // Produto de variante única na Shopify chega como "Default Title".
      variantTitle:
        produto.variantTitle && produto.variantTitle !== 'Default Title' ? produto.variantTitle : '',
      pitch: regra.pitch,
      price,
      compareAtPrice,
      discountPercent: compareAtPrice ? Math.round((1 - price / compareAtPrice) * 100) : 0,
      image: produto.image,
      triggeredBy: regra.quandoTem,
      priority: regra.priority,
    }
  }

  return null
}
