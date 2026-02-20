'use client'

import { Shield, Truck, RotateCcw, CreditCard } from 'lucide-react'

export function TrustSignals() {
  const signals = [
    { icon: Shield, text: 'Compra segura' },
    { icon: Truck, text: 'Entrega garantida' },
    { icon: RotateCcw, text: 'Troca grátis' },
    { icon: CreditCard, text: 'Parcele em até 12x' },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-xl border border-border-subtle bg-bg-surface p-4">
      {signals.map((signal) => {
        const Icon = signal.icon
        return (
          <div
            key={signal.text}
            className="flex items-center gap-2 text-xs font-medium text-txt-secondary"
          >
            <Icon className="h-4 w-4 text-forest" strokeWidth={1.5} />
            <span>{signal.text}</span>
          </div>
        )
      })}
    </div>
  )
}
