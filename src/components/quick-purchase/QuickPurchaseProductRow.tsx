'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/subscription/pricing'
import { cn } from '@/lib/utils/cn'
import type { QuickPurchaseVariant } from '@/lib/quick-purchase/constants'

interface QuickPurchaseProductRowProps {
  title: string
  image: string
  badge?: string | null
  variants: QuickPurchaseVariant[]
  selectedVariant: QuickPurchaseVariant
  onVariantChange: (variant: QuickPurchaseVariant) => void
  quantity: number
  onQuantityChange: (qty: number) => void
  showVariantSelector?: boolean
}

export function QuickPurchaseProductRow({
  title,
  image,
  badge,
  variants,
  selectedVariant,
  onVariantChange,
  quantity,
  onQuantityChange,
  showVariantSelector = true,
}: QuickPurchaseProductRowProps) {
  const handlePlus = () => onQuantityChange(quantity + 1)
  const handleMinus = () => quantity > 0 && onQuantityChange(quantity - 1)
  const isActive = quantity > 0
  const hasMultipleVariants = variants.length > 1

  return (
    <motion.div
      layout
      className={cn(
        'flex flex-col gap-3 py-4 px-4 rounded-xl border transition-all duration-200',
        isActive
          ? 'border-forest/30 bg-forest-soft/20'
          : 'border-border-subtle bg-bg-surface'
      )}
    >
      <div className="flex items-center gap-3">
        {/* Imagem */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white border border-border-subtle flex-shrink-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain p-1"
            sizes="56px"
          />
          {badge && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-forest text-white">
              {badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-txt-primary truncate">{title}</p>
          <p className="text-xs text-txt-muted mt-0.5">
            {selectedVariant.title} — {formatPrice(selectedVariant.price)}
          </p>
          {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
            <span className="text-xs text-txt-muted line-through mt-0.5 block">
              {formatPrice(selectedVariant.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Seletor de quantidade */}
        <div className="flex items-center gap-1 bg-bg-surface-2 rounded-lg border border-border-subtle flex-shrink-0">
          <button
            type="button"
            onClick={handleMinus}
            disabled={quantity <= 0}
            className="p-2.5 rounded-l-lg text-txt-muted hover:text-txt-primary hover:bg-forest-soft/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
            aria-label="Diminuir quantidade"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="min-w-[28px] text-center text-sm font-semibold text-txt-primary">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handlePlus}
            className="p-2.5 rounded-r-lg text-forest hover:bg-forest-soft/30 transition-colors active:scale-95"
            aria-label="Aumentar quantidade"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pills de tamanho (alternativa ao select, mais visual em mobile) */}
      {showVariantSelector && hasMultipleVariants && (
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.variantId}
              type="button"
              onClick={() => onVariantChange(v)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                selectedVariant.variantId === v.variantId
                  ? 'bg-forest text-white'
                  : 'bg-bg-surface-2 text-txt-muted border border-border-subtle hover:border-forest/30 hover:text-forest'
              )}
            >
              {v.title} — {formatPrice(v.price)}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
