'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { progressoDoFreteGratis, regiaoDoFreteGratis } from '@/lib/shipping/config'
import { formatPrice } from '@/lib/subscription/pricing'

interface FreeShippingBarProps {
  cartSubtotal: number
  className?: string
}

/**
 * Barra de progresso do frete grátis.
 *
 * Só desenha o que `progressoDoFreteGratis` devolve; a regra (valores e UFs)
 * mora em lib/shipping/config.ts. A mensagem diz a região: o frete grátis não
 * vale para o país todo.
 */
export function FreeShippingBar({ cartSubtotal, className = '' }: FreeShippingBarProps) {
  const semMovimento = useReducedMotion()
  const { liberada, proxima, falta, percentual } = useMemo(
    () => progressoDoFreteGratis(cartSubtotal),
    [cartSubtotal]
  )

  // Sem faixa nenhuma no config não há o que mostrar.
  if (!liberada && !proxima) return null

  const achieved = proxima === null
  const regiao = (proxima ?? liberada)!.regiao
  const todoOBrasil = regiaoDoFreteGratis() === 'todo o Brasil'
  const onde = todoOBrasil ? '' : ` para ${regiao}`

  const getProgressColor = () => {
    if (achieved) return 'bg-grass'
    if (percentual >= 75) return 'bg-leaf-light'
    if (percentual >= 50) return 'bg-terravik-gold-400'
    return 'bg-terravik-gold-300'
  }

  const getMessage = () => {
    if (achieved) return `Frete grátis liberado${onde}`
    if (percentual >= 50) return `Falta ${formatPrice(falta)} para frete grátis${onde}`
    return `Frete grátis a partir de ${formatPrice(proxima!.minimo)}${onde}`
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      <p className={`text-xs font-medium text-center ${achieved ? 'text-leaf' : 'text-terravik-brown/80'}`}>
        {getMessage()}
      </p>

      {/* Barra de progresso fina */}
      <div
        role="progressbar"
        aria-label="Progresso para o frete grátis"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentual)}
        aria-valuetext={getMessage()}
        className="relative h-2 bg-terravik-cream-200 rounded-full overflow-hidden"
      >
        <motion.div
          className={`absolute inset-y-0 left-0 ${getProgressColor()} rounded-full`}
          initial={semMovimento ? false : { width: 0 }}
          animate={{ width: `${percentual}%` }}
          transition={{ duration: semMovimento ? 0 : 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
