import { useCart } from './CartProvider'
import { formatCurrency } from '@/lib/utils/formatters'
import { Button } from '@/components/ui'
import { ShoppingCart } from 'lucide-react'

export function CartSummary() {
  const { cart, isLoading, goToCheckout } = useCart()

  if (!cart) return null

  return (
    <div className="space-y-4 border-t border-terravik-brown/10 bg-white p-6">
      {/* Subtotal */}
      <div className="flex items-center justify-between">
        <span className="text-terravik-brown/70">Subtotal</span>
        <span className="font-display text-2xl font-bold text-terravik-brown">
          {formatCurrency(cart.subtotal, cart.currency)}
        </span>
      </div>

      <p className="text-sm text-terravik-brown/60">
        Frete e impostos calculados no checkout
      </p>

      {/* Botão Finalizar */}
      <Button
        fullWidth
        size="lg"
        onClick={goToCheckout}
        disabled={isLoading || cart.items.length === 0}
        loading={isLoading}
        className="rounded-full"
      >
        <ShoppingCart className="h-5 w-5" />
        Finalizar Compra
      </Button>
    </div>
  )
}
