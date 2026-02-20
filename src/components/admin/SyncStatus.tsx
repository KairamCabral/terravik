'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

interface SyncStatusProps {
  lastSyncOrders?: string
  lastSyncCustomers?: string
}

export function SyncStatus({ lastSyncOrders, lastSyncCustomers }: SyncStatusProps) {
  const { session } = useAuth()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<'success' | 'error' | null>(null)
  const [localLastSyncOrders, setLocalLastSyncOrders] = useState<string | undefined>(lastSyncOrders)
  const [localLastSyncCustomers, setLocalLastSyncCustomers] = useState<string | undefined>(lastSyncCustomers)

  const handleManualSync = async () => {
    if (!session?.access_token) {
      setSyncResult('error')
      return
    }

    setIsSyncing(true)
    setSyncResult(null)

    const headers = {
      Authorization: `Bearer ${session.access_token}`,
    }

    try {
      const ordersRes = await fetch('/api/sync/orders', { method: 'POST', headers })
      const customersRes = await fetch('/api/sync/customers', { method: 'POST', headers })

      if (ordersRes.ok && customersRes.ok) {
        const now = new Date().toISOString()
        setLocalLastSyncOrders(now)
        setLocalLastSyncCustomers(now)
        setSyncResult('success')
      } else {
        setSyncResult('error')
      }
    } catch {
      setSyncResult('error')
    } finally {
      setIsSyncing(false)
    }
  }

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return 'Nunca'
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-neutral-900">
          Sincronização Shopify
        </h3>
        <button
          onClick={handleManualSync}
          disabled={isSyncing || !session}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSyncing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
        </button>
      </div>

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
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              Sincronização concluída com sucesso!
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              Erro na sincronização. Tente novamente.
            </>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
            <Clock className="w-4 h-4" />
            Última sync pedidos
          </div>
          <p className="font-medium text-neutral-900">
            {formatLastSync(localLastSyncOrders)}
          </p>
        </div>
        <div className="p-4 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
            <Clock className="w-4 h-4" />
            Última sync clientes
          </div>
          <p className="font-medium text-neutral-900">
            {formatLastSync(localLastSyncCustomers)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        Os dados são sincronizados automaticamente via webhooks. Use o botão acima apenas para sincronização manual.
      </p>
    </div>
  )
}
