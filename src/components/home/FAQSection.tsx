'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  Calculator,
  Package,
  Calendar,
  Shield,
  Droplets,
  ShoppingCart,
  Layers,
  AlertCircle,
} from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { FAQ_HOME } from '@/lib/faq/home'

/**
 * Perguntas frequentes da home.
 *
 * O conteúdo mora em src/lib/faq/home.ts, porque o servidor precisa dele para
 * emitir o JSON-LD de FAQPage em src/app/page.tsx. Aqui fica só o desenho.
 *
 * Compacta: py-14 no lugar de section-spacing, sem a linha de categoria (a
 * pergunta e o ícone já dizem o assunto), padding e corpo menores.
 *
 * Os painéis ficam sempre no DOM, fechados com altura 0 e visibility hidden:
 * assim `aria-controls` aponta para um id que existe e a resposta sai no HTML
 * inicial, igual ao que o FAQPage declara.
 */

/** Ícone por pergunta. Mora aqui para o módulo de dados não importar React. */
const ICONES: Record<string, typeof Package> = {
  calculadora: Calculator,
  produtos: Package,
  frequencia: Calendar,
  seguranca: Shield,
  aplicacao: Droplets,
  frete: ShoppingCart,
  combinar: Layers,
  dose: AlertCircle,
}

export function FAQSection() {
  const [aberta, setAberta] = useState<string | null>(FAQ_HOME[0]?.id ?? null)
  const reduzirMovimento = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-bg-primary via-bg-surface-2 to-bg-primary py-14 lg:py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container-main relative">
        <div className="mx-auto mb-9 max-w-2xl text-center">
          <span className="mb-2.5 inline-block rounded-full bg-forest/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest">
            Tire suas dúvidas
          </span>
          <h2 className="font-heading text-3xl font-bold text-txt-primary lg:text-4xl">
            Tudo que você precisa saber
          </h2>
          <p className="mt-3 text-sm text-txt-secondary">
            Respostas diretas para as perguntas mais comuns sobre Terravik
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-2.5">
          {FAQ_HOME.map((item, i) => {
            const estaAberta = aberta === item.id
            const Icone = ICONES[item.id] ?? Package
            const idPainel = `faq-${item.id}`
            const idBotao = `faq-botao-${item.id}`

            return (
              <motion.div
                key={item.id}
                initial={reduzirMovimento ? false : { opacity: 0, y: 10 }}
                whileInView={reduzirMovimento ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <div
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border bg-white transition-colors duration-300 motion-reduce:transition-none',
                    estaAberta
                      ? 'border-forest/30 shadow-lg shadow-forest/5'
                      : 'border-border-subtle hover:border-forest/20 hover:shadow-md'
                  )}
                >
                  {/* Fio lateral, só para marcar qual está aberta. */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      'absolute bottom-0 left-0 top-0 w-1 transition-colors duration-300 motion-reduce:transition-none',
                      estaAberta ? 'bg-forest' : 'bg-transparent group-hover:bg-forest/20'
                    )}
                  />

                  <h3>
                    <button
                      type="button"
                      id={idBotao}
                      onClick={() => setAberta(estaAberta ? null : item.id)}
                      aria-expanded={estaAberta}
                      aria-controls={idPainel}
                      className="flex w-full items-center gap-3.5 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest"
                    >
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 motion-reduce:transition-none',
                          estaAberta
                            ? 'bg-forest text-white'
                            : 'bg-forest/10 text-forest group-hover:bg-forest/20'
                        )}
                      >
                        <Icone className="h-4 w-4" aria-hidden="true" />
                      </span>

                      <span className="min-w-0 flex-1 font-heading text-base font-semibold leading-snug text-txt-primary transition-colors group-hover:text-forest">
                        {item.pergunta}
                      </span>

                      <ChevronDown
                        className={cn(
                          'h-4 w-4 shrink-0 text-txt-muted transition-transform duration-300 motion-reduce:transition-none',
                          estaAberta && 'rotate-180 text-forest'
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  <motion.div
                    id={idPainel}
                    role="region"
                    aria-labelledby={idBotao}
                    className="overflow-hidden"
                    initial={false}
                    animate={
                      estaAberta
                        ? { height: 'auto', opacity: 1, visibility: 'visible' }
                        : { height: 0, opacity: 0, transitionEnd: { visibility: 'hidden' } }
                    }
                    transition={{
                      duration: reduzirMovimento ? 0 : 0.28,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <div className="space-y-3 px-5 pb-5 pl-[4.25rem]">
                      <p className="text-sm leading-relaxed text-txt-secondary">{item.resposta}</p>

                      {item.acao && (
                        <Link
                          href={item.acao.href}
                          className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                        >
                          {item.acao.texto}
                          <ChevronDown
                            className="h-3.5 w-3.5 -rotate-90 transition-transform group-hover/link:translate-x-0.5 motion-reduce:transition-none"
                            aria-hidden="true"
                          />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-4">
          <p className="font-semibold text-txt-primary">Ainda tem dúvidas?</p>
          <Link
            href="/contato"
            className="whitespace-nowrap rounded-xl bg-forest px-6 py-2.5 font-medium text-white transition-colors hover:bg-forest/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
          >
            Falar com especialista
          </Link>
        </div>
      </div>
    </section>
  )
}
