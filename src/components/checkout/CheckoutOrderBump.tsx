'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Check, Sparkles } from 'lucide-react'
import { getSmartBumpProduct } from '@/lib/shipping/order-bump'
import { useCart } from '@/components/cart/CartProvider'
import { formatPrice } from '@/lib/subscription/pricing'

interface CheckoutOrderBumpProps {
  cartProductIds: string[]
}

export function CheckoutOrderBump({ cartProductIds }: CheckoutOrderBumpProps) {
  const { addItem, isLoading } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const product = useMemo(
    () => getSmartBumpProduct(cartProductIds),
    [cartProductIds]
  )

  const handleAdd = async () => {
    if (!product) return
    setIsAdding(true)
    try {
      await addItem(product.variantId, 1)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 3000)
    } catch {
      // silently fail
    } finally {
      setIsAdding(false)
    }
  }

  if (!product) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden border-2 border-dashed border-gold/40 bg-gold-soft/30"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gold/10">
        <Sparkles className="w-3.5 h-3.5 text-gold" />
        <span className="text-xs font-semibold text-gold">
          Clientes que compraram seus itens também levaram
        </span>
      </div>

      {/* Produto */}
      <div className="flex items-center gap-4 p-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-border-subtle relative">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-1"
            sizes="64px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-txt-primary leading-tight">
            {product.title}
            <span className="text-txt-muted font-normal"> · {product.variantTitle}</span>
          </p>
          <p className="text-xs text-txt-muted mt-0.5 line-clamp-1">{product.pitch}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-txt-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
            <span className="text-sm font-bold text-forest">{formatPrice(product.price)}</span>
            <span className="text-[10px] font-bold text-white bg-forest px-1.5 py-0.5 rounded">
              -{product.discountPercent}%
            </span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleAdd}
          disabled={isAdding || isLoading || isAdded}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-shrink-0
            ${isAdded
              ? 'bg-forest text-white'
              : 'bg-forest text-white hover:bg-forest-ink'
            }
            disabled:opacity-60
          `}
        >
          {isAdding ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
              <ShoppingCart className="w-4 h-4" />
            </motion.div>
          ) : isAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionado</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
