/**
 * Tipos para Locais e Representantes
 */

export type LocationType = 'agropecuaria' | 'garden_center' | 'supermercado' | 'loja_online' | 'online' | 'pet_shop' | 'agricultural' | 'other'

export interface Location {
  id: string
  name: string
  type: LocationType
  typeLabel: string
  address: string
  city: string
  state: string
  zipCode: string
  phone?: string
  whatsapp?: string
  website?: string
  latitude: number
  longitude: number
  products: string[] // ['P1', 'P2', 'P3']
  logoUrl?: string
}

export interface Representative {
  id: string
  name: string
  region: string
  city: string
  state: string
  phone: string
  whatsapp: string
  email: string
}
