'use client'

import { useEffect, useState, useRef } from 'react'
import { MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

/**
 * Onde Estamos — Lojas conveniadas
 *
 * Carrossel automático infinito com logos das lojas
 * Busca lojas featured do banco de dados (Supabase)
 * Fallback para dados estáticos se o fetch falhar
 */

interface Store {
  id: string
  name: string
  slug: string
  logo_url: string | null
  website: string | null
  is_featured: boolean
}

function StoreLogo({ store }: { store: Store }) {
  const [logoError, setLogoError] = useState(false)
  const showLogo = store.logo_url && !logoError

  return (
    <a
      href={store.website || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 flex items-center justify-center h-20 lg:h-24 w-40 lg:w-48 px-6 rounded-xl border border-transparent hover:border-border-subtle hover:bg-white/60 transition-all duration-300"
      aria-label={store.name}
      title={store.name}
    >
      {showLogo ? (
        <Image
          src={store.logo_url!}
          alt={store.name}
          width={180}
          height={72}
          className="h-12 lg:h-14 w-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
          unoptimized={store.logo_url?.startsWith('/lojas/') ?? false}
          onError={() => setLogoError(true)}
        />
      ) : (
        <span className="text-base lg:text-lg font-semibold text-neutral-400 group-hover:text-forest transition-colors duration-300 whitespace-nowrap">
          {store.name}
        </span>
      )}
    </a>
  )
}

const FALLBACK_STORES: Store[] = [
  { id: '1', name: 'Amazon', slug: 'amazon', logo_url: null, website: 'https://www.amazon.com.br', is_featured: true },
  { id: '2', name: 'Carrefour', slug: 'carrefour', logo_url: null, website: 'https://www.carrefour.com.br', is_featured: true },
  { id: '3', name: 'MadeiraMadeira', slug: 'madeira-madeira', logo_url: null, website: 'https://www.madeiramadeira.com.br', is_featured: true },
  { id: '4', name: 'Magazine Luiza', slug: 'magalu', logo_url: null, website: 'https://www.magazineluiza.com.br', is_featured: true },
  { id: '5', name: 'Mercado Livre', slug: 'mercado-livre', logo_url: null, website: 'https://www.mercadolivre.com.br', is_featured: true },
]

export function StoreLocationsSection() {
  const [stores, setStores] = useState<Store[]>(FALLBACK_STORES)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch('/api/stores')
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            setStores(data.filter((s: Store) => s.is_featured))
          }
        }
      } catch {
        // Usar fallback
      }
    }
    fetchStores()
  }, [])

  // Duplicar logos para efeito infinito
  const duplicatedStores = [...stores, ...stores, ...stores]

  return (
    <section className="bg-bg-surface-2 section-spacing overflow-hidden">
      <div className="container-main">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-overline text-gold tracking-widest uppercase block mb-3">
            Pontos de venda
          </span>
          <h2 className="font-heading text-h2 lg:text-h1 text-txt-primary">
            Onde estamos
          </h2>
        </motion.div>

        {/* Carrossel de Logos */}
        <div 
          className="relative mb-14"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex gap-12 lg:gap-16"
            animate={{
              x: isPaused ? undefined : [0, -100 * stores.length / 3],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: stores.length * 3,
                ease: "linear",
              },
            }}
          >
            {duplicatedStores.map((store, index) => (
              <StoreLogo key={`${store.id}-${index}`} store={store} />
            ))}
          </motion.div>

          {/* Gradientes de fade nas bordas */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-surface-2 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-surface-2 to-transparent pointer-events-none" />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Link
            href="/onde-encontrar"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest/80 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Ver todas as lojas no mapa
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
