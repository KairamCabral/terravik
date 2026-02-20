'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { calculateRemainingForFreeShipping } from '@/lib/shipping/calculator'
import { FREE_SHIPPING_CONFIG } from '@/lib/shipping/config'
import { formatPrice } from '@/lib/subscription/pricing'

interface FreeShippingBarProps {
  cartSubtotal: number
  className?: string
}

export function FreeShippingBar({ cartSubtotal, className = '' }: FreeShippingBarProps) {
  const { remaining, percentage, achieved } = useMemo(
    () => calculateRemainingForFreeShipping(cartSubtotal),
    [cartSubtotal]
  )

  const getProgressColor = () => {
    if (achieved) return 'bg-grass'
    if (percentage >= 75) return 'bg-leaf-light'
    if (percentage >= 50) return 'bg-terravik-gold-400'
    return 'bg-terravik-gold-300'
  }

  const getMessage = () => {
    if (achieved) return 'Você qualifica-se para frete grátis!'
    if (percentage >= 90) return `Quase lá! Falta apenas ${formatPrice(remaining)}`
    if (percentage >= 50) return `Falta ${formatPrice(remaining)} para frete grátis`
    return `Frete grátis a partir de ${formatPrice(FREE_SHIPPING_CONFIG.threshold)}`
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      <p className={`text-xs font-medium text-center ${achieved ? 'text-leaf' : 'text-terravik-brown/60'}`}>
        {getMessage()}
      </p>

      {/* Barra de progresso fina */}
      <div className="relative h-2 bg-terravik-cream-200 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 ${getProgressColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {achieved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
          >
            <span className="text-sm">🌿</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
