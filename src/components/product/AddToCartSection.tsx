'use client'

import { useState } from 'react'
import { ShoppingCart, Minus, Plus, Loader2, Check } from 'lucide-react'
import type { Product, ProductVariant } from '@/types/product'
import { useCart } from '@/components/cart/CartProvider'
import { getDiscountPercent } from '@/lib/subscription/pricing'
import { cn } from '@/lib/utils/cn'

interface AddToCartSectionProps {
  product: Product
  selectedVariant: ProductVariant
  quantity: number
  onQuantityChange: (quantity: number) => void
  purchaseMode: 'one-time' | 'subscription'
  frequency: number
  subscriptionPrice: number
}

export function AddToCartSection({
  product,
  selectedVariant,
  quantity,
  onQuantityChange,
  purchaseMode,
  frequency,
  subscriptionPrice,
}: AddToCartSectionProps) {
  const { addItem, isLoading } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    try {
      const discountPercent =
        purchaseMode === 'subscription' ? getDiscountPercent(frequency) : 0

      await addItem(selectedVariant.id, quantity, {
        purchaseMode,
        frequency: purchaseMode === 'subscription' ? frequency : undefined,
        subscriptionPrice:
          purchaseMode === 'subscription' ? subscriptionPrice : undefined,
        discountPercent:
          purchaseMode === 'subscription' ? discountPercent : undefined,
      })

      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
    }
  }

  const buttonText = () => {
    if (isLoading) return 'Adicionando...'
    if (isAdded) return 'Adicionado!'
    if (purchaseMode === 'subscription') return 'Assinar e economizar'
    return 'Adicionar ao carrinho'
  }

  const QUICK_QUANTITIES = [1, 2, 3] as const

  return (
    <div className="space-y-4">
      {/* Quantidade — botões rápidos + ajuste fino */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-txt-secondary">Quantidade</label>
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_QUANTITIES.map((q) => (
            <button
              key={q}
              onClick={() => onQuantityChange(q)}
              className={cn(
                'flex h-11 min-w-[4.5rem] flex-1 items-center justify-center rounded-xl border-2 text-sm font-semibold transition-all active:scale-[0.98]',
                quantity === q
                  ? 'border-forest bg-forest/10 text-forest'
                  : 'border-border-subtle bg-bg-surface text-txt-primary hover:border-forest/40'
              )}
              aria-pressed={quantity === q}
            >
              {q}
            </button>
          ))}
          <div className="flex items-center rounded-xl border-2 border-border-subtle overflow-hidden shrink-0">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="flex h-11 w-11 items-center justify-center text-txt-muted transition-colors hover:bg-bg-surface-2 hover:text-txt-primary disabled:opacity-40"
              aria-label="Diminuir"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span
              className="w-10 text-center text-sm font-semibold text-txt-primary"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="flex h-11 w-11 items-center justify-center text-txt-muted transition-colors hover:bg-bg-surface-2 hover:text-txt-primary"
              aria-label="Aumentar"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Botão CTA */}
      <button
        onClick={handleAddToCart}
        disabled={isLoading || !selectedVariant.available}
        className={cn(
          'relative w-full overflow-hidden rounded-xl py-4 text-base font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
          'bg-forest text-white shadow-md hover:bg-forest-ink hover:shadow-lg',
          isAdded && 'bg-forest-ink'
        )}
      >
        <span className="relative flex items-center justify-center gap-2">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isAdded ? (
            <Check className="h-5 w-5" />
          ) : (
            <ShoppingCart className="h-5 w-5" />
          )}
          {buttonText()}
        </span>
      </button>

      {/* Info assinatura */}
      {purchaseMode === 'subscription' && !isAdded && (
        <p className="text-center text-xs text-txt-muted">
          Primeira entrega em até 7 dias · Cancele quando quiser
        </p>
      )}
    </div>
  )
}
