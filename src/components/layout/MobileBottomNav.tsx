'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calculator, ShoppingBag, User, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/cart'
import { useQuickPurchase } from '@/contexts/QuickPurchaseContext'
import { cn } from '@/lib/utils/cn'

/**
 * MobileBottomNav — Navegação inferior mobile
 * Identidade Terravik, foco em vender e calcular.
 * CTA central: Compra Rápida (abre QuickPurchaseSheet)
 */

const NAV_ITEMS = [
  { icon: Home, label: 'Início', href: '/' },
  { icon: Calculator, label: 'Calculadora', href: '/calculadora' },
  { icon: ShoppingBag, label: 'Compra rápida', cta: true },
  { icon: User, label: 'Conta', href: '/conta' },
  { icon: ShoppingCart, label: 'Carrinho', action: 'cart' },
] as const

export function MobileBottomNav() {
  const pathname = usePathname()
  const { cart, openCart } = useCart()
  const { openQuickPurchase } = useQuickPurchase()

  const cartCount = cart?.totalQuantity ?? 0

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-bg-surface border-t border-border-subtle px-2 py-2 pb-safe lg:hidden"
      aria-label="Navegação principal"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive =
          'href' in item && item.href === '/'
            ? pathname === '/'
            : 'href' in item && item.href
              ? pathname?.startsWith(item.href)
              : false

        if ('cta' in item && item.cta) {
          return (
            <button
              key={item.label}
              onClick={openQuickPurchase}
              className="flex flex-col items-center gap-0.5 -mt-6"
              aria-label="Compra rápida"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-forest text-white shadow-lg shadow-forest/30 hover:bg-forest-ink active:scale-95 transition-all">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium text-txt-muted">
                {item.label}
              </span>
            </button>
          )
        }

        if ('action' in item && item.action === 'cart') {
          return (
            <button
              key={item.label}
              onClick={openCart}
              className="flex flex-col items-center gap-0.5 py-1 min-w-[56px]"
              aria-label={`Carrinho (${cartCount} itens)`}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-6 h-6 transition-colors',
                    isActive ? 'text-forest' : 'text-txt-muted'
                  )}
                />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'text-forest' : 'text-txt-muted'
                )}
              >
                {item.label}
              </span>
            </button>
          )
        }

        const href = 'href' in item ? item.href : '/'
        return (
          <Link
            key={item.label}
            href={href}
            className="flex flex-col items-center gap-0.5 py-1 min-w-[56px] transition-colors"
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              className={cn(
                'w-6 h-6 transition-colors',
                isActive ? 'text-forest' : 'text-txt-muted'
              )}
            />
            <span
              className={cn(
                'text-[10px] font-medium',
                isActive ? 'text-forest' : 'text-txt-muted'
              )}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
