'use client'

import { useFavorites } from '@/hooks/useFavorites'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { Heart, Loader2 } from 'lucide-react'
import { FavoritesGrid } from '@/components/favorites/FavoritesGrid'
import type { Product } from '@/types/product'

/**
 * Página de Favoritos - Área do Cliente
 * DONO: Supabase (localStorage com sync futuro)
 */

interface ContaFavoritosClientProps {
  /** Catálogo resolvido no servidor (page.tsx). */
  catalogo: Product[]
  degradado: boolean
}

export function ContaFavoritosClient({ catalogo, degradado }: ContaFavoritosClientProps) {
  const { favorites, removeFavorite, isLoading } = useFavorites()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-forest animate-spin" />
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Meus Favoritos</h1>
          <p className="text-neutral-500">Seus produtos favoritos em um só lugar</p>
        </div>

        {/* Empty State */}
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-100">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-neutral-400" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">
            Nenhum favorito ainda
          </h2>
          <p className="text-neutral-600 mb-6">
            Adicione produtos aos seus favoritos para acessá-los rapidamente depois
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/produtos" className="inline-flex items-center gap-2">
              Explorar Produtos
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Meus Favoritos</h1>
          <p className="text-neutral-500">
            {favorites.length} {favorites.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
          </p>
        </div>
      </div>

      <FavoritesGrid
        favorites={favorites}
        catalogo={catalogo}
        degradado={degradado}
        onRemove={removeFavorite}
        variante="conta"
      />

      {/* CTA */}
      <div className="bg-gradient-to-br from-forest/5 to-emerald-50 rounded-xl border border-forest/20 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1">
              Encontrou o que procurava?
            </h3>
            <p className="text-sm text-neutral-600">
              Explore nossa linha completa de fertilizantes profissionais
            </p>
          </div>
          <Button variant="primary" size="lg" asChild className="whitespace-nowrap">
            <Link href="/produtos">
              Ver Todos os Produtos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
