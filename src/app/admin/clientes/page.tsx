'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users,
  Search,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Star,
  TrendingUp,
  Crown,
  RefreshCw,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  neutral: { bg: 'bg-neutral-100', text: 'text-neutral-600' },
}

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  amber: { bg: 'bg-amber-100', text: 'text-amber-700' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
  neutral: { bg: 'bg-neutral-100', text: 'text-neutral-700' },
}

interface Customer {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  shopify_customer_id: string | null
  xp_total: number | null
  level: number | null
  streak_days: number | null
  created_at: string | null
  orders_count?: number
  total_spent?: number
  has_subscription?: boolean
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'subscribers' | 'active'>('all')
  const [stats, setStats] = useState({
    total: 0,
    newThisMonth: 0,
    subscribers: 0,
    avgLevel: 0,
  })

  const loadCustomers = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { data: profilesData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'customer')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao carregar clientes:', error)
      setIsLoading(false)
      return
    }

    const profileIds = (profilesData || []).map((p) => p.id)

    if (profileIds.length === 0) {
      setCustomers([])
      setStats({ total: 0, newThisMonth: 0, subscribers: 0, avgLevel: 0 })
      setIsLoading(false)
      return
    }

    const [ordersRes, subsRes] = await Promise.all([
      supabase.from('orders_sync').select('user_id, total_price').in('user_id', profileIds),
      supabase.from('subscriptions').select('user_id').eq('status', 'active').in('user_id', profileIds),
    ])

    const ordersByUser: Record<string, { count: number; total: number }> = {}
    for (const o of ordersRes.data || []) {
      if (!o.user_id) continue
      if (!ordersByUser[o.user_id]) ordersByUser[o.user_id] = { count: 0, total: 0 }
      ordersByUser[o.user_id].count++
      ordersByUser[o.user_id].total += o.total_price || 0
    }

    const subsByUser = new Set((subsRes.data || []).map((s) => s.user_id))

    const customersWithStats = (profilesData || []).map((profile) => {
      const ord = ordersByUser[profile.id] || { count: 0, total: 0 }
      return {
        ...profile,
        level: profile.level ?? 1,
        orders_count: ord.count,
        total_spent: ord.total,
        has_subscription: subsByUser.has(profile.id),
      }
    })

    let filtered = customersWithStats
    if (filter === 'subscribers') filtered = filtered.filter((c) => c.has_subscription)
    else if (filter === 'active') filtered = filtered.filter((c) => c.orders_count > 0)

    setCustomers(filtered)

    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    setStats({
      total: profilesData?.length || 0,
      newThisMonth: profilesData?.filter((c) => new Date(c.created_at || 0) >= thisMonth).length || 0,
      subscribers: customersWithStats.filter((c) => c.has_subscription).length,
      avgLevel:
        customersWithStats.length > 0
          ? Math.round(
              customersWithStats.reduce((sum, c) => sum + (c.level ?? 1), 0) / customersWithStats.length
            )
          : 0,
    })

    setIsLoading(false)
  }, [filter])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  const filteredCustomers = customers.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (date: string | null) => {
    return date ? new Date(date).toLocaleDateString('pt-BR') : '-'
  }

  const getLevelBadge = (level: number) => {
    if (level >= 8) return { color: 'amber', icon: Crown, label: 'VIP' }
    if (level >= 5) return { color: 'purple', icon: Star, label: 'Gold' }
    if (level >= 3) return { color: 'blue', icon: TrendingUp, label: 'Silver' }
    return { color: 'neutral', icon: Users, label: 'Bronze' }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Clientes</h1>
          <p className="text-neutral-500">{stats.total} clientes cadastrados</p>
        </div>
        <button
          onClick={loadCustomers}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total de Clientes" value={stats.total} icon={Users} color="blue" />
        <StatCard label="Novos este Mês" value={stats.newThisMonth} icon={Calendar} color="emerald" />
        <StatCard label="Assinantes Ativos" value={stats.subscribers} icon={RefreshCw} color="purple" />
        <StatCard label="Nível Médio" value={stats.avgLevel} icon={Star} color="amber" />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'subscribers', label: 'Assinantes' },
            { key: 'active', label: 'Com Pedidos' },
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
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-neutral-500">Carregando clientes...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">
              {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado ainda'}
            </p>
            <p className="text-sm text-neutral-400 mt-2">
              Os clientes aparecerão aqui após se cadastrarem ou fazerem pedidos
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredCustomers.map((customer, index) => {
              const badge = getLevelBadge(customer.level ?? 1)
              const badgeColors = BADGE_COLORS[badge.color] || BADGE_COLORS.neutral

              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/admin/clientes/${customer.id}`}
                    className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-700 font-semibold text-lg">
                          {customer.full_name?.charAt(0) || customer.email.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-neutral-900">
                            {customer.full_name || 'Sem nome'}
                          </h3>
                          {customer.has_subscription && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" />
                              Assinante
                            </span>
                          )}
                          <span className={`px-2 py-0.5 ${badgeColors.bg} ${badgeColors.text} text-xs font-medium rounded-full`}>
                            Nv. {customer.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {customer.email}
                          </span>
                          {customer.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {customer.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Pedidos</p>
                        <p className="font-semibold text-neutral-900">{customer.orders_count}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Total Gasto</p>
                        <p className="font-semibold text-neutral-900">
                          {formatCurrency(customer.total_spent || 0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Cadastro</p>
                        <p className="font-medium text-neutral-700">
                          {formatDate(customer.created_at)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
}) {
  const colors = COLOR_MAP[color] || COLOR_MAP.neutral

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className={`inline-flex p-2 rounded-lg ${colors.bg} mb-2`}>
        <Icon className={`w-5 h-5 ${colors.text}`} />
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  )
}
