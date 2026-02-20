'use client'

import { Shield, RefreshCw, Truck, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const BADGES = [
  {
    icon: Shield,
    title: 'Pagamento Seguro',
    subtitle: 'Criptografia SSL',
  },
  {
    icon: RefreshCw,
    title: 'Garantia 30 dias',
    subtitle: 'Satisfação ou reembolso',
  },
  {
    icon: Truck,
    title: 'Rastreio em tempo real',
    subtitle: 'Acompanhe seu pedido',
  },
  {
    icon: Leaf,
    title: '100% Orgânico',
    subtitle: 'Certificado e natural',
  },
]

interface CheckoutTrustBadgesProps {
  variant?: 'full' | 'compact'
  className?: string
}

export function CheckoutTrustBadges({ variant = 'full', className }: CheckoutTrustBadgesProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-3', className)}>
        {BADGES.map((badge) => (
          <div key={badge.title} className="flex items-center gap-1.5 text-xs text-txt-muted">
            <badge.icon className="w-3.5 h-3.5 text-forest/60" />
            <span>{badge.title}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      {BADGES.map((badge) => (
        <div
          key={badge.title}
          className="flex items-start gap-2.5 rounded-lg border border-border-subtle bg-bg-surface p-3"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-forest/5 flex-shrink-0">
            <badge.icon className="w-4 h-4 text-forest" />
          </div>
          <div>
            <p className="text-xs font-medium text-txt-primary leading-tight">{badge.title}</p>
            <p className="text-[11px] text-txt-muted leading-tight mt-0.5">{badge.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
