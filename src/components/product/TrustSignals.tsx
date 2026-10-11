'use client'

import { Shield, Truck, RotateCcw, CreditCard } from 'lucide-react'
import { PARCELAMENTO } from '@/lib/pagamento/parcelas'

export function TrustSignals() {
  const signals = [
    { icon: Shield, text: 'Compra segura' },
    { icon: Truck, text: 'Entrega para todo o Brasil' },
    { icon: RotateCcw, text: 'Devolução em até 7 dias' },
    { icon: CreditCard, text: `Parcele em até ${PARCELAMENTO.parcelas}x` },
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
