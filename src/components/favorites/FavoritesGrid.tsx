'use client'

import { AlertCircle } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { cn } from '@/lib/utils/cn'
import type { Product } from '@/types/product'

interface FavoritesGridProps {
  /** Identificadores salvos (handle do produto). */
  favorites: string[]
  /** Catálogo resolvido no servidor. */
  catalogo: Product[]
  /** true quando a Shopify falhou e o catálogo veio do exemplo. */
  degradado: boolean
  onRemove: (id: string) => void
  className?: string
}

/**
 * Grade de favoritos, a mesma em /favoritos e /conta/favoritos.
 *
 * O catálogo vem do servidor por prop. Antes cada página tinha um mapa de três
 * produtos escrito à mão, e favorito fora do mapa sumia.
 *
 * Com `degradado`, a lista não é desenhada: não dá para saber se o produto
 * saiu do catálogo ou se a loja só oscilou, e oferecer "remover" faria a
 * pessoa apagar a própria lista por causa de uma falha temporária.
 */
export function FavoritesGrid({
  favorites,
  catalogo,
  degradado,
  onRemove,
  className,
}: FavoritesGridProps) {
  if (degradado) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-700"
      >
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-forest" aria-hidden="true" />
        <div>
          <p className="font-semibold text-neutral-900">
            Não foi possível carregar seus favoritos agora.
          </p>
          <p className="mt-1 text-sm">
            Sua lista continua salva. Tente de novo em alguns instantes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {favorites.map((favoritoId, index) => {
        const product = catalogo.find((p) => p.handle === favoritoId || p.id === favoritoId)

        // Produto que saiu do catálogo: continua na lista, com a saída explícita.
        if (!product) {
          return (
            <div
              key={favoritoId}
              className="flex flex-col justify-between rounded-2xl border border-dashed border-neutral-200 bg-white p-6"
            >
              <div>
                <p className="font-semibold text-neutral-900">Produto indisponível</p>
                <p className="mt-1 text-sm text-neutral-600">
                  Este item não está mais no catálogo.
                </p>
              </div>
              <button
                onClick={() => onRemove(favoritoId)}
                className="mt-4 self-start text-sm font-medium text-forest underline-offset-2 hover:underline"
              >
                Remover da lista
              </button>
            </div>
          )
        }

        return (
          <ProductCard
            key={favoritoId}
            product={product}
            index={index}
            acaoDoCoracao="remover"
            onRemover={() => onRemove(favoritoId)}
          />
        )
      })}
    </div>
  )
}
