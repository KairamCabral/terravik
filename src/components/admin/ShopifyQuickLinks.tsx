'use client'

import { motion } from 'framer-motion'
import {
  ExternalLink,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Truck,
  CreditCard,
  Settings,
  RefreshCw,
} from 'lucide-react'

const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || ''
const SHOPIFY_ADMIN_URL = SHOPIFY_STORE ? `https://${SHOPIFY_STORE}/admin` : '#'

const COLOR_CLASSES: Record<string, { bg: string; border: string; iconBg: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', iconBg: 'bg-blue-100', icon: 'text-blue-600' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-100', icon: 'text-emerald-600' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', iconBg: 'bg-purple-100', icon: 'text-purple-600' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-amber-100', icon: 'text-amber-600' },
  red: { bg: 'bg-red-50', border: 'border-red-200', iconBg: 'bg-red-100', icon: 'text-red-600' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', iconBg: 'bg-teal-100', icon: 'text-teal-600' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', iconBg: 'bg-pink-100', icon: 'text-pink-600' },
  neutral: { bg: 'bg-neutral-50', border: 'border-neutral-200', iconBg: 'bg-neutral-100', icon: 'text-neutral-600' },
}

const QUICK_LINKS = [
  {
    label: 'Produtos',
    description: 'Gerenciar catálogo e estoque',
    icon: Package,
    href: `${SHOPIFY_ADMIN_URL}/products`,
    color: 'blue',
  },
  {
    label: 'Pedidos',
    description: 'Ver e processar pedidos',
    icon: ShoppingCart,
    href: `${SHOPIFY_ADMIN_URL}/orders`,
    color: 'emerald',
  },
  {
    label: 'Clientes',
    description: 'Base de clientes',
    icon: Users,
    href: `${SHOPIFY_ADMIN_URL}/customers`,
    color: 'purple',
  },
  {
    label: 'Descontos',
    description: 'Cupons e promoções',
    icon: Tag,
    href: `${SHOPIFY_ADMIN_URL}/discounts`,
    color: 'amber',
  },
  {
    label: 'Frete',
    description: 'Configurar entregas',
    icon: Truck,
    href: `${SHOPIFY_ADMIN_URL}/settings/shipping`,
    color: 'red',
  },
  {
    label: 'Pagamentos',
    description: 'Métodos de pagamento',
    icon: CreditCard,
    href: `${SHOPIFY_ADMIN_URL}/settings/payments`,
    color: 'teal',
  },
  {
    label: 'Assinaturas',
    description: 'Gerenciar recorrência',
    icon: RefreshCw,
    href: `${SHOPIFY_ADMIN_URL}/apps`,
    color: 'pink',
  },
  {
    label: 'Configurações',
    description: 'Configurações da loja',
    icon: Settings,
    href: `${SHOPIFY_ADMIN_URL}/settings`,
    color: 'neutral',
  },
]

export function ShopifyQuickLinks() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Gerenciar no Shopify
          </h2>
          <p className="text-sm text-neutral-500">
            Acesso rápido ao painel administrativo
          </p>
        </div>
        <a
          href={SHOPIFY_ADMIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#96BF48' }}
        >
          Abrir Shopify
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_LINKS.map((link, index) => {
          const colors = COLOR_CLASSES[link.color] || COLOR_CLASSES.neutral
          const Icon = link.icon
          return (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group flex flex-col items-center p-4 rounded-xl border-2 border-transparent hover:border-neutral-300 transition-all ${colors.bg}`}
            >
              <div className={`p-3 rounded-xl ${colors.iconBg} mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${colors.icon}`} />
              </div>
              <span className="font-medium text-neutral-900 text-sm">{link.label}</span>
              <span className="text-xs text-neutral-500 text-center mt-1">
                {link.description}
              </span>
            </motion.a>
          )
        })}
      </div>
    </div>
  )
}
