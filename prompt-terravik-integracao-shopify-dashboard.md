# INTEGRAÇÃO DASHBOARD TERRAVIK + SHOPIFY
## Atalhos e Sincronização

---

# ESTRATÉGIA HÍBRIDA

## Princípio Central

> **Shopify = Operações de E-commerce**
> **Supabase/Dashboard = Funcionalidades Exclusivas + Métricas**

Não recriar o que o Shopify já faz bem. Apenas complementar e sincronizar.

---

# COMPONENTE: ATALHOS SHOPIFY NO DASHBOARD

Adicionar uma seção no Dashboard Admin com links diretos para o Shopify Admin:

```tsx
// src/components/admin/ShopifyQuickLinks.tsx

'use client';

import { motion } from 'framer-motion';
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
} from 'lucide-react';

const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_URL = `https://${SHOPIFY_STORE?.replace('.myshopify.com', '')}.myshopify.com/admin`;

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
    href: `${SHOPIFY_ADMIN_URL}/apps`, // Vai para apps de assinatura
    color: 'pink',
  },
  {
    label: 'Configurações',
    description: 'Configurações da loja',
    icon: Settings,
    href: `${SHOPIFY_ADMIN_URL}/settings`,
    color: 'neutral',
  },
];

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
          className="flex items-center gap-2 px-4 py-2 bg-[#96BF48] text-white rounded-lg text-sm font-medium hover:bg-[#7BA03D] transition-colors"
        >
          Abrir Shopify
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_LINKS.map((link, index) => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              group flex flex-col items-center p-4 rounded-xl border-2 border-transparent
              bg-${link.color}-50 hover:border-${link.color}-200 transition-all
            `}
          >
            <div className={`p-3 rounded-xl bg-${link.color}-100 mb-3 group-hover:scale-110 transition-transform`}>
              <link.icon className={`w-5 h-5 text-${link.color}-600`} />
            </div>
            <span className="font-medium text-neutral-900 text-sm">{link.label}</span>
            <span className="text-xs text-neutral-500 text-center mt-1">
              {link.description}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
```

---

# INTEGRAR NO DASHBOARD ADMIN

```tsx
// src/app/admin/page.tsx

// Adicionar import
import { ShopifyQuickLinks } from '@/components/admin/ShopifyQuickLinks';

// No JSX, após os stats cards:
export default function AdminDashboardPage() {
  // ... código existente ...

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* ... */}

      {/* Stats Grid */}
      {/* ... */}

      {/* NOVO: Atalhos Shopify */}
      <ShopifyQuickLinks />

      {/* Charts */}
      {/* ... */}

      {/* Recent Activity */}
      {/* ... */}
    </div>
  );
}
```

---

# WEBHOOKS: O QUE SINCRONIZAR DO SHOPIFY

## Configurar Webhooks no Shopify Admin

1. Acesse: Shopify Admin > Settings > Notifications > Webhooks
2. Adicione os seguintes webhooks apontando para sua API:

| Evento | URL | O que faz |
|--------|-----|-----------|
| `orders/create` | `https://seusite.com/api/webhooks/shopify` | Copia pedido para Supabase |
| `orders/updated` | `https://seusite.com/api/webhooks/shopify` | Atualiza status |
| `customers/create` | `https://seusite.com/api/webhooks/shopify` | Vincula com profile |
| `customers/update` | `https://seusite.com/api/webhooks/shopify` | Atualiza dados |

---

# COMPONENTE: STATUS DE SINCRONIZAÇÃO

```tsx
// src/components/admin/SyncStatus.tsx

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react';

interface SyncStatusProps {
  lastSyncOrders?: string;
  lastSyncCustomers?: string;
}

export function SyncStatus({ lastSyncOrders, lastSyncCustomers }: SyncStatusProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<'success' | 'error' | null>(null);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      // Sync pedidos
      const ordersRes = await fetch('/api/sync/orders', { method: 'POST' });
      
      // Sync clientes
      const customersRes = await fetch('/api/sync/customers', { method: 'POST' });

      if (ordersRes.ok && customersRes.ok) {
        setSyncResult('success');
      } else {
        setSyncResult('error');
      }
    } catch (error) {
      setSyncResult('error');
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-neutral-900">
          Sincronização Shopify
        </h3>
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors"
        >
          {isSyncing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
        </button>
      </div>

      {/* Feedback */}
      {syncResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            syncResult === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {syncResult === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Sincronização concluída com sucesso!
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5" />
              Erro na sincronização. Tente novamente.
            </>
          )}
        </motion.div>
      )}

      {/* Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
            <Clock className="w-4 h-4" />
            Última sync pedidos
          </div>
          <p className="font-medium text-neutral-900">
            {formatLastSync(lastSyncOrders)}
          </p>
        </div>
        <div className="p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
            <Clock className="w-4 h-4" />
            Última sync clientes
          </div>
          <p className="font-medium text-neutral-900">
            {formatLastSync(lastSyncCustomers)}
          </p>
        </div>
      </div>

      {/* Info */}
      <p className="mt-4 text-xs text-neutral-500">
        💡 Os dados são sincronizados automaticamente via webhooks. 
        Use o botão acima apenas para sincronização manual.
      </p>
    </div>
  );
}
```

---

# PÁGINA DE CONFIGURAÇÕES: INTEGRAÇÕES

```tsx
// src/app/admin/configuracoes/page.tsx

'use client';

import { useState } from 'react';
import {
  Settings,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { SyncStatus } from '@/components/admin/SyncStatus';

export default function AdminSettingsPage() {
  const [integrations, setIntegrations] = useState({
    shopify: { connected: true, store: 'terravik.myshopify.com' },
    tiny: { connected: true, lastSync: '2025-02-19T10:30:00' },
    correios: { connected: true },
    supabase: { connected: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Configurações</h1>
        <p className="text-neutral-500">Integrações e preferências do sistema</p>
      </div>

      {/* Status das Integrações */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6">
          Integrações
        </h2>

        <div className="space-y-4">
          {/* Shopify */}
          <IntegrationCard
            name="Shopify"
            description="E-commerce, pedidos e pagamentos"
            logo="/icons/shopify.svg"
            connected={integrations.shopify.connected}
            details={integrations.shopify.store}
            manageUrl="https://terravik.myshopify.com/admin"
          />

          {/* Tiny ERP */}
          <IntegrationCard
            name="Tiny ERP"
            description="Gestão de produtos e estoque"
            logo="/icons/tiny.svg"
            connected={integrations.tiny.connected}
            details="Sincronizado via Shopify"
          />

          {/* Supabase */}
          <IntegrationCard
            name="Supabase"
            description="Banco de dados e autenticação"
            logo="/icons/supabase.svg"
            connected={integrations.supabase.connected}
            details="Projeto Terravik"
          />

          {/* Correios/Frete */}
          <IntegrationCard
            name="Frete (Correios)"
            description="Cálculo de frete e rastreamento"
            logo="/icons/correios.svg"
            connected={integrations.correios.connected}
            details="Configurado via Shopify"
            manageUrl="https://terravik.myshopify.com/admin/settings/shipping"
          />
        </div>
      </div>

      {/* Sync Status */}
      <SyncStatus />

      {/* Webhooks Info */}
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
            href="https://terravik.myshopify.com/admin/settings/notifications"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline"
          >
            Shopify Admin → Configurações → Notificações
          </a>
        </p>
      </div>
    </div>
  );
}

function IntegrationCard({
  name,
  description,
  logo,
  connected,
  details,
  manageUrl,
}: {
  name: string;
  description: string;
  logo: string;
  connected: boolean;
  details?: string;
  manageUrl?: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
          <img src={logo} alt={name} className="w-8 h-8" />
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
  );
}
```

---

# RESUMO DA ESTRATÉGIA

## O que você gerencia NO SHOPIFY:

| Item | Como Acessar | Observação |
|------|--------------|------------|
| Produtos | Shopify Admin > Produtos | Sync automático com Tiny |
| Estoque | Shopify Admin > Produtos | Sync automático com Tiny |
| Pedidos | Shopify Admin > Pedidos | Cópia vai para Supabase |
| Clientes | Shopify Admin > Clientes | Vinculado com profiles |
| Cupons | Shopify Admin > Descontos | - |
| Frete | Shopify Admin > Configurações > Frete | Usar app como Melhor Envio |
| Pagamentos | Shopify Admin > Configurações > Pagamentos | - |
| Assinaturas | Shopify Admin > Apps | Usar app como Seal Subscriptions |

## O que você gerencia NO DASHBOARD TERRAVIK:

| Item | Rota | Observação |
|------|------|------------|
| Cursos | /admin/cursos | 100% no Supabase |
| Lições | /admin/cursos/[id]/licoes | 100% no Supabase |
| Lojas | /admin/lojas | 100% no Supabase |
| Métricas | /admin/metricas | Dados do Shopify + Supabase |
| Clientes (detalhes) | /admin/clientes | Visualização unificada |
| Conquistas | /admin/configuracoes | Gerenciar achievements |

## Fluxo de Dados:

```
TINY ERP ──sync──► SHOPIFY ──webhook──► SUPABASE ──► DASHBOARD
                      │
                      └──► SITE TERRAVIK (produtos, checkout)
```

---

# APPS RECOMENDADOS PARA SHOPIFY

Para completar a estrutura híbrida:

| Funcionalidade | App Recomendado | Preço |
|----------------|-----------------|-------|
| **Frete Brasil** | Melhor Envio / Frete Rápido | Grátis/Pago |
| **Assinaturas** | Seal Subscriptions / Bold | Pago |
| **ERP Sync** | Tiny ERP (oficial) | Pago |
| **Reviews** | Judge.me | Grátis/Pago |
| **Email Marketing** | Klaviyo | Grátis/Pago |

---

# PRÓXIMOS PASSOS

1. ✅ Configurar webhooks no Shopify
2. ✅ Adicionar ShopifyQuickLinks no dashboard
3. ✅ Criar página de Configurações/Integrações
4. ✅ Testar sincronização de pedidos
5. ✅ Instalar app de assinaturas no Shopify
