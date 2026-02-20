'use client'

import { motion } from 'framer-motion'
import { Lock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/subscription/pricing'

interface CheckoutCTAProps {
  total: number
  isSubmitting: boolean
  disabled: boolean
  onClick: () => void
  savings?: number
}

export function CheckoutCTA({ total, isSubmitting, disabled, onClick, savings }: CheckoutCTAProps) {
  return (
    <div className="space-y-3">
      <motion.button
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={onClick}
        disabled={disabled || isSubmitting}
        className={cn(
          'w-full flex items-center justify-center gap-3 h-14 rounded-xl text-base font-semibold transition-all',
          'bg-forest text-white shadow-lg shadow-forest/20',
          'hover:bg-forest-ink hover:shadow-xl hover:shadow-forest/30',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          'focus:outline-none focus:ring-4 focus:ring-forest/30'
        )}
      >
        {isSubmitting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          <>
            <span>Próximo passo</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>

      {savings && savings > 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs font-medium text-forest"
        >
          Você está economizando {formatPrice(savings)} neste pedido
        </motion.p>
      ) : null}

      <p className="text-center text-[11px] text-txt-muted leading-relaxed">
        Você será redirecionado para o ambiente seguro de pagamento.
        <br />
        Ao prosseguir, você concorda com os{' '}
        <a href="/termos" className="underline hover:text-forest">Termos</a> e{' '}
        <a href="/privacidade" className="underline hover:text-forest">Política de Privacidade</a>.
      </p>
    </div>
  )
}
