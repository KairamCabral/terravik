'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircle2,
  Package,
  Mail,
  Star,
  ArrowRight,
  ShoppingBag,
  GraduationCap,
  Copy,
  Check,
} from 'lucide-react'
import { formatPrice } from '@/lib/subscription/pricing'

function OrderConfirmedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const orderId = searchParams.get('orderId') || ''
  const orderNumber = searchParams.get('orderNumber') || '#00000'
  const customerName = searchParams.get('customerName') || 'Cliente'
  const email = searchParams.get('email') || ''
  const subtotal = parseFloat(searchParams.get('subtotal') || '0')
  const shippingCost = parseFloat(searchParams.get('shippingCost') || '0')
  const couponDiscount = parseFloat(searchParams.get('couponDiscount') || '0')
  const total = parseFloat(searchParams.get('total') || '0')
  const shippingService = searchParams.get('shippingService') || ''
  const shippingDaysMin = parseInt(searchParams.get('shippingDaysMin') || '3')
  const shippingDaysMax = parseInt(searchParams.get('shippingDaysMax') || '7')
  const xpEarned = parseInt(searchParams.get('xpEarned') || '0')
  const itemCount = parseInt(searchParams.get('itemCount') || '0')

  // Delivery date estimate
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + shippingDaysMax)
  const formattedDelivery = deliveryDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  })

  const orderDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  // Confetti
  useEffect(() => {
    const launchConfetti = async () => {
      try {
        const confetti = (await import('canvas-confetti')).default

        // First burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#093E28', '#B38B25', '#22C55E', '#F4EFE5'],
        })

        // Delayed side bursts
        setTimeout(() => {
          confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: ['#093E28', '#B38B25'],
          })
          confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: ['#093E28', '#B38B25'],
          })
        }, 300)
      } catch {
        // confetti not available
      }
    }

    launchConfetti()
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [orderNumber])

  // If no order data, redirect
  if (!orderId) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-semibold text-txt-primary mb-4">
            Nenhum pedido encontrado
          </h1>
          <button
            onClick={() => router.push('/produtos')}
            className="h-12 px-8 bg-forest text-white font-semibold rounded-xl hover:bg-forest-ink transition-colors"
          >
            Ver produtos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Minimal header */}
      <header className="border-b border-border-subtle bg-bg-surface/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-center">
          <Link href="/">
            <span className="font-heading text-xl font-semibold text-forest tracking-tight">
              Terravik
            </span>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
        {/* Success icon + heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            className="w-20 h-20 mx-auto mb-5 rounded-full bg-forest/10 flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-forest" />
          </motion.div>

          <h1 className="font-heading text-3xl sm:text-4xl font-semibold text-txt-primary mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-lg text-txt-muted">
            Obrigado, <span className="font-medium text-txt-primary">{customerName.split(' ')[0]}</span>!
          </p>
        </motion.div>

        {/* Order card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border-subtle bg-bg-surface overflow-hidden mb-6"
        >
          {/* Order header */}
          <div className="px-6 py-4 border-b border-border-subtle bg-bg-surface-2/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-txt-muted">Número do pedido</p>
                <div className="flex items-center gap-2">
                  <p className="font-heading text-lg font-semibold text-txt-primary">
                    {orderNumber}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded text-txt-muted hover:text-forest transition-colors"
                    title="Copiar número"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-forest" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-txt-muted">Data</p>
                <p className="text-sm font-medium text-txt-primary">{orderDate}</p>
              </div>
            </div>
          </div>

          {/* Order details */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-txt-muted">
                Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
              </span>
              <span className="text-txt-primary">{formatPrice(subtotal)}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-forest">Desconto cupom</span>
                <span className="text-forest font-medium">-{formatPrice(couponDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-txt-muted">
                Frete ({shippingService})
              </span>
              <span className={shippingCost === 0 ? 'text-forest font-medium' : 'text-txt-primary'}>
                {shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}
              </span>
            </div>

            <div className="pt-3 border-t border-border-subtle flex justify-between items-baseline">
              <span className="text-sm font-medium text-txt-primary">Total</span>
              <span className="font-heading text-2xl font-semibold text-txt-primary">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Delivery estimate */}
          <div className="px-6 py-4 border-t border-border-subtle bg-forest/5">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-forest" />
              <div>
                <p className="text-sm font-medium text-txt-primary">
                  Previsão de entrega: até {formattedDelivery}
                </p>
                <p className="text-xs text-txt-muted">
                  {shippingService} · {shippingDaysMin}–{shippingDaysMax} dias úteis
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Email notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-surface p-4 mb-6"
        >
          <Mail className="w-5 h-5 text-forest flex-shrink-0" />
          <div>
            <p className="text-sm text-txt-primary">
              Enviamos os detalhes do pedido para{' '}
              <span className="font-medium">{email}</span>
            </p>
            <p className="text-xs text-txt-muted mt-0.5">
              Verifique também sua caixa de spam
            </p>
          </div>
        </motion.div>

        {/* XP / Gamification card */}
        {xpEarned > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl border-2 border-dashed border-gold/40 bg-gold-soft/30 p-5 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-txt-primary">
                  Você ganhou{' '}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-gold font-bold"
                  >
                    +{xpEarned} XP
                  </motion.span>{' '}
                  na Academia Terravik!
                </p>
                <p className="text-xs text-txt-muted mt-0.5">
                  Continue comprando e aprendendo para subir de nível
                </p>
              </div>
              <Link
                href="/academia"
                className="flex items-center gap-1 text-xs text-forest font-medium hover:underline flex-shrink-0"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Acessar</span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 mb-10"
        >
          <Link
            href="/conta/pedidos"
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-forest text-white font-semibold hover:bg-forest-ink transition-colors"
          >
            <Package className="w-4 h-4" />
            Acompanhar pedido
          </Link>
          <Link
            href="/produtos"
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-forest text-forest font-semibold hover:bg-forest/5 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Continuar comprando
          </Link>
        </motion.div>

        {/* Recommendations teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center pt-8 border-t border-border-subtle"
        >
          <p className="text-sm text-txt-muted mb-4">Recomendados para você</p>
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-24 h-24 rounded-xl bg-bg-surface-2 border border-border-subtle flex items-center justify-center"
              >
                <span className="text-xs text-txt-muted">Produto {i}</span>
              </div>
            ))}
          </div>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-1 text-sm text-forest font-medium mt-4 hover:underline"
          >
            Ver todos os produtos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
        </div>
      }
    >
      <OrderConfirmedContent />
    </Suspense>
  )
}
