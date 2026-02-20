'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

/**
 * Testimonials — Design System 2026
 *
 * Cards brancos, borda hairline, aspas discretas.
 * Stats no final em fundo forest.
 * Dados carregados do Supabase (tabela photo_testimonials)
 */

interface Testimonial {
  name: string
  location: string
  rating: number
  text: string
  months: number
  image: string
}

// Fallback estático caso o Supabase não retorne dados
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { name: 'Carlos Silva', location: 'São Paulo, SP', rating: 5, text: 'Segui o plano da calculadora e em 3 semanas meu gramado mudou completamente. Nunca vi tão verde!', months: 6, image: '/images/grass/Depoimento-1.png' },
  { name: 'Marina Oliveira', location: 'Campinas, SP', rating: 5, text: 'A calculadora é perfeita! Me ajudou a entender exatamente o que meu gramado precisava. Economizei dinheiro usando a dose certa.', months: 4, image: '/images/grass/Depoimento-2.png' },
  { name: 'Roberto Mendes', location: 'Ribeirão Preto, SP', rating: 5, text: 'O Resistência Total salvou meu gramado no verão. Muito pisoteio e sol forte, mas ele aguenta.', months: 8, image: '/images/grass/Depoimento-3.png' },
  { name: 'Juliana Costa', location: 'Sorocaba, SP', rating: 5, text: 'Comprei o kit para gramado novo e o resultado foi impressionante. As raízes pegaram rápido e o gramado cresceu uniforme.', months: 3, image: '/images/grass/Depoimento-4.png' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const { data } = await (supabase as any)
          .from('photo_testimonials')
          .select('*')
          .eq('is_active', true)
          .order('"order"', { ascending: true })

        if (data && data.length > 0) {
          type Row = { name: string; location: string; rating: number; text: string; months: number; image_url: string }
          setTestimonials(
            (data as Row[]).map((d) => ({
              name: d.name,
              location: d.location,
              rating: d.rating,
              text: d.text,
              months: d.months,
              image: d.image_url,
            }))
          )
        }
      } catch {
        // Fallback silencioso — usa dados estáticos
      }
    }
    fetchData()
  }, [])

  return (
    <section className="bg-bg-primary section-spacing">
      <div className="container-main">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="mb-3 inline-block text-ui font-semibold uppercase tracking-wider text-gold">
            Depoimentos
          </span>
          <h2 className="font-heading text-h2 text-txt-primary">
            O que dizem nossos clientes
          </h2>
          <p className="mt-4 text-body text-txt-secondary">
            Mais de 2.847 gramados transformados com Terravik
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={itemVariants}
              className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              {/* Imagem do gramado */}
              <div className="relative h-40 w-full">
                <Image
                  src={t.image}
                  alt={`Gramado de ${t.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>

              <div className="p-6">
                <Quote className="mb-3 h-5 w-5 text-gold/30" />

                <p className="font-heading text-sm italic leading-relaxed text-txt-primary">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Rating */}
                <div className="mt-4 flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>

                {/* Author */}
                <div className="mt-4 border-t border-border-subtle pt-4">
                  <p className="text-sm font-semibold text-txt-primary">{t.name}</p>
                  <div className="mt-0.5 flex items-center justify-between text-xs text-txt-muted">
                    <span>{t.location}</span>
                    <span className="text-forest">Há {t.months} meses</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 grid gap-px overflow-hidden rounded-lg bg-border-subtle md:grid-cols-3"
        >
          {[
            { value: '2.847+', label: 'Gramados transformados' },
            { value: '4.9/5', label: 'Avaliação média', accent: true },
            { value: '98%', label: 'Recomendam Terravik' },
          ].map((stat) => (
            <div key={stat.label} className="bg-bg-dark p-10 text-center">
              <p className={`font-heading text-4xl font-semibold ${stat.accent ? 'text-gold' : 'text-txt-on-dark'}`}>
                {stat.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider text-txt-on-dark-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
