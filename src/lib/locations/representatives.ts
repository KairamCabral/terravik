/**
 * Representantes comerciais.
 *
 * A lista tinha quatro pessoas inventadas, com telefone e e-mail. Saiu (H-06).
 * Fica vazia até o dono informar representantes reais, com autorização de
 * cada um para publicar nome e contato. Com a lista vazia, a página
 * /representantes troca a busca pela chamada para o formulário.
 */

import type { Representative } from '@/types/location'

export const REPRESENTATIVES: Representative[] = []

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
