'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PurchaseModeToggleProps {
  currentMode: 'one-time' | 'subscription'
  onModeChange: (mode: 'one-time' | 'subscription') => void
  savingsPercent: number
  savingsAmount: number
}

export function PurchaseModeToggle({
  currentMode,
  onModeChange,
  savingsPercent,
  savingsAmount,
}: PurchaseModeToggleProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-txt-secondary">
        Como você quer receber?
      </span>

      {/* Toggle Cards — Compra única em destaque */}
      <div className="grid grid-cols-2 gap-3">
        {/* Compra Única (prioridade) */}
        <button
          onClick={() => onModeChange('one-time')}
          className={cn(
            'relative rounded-xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.98]',
            currentMode === 'one-time'
              ? 'border-forest bg-forest/5 shadow-sm ring-2 ring-forest/20'
              : 'border-border-subtle bg-bg-surface hover:border-border-medium'
          )}
          aria-pressed={currentMode === 'one-time'}
        >
          <div className="mb-2 flex items-center gap-2">
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                currentMode === 'one-time'
                  ? 'border-forest bg-forest'
                  : 'border-border-medium'
              )}
            >
              {currentMode === 'one-time' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </div>
            <span className="font-semibold text-txt-primary">Compra única</span>
          </div>
          <p className="text-xs text-txt-muted">Comprar apenas uma vez</p>
        </button>

        {/* Assinar */}
        <button
          onClick={() => onModeChange('subscription')}
          className={cn(
            'relative rounded-xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.98]',
            currentMode === 'subscription'
              ? 'border-forest bg-forest/5 shadow-sm'
              : 'border-border-subtle bg-forest/5 hover:border-forest/30'
          )}
          aria-pressed={currentMode === 'subscription'}
        >
          <div className="mb-2 flex items-center gap-2">
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                currentMode === 'subscription'
                  ? 'border-forest bg-forest'
                  : 'border-forest/30'
              )}
            >
              {currentMode === 'subscription' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </div>
            <span className="font-medium text-forest">Assinar</span>
            <Sparkles className="h-3.5 w-3.5 text-gold" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-forest">-{savingsPercent}%</span>
            <span className="text-[10px] text-txt-muted">+ frete grátis</span>
          </div>
        </button>
      </div>
    </div>
  )
}
