'use client'

import { motion } from 'framer-motion'
import { Truck, Percent, Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SubscriptionBenefitsProps {
  compact?: boolean
}

const BENEFITS = [
  {
    icon: Percent,
    title: 'Desconto exclusivo',
    description: 'Até 18% off em todos os pedidos',
    accent: 'bg-forest/8 text-forest',
  },
  {
    icon: Truck,
    title: 'Frete grátis',
    description: 'Em todas as entregas',
    accent: 'bg-forest/8 text-forest',
  },
  {
    icon: Calendar,
    title: 'Flexibilidade total',
    description: 'Pause ou pule quando quiser',
    accent: 'bg-forest/8 text-forest',
  },
  {
    icon: X,
    title: 'Cancele quando quiser',
    description: 'Sem taxas ou multas',
    accent: 'bg-gold/10 text-gold',
    highlight: true,
  },
]

const BENEFITS_COMPACT = [
  { icon: Percent, text: 'Até 18% off' },
  { icon: Truck, text: 'Frete grátis' },
  { icon: Calendar, text: 'Flexível' },
  { icon: X, text: 'Cancele grátis' },
]

export function SubscriptionBenefits({ compact = false }: SubscriptionBenefitsProps) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {BENEFITS_COMPACT.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <motion.div
              key={benefit.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-1.5 rounded-full bg-forest/5 px-3 py-1.5 text-xs font-medium text-forest"
            >
              <Icon className="h-3.5 w-3.5" />
              {benefit.text}
            </motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-txt-primary">
        Benefícios da assinatura
      </h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {BENEFITS.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-3 transition-colors',
                benefit.highlight
                  ? 'border-gold/20 bg-gold/5'
                  : 'border-border-subtle bg-bg-surface'
              )}
            >
              <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', benefit.accent)}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-txt-primary">{benefit.title}</p>
                <p className="text-xs text-txt-muted">{benefit.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
