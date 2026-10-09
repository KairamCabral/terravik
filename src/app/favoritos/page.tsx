import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'
import { getCatalogoComEstado } from '@/lib/shopify/catalogo'
import { REVALIDATE } from '@/lib/utils/constants'
import { FavoritesPageClient } from './FavoritesPageClient'

export const metadata: Metadata = createMetadata({
  title: 'Meus Favoritos',
  description: 'Seus produtos favoritos da Terravik. Gerencie sua lista de desejos e adicione ao carrinho quando quiser.',
  path: '/favoritos',
  noIndex: true,
})

export const revalidate = REVALIDATE.products

export default async function FavoritosPage() {
  const { produtos, degradado } = await getCatalogoComEstado('favoritos')
  return <FavoritesPageClient catalogo={produtos} degradado={degradado} />
}
