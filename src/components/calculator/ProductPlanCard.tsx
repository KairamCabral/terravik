'use client'

import type { ProductPlan } from '@/types/calculator'
import { Badge, Button } from '@/components/ui'
import { CATALOG } from '@/lib/calculator/constants'
import { CheckCircle, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useCart } from '@/components/cart'
import { getMockProductByCalculatorId } from '@/lib/shopify/mock-data'
import { useState } from 'react'

interface ProductPlanCardProps {
  plan: ProductPlan
}

const productColors: Record<string, { bg: string; border: string; badge: string }> = {
  P1: {
    bg: 'bg-terravik-green/5',
    border: 'border-l-terravik-green-700',
    badge: 'bg-terravik-green/10 text-terravik-green-700',
  },
  P2: {
    bg: 'bg-terravik-green/5',
    border: 'border-l-terravik-green-500',
    badge: 'bg-terravik-green/10 text-terravik-green-600',
  },
  P3: {
    bg: 'bg-terravik-gold/5',
    border: 'border-l-terravik-gold',
    badge: 'bg-terravik-gold/10 text-terravik-gold-700',
  },
}

export function ProductPlanCard({ plan }: ProductPlanCardProps) {
  const catalog = CATALOG[plan.product_id]
  const colors = productColors[plan.product_id]
  const { addItem, openCart, isLoading } = useCart()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAddToCart = async () => {
    try {
      // Buscar produto mock para pegar o variant ID
      const mockProduct = getMockProductByCalculatorId(plan.product_id)
      if (!mockProduct || mockProduct.variants.length === 0) {
        alert('Produto temporariamente indisponível')
        return
      }

      // Usar a primeira variante disponível
      const variant = mockProduct.variants.find((v) => v.available)
      if (!variant) {
        alert('Produto esgotado')
        return
      }

      await addItem(variant.id, 1)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        openCart()
      }, 1000)
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      alert('Erro ao adicionar produto. Tente novamente.')
    }
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-l-4 border-terravik-brown/10 transition-shadow duration-300 hover:shadow-md',
        colors.bg,
        colors.border
      )}
    >
      {/* Header */}
      <div className="border-b border-terravik-brown/5 bg-white p-6 md:p-7">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-terravik-brown md:text-2xl">
              {plan.name}
            </h3>
            <p className="mt-1 text-sm text-terravik-brown/70">
              {catalog.base}
            </p>
          </div>
          <Badge className={cn('flex-shrink-0', colors.badge)}>
            {plan.product_id}
          </Badge>
        </div>
        <p className="text-sm text-terravik-brown/80 md:text-base">{catalog.description}</p>
      </div>

      {/* Dose e Quantidade */}
      <div className="grid gap-6 border-b border-terravik-brown/5 bg-white p-6 sm:grid-cols-2 md:p-7">
        <div>
          <p className="mb-2 text-sm font-medium text-terravik-brown/60">
            Dose por m²
          </p>
          <p className="font-display text-4xl font-bold text-terravik-green md:text-5xl">
            {plan.dose_g_m2}g
          </p>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-terravik-brown/60">
            Quantidade total
          </p>
          <p className="font-display text-4xl font-bold text-terravik-brown md:text-5xl">
            {plan.need_display}
          </p>
        </div>
      </div>

      {/* Quando usar */}
      <div className="border-b border-terravik-brown/5 bg-white p-6 md:p-7">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-terravik-brown/60">
          Quando usar
        </h4>
        <p className="text-sm text-terravik-brown md:text-base">{plan.whenToUse}</p>
      </div>

      {/* Frequência */}
      {plan.frequency_days > 0 && (
        <div className="border-b border-terravik-brown/5 bg-white p-6 md:p-7">
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-terravik-brown/60">
            Frequência
          </h4>
          <p className="text-sm text-terravik-brown md:text-base">
            Reaplicar {plan.frequency_display}
          </p>
        </div>
      )}

      {/* Como aplicar */}
      <div className="border-b border-terravik-brown/5 bg-white p-6 md:p-7">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-terravik-brown/60">
          Como aplicar
        </h4>
        <ol className="space-y-3">
          {plan.applicationSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-terravik-green/10 text-sm font-bold text-terravik-green">
                {index + 1}
              </span>
              <span className="pt-0.5 text-sm text-terravik-brown md:text-base">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Notas importantes */}
      {plan.notes.length > 0 && (
        <div className="border-b border-terravik-brown/5 bg-white p-6 md:p-7">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-terravik-brown/60">
            Notas importantes
          </h4>
          <ul className="space-y-2">
            {plan.notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-terravik-green" />
                <span className="text-sm text-terravik-brown/80 md:text-base">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="bg-white p-6 md:p-7">
        <Button
          fullWidth
          onClick={handleAddToCart}
          loading={isLoading}
          disabled={showSuccess}
          className={cn(showSuccess && 'bg-green-600 hover:bg-green-700')}
        >
          {showSuccess ? (
            'Adicionado! ✓'
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              Adicionar {plan.name} ao Carrinho
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
