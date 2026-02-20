'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils/cn'

/**
 * ProductFilters — Design System 2026
 *
 * - Desktop: inline discreto, acima do grid
 * - Mobile: toggle drawer
 * - Sem visual pesado / bordas grossas
 */

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

interface ProductFiltersProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  availableTags?: string[]
  selectedTags?: string[]
  onTagsChange?: (tags: string[]) => void
  priceRange?: { min: number; max: number }
  onPriceRangeChange?: (range: { min: number; max: number }) => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Mais relevantes' },
  { value: 'name-asc', label: 'Nome (A-Z)' },
  { value: 'name-desc', label: 'Nome (Z-A)' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
]

export function ProductFilters({
  sortBy,
  onSortChange,
  availableTags = [],
  selectedTags = [],
  onTagsChange,
  priceRange,
  onPriceRangeChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  function toggleTag(tag: string) {
    if (!onTagsChange) return
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  function clearFilters() {
    onTagsChange?.([])
    onPriceRangeChange?.({ min: 0, max: 999 })
  }

  const hasActiveFilters = selectedTags.length > 0

  return (
    <div className="space-y-4">
      {/* ── Desktop bar ──────────────────────── */}
      <div className="hidden items-center justify-between lg:flex">
        <div className="text-xs text-txt-muted">
          {hasActiveFilters && (
            <span>
              {selectedTags.length}{' '}
              {selectedTags.length === 1 ? 'filtro ativo' : 'filtros ativos'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm font-medium text-txt-secondary">
            Ordenar por:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-lg border border-border-subtle bg-bg-surface px-4 py-2 text-sm text-txt-primary focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest/20"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Mobile bar ───────────────────────── */}
      <div className="flex items-center justify-between lg:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros {hasActiveFilters && `(${selectedTags.length})`}
        </Button>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-lg border border-border-subtle bg-bg-surface px-3 py-2 text-sm text-txt-primary"
          aria-label="Ordenar produtos"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Filter panel ─────────────────────── */}
      <div
        className={cn(
          'space-y-4 rounded-lg border border-border-subtle bg-bg-surface p-4 lg:block',
          !isOpen && 'hidden lg:block'
        )}
      >
        {availableTags.length > 0 && onTagsChange && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-txt-primary">
                Características
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-forest hover:underline"
                >
                  Limpar
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                      isSelected
                        ? 'border-forest bg-forest text-bg-primary'
                        : 'border-border-subtle text-txt-secondary hover:border-forest/40'
                    )}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {isOpen && (
          <div className="flex justify-end lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Fechar
            </Button>
          </div>
        )}
      </div>

      {/* ── Active pills ─────────────────────── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-txt-muted">Filtros ativos:</span>
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="flex items-center gap-1 rounded-full bg-forest/8 px-3 py-1 text-xs font-medium text-forest"
            >
              {tag}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={clearFilters}
            className="text-xs text-txt-muted hover:text-txt-primary hover:underline"
          >
            Limpar todos
          </button>
        </div>
      )}
    </div>
  )
}
