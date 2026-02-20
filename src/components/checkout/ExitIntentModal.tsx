'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag } from 'lucide-react'

interface ExitIntentModalProps {
  enabled?: boolean
}

export function ExitIntentModal({ enabled = true }: ExitIntentModalProps) {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (!enabled || dismissed) return
      if (e.clientY <= 5 && e.relatedTarget === null) {
        setShow(true)
      }
    },
    [enabled, dismissed]
  )

  useEffect(() => {
    // Só desktop — exit-intent não faz sentido em mobile
    const isMobile = window.matchMedia('(max-width: 1023px)').matches
    if (isMobile) return

    // Delay inicial de 5s para não aparecer muito cedo
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 5000)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseLeave])

  const handleDismiss = () => {
    setShow(false)
    setDismissed(true)
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 z-[100] bg-bg-dark/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-bg-surface rounded-2xl shadow-2xl overflow-hidden">
              {/* Close */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-txt-muted hover:bg-bg-surface-2 hover:text-txt-primary transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top bar accent */}
              <div className="h-1 bg-gradient-to-r from-forest via-gold to-forest" />

              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-forest/10 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-forest" />
                </div>

                <h3 className="font-heading text-xl font-semibold text-txt-primary mb-2">
                  Esqueceu algo?
                </h3>
                <p className="text-sm text-txt-muted mb-6 max-w-xs mx-auto">
                  Seu carrinho está reservado e todos os itens continuam esperando por você.
                </p>

                <button
                  onClick={handleDismiss}
                  className="w-full h-12 bg-forest text-white font-semibold rounded-xl hover:bg-forest-ink transition-colors"
                >
                  Continuar minha compra
                </button>

                <button
                  onClick={handleDismiss}
                  className="mt-3 text-sm text-txt-muted hover:text-txt-secondary transition-colors"
                >
                  Vou voltar depois
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
