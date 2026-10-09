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
import { ProductCard } from '@/components/product/ProductCard'
import { TAGS_DE_PRODUTO, rotuloDaTag } from '@/lib/produtos/tags'

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'bestseller'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Mais relevantes' },
  { value: 'bestseller', label: 'Mais vendidos' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
]

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
              const benefit = TAGS_DE_PRODUTO[tag]
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
                  {benefit?.rotulo || tag}
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
                  {rotuloDaTag(tag)}
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
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  featured={index === 0 && !hasActiveFilters}
                  prioridade={index < 2}
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
