'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Check } from 'lucide-react'
import { getSmartBumpProduct } from '@/lib/shipping/order-bump'
import { useCart } from './CartProvider'
import { formatPrice } from '@/lib/subscription/pricing'

interface OrderBumpProps {
  cartProductIds: string[]
}

export function OrderBump({ cartProductIds }: OrderBumpProps) {
  const { addItem, isLoading } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Motor inteligente: seleciona o melhor bump baseado no carrinho
  const product = useMemo(
    () => getSmartBumpProduct(cartProductIds),
    [cartProductIds]
  )

  const handleAddBump = async () => {
    if (!product) return
    setIsAdding(true)
    try {
      await addItem(product.variantId, 1)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      console.error('Erro ao adicionar bump:', error)
    } finally {
      setIsAdding(false)
    }
  }

  if (!product) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg overflow-hidden bg-terravik-gold-50 border border-terravik-gold-200"
    >
      {/* Header - desconto exclusivo */}
      <div className="bg-gradient-gold px-3 py-1.5 flex items-center justify-center gap-2">
        <span className="text-white text-xs font-semibold">
          Leve junto com
        </span>
        <span className="bg-white/90 text-terravik-gold-600 text-xs font-bold px-1.5 py-0.5 rounded">
          {product.discountPercent}% OFF
        </span>
        <span className="text-white text-xs font-semibold">!</span>
      </div>

      {/* Produto */}
      <div className="flex items-center gap-3 p-3">
        {/* Imagem real do produto */}
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-terravik-cream-200 relative">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-0.5"
            sizes="48px"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-terravik-brown leading-tight">
            {product.title}
            <span className="text-terravik-brown/40 font-normal"> {product.variantTitle}</span>
          </p>
          <p className="text-[11px] text-terravik-brown/50 leading-tight mt-0.5 line-clamp-1">
            {product.pitch}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-terravik-brown/35 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
            <span className="text-sm font-bold text-leaf">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Botão */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAddBump}
          disabled={isAdding || isLoading}
          className={`
            flex items-center justify-center w-10 h-10 rounded-lg transition-all flex-shrink-0
            ${isAdded
              ? 'bg-leaf text-white'
              : 'bg-forest text-white hover:bg-leaf'
            }
            disabled:opacity-50
          `}
        >
          {isAdding ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <ShoppingCart className="w-4 h-4" />
            </motion.div>
          ) : isAdded ? (
            <Check className="w-4 h-4" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
