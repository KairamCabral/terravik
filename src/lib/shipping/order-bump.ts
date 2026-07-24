// src/lib/shipping/order-bump.ts
//
// Sistema de Order Bump inteligente com produtos REAIS do catálogo.
// Lógica de cross-sell baseada no ciclo de cuidado do gramado:
//
//   Implantação (Gramado Novo)
//       → Crescimento (Verde Rápido)
//           → Proteção (Resistência Total)
//               → Manutenção (volta ao ciclo)
//
// SHOPIFY: Em produção, buscar produtos e regras de cross-sell
// via metafields ou Shopify Functions.

import type { OrderBumpProduct } from './types'

// ─── Catálogo de bumps (produtos reais) ──────────────────────
//
// Cada bump mapeia para um produto + variante real do catálogo.
// O `triggeredBy` define quais produtos no carrinho ativam este bump.
// O `priority` define qual aparece primeiro se múltiplos se aplicam.

const ORDER_BUMP_CATALOG: OrderBumpProduct[] = [
  // ── Se comprou Gramado Novo → oferece Verde Rápido ──
  {
    id: 'mock-p2',
    variantId: 'mock-p2-1kg',
    handle: 'verde-rapido',
    title: 'Verde Rápido',
    variantTitle: '1kg',
    pitch: 'Próximo passo: acelere o verde do seu gramado novo',
    price: 64.90,
    compareAtPrice: null,
    discountPercent: 0,
    image: '/images/Verde-Rápido.png',
    triggeredBy: ['mock-p1'],
    priority: 1,
  },

  // ── Se comprou Gramado Novo → oferece Resistência Total ──
  {
    id: 'mock-p3',
    variantId: 'mock-p3-1kg',
    handle: 'resistencia-total',
    title: 'Resistência Total',
    variantTitle: '1kg',
    pitch: 'Proteja seu gramado novo contra sol e pisoteio',
    price: 71.20,
    compareAtPrice: null,
    discountPercent: 0,
    image: '/images/Resistencia-total.png',
    triggeredBy: ['mock-p1'],
    priority: 2,
  },

  // ── Se comprou Verde Rápido → oferece Resistência Total ──
  {
    id: 'mock-p3',
    variantId: 'mock-p3-1kg',
    handle: 'resistencia-total',
    title: 'Resistência Total',
    variantTitle: '1kg',
    pitch: 'Mantenha o verde: proteja contra calor e pisoteio',
    price: 71.20,
    compareAtPrice: null,
    discountPercent: 0,
    image: '/images/Resistencia-total.png',
    triggeredBy: ['mock-p2'],
    priority: 1,
  },

  // ── Se comprou Verde Rápido → oferece Gramado Novo ──
  {
    id: 'mock-p1',
    variantId: 'mock-p1-1kg',
    handle: 'gramado-novo',
    title: 'Gramado Novo',
    variantTitle: '1kg',
    pitch: 'Ideal para preencher falhas enquanto recupera o verde',
    price: 89.90,
    compareAtPrice: null,
    discountPercent: 0,
    image: '/images/Gramado-novo.png',
    triggeredBy: ['mock-p2'],
    priority: 2,
  },

  // ── Se comprou Resistência Total → oferece Verde Rápido ──
  {
    id: 'mock-p2',
    variantId: 'mock-p2-1kg',
    handle: 'verde-rapido',
    title: 'Verde Rápido',
    variantTitle: '1kg',
    pitch: 'Complete o cuidado: recupere a cor verde intensa',
    price: 64.90,
    compareAtPrice: null,
    discountPercent: 0,
    image: '/images/Verde-Rápido.png',
    triggeredBy: ['mock-p3'],
    priority: 1,
  },

  // ── Se comprou Resistência Total → oferece Gramado Novo ──
  {
    id: 'mock-p1',
    variantId: 'mock-p1-1kg',
    handle: 'gramado-novo',
    title: 'Gramado Novo',
    variantTitle: '1kg',
    pitch: 'Replante as áreas desgastadas com facilidade',
    price: 89.90,
    compareAtPrice: null,
    discountPercent: 0,
    image: '/images/Gramado-novo.png',
    triggeredBy: ['mock-p3'],
    priority: 2,
  },
]

// ─── Motor de recomendação ───────────────────────────────────

/**
 * Seleciona o melhor order bump baseado nos produtos do carrinho.
 *
 * Regras:
 * 1. O produto do bump NÃO pode já estar no carrinho (mesmo productId)
 * 2. Pelo menos um item do `triggeredBy` precisa estar no carrinho
 * 3. Ordena por prioridade (menor = melhor)
 * 4. Retorna apenas 1 produto (o mais relevante)
 *
 * SHOPIFY: Quando integrar, substituir por Shopify Product Recommendations API
 * ou lógica via metafields de cross-sell.
 */
export function getSmartBumpProduct(
  cartProductIds: string[]
): OrderBumpProduct | null {
  if (cartProductIds.length === 0) return null

  const candidates = ORDER_BUMP_CATALOG
    .filter((bump) => {
      // Não oferecer produto que já está no carrinho
      if (cartProductIds.includes(bump.id)) return false

      // Pelo menos um gatilho precisa estar no carrinho
      return bump.triggeredBy.some((triggerId) =>
        cartProductIds.includes(triggerId)
      )
    })
    .sort((a, b) => a.priority - b.priority)

  return candidates[0] || null
}

// Exportar catálogo para uso direto (fallback)
export const ORDER_BUMP_PRODUCTS = ORDER_BUMP_CATALOG
