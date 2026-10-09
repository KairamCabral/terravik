'use client'

import { useFavorites } from '@/hooks/useFavorites'
import { Container, Button } from '@/components/ui'
import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { FavoritesGrid } from '@/components/favorites/FavoritesGrid'
import type { Product } from '@/types/product'

/**
 * Página de Favoritos
 * 
 * Exibe produtos favoritados pelo usuário
 * Design minimalista e clean
 */

interface FavoritesPageClientProps {
  /** Catálogo resolvido no servidor (page.tsx). */
  catalogo: Product[]
  degradado: boolean
}

export function FavoritesPageClient({ catalogo, degradado }: FavoritesPageClientProps) {
  const { favorites, removeFavorite, isLoading } = useFavorites()

  if (isLoading) {
    return (
      <Container spacing="lg">
        <div className="text-center py-20">
          <div className="animate-pulse">Carregando favoritos...</div>
        </div>
      </Container>
    )
  }

  if (favorites.length === 0) {
    return (
      <Container spacing="lg">
        <div className="text-center py-20 max-w-xl mx-auto">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-neutral-400" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-forest mb-4">
            Nenhum favorito ainda
          </h1>
          <p className="text-neutral-600 mb-8">
            Adicione produtos aos seus favoritos para acessá-los rapidamente depois
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/produtos">
              Explorar Produtos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container spacing="lg">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-forest mb-3">
          Meus Favoritos
        </h1>
        <p className="text-neutral-600">
          {favorites.length} {favorites.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
        </p>
      </div>

      <FavoritesGrid
        favorites={favorites}
        catalogo={catalogo}
        degradado={degradado}
        onRemove={removeFavorite}
        className="max-w-6xl"
      />
    </Container>
  )
}
