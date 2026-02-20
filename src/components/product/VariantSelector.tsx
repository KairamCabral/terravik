'use client'

import type { ProductVariant } from '@/types/product'
import { cn } from '@/lib/utils/cn'

/**
 * VariantSelector — Design System 2026
 *
 * - Layout intuitivo: botões do mesmo estilo do seletor de quantidade
 * - Chips com border, estado selecionado em destaque
 * - Estado "indisponível" visível mas não removido
 */

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariantId: string
  onSelect: (variantId: string) => void
  /** Se true, usa o layout em botões grandes (como quantidade) */
  intuitive?: boolean
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
  intuitive = true,
}: VariantSelectorProps) {
  if (variants.length <= 1) return null

  if (intuitive) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-txt-secondary">Tamanho</label>
        <div className="flex flex-wrap items-center gap-2">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => variant.available && onSelect(variant.id)}
              disabled={!variant.available}
              className={cn(
                'flex h-11 min-w-[4.5rem] flex-1 items-center justify-center rounded-xl border-2 text-sm font-semibold transition-all active:scale-[0.98]',
                'disabled:cursor-not-allowed disabled:opacity-50',
                selectedVariantId === variant.id
                  ? 'border-forest bg-forest/10 text-forest'
                  : 'border-border-subtle bg-bg-surface text-txt-primary hover:border-forest/40'
              )}
              aria-pressed={selectedVariantId === variant.id}
            >
              {variant.title}
              {!variant.available && (
                <span className="ml-1 font-normal text-txt-muted">(Esgotado)</span>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-txt-secondary">Tamanho</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            disabled={!variant.available}
            className={cn(
              'rounded-lg border px-4 py-2.5 text-sm font-medium transition-all',
              'disabled:cursor-not-allowed disabled:opacity-40',
              'active:scale-[0.98]',
              selectedVariantId === variant.id
                ? 'border-forest bg-forest/5 text-forest ring-1 ring-forest/20'
                : 'border-border-subtle text-txt-primary hover:border-forest/40'
            )}
            aria-pressed={selectedVariantId === variant.id}
          >
            {variant.title}
            {!variant.available && (
              <span className="ml-1 text-txt-muted">(Esgotado)</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
