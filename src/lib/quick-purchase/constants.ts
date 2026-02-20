/**
 * Produtos para Compra Rápida
 * Cada produto pode ter múltiplas variantes (tamanhos).
 */

export interface QuickPurchaseVariant {
  variantId: string
  title: string
  price: number
  compareAtPrice?: number
}

export interface QuickPurchaseProduct {
  id: string
  productId: string
  title: string
  image: string
  badge: string | null
  pitch: string
  variants: QuickPurchaseVariant[]
}

export const QUICK_PURCHASE_PRODUCTS: QuickPurchaseProduct[] = [
  {
    id: 'mock-p2',
    productId: 'mock-p2',
    title: 'Verde Rápido',
    image: '/images/Verde-Rápido.png',
    badge: 'Mais vendido',
    pitch: 'Recupere o verde em dias',
    variants: [
      { variantId: 'mock-p2-2700g', title: '2,7kg', price: 89.9 },
    ],
  },
  {
    id: 'mock-p1',
    productId: 'mock-p1',
    title: 'Gramado Novo',
    image: '/images/Gramado-novo.png',
    badge: null,
    pitch: 'Enraizamento forte desde o início',
    variants: [
      { variantId: 'mock-p1-400g', title: '400g', price: 29.9 },
      { variantId: 'mock-p1-900g', title: '900g', price: 59.9 },
    ],
  },
  {
    id: 'mock-p3',
    productId: 'mock-p3',
    title: 'Resistência Total',
    image: '/images/Resistencia-total.png',
    badge: null,
    pitch: 'Proteção contra calor e pisoteio',
    variants: [
      { variantId: 'mock-p3-400g', title: '400g', price: 34.9 },
      { variantId: 'mock-p3-900g', title: '900g', price: 69.9 },
    ],
  },
]

export const CALCULATOR_RESULT_KEY = 'terravik-calculator-result'
