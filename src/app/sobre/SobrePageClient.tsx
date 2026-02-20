'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Target, Users, Calculator, Award, TrendingUp } from 'lucide-react'

/**
 * Página Sobre — Premium, Estratégica & Emocional
 *
 * Técnicas de Psicologia do Design:
 * 1. Storytelling Visual — conta a história de forma narrativa
 * 2. Problema → Solução — identifica dor e resolve
 * 3. Social Proof — números que geram credibilidade
 * 4. Emotional Connection — linguagem que conecta
 * 5. Visual Hierarchy — guia o olhar naturalmente
 * 6. Trust Signals — transparência e valores claros
 * 7. Call to Action natural — fluxo orgânico
 * 8. Minimalismo Premium — menos é mais
 */

const stats = [
  { number: '50K+', label: 'Gramados transformados' },
  { number: '98%', label: 'Satisfação' },
  { number: '3', label: 'Produtos, função clara' },
]

const values = [
  {
    icon: Sparkles,
    title: 'Simplicidade',
    description: 'Dose certa, aplicação fácil, resultado visível. Sem manual de 50 páginas.',
  },
  {
    icon: Target,
    title: 'Precisão',
    description: 'Calculadora com dose real por m². Sem tentativa e erro, sem desperdício.',
  },
  {
    icon: Users,
    title: 'Para você',
    description: 'Falamos a língua de quem cuida do gramado de casa, não de quem planta soja.',
  },
]

const differentiators = [
  {
    title: 'Cada produto resolve 1 problema',
    description: 'Implantação, crescimento ou resistência. Você não precisa adivinhar qual usar.',
  },
  {
    title: 'Calculadora baseada em ciência',
    description: 'Dose calculada por clima, irrigação, pisoteio e condição do gramado.',
  },
  {
    title: 'Tecnologia do campo, simplicidade em casa',
    description: 'Entendemos de solo e nutrição, mas traduzimos para quem não é agrônomo.',
  },
]

export function SobrePageClient() {
  return (
    <div className="bg-bg-primary">
      
      {/* Hero — Frase de impacto */}
      <section className="relative overflow-hidden pt-32 lg:pt-40 pb-20 lg:pb-28">
        {/* Imagem de fundo */}
        <Image
          src="/images/grass/familia-no-gramado-terravik.png"
          alt="Família no gramado"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        
        {/* Overlay para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-ink/60 via-forest/50 to-forest-ink/70" />
        
        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-8"
            >
              <span className="text-xs font-semibold text-white uppercase tracking-wider">Nossa história</span>
            </motion.div>

            <h1 className="font-heading text-h1 lg:text-display text-white mb-6">
              A Terravik nasceu{' '}
              <span className="text-gold">do gramado</span>
            </h1>
            
            <p className="text-body-lg text-white/90 max-w-2xl mx-auto">
              Criamos fertilizantes para quem quer resultado sem complicação —
              porque cuidar do gramado deveria ser simples.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problema → Solução (Storytelling) */}
      <section className="section-spacing">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            
            {/* O Problema */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <span className="text-2xl font-heading font-bold text-gold">?</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-h3 text-txt-primary mb-4">
                    O problema que vimos
                  </h2>
                  <p className="text-body text-txt-secondary leading-relaxed">
                    No Brasil, não existia fertilizante para gramado residencial que fosse 
                    <span className="font-semibold text-txt-primary"> simples de usar</span>. 
                    Tudo era genérico demais (&quot;NPK para plantas&quot;) ou técnico demais 
                    (produtos agrícolas com manual de 50 páginas).
                  </p>
                  <p className="text-body text-txt-secondary leading-relaxed mt-4">
                    O mercado agrícola é gigante, mas <span className="font-semibold text-txt-primary">ninguém olhava 
                    para o dono de casa</span> que só quer um gramado bonito.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* A Solução */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-heading text-h3 text-txt-primary mb-4">
                    Nossa solução
                  </h2>
                  <p className="text-body text-txt-secondary leading-relaxed">
                    A Terravik é a ponte entre a <span className="font-semibold text-txt-primary">tecnologia do campo</span> e 
                    a <span className="font-semibold text-txt-primary">simplicidade</span> que o gramado de casa precisa.
                  </p>
                  <p className="text-body text-txt-secondary leading-relaxed mt-4">
                    <span className="font-semibold text-txt-primary">Três produtos</span>, cada um com função clara. 
                    <span className="font-semibold text-txt-primary"> Uma calculadora</span> que dá a dose exata. 
                    Sem tentativa e erro, sem desperdício, sem complicação.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats — Social Proof */}
      <section className="bg-forest text-white py-12 lg:py-16">
        <div className="container-main">
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-heading text-5xl lg:text-6xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-white/70 uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="section-spacing bg-bg-surface-2">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-overline text-gold tracking-widest uppercase block mb-3">
              Nossos valores
            </span>
            <h2 className="font-heading text-h2 text-txt-primary">
              O que guia cada decisão
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative bg-bg-surface rounded-2xl p-8 border border-border-subtle hover:border-forest/30 hover:shadow-card transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-forest/10 flex items-center justify-center mb-5 group-hover:bg-forest/20 transition-colors">
                    <Icon className="w-7 h-7 text-forest" />
                  </div>
                  <h3 className="font-heading text-h4 text-txt-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-txt-secondary leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* O que nos diferencia */}
      <section className="section-spacing">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="font-heading text-h2 text-txt-primary mb-4">
                O que nos diferencia
              </h2>
              <p className="text-body-lg text-forest font-semibold">
                Não somos uma marca de jardinagem genérica.
              </p>
            </motion.div>

            <div className="space-y-8">
              {differentiators.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-4 p-6 rounded-xl border border-border-subtle bg-bg-surface hover:border-forest/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center mt-1">
                    <span className="text-sm font-bold text-forest">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-body font-semibold text-txt-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-txt-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final — Momentum natural */}
      <section className="bg-gradient-to-br from-forest via-forest-ink to-forest text-white py-16 lg:py-20">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            
            <h2 className="font-heading text-h2 lg:text-h1 mb-4">
              Quer ver na prática?
            </h2>
            
            <p className="text-body-lg text-white/80 mb-8">
              Descubra a dose exata de fertilizante para o seu gramado em menos de 1 minuto.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/calculadora"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-white/90 text-forest font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Calcular meu plano
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all"
              >
                Ver produtos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
