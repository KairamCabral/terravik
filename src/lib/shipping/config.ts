// src/lib/shipping/config.ts

import type { FreeShippingConfig, OrderBumpConfig } from './types'

export const FREE_SHIPPING_CONFIG: FreeShippingConfig = {
  threshold: 150, // R$ 150 para frete grátis
  enabled: true,
  message: 'Frete grátis para todo Brasil',
  regions: ['SP', 'RJ', 'MG', 'PR', 'SC', 'RS'], // Estados com frete grátis
}

export const ORDER_BUMP_CONFIG: OrderBumpConfig = {
  enabled: true,
  maxItems: 2,
  position: 'before-summary',
}

// Mapeamento de estados por região (para cálculo de prazo)
export const REGIONS: Record<string, string[]> = {
  sudeste: ['SP', 'RJ', 'MG', 'ES'],
  sul: ['PR', 'SC', 'RS'],
  nordeste: ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'],
  norte: ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'],
  centroOeste: ['GO', 'MT', 'MS', 'DF'],
}

export function getRegion(state: string): string {
  for (const [region, states] of Object.entries(REGIONS)) {
    if (states.includes(state.toUpperCase())) {
      return region
    }
  }
  return 'outros'
}
