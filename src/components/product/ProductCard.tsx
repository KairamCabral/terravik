import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types/product'
import { formatCurrency } from '@/lib/utils/formatters'
import { ArrowRight } from 'lucide-react'

/**
 * ProductCard Premium — Design System 2026
 *
 * - Fundo branco (bg-surface)
 * - Border hairline 1px (border-subtle)
 * - Radius 16px
 * - Sombra leve, sem sombra pesada
 * - Badge discreto (outline dourado, NÃO fundo dourado)
 * - Imagem grande, título forte, preço com destaque
 */

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0

  return (
    <Link
      href={`/produtos/${product.handle}`}
      className="group block bg-bg-surface border border-border-subtle rounded-lg overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card hover:border-border-medium"
    >
      {/* Imagem Container */}
      <div className="relative aspect-square overflow-hidden bg-bg-surface-2">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.alt || product.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl text-txt-muted">
            🌱
          </div>
        )}

        {/* Badge Novo — Outline discreto */}
        {product.tags.includes('novo') && (
          <div className="absolute left-3 top-3 z-10">
            <span className="inline-flex items-center px-3 py-1 border border-forest text-forest bg-bg-surface/90 backdrop-blur-sm rounded-full text-xs font-semibold">
              Novo
            </span>
          </div>
        )}

        {/* Badge Desconto — Outline dourado, NÃO fundo dourado */}
        {hasDiscount && (
          <div className="absolute right-3 top-3 z-10">
            <span className="inline-flex items-center px-3 py-1 border border-gold text-gold bg-bg-surface/90 backdrop-blur-sm rounded-full text-xs font-bold">
              {discountPercentage}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-6">
        {/* Título */}
        <h3 className="mb-2 font-heading text-lg font-semibold text-txt-primary line-clamp-1 group-hover:text-forest transition-colors">
          {product.title}
        </h3>

        {/* Descrição */}
        {product.description && (
          <p className="mb-4 text-sm text-txt-secondary line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Preço e CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-sm text-txt-muted line-through">
                {formatCurrency(product.compareAtPrice, product.currency)}
              </span>
            )}
            <span className="font-heading text-2xl font-semibold text-forest">
              {formatCurrency(product.price, product.currency)}
            </span>
          </div>

          {/* Ícone CTA — aparece no hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="w-5 h-5 text-forest" />
          </div>
        </div>
      </div>
    </Link>
  )
}
