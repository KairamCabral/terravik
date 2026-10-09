'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Leaf, Star } from 'lucide-react'
import type { Product } from '@/types/product'
import { FavoriteButton } from '@/components/ui'
import { formatCurrency } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'
import { chipsDoProduto, rotuloDaTag } from '@/lib/produtos/tags'
import { rotuloNoPlural } from '@/lib/shopify/variant-options'

/**
 * Card de produto, o único card de navegação do site.
 *
 * Antes havia quatro: um inline na listagem, este arquivo (sem uso), um em
 * /favoritos e outro em /conta/favoritos. Listagem e favoritos agora desenham
 * o mesmo card.
 */
interface ProductCardProps {
  product: Product
  /** Posição na grade, para escalonar a animação de entrada. */
  index?: number
  featured?: boolean
  /** 'favoritar' alterna o favorito; 'remover' tira da lista (página de favoritos). */
  acaoDoCoracao?: 'favoritar' | 'remover'
  onRemover?: () => void
  /** Imagem acima da dobra: carrega com prioridade (candidata a LCP). */
  prioridade?: boolean
}

export function ProductCard({
  product,
  index = 0,
  featured,
  acaoDoCoracao = 'favoritar',
  onRemover,
  prioridade = false,
}: ProductCardProps) {
  const temPreco = product.price > 0
  const hasDiscount = temPreco && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const hasVariants = product.variants.length > 1
  // "a partir de" só quando as variantes têm preços diferentes.
  const variaDePreco = hasVariants && product.maxPrice > product.price

  const chips = chipsDoProduto(product.tags)
  const href = `/produtos/${product.handle}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn('relative', featured && 'sm:col-span-2 lg:col-span-1')}
    >
      <Link
        href={href}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-forest/20 hover:shadow-xl"
      >
        {/* Top gradient accent */}
        <div className="absolute left-0 right-0 top-0 z-10 h-1 bg-gradient-to-r from-forest via-forest to-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Foto: inteira sobre a superfície creme, sem corte */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-bg-surface-2 to-bg-primary">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.alt || product.title}
              fill
              priority={prioridade}
              className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Leaf className="h-16 w-16 text-forest/10" aria-hidden="true" />
            </div>
          )}

          {/* Selos sobre a foto, à esquerda. O coração fica à direita. */}
          <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-2">
            {product.tags.includes('novo') && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-forest/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                <Star className="h-3 w-3" aria-hidden="true" />
                {rotuloDaTag('novo')}
              </span>
            )}
            {hasDiscount && (
              <span className="inline-flex items-center rounded-full bg-error px-3 py-1 text-[11px] font-bold text-white">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Quick view overlay */}
          <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-bg-surface/95 py-2.5 text-sm font-semibold text-forest shadow-lg backdrop-blur-sm">
              Ver detalhes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-5 md:p-6">
          {chips.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <span
                  key={chip.rotulo}
                  className={cn('rounded-full border px-2.5 py-0.5 text-[11px] font-medium', chip.cor)}
                >
                  {chip.rotulo}
                </span>
              ))}
            </div>
          )}

          <h3 className="font-heading text-lg font-semibold text-txt-primary transition-colors group-hover:text-forest md:text-xl">
            {product.title}
          </h3>

          {product.description && (
            <p className="mt-2 flex-1 text-sm leading-relaxed text-txt-secondary line-clamp-2">
              {product.description}
            </p>
          )}

          {hasVariants && (
            <p className="mt-3 text-xs text-txt-secondary">
              {product.variants.length} {rotuloNoPlural(product.variants)} disponíveis
            </p>
          )}

          <div className="mt-4 flex items-end justify-between border-t border-border-subtle pt-4">
            <div>
              {!temPreco ? (
                <span className="font-heading text-base font-semibold text-forest">
                  Preço em definição
                </span>
              ) : (
                <>
                  {hasDiscount && (
                    <span className="text-xs text-txt-secondary line-through">
                      {formatCurrency(product.compareAtPrice, product.currency)}
                    </span>
                  )}
                  <div className="flex items-baseline gap-1">
                    {variaDePreco && <span className="text-xs text-txt-secondary">a partir de</span>}
                    <span className="font-heading text-xl font-bold text-forest">
                      {formatCurrency(product.price, product.currency)}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest/5 text-forest transition-all group-hover:bg-forest group-hover:text-white group-hover:shadow-md">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </Link>

      {/* Coração: fora do link, porque botão dentro de <a> é HTML inválido. */}
      {acaoDoCoracao === 'remover' ? (
        <button
          type="button"
          onClick={onRemover}
          className="group/coracao absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-bg-surface/90 shadow-md backdrop-blur-sm transition-transform hover:scale-110"
          aria-label={`Remover ${product.title} dos favoritos`}
        >
          <Heart
            className="h-4 w-4 fill-red-500 text-red-500 transition-all group-hover/coracao:fill-transparent"
            aria-hidden="true"
          />
        </button>
      ) : (
        <FavoriteButton
          productId={product.handle}
          size="md"
          className="absolute right-3 top-3 z-20"
        />
      )}
    </motion.div>
  )
}
