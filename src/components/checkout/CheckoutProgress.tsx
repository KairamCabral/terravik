'use client'

import { motion } from 'framer-motion'
import { Check, ClipboardList, Package, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { CheckoutStep } from '@/lib/checkout/types'

const STEPS: { id: CheckoutStep; label: string; icon: typeof ClipboardList }[] = [
  { id: 'info', label: 'Seus dados', icon: ClipboardList },
  { id: 'shipping', label: 'Frete', icon: Package },
  { id: 'payment', label: 'Pagamento', icon: CreditCard },
]

const stepIndex: Record<CheckoutStep, number> = { info: 0, shipping: 1, payment: 2 }

interface CheckoutProgressProps {
  currentStep: CheckoutStep
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const currentIdx = stepIndex[currentStep]

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIdx
          const isActive = idx === currentIdx
          const Icon = step.icon

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-initial">
              <div className="flex items-center gap-2.5">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    backgroundColor: isDone ? '#093E28' : isActive ? '#093E28' : '#F4EFE5',
                  }}
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-full transition-colors',
                    isDone || isActive ? 'text-white' : 'text-txt-muted'
                  )}
                >
                  {isDone ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    'text-sm font-medium whitespace-nowrap',
                    isDone || isActive ? 'text-txt-primary' : 'text-txt-muted'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="flex-1 mx-4 h-px bg-border-subtle relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: idx < currentIdx ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="absolute inset-y-0 left-0 bg-forest"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile — compacto */}
      <div className="sm:hidden">
        <div className="flex items-center gap-1 justify-center mb-1.5">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentIdx
            const isActive = idx === currentIdx
            return (
              <div key={step.id} className="flex items-center gap-1">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    isDone ? 'bg-forest' : isActive ? 'bg-forest' : 'bg-border-subtle'
                  )}
                />
                {idx < STEPS.length - 1 && (
                  <div className={cn('w-8 h-0.5 rounded', idx < currentIdx ? 'bg-forest' : 'bg-border-subtle')} />
                )}
              </div>
            )
          })}
        </div>
        <p className="text-center text-xs text-txt-muted">
          Etapa {currentIdx + 1} de 3 · <span className="font-medium text-txt-primary">{STEPS[currentIdx].label}</span>
        </p>
      </div>

      {/* Microcopy motivacional */}
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-xs text-txt-muted mt-2 hidden sm:block"
      >
        {currentStep === 'info' && 'Preencha seus dados e endereço'}
        {currentStep === 'shipping' && 'Quase lá! Escolha o frete'}
        {currentStep === 'payment' && 'Último passo — finalize com segurança'}
      </motion.p>
    </div>
  )
}
