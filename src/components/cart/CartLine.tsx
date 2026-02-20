'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, RefreshCw, Tag } from 'lucide-react'
import type { CartItem } from '@/types/cart'
import { useCart } from './CartProvider'
import { formatPrice } from '@/lib/subscription/pricing'

interface CartLineProps {
  item: CartItem
}

export function CartLine({ item }: CartLineProps) {
  const { updateItem, removeItem, isLoading } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemove()
      return
    }
    
    setIsUpdating(true)
    try {
      await updateItem(item.id, newQuantity)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    try {
      await removeItem(item.id)
    } finally {
      setIsUpdating(false)
    }
  }

  const isSubscription = item.subscription?.isSubscription
  const frequency = item.subscription?.frequency
  const discountPercent = item.subscription?.discountPercent
  const subscriptionPrice = item.subscription?.subscriptionPrice

  // Calcular preço unitário efetivo
  const effectiveUnitPrice = isSubscription && subscriptionPrice 
    ? subscriptionPrice 
    : item.price

  return (
    <div 
      className={`
        flex gap-4 py-4 border-b transition-colors
        ${isSubscription 
          ? 'border-emerald-200 bg-emerald-50/30' 
          : 'border-terravik-brown/10'
        }
      `}
    >
      {/* Imagem */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-terravik-cream-100">
        {item.image ? (
          <Image
            src={item.image.url}
            alt={item.image.alt || item.productTitle}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-terravik-brown/40">
            🌱
          </div>
        )}
        
        {/* Badge de assinatura */}
        {isSubscription && (
          <div className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <RefreshCw className="w-2.5 h-2.5" />
            {frequency}d
          </div>
        )}
      </div>

      {/* Info do produto */}
      <div className="flex flex-1 flex-col">
        {/* Título */}
        <Link 
          href={`/produtos/${item.productHandle}`}
          className="font-medium text-terravik-brown hover:text-terravik-green transition-colors line-clamp-1"
        >
          {item.productTitle}
        </Link>

        {/* Variante */}
        {item.variantTitle && item.variantTitle !== 'Default Title' && (
          <p className="text-sm text-terravik-brown/60">{item.variantTitle}</p>
        )}

        {/* Info de assinatura */}
        {isSubscription && (
          <div className="mt-1 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <RefreshCw className="w-3 h-3" />
              A cada {frequency} dias
            </span>
            {discountPercent && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <Tag className="w-3 h-3" />
                -{discountPercent}%
              </span>
            )}
          </div>
        )}

        {/* Preço */}
        <div className="mt-1 flex items-center gap-2">
          <span className={`text-sm font-semibold ${isSubscription ? 'text-emerald-700' : 'text-terravik-green'}`}>
            {formatPrice(effectiveUnitPrice)}
          </span>
          {isSubscription && subscriptionPrice && item.price !== subscriptionPrice && (
            <span className="text-xs text-terravik-brown/40 line-through">
              {formatPrice(item.price)}
            </span>
          )}
        </div>

        {/* Controles de quantidade e remover */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isUpdating || isLoading}
              className="p-1.5 rounded-lg border border-terravik-brown/20 hover:bg-terravik-cream-100 disabled:opacity-50 transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isUpdating || isLoading}
              className="p-1.5 rounded-lg border border-terravik-brown/20 hover:bg-terravik-cream-100 disabled:opacity-50 transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Preço total do item */}
          <div className="flex items-center gap-3">
            <span className={`font-semibold ${isSubscription ? 'text-emerald-700' : 'text-terravik-brown'}`}>
              {formatPrice(item.totalPrice)}
            </span>
            
            <button
              onClick={handleRemove}
              disabled={isUpdating || isLoading}
              className="p-1.5 rounded-lg text-terravik-brown/40 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
              aria-label="Remover item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
