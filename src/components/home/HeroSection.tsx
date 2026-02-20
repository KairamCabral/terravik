'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button, Container } from '@/components/ui'
import { ArrowRight, Calculator, Shield, Truck, Star } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Hero Section Premium
 * 
 * Layout: 55% conteúdo / 45% visual
 * Features:
 * - Headline com tipografia Playfair Display
 * - Overline dourado em caps
 * - CTAs primário + secundário
 * - Trust badges inline
 * - Elementos flutuantes sutis
 * - Animações on load
 * - Gradiente de fundo sutil
 */

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Decorative Blobs */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-grass/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
      
      <Container spacing="lg" className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Overline */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block font-inter text-sm font-semibold tracking-wider text-gold uppercase"
            >
              Fertilizantes Premium
            </motion.span>
            
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-playfair text-5xl lg:text-6xl xl:text-7xl font-semibold text-forest leading-[1.1]"
            >
              A grama do seu jardim{' '}
              <span className="text-leaf">mais verde</span>,{' '}
              do jeito certo.
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-inter text-xl text-neutral-700 max-w-lg leading-relaxed"
            >
              Nutrição equilibrada que fortalece plantas, gramados e flores 
              sem excessos. Resultados visíveis em semanas.
            </motion.p>
            
            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button size="xl" variant="primary" asChild>
                <Link href="/produtos">
                  Conhecer produtos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="xl" variant="secondary" asChild>
                <Link href="/calculadora">
                  <Calculator className="w-5 h-5" />
                  Calcular para meu gramado
                </Link>
              </Button>
            </motion.div>
            
            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 pt-6 font-inter text-sm text-neutral-700"
            >
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-leaf" /> 
                Frete grátis +R$150
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-leaf" /> 
                Garantia de resultado
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gold fill-gold" /> 
                4.9/5 (2.847 avaliações)
              </span>
            </motion.div>
          </motion.div>
          
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Imagem do produto */}
            <div className="relative w-full max-w-md mx-auto">
              <Image
                src="/images/Gramado-novo.png"
                alt="Terravik - Fertilizante Premium para Gramados"
                width={500}
                height={500}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
              
              {/* Background decorativo */}
              <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-grass/10 to-leaf/10 blur-3xl" />
            </div>
            
            {/* Badge Flutuante */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -right-4 top-1/4 bg-white rounded-2xl shadow-xl p-6 hidden lg:block"
            >
              <span className="block font-playfair text-4xl font-bold text-leaf">+2.847</span>
              <span className="block font-inter text-sm text-neutral-700 mt-1">
                jardins transformados
              </span>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
