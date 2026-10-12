'use client'

import { useState } from 'react'
import { Check, Loader2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart'
import { cn } from '@/lib/utils/cn'

interface BotaoDoKitProps {
  itens: { variantId: string; quantidade: number }[]
  /** `claro`: botão branco, para fundo verde. `escuro`: botão verde, para fundo claro. */
  tom?: 'claro' | 'escuro'
  texto?: string
  className?: string
}

/** Adiciona os produtos do kit. O desconto é aplicado no carrinho. */
export function BotaoDoKit({ itens, tom = 'escuro', texto = 'Adicionar o kit ao carrinho', className }: BotaoDoKitProps) {
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
        await addItem(item.variantId, item.quantidade, { purchaseMode: 'one-time' }, 'kit')
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
        'flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl px-6 text-base font-semibold transition-all active:scale-[0.98] disabled:opacity-70',
        tom === 'claro'
          ? 'bg-white text-forest shadow-lg hover:bg-gold-soft'
          : 'bg-forest text-white shadow-md hover:bg-forest-ink',
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
          {texto}
        </>
      )}
    </button>
  )
}
