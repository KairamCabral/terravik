import { CalendarDays, ChevronDown, Droplets } from 'lucide-react'
import type { ProductPlan } from '@/types/calculator'
import { CATALOG } from '@/lib/calculator/constants'

/**
 * Como usar o plano: quanto de cada produto, o passo a passo, o calendário e
 * os cuidados. Tudo do rótulo. O passo a passo e os cuidados são os mesmos nos
 * três produtos, por isso aparecem uma vez só.
 */

const DIA_MS = 24 * 60 * 60 * 1000

function dataDaqui(dias: number): string {
  return new Date(Date.now() + dias * DIA_MS).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
}

function numero(valor: number): string {
  return valor.toLocaleString('pt-BR')
}

function Titulo({ sobre, children }: { sobre: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">{sobre}</p>
      <h2 className="mt-1 font-heading text-2xl font-bold text-txt-primary">{children}</h2>
    </div>
  )
}

export function QuantoUsar({ plano, areaM2 }: { plano: ProductPlan[]; areaM2: number }) {
  return (
    <section aria-labelledby="titulo-quanto">
      <Titulo sobre="A dose do rótulo">
        <span id="titulo-quanto">Quanto usar em {areaM2} m²</span>
      </Titulo>
      <div className="space-y-3">
        {plano.map((p) => (
          <article key={p.product_id} className="rounded-2xl border border-border-subtle bg-bg-surface p-5">
            <h3 className="font-heading text-lg font-bold text-txt-primary">{p.name}</h3>
            <p className="text-xs text-txt-muted">{CATALOG[p.product_id].base}</p>

            <dl className="mt-4 grid grid-cols-3 gap-2">
              {[
                {
                  rotulo: p.dosadores === 1 ? 'dosador raso' : 'dosadores rasos',
                  valor: p.dosadores < 0.5 ? 'menos de ½' : numero(p.dosadores),
                  destaque: true,
                },
                { rotulo: 'no total', valor: p.need_display },
                { rotulo: 'por m²', valor: `${p.dose_approx ? '≈ ' : ''}${p.dose_g_m2} g` },
              ].map((dado) => (
                <div
                  key={dado.rotulo}
                  className={dado.destaque ? 'rounded-xl bg-forest px-2 py-3 text-center text-white' : 'rounded-xl bg-bg-surface-2 px-2 py-3 text-center'}
                >
                  <dd className={`font-heading text-xl font-bold leading-none ${dado.destaque ? '' : 'text-txt-primary'}`}>
                    {dado.valor}
                  </dd>
                  <dt className={`mt-1.5 text-[11px] leading-tight ${dado.destaque ? 'text-white/80' : 'text-txt-secondary'}`}>
                    {dado.rotulo}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs text-txt-muted">
              Valores aproximados. {p.scoop_display}. O dosador vem dentro da embalagem.
            </p>

            <p className="mt-4 border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-secondary">
              <strong className="font-semibold text-txt-primary">Quando usar. </strong>
              {/* No uso pontual a frase de frequência já diz quando usar. */}
              {p.frequency_kind === 'pontual' ? p.frequency_display : `${p.whenToUse} ${p.frequency_display}`}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ComoAplicar({ plano }: { plano: ProductPlan[] }) {
  const passos = plano[0]?.applicationSteps ?? []
  const cuidados = Array.from(new Set(plano.flatMap((p) => p.notes)))

  return (
    <section aria-labelledby="titulo-aplicar">
      <Titulo sobre="Simples assim">
        <span id="titulo-aplicar">Espalhe e regue</span>
      </Titulo>
      <ol className="space-y-3">
        {passos.map((passo, indice) => (
          <li key={passo} className="flex gap-4 rounded-2xl border border-border-subtle bg-bg-surface p-4">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest/10 font-heading text-base font-bold text-forest">
              {indice + 1}
            </span>
            <p className="pt-1.5 text-sm leading-relaxed text-txt-primary">{passo}</p>
          </li>
        ))}
      </ol>

      <details className="group mt-3 rounded-2xl border border-border-subtle bg-bg-surface">
        <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-5 text-sm font-semibold text-txt-primary [&::-webkit-details-marker]:hidden">
          Cuidados na aplicação
          <ChevronDown className="h-4 w-4 text-txt-secondary transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <ul className="space-y-2.5 px-5 pb-5 text-sm leading-relaxed text-txt-secondary">
          {cuidados.map((cuidado) => (
            <li key={cuidado} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" aria-hidden="true" />
              {cuidado}
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}

export function Calendario({ plano }: { plano: ProductPlan[] }) {
  const primeiro = plano[0]
  const demais = plano.slice(1)
  // Só entra quem o rótulo manda repetir, e com o intervalo do rótulo.
  const repetiveis = plano.filter((p) => p.frequency_days > 0)
  if (!primeiro) return null

  const marcos: { quando: string; titulo: string; texto: string }[] = [
    {
      quando: 'Hoje',
      titulo: `Aplicar ${primeiro.name}`,
      texto:
        demais.length > 0
          ? `Depois, um produto por vez, na ordem da embalagem: ${demais.map((p) => p.name).join(', ')}. Não some as doses no mesmo dia.`
          : 'Com a grama seca, de manhã ou no fim da tarde.',
    },
    ...repetiveis.map((p) => {
      const aplicadoHoje = p === primeiro
      const continuo = p.frequency_kind === 'continuo'
      return {
        quando: aplicadoHoje
          ? p.frequency_days_max > p.frequency_days
            ? `${dataDaqui(p.frequency_days)} a ${dataDaqui(p.frequency_days_max)}`
            : dataDaqui(p.frequency_days)
          : continuo
            ? `A cada ${p.frequency_days} dias`
            : `De ${p.frequency_days} a ${p.frequency_days_max} dias depois`,
        titulo: continuo ? `Reaplicar ${p.name}` : `${p.name}, só se precisar`,
        texto: p.frequency_display,
      }
    }),
  ]

  return (
    <section aria-labelledby="titulo-calendario">
      <Titulo sobre="Seu calendário">
        <span id="titulo-calendario">Quando aplicar</span>
      </Titulo>
      <ol className="rounded-2xl border border-border-subtle bg-bg-surface p-5">
        {marcos.map((marco, indice) => (
          <li key={marco.titulo} className="relative flex gap-4 pb-6 last:pb-0">
            {indice < marcos.length - 1 && (
              <span className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-border-medium" aria-hidden="true" />
            )}
            <span
              className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${indice === 0 ? 'bg-forest text-white' : 'bg-bg-surface-2 text-forest'}`}
            >
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-ink">{marco.quando}</p>
              <p className="mt-0.5 font-semibold text-txt-primary">{marco.titulo}</p>
              <p className="mt-1 text-sm leading-relaxed text-txt-secondary">{marco.texto}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 flex items-start gap-2.5 rounded-2xl bg-forest/5 p-4 text-sm leading-relaxed text-txt-primary">
        <Droplets className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest" aria-hidden="true" />
        Regue imediatamente depois de aplicar: a água dissolve os grânulos e leva a nutrição até a raiz.
      </p>
    </section>
  )
}
