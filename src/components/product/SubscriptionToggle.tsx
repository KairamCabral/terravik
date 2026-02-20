'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/formatters'

interface SubscriptionToggleProps {
  hasSubscription: boolean
  oneTimePrice: number
  subscriptionPrice?: number
  subscriptionInterval?: string
  currency: string
  onToggle?: (isSubscription: boolean) => void
}

export function SubscriptionToggle({
  hasSubscription,
  oneTimePrice,
  subscriptionPrice,
  subscriptionInterval = '4-8 semanas',
  currency,
  onToggle,
}: SubscriptionToggleProps) {
  const [isSubscription, setIsSubscription] = useState(false)

  if (!hasSubscription || !subscriptionPrice) return null

  const savings = Math.round(
    ((oneTimePrice - subscriptionPrice) / oneTimePrice) * 100
  )

  const handleToggle = (value: boolean) => {
    setIsSubscription(value)
    onToggle?.(value)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-terravik-brown">
        Opção de compra
      </h3>

      {/* Toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleToggle(false)}
          className={cn(
            'relative rounded-lg border-2 p-4 text-left transition-all',
            !isSubscription
              ? 'border-terravik-green bg-terravik-green/10'
              : 'border-terravik-brown/20 hover:border-terravik-green/50'
          )}
        >
          <div className="mb-1 text-sm font-medium text-terravik-brown">
            Compra única
          </div>
          <div className="font-display text-lg font-bold text-terravik-green">
            {formatCurrency(oneTimePrice, currency)}
          </div>
        </button>

        <button
          onClick={() => handleToggle(true)}
          className={cn(
            'relative rounded-lg border-2 p-4 text-left transition-all',
            isSubscription
              ? 'border-terravik-green bg-terravik-green/10'
              : 'border-terravik-brown/20 hover:border-terravik-green/50'
          )}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-terravik-brown">
              Assinatura
            </span>
            <Badge variant="success" size="sm">
              Economize {savings}%
            </Badge>
          </div>
          <div className="font-display text-lg font-bold text-terravik-green">
            {formatCurrency(subscriptionPrice, currency)}
          </div>
        </button>
      </div>

      {/* Info sobre assinatura */}
      {isSubscription && (
        <p className="text-sm text-terravik-brown/70">
          Entrega automática a cada {subscriptionInterval}. Cancele quando
          quiser, sem taxas.
        </p>
      )}
    </div>
  )
}
