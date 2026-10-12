import Link from 'next/link'
import { ArrowRight, Camera, Check, Clock, Ruler, ShieldCheck } from 'lucide-react'
import { CATALOG, PACK_LABEL } from '@/lib/calculator/constants'
import { generatePlan } from '@/lib/calculator/engine'

interface CalculatorCTAProps {
  /** Análise por foto ligada no servidor (chave da IA e cota). */
  fotoDisponivel?: boolean
}

/**
 * Chamada da calculadora na home.
 *
 * À esquerda, a promessa e o botão. À direita, um plano de exemplo: a pessoa
 * vê o que vai receber antes de clicar. O exemplo sai do próprio motor da
 * calculadora, então os números são sempre os do rótulo.
 */
const EXEMPLO = generatePlan({
  area_m2: 60,
  implantando: false,
  objetivo: 'resistencia',
  nivel: 'bonito',
  clima_hoje: 'ameno',
  sol: 'sol_pleno',
  irrigacao: '1_2x_semana',
  pisoteio: 'medio',
})

export function CalculatorCTA({ fotoDisponivel = false }: CalculatorCTAProps) {
  const plano = EXEMPLO.plan[0]

  return (
    <section aria-labelledby="titulo-calculadora" className="relative overflow-hidden bg-forest-ink">
      {/* Fundo: gramado bem discreto, verde da marca e um brilho dourado. */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.14]"
        style={{ backgroundImage: "url('/images/grass/Gramado-Brasil-de-condominio-terravik.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,#052317_0%,rgba(9,62,40,0.92)_55%,rgba(5,35,23,0.96)_100%)]" aria-hidden="true" />
      <div
        className="absolute -right-32 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-gold/20 blur-[120px]"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" aria-hidden="true" />

      <div className="container-main relative py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr,0.95fr] lg:gap-16">
          {/* Promessa */}
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
              Calculadora gratuita
            </p>

            <h2 id="titulo-calculadora" className="mt-6 font-heading text-4xl font-bold leading-[1.05] text-white md:text-6xl">
              Não adivinhe.
              <span className="block bg-gradient-to-r from-gold-soft via-gold to-gold-soft bg-clip-text text-transparent">
                Calcule.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-white/80 lg:mx-0">
              {fotoDisponivel
                ? 'Tire uma foto do gramado ou responda 8 perguntas. Você recebe o produto certo, a quantidade de sacos e o calendário de aplicação.'
                : 'Responda 8 perguntas e receba o produto certo, a quantidade de sacos e o calendário de aplicação.'}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/calculadora"
                className="group inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-gold px-8 text-base font-semibold text-forest-ink shadow-[0_10px_40px_-8px_rgba(179,139,37,0.6)] transition-all hover:bg-gold-soft sm:w-auto"
              >
                {fotoDisponivel ? <Camera className="h-5 w-5" aria-hidden="true" /> : null}
                {fotoDisponivel ? 'Analisar meu gramado' : 'Descobrir minha dose'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/75 lg:justify-start">
              {[
                { icone: Clock, texto: 'Menos de 1 minuto' },
                { icone: ShieldCheck, texto: 'Dose do rótulo' },
                { icone: Ruler, texto: 'Na medida da sua área' },
              ].map(({ icone: Icone, texto }) => (
                <li key={texto} className="flex items-center gap-2">
                  <Icone className="h-4 w-4 text-gold-soft" strokeWidth={1.75} aria-hidden="true" />
                  {texto}
                </li>
              ))}
            </ul>
          </div>

          {/* Plano de exemplo */}
          {plano && (
            <div className="relative mx-auto w-full max-w-md" aria-label="Exemplo de plano da calculadora">
              <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-gold/50 via-white/10 to-transparent" aria-hidden="true" />
              <div className="relative rounded-[27px] bg-bg-primary p-6 shadow-2xl sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">Exemplo de plano</p>
                  <p className="flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Plano pronto
                  </p>
                </div>

                <p className="mt-4 font-heading text-2xl font-bold leading-tight text-txt-primary">
                  Gramado de {EXEMPLO.area_m2} m²
                </p>
                <p className="mt-1 text-sm text-txt-secondary">
                  {plano.name}: {CATALOG[plano.product_id].description.toLowerCase()}
                </p>

                <dl className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    { valor: plano.dosadores.toLocaleString('pt-BR'), rotulo: 'dosadores rasos', destaque: true },
                    { valor: plano.need_display, rotulo: 'no total' },
                    { valor: `${plano.dose_g_m2} g`, rotulo: 'por m²' },
                  ].map((dado) => (
                    <div
                      key={dado.rotulo}
                      className={dado.destaque ? 'rounded-xl bg-forest px-2 py-3 text-center text-white' : 'rounded-xl bg-bg-surface-2 px-2 py-3 text-center'}
                    >
                      <dd className={`font-heading text-xl font-bold leading-none ${dado.destaque ? '' : 'text-txt-primary'}`}>{dado.valor}</dd>
                      <dt className={`mt-1.5 text-[11px] leading-tight ${dado.destaque ? 'text-white/80' : 'text-txt-secondary'}`}>{dado.rotulo}</dt>
                    </div>
                  ))}
                </dl>

                <ul className="mt-5 space-y-2.5 border-t border-border-subtle pt-5 text-sm text-txt-primary">
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-txt-secondary">O que levar</span>
                    <span className="font-semibold">
                      {plano.packs_qty} {plano.packs_qty === 1 ? 'saco' : 'sacos'} de {PACK_LABEL}
                    </span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="text-txt-secondary">Reaplicar</span>
                    <span className="font-semibold">A cada {plano.frequency_days} dias</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
