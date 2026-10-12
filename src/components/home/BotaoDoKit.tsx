'use client'

import { useState } from 'react'
import { Check, Loader2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart'
import { cn } from '@/lib/utils/cn'

interface BotaoDoKitProps {
  itens: { variantId: string }[]
  className?: string
}

/** Adiciona um saco de cada produto do kit. O desconto é aplicado no carrinho. */
export function BotaoDoKit({ itens, className }: BotaoDoKitProps) {
  const { addItem, openCart } = useCart()
  const [estado, setEstado] = useState<'pronto' | 'adicionando' | 'adicionado'>('pronto')

  const comprar = async () => {
    if (estado === 'adicionando') return
    if (estado === 'adicionado') {
      openCart()
      return
    }
    setEstado('adicionando')
    try {
      for (const item of itens) {
        await addItem(item.variantId, 1, { purchaseMode: 'one-time' }, 'kit')
      }
      setEstado('adicionado')
      openCart()
    } catch {
      // O CartProvider já avisou por toast.
      setEstado('pronto')
    }
  }

  return (
    <button
      type="button"
      onClick={comprar}
      disabled={estado === 'adicionando'}
      className={cn(
        'flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 text-base font-semibold text-forest shadow-lg transition-all hover:bg-gold-soft active:scale-[0.98] disabled:opacity-70 sm:w-auto sm:px-10',
        className
      )}
    >
      {estado === 'adicionando' ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          Adicionando
        </>
      ) : estado === 'adicionado' ? (
        <>
          <Check className="h-5 w-5" aria-hidden="true" />
          No carrinho. Ver carrinho
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          Adicionar o kit ao carrinho
        </>
      )}
    </button>
  )
}
