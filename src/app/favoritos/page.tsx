import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'
import { getCatalogoComEstado } from '@/lib/shopify/catalogo'
import { FavoritesPageClient } from './FavoritesPageClient'

export const metadata: Metadata = createMetadata({
  title: 'Meus Favoritos',
  description: 'Seus produtos favoritos da Terravik. Gerencie sua lista de desejos e adicione ao carrinho quando quiser.',
  path: '/favoritos',
  noIndex: true,
})

// Literal de propósito: o Next 15 só aceita valor escrito direto aqui.
// É o mesmo de REVALIDATE.products (src/lib/utils/constants.ts).
export const revalidate = 60

export default async function FavoritosPage() {
  const { produtos, degradado } = await getCatalogoComEstado('favoritos')
  return <FavoritesPageClient catalogo={produtos} degradado={degradado} />
}
