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
  ArrowRight,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import {
  agruparPorDia,
  dentroDe,
  formatarVariacao,
  janelas,
  somarReceita,
  temVariacao,
  variacao,
  type PontoDiario,
} from '@/lib/admin/metricas'

const MetricsCharts = dynamic(
  () => import('@/components/admin/MetricsCharts'),
  { ssr: false }
)

type Periodo = '7d' | '30d' | '90d'

const DIAS_POR_PERIODO: Record<Periodo, number> = { '7d': 7, '30d': 30, '90d': 90 }

/** `change` undefined: não há base de comparação, e o cartão fica sem selo. */
interface Metrica {
  value: number
  change?: number
}

/**
 * O cartão "Calculadora" e a etapa "Usou Calculadora" do funil saíram desta
 * página. Os dois liam `calculator_logs`, tabela que existe no banco mas em que
 * nenhum código do site insere: o número seria zero para sempre. Para voltarem,
 * a calculadora de gramado precisa gravar um registro ao entregar o resultado.
 */
export default function AdminMetricsPage() {
  const [, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<Periodo>('30d')

  const [metrics, setMetrics] = useState<{
    revenue: Metrica
    orders: Metrica
    customers: Metrica
    subscriptions: Metrica
    courseCompletions: Metrica
  }>({
    revenue: { value: 0 },
    orders: { value: 0 },
    customers: { value: 0 },
    subscriptions: { value: 0 },
    courseCompletions: { value: 0 },
  })

  const [chartData, setChartData] = useState<PontoDiario[]>([])
  const [conversionFunnel, setConversionFunnel] = useState<
    { name: string; value: number }[]
  >([])

  const loadMetrics = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    const days = DIAS_POR_PERIODO[period]
    const agora = new Date()
    // Janela atual e a anterior, do mesmo tamanho, para a variação.
    const { inicioAtual, inicioAnterior } = janelas(agora, days)
    const startIso = inicioAtual.toISOString()
    const previousIso = inicioAnterior.toISOString()

    const contarClientes = () =>
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'customer')
    const contarLicoes = () =>
      supabase
        .from('user_progress')
        .select('id', { count: 'exact', head: true })
        .not('completed_at', 'is', null)

    const [
      ordersRes,
      customersRes,
      customersPrevRes,
      subsRes,
      newSubsRes,
      progressRes,
      progressPrevRes,
    ] = await Promise.all([
      // Vem desde o início da janela anterior: os mesmos pedidos alimentam o
      // gráfico, o total do período e a comparação.
      supabase
        .from('orders_sync')
        .select('total_price, shopify_created_at')
        .gte('shopify_created_at', previousIso),
      contarClientes().gte('created_at', startIso),
      contarClientes().gte('created_at', previousIso).lt('created_at', startIso),
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active'),
      supabase
        .from('subscriptions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startIso),
      contarLicoes().gte('completed_at', startIso),
      contarLicoes().gte('completed_at', previousIso).lt('completed_at', startIso),
    ])

    const allOrders = ordersRes.data || []
    const orders = allOrders.filter((o) => dentroDe(o.shopify_created_at, inicioAtual, agora))
    const previousOrders = allOrders.filter((o) =>
      dentroDe(o.shopify_created_at, inicioAnterior, inicioAtual)
    )

    const totalRevenue = somarReceita(orders)
    const totalOrders = orders.length

    // Contagem que falhou (count null) não vira comparação.
    const variacaoDeContagem = (atual: number | null, anterior: number | null) =>
      atual === null || anterior === null ? undefined : variacao(atual, anterior)

    setMetrics({
      revenue: {
        value: totalRevenue,
        change: variacao(totalRevenue, somarReceita(previousOrders)),
      },
      orders: {
        value: totalOrders,
        change: variacao(totalOrders, previousOrders.length),
      },
      customers: {
        value: customersRes.count ?? 0,
        change: variacaoDeContagem(customersRes.count, customersPrevRes.count),
      },
      // Assinaturas ativas é um retrato do agora, não um acumulado do período.
      // O banco não guarda histórico de status, então não há com o que comparar.
      subscriptions: { value: subsRes.count ?? 0 },
      courseCompletions: {
        value: progressRes.count ?? 0,
        change: variacaoDeContagem(progressRes.count, progressPrevRes.count),
      },
    })

    setChartData(agruparPorDia(orders, agora, days))

    // Funil só com etapas medidas no período. "Visitantes" era um número fixo
    // e "Adicionou ao Carrinho" era uma multiplicação: o site não registra
    // sessão nem evento de carrinho no banco, então as duas saíram.
    setConversionFunnel([
      { name: 'Finalizou compra', value: totalOrders },
      { name: 'Assinou', value: newSubsRes.count ?? 0 },
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
              onClick={() => setPeriod(p.key as Periodo)}
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Receita"
          value={formatCurrency(metrics.revenue.value)}
          change={metrics.revenue.change}
          icon={DollarSign}
        />
        <MetricCard
          label="Pedidos"
          value={metrics.orders.value}
          change={metrics.orders.change}
          icon={ShoppingCart}
        />
        <MetricCard
          label="Novos Clientes"
          value={metrics.customers.value}
          change={metrics.customers.change}
          icon={Users}
        />
        <MetricCard
          label="Assinaturas Ativas"
          value={metrics.subscriptions.value}
          icon={RefreshCw}
        />
        <MetricCard
          label="Lições Completas"
          value={metrics.courseCompletions.value}
          change={metrics.courseCompletions.change}
          icon={GraduationCap}
        />
      </div>

      <MetricsCharts revenueChart={chartData} ordersChart={chartData} />

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Funil de Conversão
        </h2>
        <div className="flex items-center justify-start flex-wrap gap-4">
          {conversionFunnel.map((step, index) => {
            const prevValue = index > 0 ? conversionFunnel[index - 1].value : 0
            return (
              <div key={step.name} className="flex items-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-2 bg-neutral-100">
                    <span className="text-2xl font-bold text-neutral-900">
                      {step.value}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{step.name}</p>
                  {/* Taxa só com etapa anterior medida: sem base, não há percentual. */}
                  {index > 0 && prevValue > 0 && (
                    <p className="text-xs text-neutral-500 mt-1">
                      {((step.value / prevValue) * 100).toFixed(1).replace('.', ',')}%
                    </p>
                  )}
                </div>
                {index < conversionFunnel.length - 1 && (
                  <ArrowRight
                    className="w-6 h-6 text-neutral-300 mx-4 flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string
  value: string | number
  /** Variação sobre o período anterior de mesmo tamanho. Sem número, sem selo. */
  change?: number
  icon: React.ElementType
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-neutral-200 p-4"
    >
      <div className="flex items-center justify-between mb-2">
        {/* Ícone neutro: a cor fica reservada para o estado (subiu ou caiu). */}
        <div className="p-2 rounded-lg bg-neutral-100">
          <Icon className="w-4 h-4 text-neutral-600" aria-hidden="true" />
        </div>
        {temVariacao(change) && (
          <div
            className={`flex items-center gap-1 text-xs ${
              change >= 0 ? 'text-emerald-700' : 'text-red-600'
            }`}
            title="Contra o período anterior de mesmo tamanho"
          >
            {change >= 0 ? (
              <TrendingUp className="w-3 h-3" aria-hidden="true" />
            ) : (
              <TrendingDown className="w-3 h-3" aria-hidden="true" />
            )}
            <span className="sr-only">{change >= 0 ? 'Alta de' : 'Queda de'}</span>
            {formatarVariacao(change)}
          </div>
        )}
      </div>
      <p className="text-xl font-bold text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </motion.div>
  )
}
