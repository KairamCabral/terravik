'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { X, RefreshCw } from 'lucide-react'
import { useCart } from './CartProvider'
import { CartLine } from './CartLine'
import { CartEmpty } from './CartEmpty'
import { Button } from '@/components/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '@/lib/subscription/pricing'
import type { Cart } from '@/types/cart'
import { FreeShippingBar } from './FreeShippingBar'
import { ShippingCalculator } from './ShippingCalculator'
import { OrderBump } from './OrderBump'
import type { ShippingOption } from '@/lib/shipping/types'
import { CouponInput } from './CouponInput'
import type { AppliedCoupon } from '@/lib/shipping/coupon'

/**
 * CartDrawer — Design System 2026
 *
 * Polimentos:
 *  - Focus trap (a11y)
 *  - aria-modal, role=dialog
 *  - Tokens DS (border-subtle, bg-surface, txt-*)
 *  - "Finalizar pedido" (microcopy)
 *  - Border hairline, tipografia limpa
 */

export function CartDrawer() {
  const { cart, isOpen, closeCart, goToCheckout, isLoading } = useCart()
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Bloquear scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus no close button ao abrir
      setTimeout(() => closeBtnRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ESC fecha
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeCart()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, closeCart])

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !drawerRef.current) return

    const focusableEls = drawerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusableEls.length === 0) return

    const first = focusableEls[0]
    const last = focusableEls[focusableEls.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [])

  // Calcular economia
  const calculateCartSavings = (cartData: Cart | null): number => {
    if (!cartData) return 0
    return cartData.items.reduce((savings: number, item) => {
      if (item.subscription?.isSubscription && item.subscription.subscriptionPrice) {
        const baseTotal = item.price * item.quantity
        const discountedTotal = item.subscription.subscriptionPrice * item.quantity
        return savings + (baseTotal - discountedTotal)
      }
      return savings
    }, 0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-bg-dark/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-bg-surface shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho de compras"
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
              <h2 className="font-heading text-lg font-semibold text-txt-primary">
                Seu Carrinho {cart && cart.totalQuantity > 0 && `(${cart.totalQuantity})`}
              </h2>
              <button
                ref={closeBtnRef}
                onClick={closeCart}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-txt-muted transition-colors hover:bg-bg-surface-2 hover:text-txt-primary"
                aria-label="Fechar carrinho"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {!cart || cart.items.length === 0 ? (
                <CartEmpty />
              ) : (
                <div>
                  <div className="px-5 pt-4 pb-2">
                    <FreeShippingBar cartSubtotal={cart.subtotal} />
                  </div>
                  <div className="px-5">
                    {cart.items.map((item) => (
                      <CartLine key={item.id} item={item} />
                    ))}
                  </div>
                  <div className="px-5 py-3">
                    <OrderBump cartProductIds={cart.items.map((item) => item.productId)} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart && cart.items.length > 0 && (
              <div className="border-t border-border-subtle px-5 py-4 space-y-3">
                {/* Assinaturas resumo */}
                {cart.hasSubscription && (
                  <div className="flex items-center gap-2 rounded-lg border border-forest/15 bg-forest-soft/30 px-3 py-2 text-xs text-forest">
                    <RefreshCw className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>
                      <span className="font-medium">
                        {cart.subscriptionCount} {cart.subscriptionCount === 1 ? 'assinatura' : 'assinaturas'}
                      </span>
                      {' '}· Frete grátis · Cancele quando quiser
                    </span>
                  </div>
                )}

                {/* Cupom */}
                <CouponInput
                  cartSubtotal={cart.subtotal}
                  onCouponApply={setAppliedCoupon}
                  appliedCoupon={appliedCoupon}
                />

                {/* Frete */}
                <ShippingCalculator
                  cartSubtotal={cart.subtotal}
                  onShippingSelect={setSelectedShipping}
                  selectedShipping={selectedShipping}
                />

                {/* Total */}
                <div className="border-t border-border-subtle pt-3">
                  {(() => {
                    const subscriptionSavings = calculateCartSavings(cart)
                    const shippingSavings = selectedShipping?.isFree && selectedShipping?.originalPrice ? selectedShipping.originalPrice : 0
                    const couponSavings = appliedCoupon?.discountAmount || 0
                    const totalSavings = subscriptionSavings + shippingSavings + couponSavings
                    return totalSavings > 0 ? (
                      <p className="mb-2 text-center text-xs font-medium text-forest">
                        Economizando {formatPrice(totalSavings)}
                      </p>
                    ) : null
                  })()}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-txt-muted">Total:</span>
                    <span className="font-heading text-xl font-semibold text-txt-primary">
                      {formatPrice(
                        Math.max(0, cart.subtotal - (appliedCoupon?.discountAmount || 0)) +
                        (selectedShipping?.price || 0)
                      )}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  fullWidth
                  size="lg"
                  onClick={goToCheckout}
                  disabled={isLoading || cart.items.length === 0}
                  loading={isLoading}
                >
                  Finalizar pedido
                </Button>

                <button
                  onClick={closeCart}
                  className="w-full text-center text-xs text-txt-muted transition-colors hover:text-txt-secondary py-0.5"
                >
                  Continuar comprando
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
