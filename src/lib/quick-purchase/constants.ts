/**
 * Compra Rápida.
 *
 * Os produtos vêm de /api/compra-rapida, montados do catálogo no servidor.
 * Aqui fica só a curadoria: quais handles entram, em que ordem, com que
 * selo e frase. Preço e variante nunca são escritos à mão.
 */

export interface QuickPurchaseVariant {
  variantId: string
  title: string
  price: number
  compareAtPrice?: number
}

export interface QuickPurchaseProduct {
  /** Handle do produto no catálogo. */
  id: string
  title: string
  image: string
  badge: string | null
  pitch: string
  variants: QuickPurchaseVariant[]
}

export interface CuradoriaDaCompraRapida {
  handle: string
  badge: string | null
  pitch: string
}

export const CURADORIA_DA_COMPRA_RAPIDA: CuradoriaDaCompraRapida[] = [
  { handle: 'verde-rapido', badge: 'Mais vendido', pitch: 'Recupere o verde em dias' },
  { handle: 'gramado-novo', badge: null, pitch: 'Enraizamento forte desde o início' },
  { handle: 'resistencia-total', badge: null, pitch: 'Proteção contra calor e pisoteio' },
]

export const CALCULATOR_RESULT_KEY = 'terravik-calculator-result'
