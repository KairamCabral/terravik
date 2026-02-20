'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  ChevronDown,
  Star,
  Check,
} from 'lucide-react'
import type { Product } from '@/types/product'
import { formatCurrency } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui'

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'bestseller'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Mais relevantes' },
  { value: 'bestseller', label: 'Mais vendidos' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
]

const PRODUCT_BENEFITS: Record<string, { label: string; color: string }> = {
  implantacao: { label: 'Implantação', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  crescimento: { label: 'Crescimento', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  resistencia: { label: 'Proteção', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  protecao: { label: 'Resistência', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  novo: { label: 'Novo', color: 'bg-forest/5 text-forest border-forest/20' },
  verde: { label: 'Verde Intenso', color: 'bg-green-50 text-green-700 border-green-200' },
}

const TRUST_ITEMS = [
  { icon: Truck, text: 'Frete grátis acima de R$ 149' },
  { icon: ShieldCheck, text: 'Garantia de satisfação' },
  { icon: Leaf, text: 'Fórmulas premium' },
  { icon: Star, text: '4.9★ avaliação média' },
]

interface ProductsPageClientProps {
  initialProducts: Product[]
}

export function ProductsPageClient({ initialProducts }: ProductsPageClientProps) {
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    initialProducts.forEach((product) => {
      product.tags?.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [initialProducts])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...initialProducts]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((product) =>
        selectedTags.some((tag) => product.tags?.includes(tag))
      )
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'bestseller':
        break
    }

    return filtered
  }, [initialProducts, selectedTags, sortBy, searchQuery])

  const toggleTag = useCallback(
    (tag: string) => {
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      )
    },
    []
  )

  const clearFilters = useCallback(() => {
    setSelectedTags([])
    setSearchQuery('')
  }, [])

  const hasActiveFilters = selectedTags.length > 0 || searchQuery.trim().length > 0

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden bg-forest-ink">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />

        <div className="container-main relative py-10 md:py-12 lg:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wider text-gold uppercase backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Nutrição inteligente para gramados
              </span>

              <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.5rem]">
                Nossos{' '}
                <span className="bg-gradient-to-r from-gold to-gold-muted bg-clip-text text-transparent">
                  Produtos
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base text-txt-on-dark-muted md:text-lg">
                Três linhas desenvolvidas com precisão para cada fase do seu gramado.
                Dose certa, resultado visível.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="border-y border-border-medium bg-white shadow-lg">
        <div className="container-main">
          <div className="grid grid-cols-2 gap-6 py-8 md:flex md:items-center md:justify-center md:gap-12 lg:gap-20">
            {TRUST_ITEMS.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="group flex flex-col items-center gap-3 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-forest/10 to-forest/5 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:from-forest/15 group-hover:to-forest/10">
                  <item.icon className="h-6 w-6 text-forest transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                  
                  {/* Decorative glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-forest/5 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                
                <span className="max-w-[140px] text-xs font-semibold leading-tight text-txt-primary transition-colors duration-300 group-hover:text-forest md:text-sm lg:max-w-none">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <section className="container-main py-10 md:py-14 lg:py-16">
        {/* ── Toolbar ── */}
        <div className="mb-8 space-y-4">
          {/* Search + Sort row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-muted" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border-subtle bg-bg-surface py-2 pl-10 pr-10 text-sm text-txt-primary placeholder-txt-muted transition-colors focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-txt-muted hover:text-txt-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-txt-muted sm:block">Ordenar:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none rounded-lg border border-border-subtle bg-bg-surface py-2 pl-4 pr-10 text-sm text-txt-primary transition-colors focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-txt-muted" />
              </div>
            </div>
          </div>

          {/* Tags / Filtros inline */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedTags([])}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                selectedTags.length === 0
                  ? 'border-forest bg-forest text-white shadow-sm'
                  : 'border-border-subtle text-txt-secondary hover:border-forest/30 hover:text-forest'
              )}
            >
              Todos
            </button>
            {availableTags.map((tag) => {
              const benefit = PRODUCT_BENEFITS[tag]
              const isSelected = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                    isSelected
                      ? 'border-forest bg-forest text-white shadow-sm'
                      : 'border-border-subtle text-txt-secondary hover:border-forest/30 hover:text-forest'
                  )}
                >
                  {benefit?.label || tag}
                </button>
              )
            })}
          </div>
        </div>

        {/* Active filters chips */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-txt-muted">Filtros:</span>
              {selectedTags.map((tag) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => toggleTag(tag)}
                  className="flex items-center gap-1.5 rounded-full bg-forest/8 px-3 py-1 text-xs font-medium text-forest transition-colors hover:bg-forest/15"
                >
                  {PRODUCT_BENEFITS[tag]?.label || tag}
                  <X className="h-3 w-3" />
                </motion.button>
              ))}
              {searchQuery && (
                <span className="flex items-center gap-1.5 rounded-full bg-forest/8 px-3 py-1 text-xs font-medium text-forest">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-txt-muted underline-offset-2 hover:text-forest hover:underline"
              >
                Limpar tudo
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Product Grid ── */}
        <AnimatePresence mode="wait">
          {filteredAndSortedProducts.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCardPremium
                  key={product.id}
                  product={product}
                  index={index}
                  featured={index === 0 && !hasActiveFilters}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-border-subtle bg-bg-surface p-16 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-forest/5">
                <Search className="h-6 w-6 text-forest/40" />
              </div>
              <p className="text-lg font-medium text-txt-primary">
                Nenhum produto encontrado
              </p>
              <p className="mt-2 text-sm text-txt-muted">
                Tente ajustar seus filtros ou termos de busca.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-forest underline-offset-2 hover:underline"
              >
                Limpar filtros
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom CTA ── */}
        {filteredAndSortedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <div className="mx-auto max-w-lg rounded-2xl border border-border-subtle bg-bg-surface p-8 md:p-10">
              <h2 className="font-heading text-xl font-semibold text-txt-primary md:text-2xl">
                Não sabe qual escolher?
              </h2>
              <p className="mt-3 text-sm text-txt-secondary">
                Nossa calculadora analisa o estado do seu gramado e recomenda o produto ideal em menos de 2 minutos.
              </p>
              <Link
                href="/calculadora"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-forest-ink hover:shadow-lg"
              >
                <Sparkles className="h-4 w-4" />
                Usar a Calculadora
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PRODUCT CARD PREMIUM
   ═══════════════════════════════════════════════════════════ */

interface ProductCardPremiumProps {
  product: Product
  index: number
  featured?: boolean
}

function ProductCardPremium({ product, index, featured }: ProductCardPremiumProps) {
  const hasDiscount = product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0

  const hasVariants = product.variants.length > 1
  const priceRange =
    hasVariants && product.maxPrice > product.price
      ? `${formatCurrency(product.price, product.currency)} – ${formatCurrency(product.maxPrice, product.currency)}`
      : null

  const tagBenefits = product.tags
    .map((t) => PRODUCT_BENEFITS[t])
    .filter(Boolean)
    .slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        featured && 'sm:col-span-2 lg:col-span-1'
      )}
    >
      <Link
        href={`/produtos/${product.handle}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-forest/20 hover:shadow-xl"
      >
        {/* Top gradient accent */}
        <div className="absolute left-0 right-0 top-0 z-10 h-1 bg-gradient-to-r from-forest via-forest to-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-bg-surface-2 to-bg-primary">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.alt || product.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Leaf className="h-16 w-16 text-forest/10" />
            </div>
          )}

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
            {product.tags.includes('novo') && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-forest/90 px-3 py-1 text-[11px] font-semibold text-white uppercase tracking-wide backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                Novo
              </span>
            )}
          </div>

          {hasDiscount && (
            <div className="absolute right-3 top-3 z-10">
              <span className="inline-flex items-center rounded-full bg-red-500/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* Quick view overlay */}
          <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white/95 py-2.5 text-sm font-semibold text-forest shadow-lg backdrop-blur-sm">
              Ver detalhes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-5 md:p-6">
          {/* Tags */}
          {tagBenefits.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {tagBenefits.map((benefit) => (
                <span
                  key={benefit!.label}
                  className={cn(
                    'rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
                    benefit!.color
                  )}
                >
                  {benefit!.label}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-heading text-lg font-semibold text-txt-primary transition-colors group-hover:text-forest md:text-xl">
            {product.title}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="mt-2 flex-1 text-sm leading-relaxed text-txt-secondary line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Variant info */}
          {hasVariants && (
            <p className="mt-3 text-xs text-txt-muted">
              {product.variants.length} tamanhos disponíveis
            </p>
          )}

          {/* Price section */}
          <div className="mt-4 flex items-end justify-between border-t border-border-subtle pt-4">
            <div>
              {hasDiscount && (
                <span className="text-xs text-txt-muted line-through">
                  {formatCurrency(product.compareAtPrice, product.currency)}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                {priceRange ? (
                  <span className="font-heading text-sm font-semibold text-forest">
                    {priceRange}
                  </span>
                ) : (
                  <>
                    <span className="text-xs text-txt-muted">a partir de</span>
                    <span className="font-heading text-xl font-bold text-forest">
                      {formatCurrency(product.price, product.currency)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* CTA micro */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest/5 text-forest transition-all group-hover:bg-forest group-hover:text-white group-hover:shadow-md">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
