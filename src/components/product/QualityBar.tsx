'use client'

import { Target, Eye, Leaf } from 'lucide-react'

const items = [
  {
    icon: Target,
    label: 'Dose certa',
    desc: 'Fórmula precisa',
  },
  {
    icon: Eye,
    label: 'Resultado previsível',
    desc: 'Visível em dias',
  },
  {
    icon: Leaf,
    label: 'Aplicação simples',
    desc: 'Sem complicação',
  },
]

export function QualityBar() {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-xl border border-border-subtle bg-bg-surface p-4">
      {items.map(({ icon: Icon, label, desc }, index) => (
        <div key={label} className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/8">
            <Icon className="h-5 w-5 text-forest" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-semibold text-txt-primary">{label}</p>
            <p className="text-[10px] text-txt-muted">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
