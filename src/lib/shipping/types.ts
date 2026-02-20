// src/lib/shipping/types.ts

export interface ShippingAddress {
  cep: string
  street?: string
  neighborhood?: string
  city?: string
  state?: string
}

export interface ShippingOption {
  id: string
  carrier: string              // "Correios", "Jadlog", etc
  service: string              // "PAC", "SEDEX", "Expressa"
  price: number
  originalPrice?: number       // Para mostrar desconto
  estimatedDays: {
    min: number
    max: number
  }
  isFree: boolean
  isRecommended?: boolean
  icon?: string
}

export interface ShippingCalculation {
  address: ShippingAddress
  options: ShippingOption[]
  selectedOption?: ShippingOption
  calculatedAt: string
}

export interface FreeShippingConfig {
  threshold: number            // Valor mínimo para frete grátis (ex: 150)
  enabled: boolean
  message: string
  regions?: string[]           // Estados/regiões elegíveis
}

// Order Bump
export interface OrderBumpProduct {
  id: string                   // productId do catálogo (ex: 'mock-p2')
  variantId: string            // variantId para addToCart (ex: 'mock-p2-2700g')
  handle: string               // handle do produto (ex: 'verde-rapido')
  title: string                // Nome do produto
  variantTitle: string         // Nome da variante (ex: '2,7kg')
  pitch: string                // Frase persuasiva de cross-sell
  price: number                // Preço especial do bump
  compareAtPrice: number       // Preço original (âncora)
  discountPercent: number
  image: string
  triggeredBy: string[]        // IDs de produtos que ativam este bump
  priority: number             // Prioridade (menor = mostra primeiro)
}

export interface OrderBumpConfig {
  enabled: boolean
  maxItems: number             // Máximo de bumps a mostrar
  position: 'before-summary' | 'after-items' | 'floating'
}
