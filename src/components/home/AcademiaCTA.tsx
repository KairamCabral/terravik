'use client'

import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { motion } from 'framer-motion'

/**
 * Academia CTA — Compacto, Marcante e Direto
 * Comunicação clara e assertiva
 */

export function AcademiaCTA() {
  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      
      {/* Gradiente igual à página /sobre */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-ink via-forest to-forest-ink" />
      
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} />

      <div className="container-main relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          
          {/* Content Grid */}
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
            
            {/* Left: Message */}
            <div>
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider text-forest bg-white/90 rounded-full">
                Cursos Gratuitos
              </span>
              
              <h2 className="font-heading text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Aprenda a cuidar do seu gramado
              </h2>
              
              <p className="text-lg text-white/80 mb-6 max-w-xl">
                Cursos práticos e gamificados. Do iniciante ao especialista.
              </p>

              {/* Stats inline */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-amber-400 border-2 border-white"
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-white">2.847 alunos</span>
                </div>
              </div>
            </div>

            {/* Right: CTA Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:w-64"
            >
              <div className="p-6 lg:p-8 rounded-2xl bg-white shadow-2xl shadow-forest-ink/20">
                
                {/* Value prop */}
                <div className="mb-6 text-center">
                  <div className="inline-flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-forest">100%</span>
                    <span className="text-lg text-neutral-600">Grátis</span>
                  </div>
                  <div className="text-xs text-neutral-400 line-through">
                    vs R$ 497 em cursos pagos
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <Button variant="primary" size="default" className="w-full group" asChild>
                    <Link href="/academia" className="flex items-center justify-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Começar agora
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  
                  <Button variant="outline" size="default" className="w-full" asChild>
                    <Link href="/academia/cursos">
                      Ver cursos
                    </Link>
                  </Button>
                </div>

                {/* Mini features */}
                <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2">
                  {['3 cursos completos', 'Aprenda no seu ritmo', 'Suporte da comunidade'].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-xs text-neutral-600">
                      <div className="w-1 h-1 rounded-full bg-forest" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
