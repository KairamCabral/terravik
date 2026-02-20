import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'
import { FavoritesPageClient } from './FavoritesPageClient'

export const metadata: Metadata = createMetadata({
  title: 'Meus Favoritos',
  description: 'Seus produtos favoritos da Terravik. Gerencie sua lista de desejos e adicione ao carrinho quando quiser.',
  path: '/favoritos',
})

export default function FavoritosPage() {
  return <FavoritesPageClient />
}
