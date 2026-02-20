'use client'

import { motion } from 'framer-motion'
import { Check, Zap, TrendingUp, Clock } from 'lucide-react'
import { getDiscountPercent, calculateSubscriptionPrice } from '@/lib/subscription/pricing'
import { cn } from '@/lib/utils/cn'

interface FrequencyPickerProps {
  selectedFrequency: 30 | 60 | 90
  onFrequencyChange: (frequency: 30 | 60 | 90) => void
  basePrice: number
  quantity: number
}

const FREQUENCY_OPTIONS = [
  {
    days: 30 as const,
    label: '30 dias',
    description: 'Cuidado intensivo',
    icon: Zap,
    recommended: false,
    tag: null,
  },
  {
    days: 60 as const,
    label: '60 dias',
    description: 'Equilíbrio perfeito',
    icon: Check,
    recommended: true,
    tag: 'Recomendado',
  },
  {
    days: 90 as const,
    label: '90 dias',
    description: 'Máxima economia',
    icon: Clock,
    recommended: false,
    tag: 'Maior desconto',
  },
]

export function FrequencyPicker({
  selectedFrequency,
  onFrequencyChange,
  basePrice,
  quantity,
}: FrequencyPickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-txt-secondary">
          Frequência de entrega
        </span>
        <span className="text-xs text-txt-muted">
          Altere quando quiser
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {FREQUENCY_OPTIONS.map((option) => {
          const isSelected = selectedFrequency === option.days
          const discount = getDiscountPercent(option.days)
          const Icon = option.icon

          return (
            <button
              key={option.days}
              onClick={() => onFrequencyChange(option.days)}
              className={cn(
                'relative flex flex-col items-center rounded-xl border-2 p-3 transition-all duration-200 active:scale-[0.98]',
                isSelected
                  ? 'border-forest bg-forest/5 shadow-sm'
                  : 'border-border-subtle bg-bg-surface hover:border-forest/30',
                option.recommended && !isSelected && 'border-forest/20'
              )}
            >
              {/* Tag */}
              {option.tag && (
                <div
                  className={cn(
                    'absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                    option.recommended
                      ? 'bg-forest text-white'
                      : 'bg-gold/10 text-gold'
                  )}
                >
                  {option.tag}
                </div>
              )}

              {/* Ícone */}
              <div
                className={cn(
                  'mb-1 flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                  isSelected
                    ? 'bg-forest text-white'
                    : 'bg-forest/8 text-forest'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Dias */}
              <span
                className={cn(
                  'text-sm font-semibold',
                  isSelected ? 'text-forest' : 'text-txt-primary'
                )}
              >
                {option.days}
              </span>
              <span className="text-[10px] text-txt-muted">dias</span>

              {/* Desconto */}
              <div
                className={cn(
                  'mt-2 rounded-full px-2 py-0.5 text-xs font-bold',
                  isSelected
                    ? 'bg-forest text-white'
                    : 'bg-forest/8 text-forest'
                )}
              >
                -{discount}%
              </div>

              {/* Indicador de seleção */}
              {isSelected && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-forest"
                  layoutId="frequency-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Descrição da frequência selecionada */}
      <motion.p
        key={selectedFrequency}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-xs text-txt-muted"
      >
        {FREQUENCY_OPTIONS.find((o) => o.days === selectedFrequency)?.description}
        {' — '}
        Você recebe a cada {selectedFrequency} dias
      </motion.p>
    </div>
  )
}
