'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui'
import { useCart } from '@/components/cart'

interface AddToCartButtonProps {
  variantId: string
  available: boolean
}

export function AddToCartButton({
  variantId,
  available,
}: AddToCartButtonProps) {
  const { addItem, openCart, isLoading } = useCart()
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const handleAddToCart = async () => {
    try {
      await addItem(variantId, 1)
      setShowSuccess(true)
      // Abrir drawer após adicionar
      setTimeout(() => openCart(), 300)
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
    }
  }

  if (!available) {
    return (
      <Button fullWidth size="lg" disabled className="rounded-full">
        Esgotado
      </Button>
    )
  }

  if (showSuccess) {
    return (
      <Button
        fullWidth
        size="lg"
        className="rounded-full bg-green-600 hover:bg-green-700"
        disabled
      >
        <Check className="h-5 w-5" />
        Adicionado!
      </Button>
    )
  }

  return (
    <Button
      fullWidth
      size="lg"
      onClick={handleAddToCart}
      loading={isLoading}
      className="rounded-full"
    >
      <ShoppingCart className="h-5 w-5" />
      {isLoading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
    </Button>
  )
}
