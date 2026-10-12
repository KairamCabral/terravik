import type { ProductPlan } from '@/types/calculator'
import { Calendar, Clock, Droplets } from 'lucide-react'

interface CalendarBlockProps {
  plan: ProductPlan[]
}

const DIA_MS = 24 * 60 * 60 * 1000

function dataDaqui(dias: number): string {
  return new Date(Date.now() + dias * DIA_MS).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
  })
}

export function CalendarBlock({ plan }: CalendarBlockProps) {
  const primeiro = plan[0]
  const demais = plan.slice(1)

  // Só entra aqui quem o rótulo manda repetir, e com o intervalo do rótulo.
  // Uso pontual (Raiz Forte) fica de fora: o plano não agenda o que o rótulo
  // não manda repetir.
  const repetiveis = plan.filter((p) => p.frequency_days > 0)

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
        {primeiro && (
          <div className="flex items-start gap-3 rounded-xl bg-terravik-green/5 p-4">
            <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-terravik-green" />
            <div>
              <p className="font-medium text-terravik-brown">Hoje</p>
              <p className="text-sm text-terravik-brown/70">
                Aplicar {primeiro.name}
                {demais.length > 0 &&
                  `. Depois, um produto por vez, na ordem da embalagem: ${demais
                    .map((p) => p.name)
                    .join(', ')}. Não some as doses no mesmo dia.`}
              </p>
            </div>
          </div>
        )}

        {/* Repetição, só a que o rótulo informa */}
        {repetiveis.map((p) => (
          <div
            key={p.product_id}
            className="flex items-start gap-3 rounded-xl border border-terravik-brown/10 p-4"
          >
            <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-terravik-brown/60" />
            <div>
              <p className="font-medium text-terravik-brown">
                {p.frequency_kind === 'continuo'
                  ? `${p.name}: uso contínuo`
                  : `${p.name}: repetir só se precisar`}
              </p>
              <p className="text-sm text-terravik-brown/70">
                {p.frequency_display}
                {/* A data só vale para o produto aplicado hoje. */}
                {p === primeiro &&
                  (p.frequency_days_max > p.frequency_days
                    ? ` Aplicando hoje, a janela vai de ${dataDaqui(p.frequency_days)} a ${dataDaqui(p.frequency_days_max)}.`
                    : ` Aplicando hoje, a próxima fica para ${dataDaqui(p.frequency_days)}.`)}
              </p>
            </div>
          </div>
        ))}

        {/* Lembrete */}
        <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4">
          <Droplets className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Lembrete</p>
            <p className="text-sm text-blue-800">
              Regue imediatamente após aplicar: a água dissolve os grânulos e
              leva a nutrição até a raiz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
