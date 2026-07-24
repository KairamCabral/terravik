'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Tag, RefreshCw, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/subscription/pricing'
import type { Cart } from '@/types/cart'
import type { ShippingOption } from '@/lib/shipping/types'
import type { AppliedCoupon } from '@/lib/shipping/coupon'
import { CheckoutTimer } from './CheckoutTimer'
import { CheckoutTrustBadges } from './CheckoutTrustBadges'

interface CheckoutOrderSummaryProps {
  cart: Cart
  shipping: ShippingOption | null
  coupon: AppliedCoupon | null
  onRemoveItem?: (lineId: string) => Promise<void>
  className?: string
}

export function CheckoutOrderSummary({
  cart,
  shipping,
  coupon,
  onRemoveItem,
  className,
}: CheckoutOrderSummaryProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const couponDiscount = coupon?.discountAmount ?? 0
  const shippingCost = shipping?.price ?? 0
  const total = Math.max(0, cart.subtotal - couponDiscount) + shippingCost

  const totalSavings =
    (cart.items.reduce((acc, item) => {
      if (item.subscription?.isSubscription && item.subscription.subscriptionPrice) {
        return acc + (item.price - item.subscription.subscriptionPrice) * item.quantity
      }
      return acc
    }, 0)) +
    (shipping?.isFree && shipping.originalPrice ? shipping.originalPrice : 0) +
    couponDiscount

  async function handleConfirmRemove(lineId: string) {
    if (!onRemoveItem) return
    setRemovingId(lineId)
    setConfirmingId(null)
    try {
      await onRemoveItem(lineId)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className={cn('rounded-xl border border-border-subtle bg-bg-surface', className)}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-subtle">
        <h2 className="font-heading text-lg font-semibold text-txt-primary">Resumo do pedido</h2>
        <p className="text-xs text-txt-muted mt-0.5">{cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'itens'}</p>
      </div>

      {/* Items */}
      <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 group">
            <div className="relative w-14 h-14 rounded-lg bg-bg-surface-2 overflow-hidden flex-shrink-0 border border-border-subtle">
              {item.image?.url ? (
                <Image
                  src={item.image.url}
                  alt={item.image.alt || item.productTitle}
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-txt-muted text-xs">
                  Img
                </div>
              )}
              {/* Qty badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-txt-primary leading-tight truncate">
                {item.productTitle}
              </p>
              {item.variantTitle && item.variantTitle !== 'Default Title' && (
                <p className="text-xs text-txt-muted truncate">{item.variantTitle}</p>
              )}
              {item.subscription?.isSubscription && (
                <span className="inline-flex items-center gap-1 text-[10px] text-forest font-medium mt-0.5">
                  <RefreshCw className="w-2.5 h-2.5" />
                  Assinatura · {item.subscription.discountPercent}% off
                </span>
              )}

              {/* Confirmação inline de remoção */}
              <AnimatePresence>
                {confirmingId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2 mt-1"
                  >
                    <span className="text-[11px] text-txt-muted">Remover item?</span>
                    <button
                      onClick={() => handleConfirmRemove(item.id)}
                      className="text-[11px] text-functional-error font-semibold hover:underline"
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="text-[11px] text-txt-muted hover:underline"
                    >
                      Não
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p className={cn(
                'text-sm font-medium whitespace-nowrap transition-opacity',
                removingId === item.id ? 'text-txt-muted opacity-40' : 'text-txt-primary'
              )}>
                {formatPrice(item.totalPrice * item.quantity)}
              </p>
              {onRemoveItem && confirmingId !== item.id && (
                <button
                  onClick={() => setConfirmingId(item.id)}
                  disabled={removingId === item.id}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-0.5 rounded text-txt-muted hover:text-functional-error disabled:cursor-not-allowed"
                  aria-label={`Remover ${item.productTitle}`}
                  title="Remover item"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="px-5 py-4 border-t border-border-subtle space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-txt-muted">Subtotal</span>
          <span className="text-txt-primary">{formatPrice(cart.subtotal)}</span>
        </div>

        {coupon && couponDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1 text-forest">
              <Tag className="w-3.5 h-3.5" />
              {coupon.code}
            </span>
            <span className="text-forest font-medium">-{formatPrice(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-txt-muted">Frete</span>
          {shipping ? (
            <span className={shipping.isFree ? 'text-forest font-medium' : 'text-txt-primary'}>
              {shipping.isFree ? 'Grátis' : formatPrice(shippingCost)}
            </span>
          ) : (
            <span className="text-txt-muted text-xs">Calcular na entrega</span>
          )}
        </div>

        <div className="pt-2 border-t border-border-subtle">
          {totalSavings > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs font-medium text-forest mb-2"
            >
              Economizando {formatPrice(totalSavings)}
            </motion.p>
          )}
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-txt-muted">Total</span>
            <motion.span
              key={total}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="font-heading text-2xl font-semibold text-txt-primary"
            >
              {formatPrice(total)}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Trust + Timer */}
      <div className="px-5 pb-5 space-y-4">
        <CheckoutTrustBadges variant="full" />
        <CheckoutTimer className="justify-center" />
      </div>
    </div>
  )
}

/**
 * Versão mobile colapsável do resumo
 */
export function CheckoutMobileSummary({
  cart,
  shipping,
  coupon,
  onRemoveItem,
}: Omit<CheckoutOrderSummaryProps, 'className'>) {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const couponDiscount = coupon?.discountAmount ?? 0
  const shippingCost = shipping?.price ?? 0
  const total = Math.max(0, cart.subtotal - couponDiscount) + shippingCost

  async function handleConfirmRemove(lineId: string) {
    if (!onRemoveItem) return
    setRemovingId(lineId)
    setConfirmingId(null)
    try {
      await onRemoveItem(lineId)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="lg:hidden border-b border-border-subtle bg-bg-surface">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={cn('w-4 h-4 text-txt-muted transition-transform', isOpen && 'rotate-180')}
          />
          <span className="text-sm text-forest font-medium">
            {isOpen ? 'Ocultar resumo' : 'Ver resumo'} ({cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'itens'})
          </span>
        </div>
        <span className="font-heading text-lg font-semibold text-txt-primary">
          {formatPrice(total)}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-2.5">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 group">
                  <div className="relative w-10 h-10 rounded bg-bg-surface-2 overflow-hidden flex-shrink-0 border border-border-subtle">
                    {item.image?.url ? (
                      <Image
                        src={item.image.url}
                        alt={item.image.alt || item.productTitle}
                        fill
                        className="object-contain p-0.5"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-txt-muted">Img</div>
                    )}
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-forest text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-txt-primary truncate">{item.productTitle}</p>
                    <AnimatePresence>
                      {confirmingId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2 mt-0.5"
                        >
                          <span className="text-[11px] text-txt-muted">Remover?</span>
                          <button
                            onClick={() => handleConfirmRemove(item.id)}
                            className="text-[11px] text-functional-error font-semibold hover:underline"
                          >
                            Sim
                          </button>
                          <button
                            onClick={() => setConfirmingId(null)}
                            className="text-[11px] text-txt-muted hover:underline"
                          >
                            Não
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <p className={cn(
                      'text-sm font-medium transition-opacity',
                      removingId === item.id ? 'text-txt-muted opacity-40' : 'text-txt-primary'
                    )}>
                      {formatPrice(item.totalPrice * item.quantity)}
                    </p>
                    {onRemoveItem && confirmingId !== item.id && (
                      <button
                        onClick={() => setConfirmingId(item.id)}
                        disabled={removingId === item.id}
                        className="p-0.5 rounded text-txt-muted hover:text-functional-error transition-colors disabled:cursor-not-allowed"
                        aria-label={`Remover ${item.productTitle}`}
                        title="Remover item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-border-subtle flex justify-between text-sm">
                <span className="text-txt-muted">Frete</span>
                {shipping ? (
                  <span className={shipping.isFree ? 'text-forest font-medium' : ''}>
                    {shipping.isFree ? 'Grátis' : formatPrice(shippingCost)}
                  </span>
                ) : (
                  <span className="text-txt-muted text-xs">A calcular</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
