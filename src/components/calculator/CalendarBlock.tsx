import type { ProductPlan } from '@/types/calculator'
import { Calendar, Clock, Droplets } from 'lucide-react'

interface CalendarBlockProps {
  plan: ProductPlan[]
}

export function CalendarBlock({ plan }: CalendarBlockProps) {
  // Produto com maior frequência (excluindo P1 que é aplicação única)
  const nextProduct = plan
    .filter((p) => p.frequency_days > 0)
    .sort((a, b) => a.frequency_days - b.frequency_days)[0]

  const todayProducts = plan.map((p) => p.name).join(', ')

  // Data da próxima aplicação (exemplo)
  const nextDate = nextProduct
    ? new Date(Date.now() + nextProduct.frequency_days * 24 * 60 * 60 * 1000)
        .toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
        })
    : null

  return (
    <div className="rounded-2xl border-2 border-terravik-brown/10 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-terravik-green/10">
          <Calendar className="h-5 w-5 text-terravik-green" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-terravik-brown">
            Seu calendário
          </h3>
          <p className="text-sm text-terravik-brown/60">
            Programe as aplicações
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Hoje */}
        <div className="flex items-start gap-3 rounded-xl bg-terravik-green/5 p-4">
          <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-terravik-green" />
          <div>
            <p className="font-medium text-terravik-brown">Hoje</p>
            <p className="text-sm text-terravik-brown/70">
              Aplicar {todayProducts}
            </p>
          </div>
        </div>

        {/* Próxima aplicação */}
        {nextProduct && nextDate && (
          <div className="flex items-start gap-3 rounded-xl border border-terravik-brown/10 p-4">
            <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-terravik-brown/60" />
            <div>
              <p className="font-medium text-terravik-brown">
                Próxima aplicação
              </p>
              <p className="text-sm text-terravik-brown/70">
                Aproximadamente em {nextDate} — {nextProduct.name}
              </p>
            </div>
          </div>
        )}

        {/* Lembrete */}
        <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4">
          <Droplets className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Lembrete</p>
            <p className="text-sm text-blue-800">
              Sempre regue após aplicar para ativar o fertilizante.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
