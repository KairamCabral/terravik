'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  RefreshCw,
  Pause,
  Play,
  XCircle,
  ChevronRight,
  Clock,
  DollarSign,
  AlertCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
  neutral: { bg: 'bg-neutral-100', text: 'text-neutral-600' },
}

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  paused: { bg: 'bg-amber-100', text: 'text-amber-700' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
  pending: { bg: 'bg-neutral-100', text: 'text-neutral-700' },
}

interface Subscription {
  id: string
  user_id: string
  status: 'active' | 'paused' | 'cancelled' | 'pending' | null
  frequency_days: number
  products: { title?: string; quantity?: number; subscriptionPrice?: number; price?: number }[]
  next_delivery_date: string | null
  delivery_count: number
  created_at: string
  started_at: string | null
  profiles?: { full_name: string | null; email: string } | null
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    paused: 0,
    mrr: 0,
  })

  const loadSubscriptions = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('subscriptions')
      .select(
        `
        *,
        profiles!subscriptions_user_id_fkey(full_name, email)
      `
      )
      .order('created_at', { ascending: false })

    let subsData: Subscription[] = []

    if (error) {
      console.error('Erro ao carregar assinaturas (join):', error)
      const { data: fallbackData } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false })
      subsData = (fallbackData || []) as Subscription[]
      const userIds = [...new Set(subsData.map((s) => s.user_id))]
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds)
        const profilesMap = new Map(
          (profilesData || []).map((p) => [p.id, { full_name: p.full_name, email: p.email }])
        )
        subsData = subsData.map((s) => ({
          ...s,
          profiles: profilesMap.get(s.user_id) || null,
        }))
      }
    } else {
      subsData = (data || []) as Subscription[]
    }

    const filteredSubs = filter === 'all' ? subsData : subsData.filter((s) => s.status === filter)
    setSubscriptions(filteredSubs)

    const allSubs = subsData
    const activeSubs = allSubs.filter((s) => s.status === 'active')

    const mrr = activeSubs.reduce((sum, sub) => {
      const monthlyValue =
        sub.products?.reduce((pSum: number, p) => {
          const price = p.subscriptionPrice ?? p.price ?? 0
          const qty = p.quantity ?? 1
          const deliveriesPerMonth = 30 / (sub.frequency_days || 30)
          return pSum + price * qty * deliveriesPerMonth
        }, 0) ?? 0
      return sum + monthlyValue
    }, 0)

    setStats({
      total: allSubs.length,
      active: activeSubs.length,
      paused: allSubs.filter((s) => s.status === 'paused').length,
      mrr,
    })

    setIsLoading(false)
  }, [filter])

  useEffect(() => {
    loadSubscriptions()
  }, [loadSubscriptions])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString('pt-BR') : '-'

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return { color: 'emerald', label: 'Ativa', icon: Play }
      case 'paused':
        return { color: 'amber', label: 'Pausada', icon: Pause }
      case 'cancelled':
        return { color: 'red', label: 'Cancelada', icon: XCircle }
      default:
        return { color: 'neutral', label: 'Pendente', icon: Clock }
    }
  }

  const getFrequencyLabel = (days: number) => {
    if (days === 30) return 'Mensal'
    if (days === 45) return 'A cada 45 dias'
    if (days === 60) return 'Bimestral'
    if (days === 90) return 'Trimestral'
    return `A cada ${days} dias`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Assinaturas</h1>
          <p className="text-neutral-500">Gerencie as assinaturas recorrentes</p>
        </div>
        <button
          onClick={loadSubscriptions}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total de Assinaturas" value={stats.total} icon={RefreshCw} color="blue" />
        <StatCard label="Assinaturas Ativas" value={stats.active} icon={Play} color="emerald" />
        <StatCard label="Assinaturas Pausadas" value={stats.paused} icon={Pause} color="amber" />
        <StatCard
          label="MRR (Receita Mensal)"
          value={formatCurrency(stats.mrr)}
          icon={DollarSign}
          color="purple"
          isText
        />
      </div>

      <div className="flex gap-2">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'active', label: 'Ativas' },
          { key: 'paused', label: 'Pausadas' },
          { key: 'cancelled', label: 'Canceladas' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-neutral-500">Carregando assinaturas...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">Nenhuma assinatura encontrada</p>
            <p className="text-sm text-neutral-400 mt-2">
              As assinaturas aparecerão aqui quando clientes assinarem
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {subscriptions.map((sub, index) => {
              const status = getStatusBadge(sub.status)
              const StatusIcon = status.icon
              const statusColors = STATUS_BADGE[sub.status ?? 'pending'] || STATUS_BADGE.pending
              const iconColors = COLOR_MAP[status.color] || COLOR_MAP.neutral
              const user = sub.profiles

              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColors.bg}`}
                      >
                        <StatusIcon className={`w-6 h-6 ${iconColors.text}`} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-neutral-900">
                            {user?.full_name || user?.email || 'Cliente'}
                          </h3>
                          <span
                            className={`px-2 py-0.5 ${statusColors.bg} ${statusColors.text} text-xs font-medium rounded-full`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">
                          {getFrequencyLabel(sub.frequency_days)} •{' '}
                          {sub.products?.length || 0} produto(s)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Entregas</p>
                        <p className="font-semibold text-neutral-900">{sub.delivery_count}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Próxima Entrega</p>
                        <p className="font-medium text-neutral-700">
                          {formatDate(sub.next_delivery_date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Desde</p>
                        <p className="font-medium text-neutral-700">
                          {formatDate(sub.started_at || sub.created_at)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </div>
                  </div>

                  {sub.products && sub.products.length > 0 && (
                    <div className="mt-3 ml-16 flex flex-wrap gap-2">
                      {sub.products.map((product, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600"
                        >
                          {product.title || 'Produto'} x{product.quantity ?? 1}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">Gerenciamento de Assinaturas</p>
          <p className="text-sm text-amber-700 mt-1">
            Para pausar, cancelar ou modificar assinaturas, acesse o painel do Shopify ou o app de
            assinaturas configurado.
          </p>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  isText = false,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  isText?: boolean
}) {
  const colors = COLOR_MAP[color] || COLOR_MAP.neutral

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className={`inline-flex p-2 rounded-lg ${colors.bg} mb-2`}>
        <Icon className={`w-5 h-5 ${colors.text}`} />
      </div>
      <p className={`${isText ? 'text-xl' : 'text-2xl'} font-bold text-neutral-900`}>{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  )
}
