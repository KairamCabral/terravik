'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, Loader2, X, ChevronRight, Check } from 'lucide-react'
import { cupomDoCarrinho } from '@/lib/cart/cupom'
import { formatPrice } from '@/lib/subscription/pricing'
import { useCart } from './CartProvider'

const COUPON_TO_APPLY_KEY = 'terravik-coupon-to-apply'

/**
 * Cupom da gaveta. Quem valida é a Shopify, pelo CartProvider: nada aqui
 * confere código contra lista local.
 */
export function CouponInput() {
  const { cart, aplicarCupom, removerCupom } = useCart()
  const appliedCoupon = cupomDoCarrinho(cart)
  const [code, setCode] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cupom pendente do banner (ex: "Usar cupom" no AnnouncementBar)
  useEffect(() => {
    try {
      const pending = sessionStorage.getItem(COUPON_TO_APPLY_KEY)
      if (pending) {
        setIsExpanded(true)
        setCode(pending)
        sessionStorage.removeItem(COUPON_TO_APPLY_KEY)
      }
    } catch {}
  }, [])

  const handleApply = useCallback(async () => {
    if (!code.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const resultado = await aplicarCupom(code)

      if (resultado.ok) {
        setIsExpanded(false)
        setCode('')
      } else {
        setError(resultado.mensagem || 'Cupom inválido')
      }
    } finally {
      setIsLoading(false)
    }
  }, [code, aplicarCupom])

  const handleRemove = useCallback(async () => {
    setIsLoading(true)
    try {
      await removerCupom()
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }, [removerCupom])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApply()
    }
  }

  // ─── Cupom aplicado: mostra resumo compacto ───
  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between py-1 text-sm">
        <div className="flex items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-leaf" />
          <span className="text-terravik-brown/60">Cupom</span>
          <span className="text-[11px] font-mono font-medium text-leaf bg-terravik-green-50 px-1.5 py-0.5 rounded">
            {appliedCoupon.code}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {appliedCoupon.discountAmount <= 0 ? (
            <span className="text-sm font-medium text-leaf">Aplicado</span>
          ) : (
            <span className="text-sm font-medium text-leaf">
              -{formatPrice(appliedCoupon.discountAmount)}
            </span>
          )}
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="text-terravik-brown/30 hover:text-accent-red transition-colors p-0.5"
            aria-label="Remover cupom"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  // ─── Linha colapsada: "Cupom | Inserir código >" ───
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-between py-1 text-sm group"
      >
        <div className="flex items-center gap-2 text-terravik-brown/60">
          <Tag className="w-3.5 h-3.5" />
          <span>Cupom</span>
        </div>
        <span className="text-xs text-leaf font-medium flex items-center gap-0.5 group-hover:underline">
          Inserir código <ChevronRight className="w-3 h-3" />
        </span>
      </button>
    )
  }

  // ─── Formulário expandido ───
  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError(null)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Código do cupom"
            autoFocus
            className={`
              w-full px-3 py-2 text-sm rounded-lg border transition-colors text-terravik-brown
              font-mono uppercase tracking-wider
              ${error
                ? 'border-accent-red/40 focus:border-accent-red'
                : 'border-terravik-brown/15 focus:border-leaf'
              }
              focus:outline-none focus:ring-1 focus:ring-leaf/20
              bg-white placeholder:text-terravik-brown/25 placeholder:normal-case placeholder:tracking-normal placeholder:font-sans
            `}
          />
          {isLoading && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 text-terravik-brown/30 animate-spin" />
            </div>
          )}
        </div>

        <button
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
          className="px-3 py-2 bg-forest text-white text-sm rounded-lg font-medium hover:bg-leaf disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
        </button>

        <button
          onClick={() => {
            setIsExpanded(false)
            setCode('')
            setError(null)
          }}
          className="px-2 py-2 text-terravik-brown/30 hover:text-terravik-brown/60 text-xs"
        >
          &times;
        </button>
      </div>

      {/* Erro */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[11px] text-accent-red"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
