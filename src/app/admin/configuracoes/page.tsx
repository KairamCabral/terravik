'use client'

import { useState } from 'react'
import {
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShoppingBag,
  Database,
  Truck,
  Package,
} from 'lucide-react'
import { SyncStatus } from '@/components/admin/SyncStatus'

const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'terravik.myshopify.com'
const SHOPIFY_ADMIN_URL = `https://${SHOPIFY_STORE}/admin`
const SHOPIFY_NOTIFICATIONS_URL = `https://${SHOPIFY_STORE}/admin/settings/notifications`

export default function AdminSettingsPage() {
  const [integrations] = useState({
    shopify: { connected: true, store: SHOPIFY_STORE },
    tiny: { connected: true, lastSync: '2025-02-19T10:30:00' },
    correios: { connected: true },
    supabase: { connected: true },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Configurações</h1>
        <p className="text-neutral-500">Integrações e preferências do sistema</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6">
          Integrações
        </h2>

        <div className="space-y-4">
          <IntegrationCard
            name="Shopify"
            description="E-commerce, pedidos e pagamentos"
            icon={ShoppingBag}
            connected={integrations.shopify.connected}
            details={integrations.shopify.store}
            manageUrl={SHOPIFY_ADMIN_URL}
          />

          <IntegrationCard
            name="Tiny ERP"
            description="Gestão de produtos e estoque"
            icon={Package}
            connected={integrations.tiny.connected}
            details="Sincronizado via Shopify"
          />

          <IntegrationCard
            name="Supabase"
            description="Banco de dados e autenticação"
            icon={Database}
            connected={integrations.supabase.connected}
            details="Projeto Terravik"
          />

          <IntegrationCard
            name="Frete (Correios)"
            description="Cálculo de frete e rastreamento"
            icon={Truck}
            connected={integrations.correios.connected}
            details="Configurado via Shopify"
            manageUrl={`${SHOPIFY_ADMIN_URL}/settings/shipping`}
          />
        </div>
      </div>

      <SyncStatus />

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Webhooks Configurados
        </h2>

        <div className="space-y-3">
          {[
            { event: 'orders/create', status: 'active' },
            { event: 'orders/updated', status: 'active' },
            { event: 'customers/create', status: 'active' },
            { event: 'customers/update', status: 'active' },
          ].map((webhook) => (
            <div
              key={webhook.event}
              className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <code className="text-sm text-neutral-700">{webhook.event}</code>
              </div>
              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                Ativo
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-neutral-500">
          Configure webhooks em:{' '}
          <a
            href={SHOPIFY_NOTIFICATIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline"
          >
            Shopify Admin → Configurações → Notificações
          </a>
        </p>
      </div>
    </div>
  )
}

function IntegrationCard({
  name,
  description,
  icon: Icon,
  connected,
  details,
  manageUrl,
}: {
  name: string
  description: string
  icon: React.ElementType
  connected: boolean
  details?: string
  manageUrl?: string
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-neutral-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-neutral-900">{name}</h3>
            {connected ? (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <p className="text-sm text-neutral-500">{description}</p>
          {details && (
            <p className="text-xs text-neutral-400 mt-1">{details}</p>
          )}
        </div>
      </div>

      {manageUrl && (
        <a
          href={manageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          Gerenciar
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  )
}
