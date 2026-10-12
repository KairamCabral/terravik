import Link from 'next/link'
import { ArrowRight, Check, Minus } from 'lucide-react'

/**
 * Terravik comparada ao adubo comum, sem citar marca.
 *
 * A coluna da Terravik só traz o que está no rótulo (docs/produtos-fatos-do-
 * rotulo.md). A coluna do adubo comum descreve a prática geral do mercado, nos
 * termos do argumento da fórmula concentrada aprovado pelo dono, e por isso
 * vem sempre com "costuma" ou "em geral".
 */
const LINHAS = [
  {
    criterio: 'Dose por m²',
    terravik: 'Cerca de 17 a 25 g no Verde Rápido e no Resistência Total',
    comum: 'Costuma pedir 30 g ou mais',
  },
  {
    criterio: 'Nutrientes',
    terravik: 'Todos juntos em cada grânulo',
    comum: 'Em geral, mistura de grãos diferentes',
  },
  {
    criterio: 'Como medir',
    terravik: 'Dosador de 100 ml dentro do saco',
    comum: 'Balança ou no olho',
  },
  {
    criterio: 'Qual usar',
    terravik: 'Um produto para cada momento do gramado',
    comum: 'Fórmula genérica para tudo',
  },
  {
    criterio: 'Quanto comprar',
    terravik: 'A calculadora diz os sacos e os dosadores',
    comum: 'A conta fica por sua conta',
  },
] as const

export function ComparativoSection() {
  return (
    <section aria-labelledby="titulo-comparativo" className="bg-bg-surface">
      <div className="container-main py-14 md:py-20">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Fórmula concentrada</p>
          <h2 id="titulo-comparativo" className="mt-2 font-heading text-2xl font-bold text-txt-primary md:text-4xl">
            Por que escolher Terravik?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-txt-secondary">
            Você não paga pelo saco. Paga pelo que ele faz no seu gramado.
          </p>
        </div>

        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border-subtle">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Comparação entre os fertilizantes Terravik e o adubo comum</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[26%] bg-bg-surface-2 px-3 py-4 text-xs font-semibold uppercase tracking-wider text-txt-secondary md:px-5">
                  <span className="sr-only">Critério</span>
                </th>
                <th scope="col" className="w-[40%] bg-forest px-3 py-4 font-heading text-base font-bold text-white md:px-5 md:text-lg">
                  Terravik
                </th>
                <th scope="col" className="bg-bg-surface-2 px-3 py-4 text-sm font-semibold text-txt-secondary md:px-5">
                  Adubo comum
                </th>
              </tr>
            </thead>
            <tbody>
              {LINHAS.map((linha) => (
                <tr key={linha.criterio} className="border-t border-border-subtle align-top">
                  <th scope="row" className="px-3 py-4 text-xs font-semibold text-txt-primary md:px-5 md:text-sm">
                    {linha.criterio}
                  </th>
                  <td className="bg-forest/5 px-3 py-4 font-medium text-txt-primary md:px-5">
                    <span className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest" aria-hidden="true" />
                      {linha.terravik}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-txt-secondary md:px-5">
                    <span className="flex gap-2">
                      <Minus className="mt-0.5 h-4 w-4 flex-shrink-0 text-txt-muted" aria-hidden="true" />
                      {linha.comum}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-relaxed text-txt-muted">
          Dose da Terravik conforme o rótulo. O Raiz Forte, de uso pontual no plantio, usa 50 g por m².
        </p>

        <div className="mt-8 text-center">
          <Link
            href="/produtos"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-forest px-7 text-sm font-semibold text-white transition-all hover:bg-forest-ink"
          >
            Ver os produtos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
