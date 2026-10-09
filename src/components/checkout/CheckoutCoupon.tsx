'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, Loader2, X, Check } from 'lucide-react'
import { cupomDoCarrinho } from '@/lib/cart/cupom'
import { useCart } from '@/components/cart'
import { formatPrice } from '@/lib/subscription/pricing'
import { cn } from '@/lib/utils/cn'

/** Cupom do checkout. Quem valida é a Shopify, pelo CartProvider. */
export function CheckoutCoupon() {
  const { cart, aplicarCupom, removerCupom } = useCart()
  const coupon = cupomDoCarrinho(cart)
  const [isOpen, setIsOpen] = useState(false)
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focar automaticamente ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const handleApply = useCallback(async () => {
    if (!code.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const resultado = await aplicarCupom(code)

      if (resultado.ok) {
        setIsOpen(false)
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
    if (e.key === 'Escape') {
      setIsOpen(false)
      setCode('')
      setError(null)
    }
  }

  // Cupom aplicado
  if (coupon) {
    return (
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-forest" />
          <span className="text-sm text-txt-muted">Cupom</span>
          <span className="text-xs font-mono font-medium text-forest bg-forest/10 px-2 py-0.5 rounded">
            {coupon.code}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {coupon.discountAmount <= 0 ? (
            <span className="text-sm font-medium text-forest">Frete grátis</span>
          ) : (
            <span className="text-sm font-medium text-forest">
              -{formatPrice(coupon.discountAmount)}
            </span>
          )}
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="p-0.5 text-txt-muted hover:text-functional-error transition-colors"
            aria-label="Remover cupom"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Link para abrir
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-sm text-forest font-medium hover:underline"
      >
        <Tag className="w-3.5 h-3.5" />
        Tem um cupom de desconto?
      </button>
    )
  }

  // Campo de input aberto — já com foco
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase())
              setError(null)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Digite o código do cupom"
            className={cn(
              'w-full h-12 px-4 text-base rounded-lg border transition-all',
              'text-txt-primary font-mono uppercase tracking-wider',
              'placeholder:text-txt-muted/50 placeholder:normal-case placeholder:tracking-normal placeholder:font-sans',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-functional-error focus:ring-functional-error/20'
                : 'border-border-subtle focus:border-forest focus:ring-forest/20',
              'bg-bg-surface'
            )}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted animate-spin" />
          )}
        </div>

        <button
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
          className="h-12 px-5 bg-forest text-white text-sm font-medium rounded-lg hover:bg-forest-ink disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Aplicar
        </button>

        <button
          onClick={() => {
            setIsOpen(false)
            setCode('')
            setError(null)
          }}
          className="h-12 px-2 text-txt-muted hover:text-txt-secondary transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-functional-error"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
