'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ShoppingBag, ShoppingCart, Minus, Plus, Loader2, Check } from 'lucide-react'
import type { Product, ProductVariant } from '@/types/product'
import { useCart } from '@/components/cart/CartProvider'
import { getDiscountPercent } from '@/lib/subscription/pricing'
import { formatCurrency } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'

const QUANTIDADE_MAXIMA = 999

interface AddToCartSectionProps {
  product: Product
  selectedVariant: ProductVariant
  quantity: number
  onQuantityChange: (quantity: number) => void
  purchaseMode: 'one-time' | 'subscription'
  frequency: number
  subscriptionPrice: number
  /** Mostra a barra fixa de compra no celular (o botão principal saiu da tela). */
  barraFixaVisivel?: boolean
}

export function AddToCartSection({
  product,
  selectedVariant,
  quantity,
  onQuantityChange,
  purchaseMode,
  frequency,
  subscriptionPrice,
  barraFixaVisivel = false,
}: AddToCartSectionProps) {
  const { addItem, goToCheckout, isLoading } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [montado, setMontado] = useState(false)

  // Texto digitado na quantidade. Só vira número no blur ou no Enter, para a
  // pessoa conseguir apagar o campo e digitar "12" sem o valor pular.
  const [textoDaQuantidade, setTextoDaQuantidade] = useState(String(quantity))
  useEffect(() => setTextoDaQuantidade(String(quantity)), [quantity])
  useEffect(() => setMontado(true), [])

  const confirmarQuantidade = () => {
    const numero = parseInt(textoDaQuantidade.replace(/\D/g, ''), 10)
    const valida = Number.isFinite(numero) ? Math.min(QUANTIDADE_MAXIMA, Math.max(1, numero)) : quantity
    onQuantityChange(valida)
    setTextoDaQuantidade(String(valida))
  }

  const disponivel = selectedVariant.available && selectedVariant.price > 0
  const assinatura = purchaseMode === 'subscription'
  const precoUnitario = assinatura ? subscriptionPrice : selectedVariant.price

  const adicionar = async () => {
    const discountPercent = assinatura ? getDiscountPercent(frequency) : 0

    await addItem(selectedVariant.id, quantity, {
      purchaseMode,
      frequency: assinatura ? frequency : undefined,
      subscriptionPrice: assinatura ? subscriptionPrice : undefined,
      discountPercent: assinatura ? discountPercent : undefined,
    })
  }

  const handleAddToCart = async () => {
    try {
      await adicionar()
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch {
      // O CartProvider já avisou por toast; o botão não confirma.
    }
  }

  // Adiciona e segue para o checkout. goToCheckout lê o carrinho de uma ref
  // no CartProvider, então enxerga o item que acabou de entrar.
  const handleComprarAgora = async () => {
    try {
      await adicionar()
      goToCheckout()
    } catch {
      // O CartProvider já avisou por toast.
    }
  }

  const textoPrincipal = assinatura ? 'Assinar e economizar' : 'Comprar agora'

  const QUICK_QUANTITIES = [1, 2, 3] as const

  return (
    <div className="space-y-4">
      {/* Quantidade — botões rápidos + ajuste fino */}
      <div className="space-y-2">
        <label htmlFor="quantidade-do-produto" className="text-sm font-medium text-txt-secondary">
          Quantidade
        </label>
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
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <input
              id="quantidade-do-produto"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={textoDaQuantidade}
              onChange={(e) => setTextoDaQuantidade(e.target.value.replace(/\D/g, '').slice(0, 3))}
              onBlur={confirmarQuantidade}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  confirmarQuantidade()
                }
              }}
              className="h-11 w-12 bg-transparent text-center text-sm font-semibold text-txt-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest"
            />
            <button
              onClick={() => onQuantityChange(Math.min(QUANTIDADE_MAXIMA, quantity + 1))}
              disabled={quantity >= QUANTIDADE_MAXIMA}
              className="flex h-11 w-11 items-center justify-center text-txt-muted transition-colors hover:bg-bg-surface-2 hover:text-txt-primary disabled:opacity-40"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Botão principal: compra e segue para o checkout */}
      <button
        onClick={handleComprarAgora}
        disabled={isLoading || !disponivel}
        className={cn(
          'relative w-full overflow-hidden rounded-xl py-4 text-base font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
          'bg-forest text-white shadow-md hover:bg-forest-ink hover:shadow-lg'
        )}
      >
        <span className="relative flex items-center justify-center gap-2">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          )}
          {!disponivel ? 'Indisponível' : isLoading ? 'Adicionando...' : textoPrincipal}
        </span>
      </button>

      {/* Botão secundário: só adiciona */}
      {disponivel && (
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-forest py-3.5 text-base font-semibold text-forest transition-all hover:bg-forest/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAdded ? (
            <Check className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          )}
          {isAdded ? 'Adicionado!' : 'Adicionar ao carrinho'}
        </button>
      )}

      {/* Info assinatura */}
      {assinatura && !isAdded && (
        <p className="text-center text-xs text-txt-muted">
          Primeira entrega em até 7 dias · Cancele quando quiser
        </p>
      )}

      {/* Barra fixa do celular. Fica ACIMA da navegação inferior (z-50), com
          respiro para a área segura, e compra de verdade: antes só rolava a
          página até o topo. */}
      {montado &&
        barraFixaVisivel &&
        disponivel &&
        createPortal(
          <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border-subtle bg-bg-surface/95 backdrop-blur-lg lg:hidden">
            <div className="flex items-center gap-4 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs text-txt-muted">
                  {quantity > 1 ? `${quantity} × ` : ''}
                  {product.title}
                </p>
                <p className="font-heading text-lg font-bold text-forest">
                  {formatCurrency(precoUnitario * quantity, product.currency)}
                </p>
              </div>
              <button
                onClick={handleComprarAgora}
                disabled={isLoading}
                className="shrink-0 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-forest-ink active:scale-[0.98] disabled:opacity-60"
              >
                {isLoading ? 'Adicionando...' : textoPrincipal}
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
