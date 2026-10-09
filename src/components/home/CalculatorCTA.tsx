'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Calculator CTA — Premium Minimalista
 *
 * Princípios:
 * - Cabe inteiro na viewport (sem scroll)
 * - Identidade Terravik: forest gradient + gold accent + Fraunces
 * - Minimalismo: poucos elementos, muito espaço em branco negativo
 * - Sofisticação: tipografia grande, contraste, dourado sutil
 */

export function CalculatorCTA() {
  return (
    <section className="relative">
      {/* Imagem de fundo: gramado. Rola com a página; fundo fixo força repintura a cada rolagem. */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/grass/Gramado-Brasil-de-condominio-terravik.png')" }}
          aria-hidden="true"
        />
      </div>

      {/* Overlay verde escuro da marca */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#093E28_0%,#052317_100%)] opacity-85" />

      {/* Gold accent line no topo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent z-10" />

      {/* Conteúdo — altura controlada para caber na viewport */}
      <div className="container-main relative z-10 py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">

          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-overline text-gold tracking-widest uppercase mb-5"
          >
            Calculadora Gratuita
          </motion.p>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-heading text-h1 lg:text-display text-white mb-5"
          >
            Não adivinhe.{' '}
            <span className="text-gold">Calcule.</span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-body-lg text-white/90 max-w-xl mx-auto mb-10"
          >
            Responda 8 perguntas e receba o produto, a dose e o
            calendário de aplicação ideais para o seu gramado.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <Link
              href="/calculadora"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gold hover:bg-gold/90 text-forest-ink font-semibold rounded-xl transition-all duration-300 shadow-[0_0_24px_rgba(179,139,37,0.25)] hover:shadow-[0_0_36px_rgba(179,139,37,0.35)]"
            >
              Descobrir minha dose
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Gold accent line no fundo */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent z-10" />
    </section>
  )
}
