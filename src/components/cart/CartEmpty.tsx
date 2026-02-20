import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui'

export function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-terravik-green/10">
        <ShoppingBag className="h-10 w-10 text-terravik-green/60" />
      </div>
      <h3 className="mb-2 font-display text-xl font-bold text-terravik-brown">
        Seu carrinho está vazio
      </h3>
      <p className="mb-6 text-sm text-terravik-brown/60">
        Conheça nossos produtos para gramado
      </p>
      <Button asChild>
        <Link href="/produtos">Ver Produtos</Link>
      </Button>
    </div>
  )
}
