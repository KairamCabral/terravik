'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Tag } from 'lucide-react'

interface PriceDisplayProps {
  basePrice: number
  compareAtPrice: number | null
  subscriptionPrice: number
  discountPercent: number
  purchaseMode: 'one-time' | 'subscription'
  quantity: number
}

export function PriceDisplay({
  basePrice,
  compareAtPrice,
  subscriptionPrice,
  discountPercent,
  purchaseMode,
  quantity,
}: PriceDisplayProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const totalBasePrice = basePrice * quantity
  const totalSubscriptionPrice = subscriptionPrice * quantity
  const totalCompareAt = compareAtPrice ? compareAtPrice * quantity : null

  const displayPrice =
    purchaseMode === 'subscription' ? totalSubscriptionPrice : totalBasePrice
  const unitPrice =
    purchaseMode === 'subscription' ? subscriptionPrice : basePrice

  return (
    <div className="space-y-2">
      {/* Preço principal */}
      <div className="flex items-baseline gap-3">
        <AnimatePresence mode="wait">
          <motion.span
            key={`${purchaseMode}-${quantity}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="font-heading text-4xl font-bold tracking-tight text-forest"
          >
            {formatPrice(displayPrice)}
          </motion.span>
        </AnimatePresence>

        {/* Preço original riscado (anchoring) */}
        {purchaseMode === 'subscription' && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg text-txt-muted line-through"
          >
            {formatPrice(totalBasePrice)}
          </motion.span>
        )}

        {totalCompareAt && purchaseMode === 'one-time' && (
          <span className="text-lg text-txt-muted line-through">
            {formatPrice(totalCompareAt)}
          </span>
        )}
      </div>

      {/* Indicador de modo + parcelamento */}
      <AnimatePresence mode="wait">
        {purchaseMode === 'subscription' ? (
          <motion.div
            key="subscription-indicator"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-forest/20 bg-forest/5 px-2.5 py-1 text-xs font-semibold text-forest">
                <Tag className="h-3 w-3" />
                -{discountPercent}% assinante
              </span>
              <span className="text-sm text-txt-muted">por entrega</span>
            </div>
            {displayPrice >= 30 && (
              <p className="text-xs text-txt-muted">
                ou{' '}
                <span className="font-medium text-txt-secondary">
                  3x de {formatPrice(displayPrice / 3)}
                </span>{' '}
                sem juros
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="onetime-indicator"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-1"
          >
            {displayPrice >= 30 && (
              <p className="text-xs text-txt-muted">
                ou{' '}
                <span className="font-medium text-txt-secondary">
                  3x de {formatPrice(displayPrice / 3)}
                </span>{' '}
                sem juros
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quantidade */}
      {quantity > 1 && (
        <p className="text-xs text-txt-muted">
          {quantity} unidades × {formatPrice(unitPrice)} cada
        </p>
      )}
    </div>
  )
}
