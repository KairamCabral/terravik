'use client'

import { useState } from 'react'
import { ChevronDown, Calculator, Package, Calendar, Shield, Droplets, ShoppingCart, Layers, AlertCircle, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'

/**
 * FAQ — Premium, Estratégico e Minimalista
 *
 * Copy focada em:
 * - Reduzir objeções de compra
 * - Destacar benefícios e diferenciais
 * - Linguagem consultiva e confiante
 * - Transparência e credibilidade
 */

interface FAQ {
  icon: typeof Calculator
  category: string
  question: string
  answer: string
  highlight?: string
  cta?: {
    text: string
    href: string
  }
}

const faqs: FAQ[] = [
  {
    icon: Calculator,
    category: 'Calculadora',
    question: 'A calculadora realmente funciona para qualquer gramado?',
    answer: 'Sim. Nossa calculadora considera 8 variáveis (área, clima, tipo de grama, irrigação, pisoteio, objetivo, etc.) e gera um plano personalizado com margem de segurança. Já foi usada em mais de 50 mil gramados do Rio Grande do Sul ao Amazonas.',
    highlight: '50 mil+ gramados calculados',
  },
  {
    icon: Package,
    category: 'Produtos',
    question: 'Por que só 3 produtos? Não falta algo?',
    answer: 'Ao contrário. A maioria das marcas tem 15+ produtos porque vendem ingredientes separados. Nós formulamos produtos completos: um para cada fase do gramado. Menos escolha = menos erro = melhor resultado.',
    highlight: '1 produto = 1 problema resolvido',
  },
  {
    icon: Calendar,
    category: 'Aplicação',
    question: 'Vou precisar aplicar todo mês?',
    answer: 'Não. Nossos fertilizantes são de liberação lenta. Verde Rápido dura 4-6 semanas. Resistência Total dura 6-8 semanas. Você aplica menos vezes e ainda economiza tempo e dinheiro comparado a produtos líquidos semanais.',
    highlight: 'Até 8 semanas de efeito',
    cta: {
      text: 'Ver frequência recomendada',
      href: '/calculadora'
    }
  },
  {
    icon: Shield,
    category: 'Segurança',
    question: 'É seguro para crianças e pets?',
    answer: 'Totalmente. São fertilizantes granulados de liberação controlada, não são pesticidas. Após regar (1-2h), o produto já está absorvido pelo solo e o gramado pode ser usado normalmente. Usamos as mesmas fórmulas de campos de golfe profissionais.',
    highlight: 'Liberado após 1-2h de rega',
  },
  {
    icon: Droplets,
    category: 'Aplicação',
    question: 'É difícil aplicar? Preciso de equipamento especial?',
    answer: 'É simples como regar. Distribua os grânulos uniformemente (pode ser a lanço, com espalhador ou até com a mão), depois regue. Não precisa dissolver, misturar ou calcular proporções. O produto já vem na concentração certa.',
    highlight: 'Simples como regar o gramado',
  },
  {
    icon: ShoppingCart,
    category: 'Compra',
    question: 'Onde compro e quanto custa o frete?',
    answer: 'Vendemos online com frete calculado no checkout (PAC ou SEDEX) ou em pontos físicos parceiros. Acima de R$ 199, frete grátis para Sul e Sudeste. Entregamos para todo Brasil.',
    cta: {
      text: 'Ver pontos de venda',
      href: '/onde-encontrar'
    }
  },
  {
    icon: Layers,
    category: 'Uso',
    question: 'Posso usar 2 produtos ao mesmo tempo?',
    answer: 'Não na mesma aplicação. Se sua calculadora recomenda mais de um produto, aplique com intervalo mínimo de 7 dias. Isso evita sobrecarga de nutrientes e garante absorção ideal de cada fórmula.',
    highlight: 'Intervalo mínimo: 7 dias',
  },
  {
    icon: AlertCircle,
    category: 'Dúvidas',
    question: 'E se eu aplicar dose errada?',
    answer: 'A calculadora já considera margem de segurança. Se aplicar menos, terá menos resultado (não há risco). Se aplicar até 2x a dose, regue bastante para diluir. Nossa fórmula é segura mesmo com pequenos excessos.',
    highlight: 'Fórmula com margem de segurança',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative bg-gradient-to-b from-bg-primary via-bg-surface-2 to-bg-primary section-spacing overflow-hidden">
      
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container-main relative">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider text-forest bg-forest/10 rounded-full">
            Tire suas dúvidas
          </span>
          
          <h2 className="font-heading text-h1 lg:text-display-sm text-txt-primary mb-4">
            Tudo que você precisa saber
          </h2>
          
          <p className="text-lg text-txt-secondary">
            Respostas diretas para as perguntas mais comuns sobre Terravik
          </p>
        </motion.div>

        {/* FAQ Grid com categorias visuais */}
        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const Icon = faq.icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <div
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300',
                    isOpen
                      ? 'border-forest/30 shadow-lg shadow-forest/5'
                      : 'border-border-subtle hover:border-forest/20 hover:shadow-md'
                  )}
                >
                  {/* Barra lateral de categoria */}
                  <div className={cn(
                    'absolute left-0 top-0 bottom-0 w-1 transition-all duration-300',
                    isOpen ? 'bg-forest' : 'bg-transparent group-hover:bg-forest/20'
                  )} />

                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-start gap-4 p-6 text-left"
                    aria-expanded={isOpen}
                  >
                    {/* Icon + Category */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300',
                        isOpen 
                          ? 'bg-forest text-white shadow-lg shadow-forest/20' 
                          : 'bg-forest/10 text-forest group-hover:bg-forest/20'
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Question */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-txt-muted">
                        {faq.category}
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-txt-primary group-hover:text-forest transition-colors">
                        {faq.question}
                      </h3>
                    </div>

                    {/* Chevron */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300',
                        isOpen ? 'bg-forest/10' : 'group-hover:bg-neutral-100'
                      )}>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 text-txt-muted transition-all duration-300',
                            isOpen && 'rotate-180 text-forest'
                          )}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <div className="px-6 pb-6 pl-20">
                          <div className="space-y-4">
                            {/* Answer text */}
                            <p className="text-txt-secondary leading-relaxed">
                              {faq.answer}
                            </p>

                            {/* Highlight */}
                            {faq.highlight && (
                              <div className="flex items-center gap-2 p-3 rounded-lg bg-forest/5 border border-forest/10">
                                <CheckCircle2 className="h-4 w-4 text-forest flex-shrink-0" />
                                <span className="text-sm font-medium text-forest">
                                  {faq.highlight}
                                </span>
                              </div>
                            )}

                            {/* CTA */}
                            {faq.cta && (
                              <Link
                                href={faq.cta.href}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest/80 transition-colors group/link"
                              >
                                {faq.cta.text}
                                <ChevronDown className="h-3 w-3 -rotate-90 transition-transform group-hover/link:translate-x-1" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-forest/5 to-emerald-500/5 border border-forest/10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest/10">
                <AlertCircle className="h-6 w-6 text-forest" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-txt-primary">Ainda tem dúvidas?</p>
                <p className="text-sm text-txt-secondary">Nossa equipe responde em até 24h</p>
              </div>
            </div>
            <Link
              href="/contato"
              className="px-6 py-2.5 rounded-xl bg-forest text-white font-medium hover:bg-forest/90 transition-colors whitespace-nowrap"
            >
              Falar com especialista
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
