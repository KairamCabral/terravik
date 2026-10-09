// src/lib/shipping/calculator.ts

import type { ShippingAddress, ShippingOption } from './types'
import { FREE_SHIPPING_CONFIG, getRegion, faixaDaUf, progressoDoFreteGratis } from './config'

// Consulta de CEP via ViaCEP (gratuito)
export async function fetchAddressByCep(cep: string): Promise<ShippingAddress | null> {
  const cleanCep = cep.replace(/\D/g, '')

  if (cleanCep.length !== 8) {
    return null
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
    const data = await response.json()

    if (data.erro) {
      return null
    }

    return {
      cep: cleanCep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    return null
  }
}

// Taxas base por região (mock - em produção integrar com Correios/transportadoras)
interface RegionRate {
  pac: number
  sedex: number
  days: { pac: [number, number]; sedex: [number, number] }
}

const BASE_RATES: Record<string, RegionRate> = {
  sudeste: { pac: 15.9, sedex: 25.9, days: { pac: [3, 5], sedex: [1, 2] } },
  sul: { pac: 18.9, sedex: 29.9, days: { pac: [4, 6], sedex: [2, 3] } },
  nordeste: { pac: 25.9, sedex: 39.9, days: { pac: [7, 12], sedex: [3, 5] } },
  norte: { pac: 29.9, sedex: 45.9, days: { pac: [10, 15], sedex: [4, 6] } },
  centroOeste: { pac: 22.9, sedex: 35.9, days: { pac: [5, 8], sedex: [2, 4] } },
  outros: { pac: 29.9, sedex: 45.9, days: { pac: [10, 15], sedex: [5, 7] } },
}

// Calcular opções de frete
export async function calculateShipping(
  address: ShippingAddress,
  cartSubtotal: number,
  cartWeight: number = 1 // kg
): Promise<ShippingOption[]> {
  const state = address.state?.toUpperCase() || 'SP'
  const region = getRegion(state)

  // Verificar se tem frete grátis
  // O mínimo é o da faixa da UF de destino, não um valor geral.
  const faixa = faixaDaUf(state)
  const hasFreeShipping = faixa !== null && cartSubtotal >= faixa.minimo
  const isFreeShippingRegion = faixa !== null

  const rates = BASE_RATES[region] || BASE_RATES.outros

  // Ajuste por peso (simplificado)
  const weightMultiplier = Math.max(1, cartWeight / 2)

  const options: ShippingOption[] = []

  // Opção 1: PAC (ou Frete Grátis)
  if (hasFreeShipping && isFreeShippingRegion) {
    options.push({
      id: 'free',
      carrier: 'Correios',
      service: 'Frete Grátis',
      price: 0,
      originalPrice: Math.round(rates.pac * weightMultiplier * 100) / 100,
      estimatedDays: { min: rates.days.pac[0], max: rates.days.pac[1] },
      isFree: true,
      isRecommended: true,
      icon: '🎁',
    })
  } else {
    options.push({
      id: 'pac',
      carrier: 'Correios',
      service: 'PAC',
      price: Math.round(rates.pac * weightMultiplier * 100) / 100,
      estimatedDays: { min: rates.days.pac[0], max: rates.days.pac[1] },
      isFree: false,
      icon: '📦',
    })
  }

  // Opção 2: SEDEX (mais rápido)
  options.push({
    id: 'sedex',
    carrier: 'Correios',
    service: 'SEDEX',
    price: Math.round(rates.sedex * weightMultiplier * 100) / 100,
    estimatedDays: { min: rates.days.sedex[0], max: rates.days.sedex[1] },
    isFree: false,
    isRecommended: !hasFreeShipping,
    icon: '⚡',
  })

  // Opção 3: Expressa (para algumas regiões)
  if (region === 'sudeste' || region === 'sul') {
    options.push({
      id: 'express',
      carrier: 'Jadlog',
      service: 'Expressa',
      price: Math.round(rates.sedex * 1.3 * weightMultiplier * 100) / 100,
      estimatedDays: { min: 1, max: 1 },
      isFree: false,
      icon: '🚀',
    })
  }

  return options
}

// Calcular quanto falta para frete grátis.
// Compatibilidade: delega a progressoDoFreteGratis (config.ts), a fonte única.
export function calculateRemainingForFreeShipping(cartSubtotal: number): {
  remaining: number
  percentage: number
  achieved: boolean
} {
  const progresso = progressoDoFreteGratis(cartSubtotal)
  return {
    remaining: progresso.falta,
    percentage: progresso.percentual,
    achieved: progresso.proxima === null && progresso.liberada !== null,
  }
}
