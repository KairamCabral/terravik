'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
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
  /** 'conta' usa o card mais compacto da área logada. */
  variante?: 'pagina' | 'conta'
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
  variante = 'pagina',
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

  const conta = variante === 'conta'

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

        const href = `/produtos/${product.handle}`

        return (
          <motion.div
            key={favoritoId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={cn(
              'relative overflow-hidden border border-neutral-100 bg-white shadow-sm',
              conta
                ? 'rounded-2xl transition-all duration-300 hover:shadow-lg'
                : 'rounded-3xl transition-shadow duration-300 hover:shadow-xl'
            )}
          >
            <button
              onClick={() => onRemove(favoritoId)}
              className="group absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition-transform hover:scale-110"
              aria-label={`Remover ${product.title} dos favoritos`}
            >
              <Heart className="h-4 w-4 fill-red-500 text-red-500 transition-all group-hover:fill-transparent" />
            </button>

            <Link
              href={href}
              className={cn(
                'group/image relative flex cursor-pointer items-center justify-center bg-gradient-to-br from-neutral-50 to-white p-6',
                conta ? 'h-[240px]' : 'h-[260px]'
              )}
            >
              {product.featuredImage && (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.alt || product.title}
                  width={conta ? 200 : 220}
                  height={conta ? 200 : 220}
                  className="object-contain transition-transform duration-500 group-hover/image:scale-110"
                />
              )}
            </Link>

            <div className={conta ? 'p-5' : 'p-6'}>
              <Link href={href}>
                <h3
                  className={cn(
                    'mb-2 font-heading font-bold text-forest transition-colors hover:text-forest/80',
                    conta ? 'text-lg' : 'text-xl'
                  )}
                >
                  {product.title}
                </h3>
              </Link>

              <p className="mb-4 line-clamp-2 text-sm text-neutral-600">{product.description}</p>

              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-forest">
                  R$ {product.price.toFixed(2)}
                </span>
                <span className="text-xs text-neutral-500">
                  ou 6x de R$ {(product.price / 6).toFixed(2)}
                </span>
              </div>

              <Button
                asChild
                className={cn(
                  'h-11 w-full bg-forest text-sm font-semibold text-white hover:bg-forest/90',
                  conta ? 'rounded-xl' : 'rounded-full'
                )}
              >
                <Link href={href} className="flex items-center justify-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Ver Produto
                </Link>
              </Button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
