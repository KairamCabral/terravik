'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import type { ProductImage } from '@/types/product'
import { cn } from '@/lib/utils/cn'
import { Sparkles, Play, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: ProductImage[]
  badge?: string
  videoUrl?: string
  /** Miniatura do vídeo. Se não informado e for YouTube, usa thumbnail automática. */
  videoThumbnailUrl?: string
}

function getEmbedUrl(url: string): string {
  try {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
    if (url.endsWith('.mp4') || url.includes('.mp4?')) return url
    return url
  } catch {
    return url
  }
}

/** Retorna URL da miniatura do YouTube (hqdefault = 480x360) */
function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/)
  return match ? `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg` : null
}

export function ProductGallery({ images, badge, videoUrl, videoThumbnailUrl }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const thumbScrollRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((index: number) => {
    setSelectedIndex(Math.max(0, Math.min(index, images.length - 1)))
  }, [images.length])

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-bg-surface-2 text-7xl text-txt-muted">
        🌱
      </div>
    )
  }

  const selectedImage = images[selectedIndex]

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  const thumbUrl = videoUrl ? (videoThumbnailUrl ?? getYouTubeThumbnail(videoUrl)) : null

  return (
    <div className="relative">
      <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
        {/* Mobile: imagem principal primeiro (foco nas imagens). Desktop: thumbnails à esquerda. */}
        {/* Imagem principal — no mobile vem primeiro; no lg fica à direita das thumbnails */}
        <div className="relative min-w-0 flex-1 order-first lg:order-none">
          <div
            ref={imageRef}
            className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-bg-surface-2 shadow-sm"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setLightboxOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage.url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative h-full w-full"
              >
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt || `Imagem ${selectedIndex + 1}`}
                  fill
                  className={cn(
                    'object-cover transition-transform duration-300 ease-out',
                    isZoomed && 'scale-150'
                  )}
                  style={
                    isZoomed
                      ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                      : undefined
                  }
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={selectedIndex === 0}
                />
              </motion.div>
            </AnimatePresence>

            {badge && (
              <div className="absolute left-4 top-4 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/90 px-3.5 py-1.5 text-xs font-semibold text-white uppercase tracking-wide shadow-lg backdrop-blur-sm">
                  <Sparkles className="h-3 w-3" />
                  {badge}
                </span>
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goTo(selectedIndex - 1)
                  }}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white disabled:opacity-0"
                  disabled={selectedIndex === 0}
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-5 w-5 text-forest" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goTo(selectedIndex + 1)
                  }}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white disabled:opacity-0"
                  disabled={selectedIndex === images.length - 1}
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-5 w-5 text-forest" />
                </button>
              </>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/30 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100 lg:hidden">
              <p className="text-center text-xs text-white/90">Toque para ampliar</p>
            </div>
          </div>
        </div>

        {/* Faixa de miniaturas + vídeo: no mobile fica abaixo da imagem (foco nas imagens); no desktop à esquerda */}
        {(images.length > 1 || videoUrl) && (
        <div className="flex flex-col gap-2 lg:order-first lg:w-20 lg:flex-shrink-0 lg:self-start">
          {/* Thumbnails — horizontal no mobile, vertical no desktop */}
          {images.length > 1 && (
            <div
              ref={thumbScrollRef}
              className={cn(
                'flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[min(24rem,60vh)] lg:pb-0',
                'scrollbar-thin scrollbar-thumb-border-medium scrollbar-track-transparent'
              )}
              style={{ scrollbarWidth: 'thin' }}
            >
              {images.map((image, index) => (
                <button
                  key={image.url}
                  onClick={() => goTo(index)}
                  className={cn(
                    'relative flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200',
                    'aspect-square w-16 sm:w-20 lg:w-full',
                    selectedIndex === index
                      ? 'border-forest shadow-md ring-2 ring-forest/20'
                      : 'border-transparent hover:border-forest/40 hover:opacity-90'
                  )}
                  aria-label={`Ver imagem ${index + 1}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `Miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </button>
              ))}
            </div>
          )}
          {/* Vídeo: só abre ao clicar no card; no mobile fica na mesma faixa das miniaturas */}
          {videoUrl && (
            <motion.button
              onClick={() => setVideoOpen(true)}
              className="group relative mt-1 flex w-full overflow-hidden rounded-xl border-2 border-transparent shadow-lg ring-2 ring-white/80 transition-all duration-300 hover:scale-[1.02] hover:border-forest/30 hover:shadow-forest/25 hover:ring-forest active:scale-[0.98] lg:mt-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              aria-label="Assistir vídeo do produto"
            >
              <div className="relative aspect-square w-full">
                {thumbUrl ? (
                  <Image
                    src={thumbUrl}
                    alt="Assistir vídeo"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="80px"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-forest to-forest-ink" />
                )}
                <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                    <Play className="h-4 w-4 fill-forest text-forest pl-0.5 sm:h-5 sm:w-5" strokeWidth={2} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white drop-shadow-md sm:text-[10px]">
                    Assistir
                  </span>
                </div>
              </div>
            </motion.button>
          )}
        </div>
        )}
      </div>

      {lightboxOpen &&
        createPortal(
          <Lightbox
            images={images}
            selectedIndex={selectedIndex}
            onClose={() => setLightboxOpen(false)}
            onSelect={goTo}
          />,
          document.body
        )}

      {videoOpen &&
        createPortal(
          <VideoModal
            url={getEmbedUrl(videoUrl)}
            onClose={() => setVideoOpen(false)}
          />,
          document.body
        )}
    </div>
  )
}

function Lightbox({
  images,
  selectedIndex,
  onClose,
  onSelect,
}: {
  images: ProductImage[]
  selectedIndex: number
  onClose: () => void
  onSelect: (index: number) => void
}) {
  const goPrev = () => onSelect(selectedIndex - 1)
  const goNext = () => onSelect(selectedIndex + 1)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Fechar"
      >
        <X className="h-8 w-8" />
      </button>

      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={images[selectedIndex]?.url}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative aspect-square w-full max-w-4xl"
          >
            <Image
              src={images[selectedIndex].url}
              alt={images[selectedIndex].alt || `Imagem ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              disabled={selectedIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 disabled:opacity-0"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={goNext}
              disabled={selectedIndex === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 disabled:opacity-0"
              aria-label="Próxima"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/70">
          {selectedIndex + 1} / {images.length}
        </p>
      )}
    </motion.div>
  )
}

function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  const isEmbed = url.includes('youtube.com/embed') || url.includes('vimeo.com')

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Fechar vídeo"
      >
        <X className="h-8 w-8" />
      </button>

      <div
        className="relative w-full max-w-4xl"
        style={{ aspectRatio: '16/9' }}
        onClick={(e) => e.stopPropagation()}
      >
        {isEmbed ? (
          <iframe
            src={url}
            title="Vídeo do produto"
            className="absolute inset-0 h-full w-full rounded-2xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={url}
            controls
            autoPlay
            className="absolute inset-0 h-full w-full rounded-2xl object-contain"
          />
        )}
      </div>
    </motion.div>
  )
}
