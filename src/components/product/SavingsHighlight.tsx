'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Gift } from 'lucide-react'

interface SavingsHighlightProps {
  annualSavings: number
  frequency: number
  quantity: number
}

export function SavingsHighlight({
  annualSavings,
  frequency,
  quantity,
}: SavingsHighlightProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getAnalogy = (value: number): string => {
    if (value < 50) return 'alguns cafés especiais'
    if (value < 100) return 'um jantar delivery'
    if (value < 200) return 'um jantar especial a dois'
    if (value < 400) return 'aquele gadget da sua wishlist'
    if (value < 600) return 'uma escapada de fim de semana'
    return 'quase uma mini-viagem'
  }

  const deliveriesPerYear = Math.floor(365 / frequency)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest-ink via-forest to-forest p-5 text-white shadow-lg"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-white/70">
            Sua economia anual
          </span>
        </div>

        {/* Valor principal */}
        <div className="mb-4 flex items-baseline gap-2">
          <motion.span
            key={annualSavings}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold"
          >
            {formatPrice(annualSavings)}
          </motion.span>
          <span className="text-white/60">/ano</span>
        </div>

        {/* Analogia */}
        <p className="mb-4 text-sm text-white/70">
          Com esse valor você poderia ter {getAnalogy(annualSavings)}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-white/60">
              <Gift className="h-4 w-4" />
              <span className="text-xs">Entregas/ano</span>
            </div>
            <p className="mt-1 text-xl font-bold">{deliveriesPerYear}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-white/60">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Economia/entrega</span>
            </div>
            <p className="mt-1 text-xl font-bold">
              {formatPrice(annualSavings / deliveriesPerYear)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
