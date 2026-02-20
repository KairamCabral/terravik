/**
 * Representantes Comerciais (mock data)
 */

import type { Representative } from '@/types/location'

export const REPRESENTATIVES: Representative[] = [
  {
    id: 'rep-1',
    name: 'João Silva',
    region: 'Sul de Santa Catarina',
    city: 'Criciúma',
    state: 'SC',
    phone: '(48) 99999-1234',
    whatsapp: '5548999991234',
    email: 'joao.silva@terravik.com.br',
  },
  {
    id: 'rep-2',
    name: 'Maria Santos',
    region: 'Grande Florianópolis e Litoral',
    city: 'Florianópolis',
    state: 'SC',
    phone: '(48) 99888-5678',
    whatsapp: '5548998885678',
    email: 'maria.santos@terravik.com.br',
  },
  {
    id: 'rep-3',
    name: 'Carlos Oliveira',
    region: 'Norte de SC e Vale do Itajaí',
    city: 'Joinville',
    state: 'SC',
    phone: '(47) 99777-9012',
    whatsapp: '5547997779012',
    email: 'carlos.oliveira@terravik.com.br',
  },
  {
    id: 'rep-4',
    name: 'Ana Paula Costa',
    region: 'Rio Grande do Sul',
    city: 'Porto Alegre',
    state: 'RS',
    phone: '(51) 99666-3456',
    whatsapp: '5551996663456',
    email: 'ana.costa@terravik.com.br',
  },
]

export function getRepresentatives(): Representative[] {
  return REPRESENTATIVES
}

export function getRepresentativesByState(state: string): Representative[] {
  return REPRESENTATIVES.filter((rep) => rep.state === state)
}

export function getRepresentativesByRegion(
  searchTerm: string
): Representative[] {
  const term = searchTerm.toLowerCase()
  return REPRESENTATIVES.filter(
    (rep) =>
      rep.region.toLowerCase().includes(term) ||
      rep.city.toLowerCase().includes(term) ||
      rep.state.toLowerCase().includes(term)
  )
}
