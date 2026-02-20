'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  RefreshCw,
  GraduationCap,
  Calculator,
  ArrowRight,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'

const MetricsCharts = dynamic(
  () => import('@/components/admin/MetricsCharts'),
  { ssr: false }
)

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
  neutral: { bg: 'bg-neutral-100', text: 'text-neutral-600' },
}

const FUNNEL_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']

export default function AdminMetricsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  const [metrics, setMetrics] = useState({
    revenue: { value: 0, change: 0 },
    orders: { value: 0, change: 0 },
    customers: { value: 0, change: 0 },
    subscriptions: { value: 0, change: 0 },
    calculatorUses: { value: 0, change: 0 },
    courseCompletions: { value: 0, change: 0 },
  })

  const [revenueChart, setRevenueChart] = useState<{ date: string; revenue: number; orders: number }[]>([])
  const [ordersChart, setOrdersChart] = useState<{ date: string; revenue: number; orders: number }[]>([])
  const [conversionFunnel, setConversionFunnel] = useState<
    { name: string; value: number }[]
  >([])

  const loadMetrics = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startIso = startDate.toISOString()

    const [ordersRes, customersRes, subsRes, calcRes, progressRes] = await Promise.all([
      supabase
        .from('orders_sync')
        .select('total_price, shopify_created_at')
        .gte('shopify_created_at', startIso),
      supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('role', 'customer')
        .gte('created_at', startIso),
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact' })
        .eq('status', 'active'),
      supabase
        .from('calculator_logs')
        .select('id', { count: 'exact' })
        .gte('created_at', startIso),
      supabase
        .from('user_progress')
        .select('id', { count: 'exact' })
        .not('completed_at', 'is', null)
        .gte('completed_at', startIso),
    ])

    const orders = ordersRes.data || []
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0)
    const totalOrders = orders.length
    const customersCount = customersRes.count ?? 0
    const subsCount = subsRes.count ?? 0
    const calcCount = calcRes.count ?? 0
    const courseCount = progressRes.count ?? 0

    setMetrics({
      revenue: { value: totalRevenue, change: 12.5 },
      orders: { value: totalOrders, change: 8.2 },
      customers: { value: customersCount, change: 15.3 },
      subscriptions: { value: subsCount, change: 22.1 },
      calculatorUses: { value: calcCount, change: 5.4 },
      courseCompletions: { value: courseCount, change: 18.7 },
    })

    const chartData = generateChartData(days, orders)
    setRevenueChart(chartData)
    setOrdersChart(chartData)

    const cartEstimate = Math.round(calcCount * 0.6)
    setConversionFunnel([
      { name: 'Visitantes', value: 1000 },
      { name: 'Usou Calculadora', value: calcCount },
      { name: 'Adicionou ao Carrinho', value: cartEstimate },
      { name: 'Finalizou Compra', value: totalOrders },
      { name: 'Assinou', value: subsCount },
    ])

    setIsLoading(false)
  }, [period])

  useEffect(() => {
    loadMetrics()
  }, [loadMetrics])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Métricas</h1>
          <p className="text-neutral-500">Acompanhe o desempenho do seu negócio</p>
        </div>

        <div className="flex gap-2">
          {[
            { key: '7d', label: '7 dias' },
            { key: '30d', label: '30 dias' },
            { key: '90d', label: '90 dias' },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key as typeof period)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                period === p.key
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Receita"
          value={formatCurrency(metrics.revenue.value)}
          change={metrics.revenue.change}
          icon={DollarSign}
          color="emerald"
        />
        <MetricCard
          label="Pedidos"
          value={metrics.orders.value}
          change={metrics.orders.change}
          icon={ShoppingCart}
          color="blue"
        />
        <MetricCard
          label="Novos Clientes"
          value={metrics.customers.value}
          change={metrics.customers.change}
          icon={Users}
          color="purple"
        />
        <MetricCard
          label="Assinaturas"
          value={metrics.subscriptions.value}
          change={metrics.subscriptions.change}
          icon={RefreshCw}
          color="amber"
        />
        <MetricCard
          label="Calculadora"
          value={metrics.calculatorUses.value}
          change={metrics.calculatorUses.change}
          icon={Calculator}
          color="teal"
        />
        <MetricCard
          label="Lições Completas"
          value={metrics.courseCompletions.value}
          change={metrics.courseCompletions.change}
          icon={GraduationCap}
          color="pink"
        />
      </div>

      <MetricsCharts revenueChart={revenueChart} ordersChart={ordersChart} />

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Funil de Conversão
        </h2>
        <div className="flex items-center justify-between flex-wrap gap-4">
          {conversionFunnel.map((step, index) => (
            <div key={step.name} className="flex items-center">
              <div className="text-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: `${FUNNEL_COLORS[index]}20` }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: FUNNEL_COLORS[index] }}
                  >
                    {step.value}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">{step.name}</p>
                {index > 0 && (
                  <p className="text-xs text-neutral-400 mt-1">
                    {(() => {
                      const prevValue = conversionFunnel[index - 1].value
                      if (prevValue === 0) return '0%'
                      return `${((step.value / prevValue) * 100).toFixed(1)}%`
                    })()}
                  </p>
                )}
              </div>
              {index < conversionFunnel.length - 1 && (
                <ArrowRight className="w-6 h-6 text-neutral-300 mx-4 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function generateChartData(
  days: number,
  orders: { total_price?: number | null; shopify_created_at?: string | null }[]
): { date: string; revenue: number; orders: number }[] {
  const byDate: Record<string, { revenue: number; orders: number }> = {}

  for (let i = days; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    byDate[key] = { revenue: 0, orders: 0 }
  }

  for (const o of orders) {
    const dateStr = o.shopify_created_at
      ? new Date(o.shopify_created_at).toISOString().slice(0, 10)
      : null
    if (dateStr && byDate[dateStr]) {
      byDate[dateStr].revenue += o.total_price || 0
      byDate[dateStr].orders += 1
    }
  }

  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      revenue: data.revenue,
      orders: data.orders,
    }))
}

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  change: number
  icon: React.ElementType
  color: string
}) {
  const isPositive = change >= 0
  const colors = COLOR_MAP[color] || COLOR_MAP.neutral

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-neutral-200 p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`w-4 h-4 ${colors.text}`} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs ${
            isPositive ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-xl font-bold text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </motion.div>
  )
}
