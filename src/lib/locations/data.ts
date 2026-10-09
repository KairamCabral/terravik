/**
 * Pontos de Venda
 * Busca do Supabase (stores table) com fallback local
 */

import type { Location, LocationType } from '@/types/location'

const TYPE_LABELS: Record<string, string> = {
  garden_center: 'Garden Center',
  pet_shop: 'Pet Shop',
  agricultural: 'Agropecuária',
  online: 'Loja Online',
  other: 'Outro',
  agropecuaria: 'Agropecuária',
  supermercado: 'Supermercado',
  loja_online: 'Loja Online',
}

/**
 * Sem fallback estático: as três lojas que estavam aqui eram de exemplo, com
 * endereço e telefone inventados (H-06). Loja só vem da tabela `stores`.
 */
export const LOCATIONS: Location[] = []

/** Busca lojas do banco via API */
export async function getStoresFromDB(): Promise<Location[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/stores`, { next: { revalidate: 60 } })
    if (!res.ok) return LOCATIONS

    const stores = await res.json()
    if (!Array.isArray(stores) || stores.length === 0) return LOCATIONS

    return stores.map((s: Record<string, unknown>) => ({
      id: s.id as string,
      name: s.name as string,
      type: ((s.type as string) === 'online' ? 'loja_online' : (s.type as string) || 'other') as LocationType,
      typeLabel: TYPE_LABELS[(s.type as string) || 'other'] || 'Outro',
      address: s.address as string,
      city: s.city as string,
      state: s.state as string,
      zipCode: (s.cep as string) || '',
      phone: s.phone as string | undefined,
      whatsapp: s.whatsapp as string | undefined,
      website: s.website as string | undefined,
      latitude: Number(s.latitude) || 0,
      longitude: Number(s.longitude) || 0,
      products: (s.available_products as string[]) || [],
      logoUrl: s.logo_url as string | undefined,
    }))
  } catch {
    return LOCATIONS
  }
}

// Sync helpers
export function getLocations(): Location[] {
  return LOCATIONS
}

export function getLocationsByState(state: string): Location[] {
  return LOCATIONS.filter((loc) => loc.state === state)
}

export function getLocationsByCity(city: string): Location[] {
  return LOCATIONS.filter(
    (loc) => loc.city.toLowerCase() === city.toLowerCase()
  )
}

export function getLocationTypes(): Array<{ value: string; label: string }> {
  const types = new Set(LOCATIONS.map((loc) => loc.type))
  return Array.from(types).map((type) => {
    const location = LOCATIONS.find((loc) => loc.type === type)
    return {
      value: type,
      label: location?.typeLabel || type,
    }
  })
}
