'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getImageProps } from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

/**
 * Banner Carousel — Design System 2026
 *
 * - Busca banners ativos do Supabase (tabela `banners`)
 * - Fallback para dados locais se banco indisponível
 * - Desktop 1920x800 (painel) ou 1920x720 (artes locais) / Mobile 1080x1350 (painel) ou horizontal 1720x720 (artes locais)
 * - Auto-play 5s, pausa ao hover
 * - Suporte a link clicável por banner
 * - Auto-refresh a cada 30s para refletir mudanças do admin
 */

interface BannerData {
  id: string
  desktop: string
  mobile: string
  alt: string
  link?: string | null
  /** Proporção da arte de computador, em CSS ("8 / 3"). Padrão: 1920 / 800. */
  proporcaoDesktop?: string
  /** Proporção da arte de celular, em CSS. Padrão: 1080 / 1350. */
  proporcaoCelular?: string
}

// As artes locais são 1920x720. Cortar para 1920x800 comeria o texto da borda.
const PROPORCAO_DA_ARTE_LOCAL = '8 / 3'
// No celular a arte local também é horizontal: a mesma do computador com as
// bordas laterais aparadas (1720x720), sem cortar o texto nem a embalagem.
const PROPORCAO_DA_ARTE_LOCAL_NO_CELULAR = '43 / 18'

// Fallback caso o banco não esteja acessível
const FALLBACK_BANNERS: BannerData[] = [
  {
    id: 'fallback-1',
    desktop: '/images/Banner/home-raiz-forte.jpg',
    mobile: '/images/Banner/home-raiz-forte-celular-h.jpg',
    alt: 'Raiz Forte Terravik: raízes fortes, gramado saudável. Rende 32 m².',
    link: '/produtos/raiz-forte',
    proporcaoDesktop: PROPORCAO_DA_ARTE_LOCAL,
    proporcaoCelular: PROPORCAO_DA_ARTE_LOCAL_NO_CELULAR,
  },
  {
    id: 'fallback-2',
    desktop: '/images/Banner/home-verde-rapido.jpg',
    mobile: '/images/Banner/home-verde-rapido-celular-h.jpg',
    alt: 'Verde Rápido Terravik: seu gramado verde de novo. Rende 96 m².',
    link: '/produtos/verde-rapido',
    proporcaoDesktop: PROPORCAO_DA_ARTE_LOCAL,
    proporcaoCelular: PROPORCAO_DA_ARTE_LOCAL_NO_CELULAR,
  },
  {
    id: 'fallback-3',
    desktop: '/images/Banner/home-resistencia-total.jpg',
    mobile: '/images/Banner/home-resistencia-total-celular-h.jpg',
    alt: 'Resistência Total Terravik: um gramado forte o ano inteiro. Rende 64 m².',
    link: '/produtos/resistencia-total',
    proporcaoDesktop: PROPORCAO_DA_ARTE_LOCAL,
    proporcaoCelular: PROPORCAO_DA_ARTE_LOCAL_NO_CELULAR,
  },
]

// Corte do Tailwind `md`. As duas mídias precisam ser exatamente
// complementares: se sobrar largura em que nenhuma casa, o LCP fica sem
// preload; se as duas casarem, o navegador baixa os dois cortes.
const MIDIA_DESKTOP = '(min-width: 768px)'
const MIDIA_CELULAR = '(max-width: 767.98px)'

const AUTO_PLAY_INTERVAL = 5000
const REFRESH_INTERVAL = 30000

