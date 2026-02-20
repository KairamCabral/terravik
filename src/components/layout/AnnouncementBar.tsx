'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Truck, Sparkles, Timer, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useCart } from '@/components/cart'
import { useToast } from '@/components/ui'
import { FIRST_PURCHASE_COUPON_CODE } from '@/lib/shipping/coupon'

const COUPON_TO_APPLY_KEY = 'terravik-coupon-to-apply'

/**
 * AnnouncementBar — Design System 2026
 *
 * - Gradientes usando tokens (forest → leaf, gold)
 * - Motion discreto, respeita prefers-reduced-motion
 * - Sem shimmer exagerado
 */

type AnnouncementVariant = 'freeShipping' | 'discount' | 'launch' | 'social'

interface AnnouncementBarProps {
  variant?: AnnouncementVariant
  closeable?: boolean
  autoRotate?: boolean
  rotateInterval?: number
}

// Textos em uma linha para não quebrar e sobrepor o header
const announcements: Record<
  AnnouncementVariant,
  {
    icon: typeof Truck
    text: string
    highlight: string
    cta: string
    link: string
    gradient: string
    couponCode?: string
  }
> = {
  freeShipping: {
    icon: Truck,
    text: 'FRETE GRÁTIS',
    highlight: 'acima de R$ 150',
    cta: 'Aproveite',
    link: '/produtos',
    gradient: 'from-forest to-forest-ink',
  },
  discount: {
    icon: Sparkles,
    text: '1ª compra',
    highlight: '15% OFF',
    cta: 'Usar cupom',
    link: '/produtos',
    gradient: 'from-gold to-gold',
    couponCode: FIRST_PURCHASE_COUPON_CODE,
  },
  launch: {
    icon: TrendingUp,
    text: 'Calculadora',
    highlight: 'dose em 30s',
    cta: 'Testar',
    link: '/calculadora',
    gradient: 'from-forest to-forest-ink',
  },
  social: {
    icon: Sparkles,
    text: '+2.847 gramados',
    highlight: 'Seja o próximo',
    cta: 'Ver soluções',
    link: '/produtos',
    gradient: 'from-forest to-forest-ink',
  },
}

export function AnnouncementBar({
  variant = 'freeShipping',
  closeable = true,
  autoRotate = false,
  rotateInterval = 5000,
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [currentVariant, setCurrentVariant] = useState<AnnouncementVariant>(variant)
  const { openCart } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    if (!autoRotate) return
    const variants: AnnouncementVariant[] = ['freeShipping', 'discount', 'launch', 'social']
    let currentIndex = variants.indexOf(currentVariant)
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % variants.length
      setCurrentVariant(variants[currentIndex])
    }, rotateInterval)
    return () => clearInterval(interval)
  }, [autoRotate, rotateInterval, currentVariant])

  useEffect(() => {
    try {
      const wasClosed = localStorage.getItem('announcement-bar-closed')
      if (wasClosed === 'true') setIsVisible(false)
    } catch {
      // SSR / localStorage indisponível
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    if (closeable) {
      try { localStorage.setItem('announcement-bar-closed', 'true') } catch {}
    }
  }

  const handleCouponClick = async () => {
    const announcement = announcements[currentVariant]
    const code = announcement.couponCode
    if (!code) return

    try {
      await navigator.clipboard.writeText(code)
      try {
        sessionStorage.setItem(COUPON_TO_APPLY_KEY, code)
      } catch {}
      openCart()
      showToast('success', `Cupom ${code} copiado! Cole no carrinho e clique em Aplicar.`)
    } catch {
      try {
        sessionStorage.setItem(COUPON_TO_APPLY_KEY, code)
      } catch {}
      openCart()
      showToast('info', `Cupom ${code}. Abra o carrinho e cole no campo de cupom.`)
    }
  }

  const announcement = announcements[currentVariant]
  const Icon = announcement.icon

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-[60] overflow-hidden',
          `bg-gradient-to-r ${announcement.gradient}`
        )}
        role="banner"
        aria-label="Anúncio"
      >
        <div className="container-main relative">
          <div className="flex h-10 flex-nowrap items-center justify-center gap-1.5 sm:gap-2 px-3 py-0 sm:px-4">
            <Icon className="h-4 w-4 flex-shrink-0 text-bg-primary sm:h-4 sm:w-4" strokeWidth={1.5} />

            <div className="flex min-w-0 flex-shrink flex-nowrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="truncate text-xs font-semibold text-bg-primary sm:text-sm">
                {announcement.text}
              </span>
              <span className="inline-flex flex-shrink-0 items-center px-2 py-0.5 rounded-full border border-bg-primary/20 bg-bg-primary/15 text-xs font-bold text-bg-primary backdrop-blur-sm sm:text-sm">
                {announcement.highlight}
              </span>
            </div>

            {announcement.couponCode ? (
              <button
                onClick={handleCouponClick}
                type="button"
                className="flex-shrink-0 inline-flex items-center gap-0.5 rounded-full bg-bg-surface px-2.5 py-1 text-xs font-semibold text-forest transition-colors hover:bg-bg-primary sm:px-3"
              >
                {announcement.cta}
                <span className="text-sm">→</span>
              </button>
            ) : (
              <Link
                href={announcement.link}
                className="flex-shrink-0 inline-flex items-center gap-0.5 rounded-full bg-bg-surface px-2.5 py-1 text-xs font-semibold text-forest transition-colors hover:bg-bg-primary sm:px-3"
              >
                {announcement.cta}
                <span className="text-sm">→</span>
              </Link>
            )}

            {closeable && (
              <button
                onClick={handleClose}
                className="absolute right-1 top-1/2 -translate-y-1/2 flex-shrink-0 rounded-full p-1 transition-colors hover:bg-bg-primary/15 sm:right-2"
                aria-label="Fechar anúncio"
              >
                <X className="h-3.5 w-3.5 text-bg-primary/70 transition-colors hover:text-bg-primary" />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {autoRotate && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-bg-primary/25"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: rotateInterval / 1000, ease: 'linear' }}
            key={currentVariant}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export function FreeShippingBar() {
  return <AnnouncementBar variant="freeShipping" />
}

export function DiscountBar() {
  return <AnnouncementBar variant="discount" />
}

export function LaunchBar() {
  return <AnnouncementBar variant="launch" />
}

export function SocialProofBar() {
  return <AnnouncementBar variant="social" />
}

export function RotatingAnnouncementBar() {
  return <AnnouncementBar autoRotate rotateInterval={6000} closeable={false} />
}
