'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Play, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'

/**
 * Influencers / Video Testimonials
 *
 * Desktop: grid 4 colunas, sem scroll
 * Mobile: scroll horizontal com snap
 * Dados carregados do Supabase (tabela video_testimonials)
 */

interface VideoTestimonial {
  id: string
  handle: string
  thumbnail: string
  videoUrl?: string
  product: string
}

// Fallback estático caso o Supabase não retorne dados
const FALLBACK_TESTIMONIALS: VideoTestimonial[] = [
  { id: '1', handle: '@joao_gramados', thumbnail: '/images/grass/Depoimento-1.png', product: 'Gramado Novo — 1 kg' },
  { id: '2', handle: '@marina.jardim', thumbnail: '/images/grass/Depoimento-1.png', product: 'Verde Rápido — 1 kg' },
  { id: '3', handle: '@carlos_paisagismo', thumbnail: '/images/grass/Depoimento-1.png', product: 'Resistência Total — 1 kg' },
  { id: '4', handle: '@ana.greenlife', thumbnail: '/images/grass/Depoimento-1.png', product: 'Gramado Novo — 1 kg' },
]

function VideoCard({ item, index }: { item: VideoTestimonial; index: number }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = useCallback(() => {
    if (!item.videoUrl) return
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, item.videoUrl])

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }, [isMuted])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 w-[200px] sm:w-auto group"
    >
      <div
        className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer bg-neutral-900 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        onClick={togglePlay}
      >
        {/* Thumbnail */}
        <Image
          src={item.thumbnail}
          alt={`Depoimento ${item.handle}`}
          fill
          className={cn(
            'object-cover transition-opacity duration-300',
            isPlaying && 'opacity-0'
          )}
          sizes="(max-width: 1024px) 200px, 25vw"
        />

        {/* Video */}
        {item.videoUrl && (
          <video
            ref={videoRef}
            src={item.videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            preload="none"
          />
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Play */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/25 group-hover:bg-white/25 transition-colors">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mute */}
        {isPlaying && item.videoUrl && (
          <button
            onClick={toggleMute}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10"
            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        )}

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <p className="text-white font-semibold text-sm">{item.handle}</p>
          <p className="text-white/60 text-xs mt-0.5">{item.product}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function InfluencersSection() {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>(FALLBACK_TESTIMONIALS)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const { data } = await (supabase as any)
          .from('video_testimonials')
          .select('*')
          .eq('is_active', true)
          .order('"order"', { ascending: true })

        if (data && data.length > 0) {
          setTestimonials(
            (data as { id: string; handle: string; thumbnail_url: string; video_url: string | null; product_name: string }[]).map((d) => ({
              id: d.id,
              handle: d.handle,
              thumbnail: d.thumbnail_url,
              videoUrl: d.video_url || undefined,
              product: d.product_name,
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
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="text-overline text-gold tracking-widest uppercase block mb-3">
            Quem usa, aprova
          </span>
          <h2 className="font-heading text-h2 text-txt-primary">
            Resultados reais
          </h2>
        </motion.div>

        {/* Desktop: grid 4 colunas / Mobile: scroll horizontal */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-5">
          {testimonials.map((item, i) => (
            <VideoCard key={item.id} item={item} index={i} />
          ))}
        </div>

        <div
          className="flex lg:hidden gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {testimonials.map((item, i) => (
            <div key={item.id} style={{ scrollSnapAlign: 'start' }}>
              <VideoCard item={item} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