export function BannerSection() {
  const [banners, setBanners] = useState<BannerData[]>(FALLBACK_BANNERS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Buscar banners do Supabase
  const fetchBanners = useCallback(async () => {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('banners')
        .select('id, title, alt_text, desktop_image_url, mobile_image_url, link_url')
        .eq('is_active', true)
        .order('"order"', { ascending: true })

      if (error) {
        console.error('[BannerSection] Erro:', error.message)
        return
      }

      if (data && data.length > 0) {
        const mapped = data.map((b) => ({
          id: b.id,
          desktop: b.desktop_image_url,
          mobile: b.mobile_image_url,
          alt: b.alt_text,
          link: b.link_url,
        }))
        setBanners(mapped)
        // Resetar índice se ficou fora do range
        setCurrentIndex((prev) => (prev >= mapped.length ? 0 : prev))
      } else {
        setBanners(FALLBACK_BANNERS)
        setCurrentIndex(0)
      }
    } catch {
      // Silencioso - manter banners atuais
    }
  }, [])

  // Carga inicial + auto-refresh
  useEffect(() => {
    fetchBanners()
    const interval = setInterval(fetchBanners, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchBanners])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const len = banners.length
      return len > 0 ? (prev + 1) % len : 0
    })
  }, [banners.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const len = banners.length
      return len > 0 ? (prev - 1 + len) % len : 0
    })
  }, [banners.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Troca de slide com o dedo. Só conta o gesto mais horizontal que vertical,
  // para não brigar com a rolagem da página.
  const toque = useRef<{ x: number; y: number } | null>(null)
  const aoTocar = (e: React.TouchEvent) => {
    const t = e.touches[0]
    toque.current = { x: t.clientX, y: t.clientY }
  }
  const aoSoltar = (e: React.TouchEvent) => {
    const inicio = toque.current
    toque.current = null
    if (!inicio || banners.length <= 1) return
    const t = e.changedTouches[0]
    const dx = t.clientX - inicio.x
    const dy = t.clientY - inicio.y
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx < 0) goToNext()
    else goToPrevious()
  }

  // Auto-play
  useEffect(() => {
    if (isHovered || banners.length <= 1) return
    const interval = setInterval(goToNext, AUTO_PLAY_INTERVAL)
    return () => clearInterval(interval)
  }, [isHovered, goToNext, banners.length])

  // Keyboard nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrevious])

  // Segurança: manter índice dentro dos limites
  const safeIndex = banners.length > 0 ? currentIndex % banners.length : 0
  const currentBanner = banners[safeIndex]

  if (!currentBanner) return null

  // Direção de arte: o ARQUIVO muda por tela, então é <picture>, não dois
  // <Image>. Com dois <Image priority> saíam dois preloads sem `media`, e o
  // celular baixava também o corte de 1920x800.
  // getImageProps não registra preload nenhum: os dois <link> saem à mão, um
  // por tela, só no primeiro slide.
  const primeiroSlide = safeIndex === 0
  const propsComuns = {
    alt: currentBanner.alt,
    fill: true,
    sizes: '100vw',
    // 75 é o padrão do otimizador: a 90 o banner pesava quase o dobro sem
    // diferença visível numa foto.
    quality: 75,
    priority: primeiroSlide,
  }
  const { props: imgDesktop } = getImageProps({ ...propsComuns, src: currentBanner.desktop })
  const { props: imgMobile } = getImageProps({ ...propsComuns, src: currentBanner.mobile })

  const imageContent = (
    <motion.div
      key={`${currentBanner.id}-${safeIndex}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0"
    >
      {primeiroSlide && (
        <>
          <link
            rel="preload"
            as="image"
            href={imgDesktop.src}
            imageSrcSet={imgDesktop.srcSet}
            imageSizes={imgDesktop.sizes}
            media={MIDIA_DESKTOP}
            fetchPriority="high"
          />
          <link
            rel="preload"
            as="image"
            href={imgMobile.src}
            imageSrcSet={imgMobile.srcSet}
            imageSizes={imgMobile.sizes}
            media={MIDIA_CELULAR}
            fetchPriority="high"
          />
        </>
      )}
      <picture>
        <source media={MIDIA_DESKTOP} srcSet={imgDesktop.srcSet} sizes={imgDesktop.sizes} />
        {/* eslint-disable-next-line @next/next/no-img-element -- props vêm de getImageProps */}
        <img {...imgMobile} alt={currentBanner.alt} className="object-cover" />
      </picture>
    </motion.div>
  )

  return (
    <section
      className="relative w-full touch-pan-y overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={aoTocar}
      onTouchEnd={aoSoltar}
      aria-label="Banner carousel"
    >
      {/* Container — Mobile: 1080×1350 / Desktop: 1920×800 */}
      <div
        className="relative w-full [aspect-ratio:var(--proporcao-do-banner-no-celular)] md:[aspect-ratio:var(--proporcao-do-banner)]"
        style={{
          ['--proporcao-do-banner' as string]: currentBanner.proporcaoDesktop ?? '1920 / 800',
          ['--proporcao-do-banner-no-celular' as string]: currentBanner.proporcaoCelular ?? '1080 / 1350',
        }}
      >
        <AnimatePresence initial={false} mode="wait">
          {currentBanner.link ? (
            <Link href={currentBanner.link} className="absolute inset-0 block">
              {imageContent}
            </Link>
          ) : (
            imageContent
          )}
        </AnimatePresence>
      </div>

      {/* Setas */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            aria-label="Banner anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-bg-surface/90 backdrop-blur-sm border border-border-subtle text-txt-primary shadow-sm transition-all hover:bg-bg-surface hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest md:h-12 md:w-12"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <button
            onClick={goToNext}
            aria-label="Próximo banner"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-bg-surface/90 backdrop-blur-sm border border-border-subtle text-txt-primary shadow-sm transition-all hover:bg-bg-surface hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest md:h-12 md:w-12"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </>
      )}

      {/* Indicadores */}
      {banners.length > 1 && (
        <div className="absolute bottom-1.5 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 md:gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Ir para banner ${index + 1}`}
              className={`
                h-2 md:h-2.5 rounded-full transition-all duration-300
                ${
                  index === safeIndex
                    ? 'w-8 md:w-12 bg-bg-surface'
                    : 'w-2 md:w-2.5 bg-bg-surface/50 hover:bg-bg-surface/75'
                }
              `}
            />
          ))}
        </div>
      )}

      {/* Contador */}
      {banners.length > 1 && (
        <div className="absolute top-4 right-4 z-10 hidden md:block rounded-full bg-bg-dark/50 backdrop-blur-sm px-3 py-1.5 text-xs md:text-sm font-medium text-txt-on-dark">
          {safeIndex + 1} / {banners.length}
        </div>
      )}
    </section>
  )
}
