'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag } from 'lucide-react'
import { fraseParcelamento } from '@/lib/pagamento/parcelas'

interface PriceDisplayProps {
  basePrice: number
  compareAtPrice: number | null
  subscriptionPrice: number
  discountPercent: number
  purchaseMode: 'one-time' | 'subscription'
  quantity: number
}

export function PriceDisplay({
  basePrice,
  compareAtPrice,
  subscriptionPrice,
  discountPercent,
  purchaseMode,
  quantity,
}: PriceDisplayProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const totalBasePrice = basePrice * quantity
  const totalSubscriptionPrice = subscriptionPrice * quantity
  // Só risca quando o preço "de" é MAIOR que o de venda. A Shopify devolve
  // compareAtPrice igual ao preço em produto sem promoção, e a tela mostrava
  // "R$ 89,90" ao lado de "R$ 89,90" riscado.
  const totalCompareAt =
    compareAtPrice && compareAtPrice > basePrice ? compareAtPrice * quantity : null

  const displayPrice =
    purchaseMode === 'subscription' ? totalSubscriptionPrice : totalBasePrice
  const unitPrice =
    purchaseMode === 'subscription' ? subscriptionPrice : basePrice
  // Regra única de parcelamento (lib/pagamento/parcelas.ts).
  const parcelamento = fraseParcelamento(displayPrice)

  // Produto sem preço cadastrado: nada de "R$ 0,00" nem parcela de R$ 0,00.
  if (basePrice <= 0) {
    return (
      <div className="space-y-1">
        <p className="font-heading text-2xl font-bold text-forest">Preço em definição</p>
        <p className="text-sm text-txt-secondary">
          Este produto ainda não tem preço publicado.{' '}
          <Link href="/contato" className="font-medium text-forest underline underline-offset-2">
            Fale com a equipe
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Preço principal */}
      <div className="flex items-baseline gap-3">
        <AnimatePresence mode="wait">
          <motion.span
            key={`${purchaseMode}-${quantity}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="font-heading text-4xl font-bold tracking-tight text-forest"
          >
            {formatPrice(displayPrice)}
          </motion.span>
        </AnimatePresence>

        {/* Preço original riscado (anchoring) */}
        {purchaseMode === 'subscription' && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg text-txt-muted line-through"
          >
            {formatPrice(totalBasePrice)}
          </motion.span>
        )}

        {totalCompareAt && purchaseMode === 'one-time' && (
          <span className="text-lg text-txt-muted line-through">
            {formatPrice(totalCompareAt)}
          </span>
        )}
      </div>

      {/* Indicador de modo + parcelamento */}
      <AnimatePresence mode="wait">
        {purchaseMode === 'subscription' ? (
          <motion.div
            key="subscription-indicator"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-forest/20 bg-forest/5 px-2.5 py-1 text-xs font-semibold text-forest">
                <Tag className="h-3 w-3" />
                -{discountPercent}% assinante
              </span>
              <span className="text-sm text-txt-muted">por entrega</span>
            </div>
            {parcelamento && (
              <p className="text-xs text-txt-secondary">
                ou <span className="font-medium">{parcelamento}</span>
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="onetime-indicator"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-1"
          >
            {parcelamento && (
              <p className="text-xs text-txt-secondary">
                ou <span className="font-medium">{parcelamento}</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quantidade */}
      {quantity > 1 && (
        <p className="text-xs text-txt-muted">
          {quantity} unidades × {formatPrice(unitPrice)} cada
        </p>
      )}
    </div>
  )
}
