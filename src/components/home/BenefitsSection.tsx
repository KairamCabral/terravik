'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

/**
 * Seção Grupo de Produtos — imagem responsiva
 *
 * Desktop: Grupo-desktop.png
 * Mobile: Grupo-mobile.png
 */

export function BenefitsSection() {
  return (
    <section className="bg-bg-primary section-spacing">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-[85%] md:w-[75%] overflow-hidden rounded-2xl lg:rounded-3xl"
      >
        {/* Desktop */}
        <Image
          src="/images/Grupo-desktop.png"
          alt="Linha completa de fertilizantes Terravik"
          width={1920}
          height={800}
          className="hidden md:block w-full h-auto"
          sizes="75vw"
          quality={90}
        />

        {/* Mobile */}
        <Image
          src="/images/Grupo-mobile.png"
          alt="Linha completa de fertilizantes Terravik"
          width={1080}
          height={1350}
          className="block md:hidden w-full h-auto"
          sizes="85vw"
          quality={90}
        />
      </motion.div>
    </section>
  )
}
