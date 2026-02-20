'use client'

import { useEffect, useState } from 'react'
import {
  Package,
  GraduationCap,
  Award,
  Loader2,
  ChevronRight,
  Truck,
  Clock,
  CheckCircle2,
  ShoppingBag,
  Calculator,
  Heart,
  Sparkles,
  AlertCircle,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { createClient } from '@/lib/supabase/client'

/**
 * Visão Geral da Conta — Dashboard do Cliente
 * 
 * Apresenta um resumo inteligente e estratégico:
 * - Saudação personalizada por horário
 * - Último pedido com status visual
 * - Compras recentes
 * - Stats rápidos (pedidos, lições, conquistas)
 * - Ações rápidas estratégicas
 * - Dicas contextuais
 */

interface DashboardStats {
  orders: number
  lessonsCompleted: number
  achievements: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  date: string
  total: number
  status: string
  fulfillmentStatus: string | null
  items: Array<{ title: string; quantity: number; price: string }>
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  paid: { label: 'Pago', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
  pending: { label: 'Pendente', color: 'text-amber-600 bg-amber-50', icon: Clock },
  fulfilled: { label: 'Enviado', color: 'text-blue-600 bg-blue-50', icon: Truck },
  delivered: { label: 'Entregue', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'text-red-600 bg-red-50', icon: AlertCircle },
}

const FULFILLMENT_MAP: Record<string, { label: string; color: string; icon: typeof Truck }> = {
  shipped: { label: 'Enviado', color: 'text-blue-600 bg-blue-50', icon: Truck },
  delivered: { label: 'Entregue', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
  in_transit: { label: 'Em trânsito', color: 'text-indigo-600 bg-indigo-50', icon: Truck },
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '-'
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function AccountPageClient() {
  const { user, profile, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({ orders: 0, lessonsCompleted: 0, achievements: 0 })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setIsLoadingData(false)
      return
    }

    const loadDashboard = async () => {
      const supabase = createClient()

      try {
        // Carregar tudo em paralelo com timeout de segurança
        const timeout = new Promise<void>((resolve) => setTimeout(resolve, 5000))

        const dataPromise = Promise.allSettled([
          // Stats: pedidos
          supabase
            .from('orders_sync')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
          // Stats: lições
          supabase
            .from('user_progress')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .not('completed_at', 'is', null),
          // Stats: conquistas
          supabase
            .from('user_achievements')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
          // Pedidos recentes (últimos 5)
          supabase
            .from('orders_sync')
            .select('*')
            .eq('user_id', user.id)
            .order('shopify_created_at', { ascending: false })
            .limit(5),
        ])

        const results = await Promise.race([dataPromise, timeout.then(() => null)])

        if (results && Array.isArray(results)) {
          const [ordersCount, lessonsCount, achievementsCount, ordersData] = results

          setStats({
            orders: ordersCount.status === 'fulfilled' ? (ordersCount.value.count || 0) : 0,
            lessonsCompleted: lessonsCount.status === 'fulfilled' ? (lessonsCount.value.count || 0) : 0,
            achievements: achievementsCount.status === 'fulfilled' ? (achievementsCount.value.count || 0) : 0,
          })

          if (ordersData.status === 'fulfilled' && ordersData.value.data) {
            setRecentOrders(
              ordersData.value.data.map((order: any) => {
                const lineItems = (order.line_items as Array<Record<string, unknown>>) || []
                return {
                  id: order.id,
                  orderNumber: order.shopify_order_number || order.shopify_order_id || '-',
                  date: order.shopify_created_at || order.created_at || '',
                  total: Number(order.total_price) || 0,
                  status: order.status || 'pending',
                  fulfillmentStatus: order.fulfillment_status,
                  items: lineItems.map((item: any) => ({
                    title: String(item.title || 'Produto'),
                    quantity: Number(item.quantity || 1),
                    price: String(item.price || '0'),
                  })),
                }
              })
            )
          }
        }
      } catch (err) {
        console.error('[Dashboard] Erro ao carregar dados:', err)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadDashboard()
  }, [user?.id])

  const userName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário'
  const lastOrder = recentOrders[0] || null

  // Loading state
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-forest animate-spin mb-4" />
        <p className="text-sm text-neutral-500">Carregando sua conta...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ─── Saudação ─────────────────────────────────────── */}
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-neutral-900 mb-1">
          {getGreeting()}, {userName}!
        </h1>
        <p className="text-neutral-500">
          Aqui está o resumo da sua conta Terravik.
        </p>
      </div>

      {/* ─── Stats Rápidos ────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        {[
          { label: 'Pedidos', value: stats.orders, icon: Package, color: 'text-blue-600 bg-blue-50' },
          { label: 'Lições', value: stats.lessonsCompleted, icon: GraduationCap, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Conquistas', value: stats.achievements, icon: Award, color: 'text-amber-600 bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-neutral-100 p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              {isLoadingData ? (
                <div className="h-7 w-8 bg-neutral-100 rounded animate-pulse" />
              ) : (
                <span className="text-2xl font-bold text-neutral-900">{stat.value}</span>
              )}
            </div>
            <p className="text-xs text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Último Pedido (destaque) ─────────────────────── */}
      {isLoadingData ? (
        <div className="bg-white rounded-xl border border-neutral-100 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-40 bg-neutral-100 rounded" />
            <div className="h-16 bg-neutral-50 rounded-lg" />
            <div className="h-4 w-60 bg-neutral-100 rounded" />
          </div>
        </div>
      ) : lastOrder ? (
        <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-50">
            <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Último Pedido
            </h2>
            <Link
              href="/conta/pedidos"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-6">
            {/* Header do pedido */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-lg font-bold text-neutral-900">
                  Pedido #{lastOrder.orderNumber}
                </p>
                <p className="text-sm text-neutral-500">
                  {formatDate(lastOrder.date)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Status do pagamento */}
                {(() => {
                  const status = STATUS_MAP[lastOrder.status] || STATUS_MAP.pending
                  const Icon = status.icon
                  return (
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  )
                })()}
                {/* Status de envio */}
                {lastOrder.fulfillmentStatus && (() => {
                  const fulfillment = FULFILLMENT_MAP[lastOrder.fulfillmentStatus] || {
                    label: lastOrder.fulfillmentStatus,
                    color: 'text-neutral-600 bg-neutral-50',
                    icon: Package,
                  }
                  const Icon = fulfillment.icon
                  return (
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${fulfillment.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {fulfillment.label}
                    </span>
                  )
                })()}
              </div>
            </div>

            {/* Itens do pedido */}
            <div className="bg-neutral-50 rounded-lg p-4 mb-4">
              {lastOrder.items.length > 0 ? (
                <div className="space-y-2">
                  {lastOrder.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-700">
                        {item.quantity}x {item.title}
                      </span>
                      <span className="text-neutral-500 font-medium">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                  {lastOrder.items.length > 3 && (
                    <p className="text-xs text-neutral-400 pt-1">
                      + {lastOrder.items.length - 3} outros itens
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">Detalhes do pedido indisponíveis</p>
              )}
            </div>

            {/* Total + CTA */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-neutral-900">
                Total: {formatCurrency(lastOrder.total)}
              </p>
              <Link
                href="/conta/pedidos"
                className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Detalhes do pedido
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Estado vazio — sem pedidos */
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-neutral-900 mb-1">
                Você ainda não fez nenhum pedido
              </h2>
              <p className="text-sm text-neutral-600 mb-4">
                Explore nossos fertilizantes premium e dê ao seu gramado o tratamento que ele merece.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/produtos"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ver Produtos
                </Link>
                <Link
                  href="/calculadora"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 text-sm font-medium rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Calcular Dose Ideal
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Compras Recentes (lista) ─────────────────────── */}
      {recentOrders.length > 1 && (
        <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-50">
            <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Compras Recentes
            </h2>
          </div>
          <div className="divide-y divide-neutral-50">
            {recentOrders.slice(1).map((order) => {
              const status = STATUS_MAP[order.status] || STATUS_MAP.pending
              return (
                <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status.color}`}>
                      <status.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Pedido #{order.orderNumber}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(order.date)} · {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Barra de Nível / XP ──────────────────────────── */}
      {profile && (
        <div className="bg-white rounded-xl border border-neutral-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-neutral-900">
                Nível {profile.level || 1}
              </span>
            </div>
            <span className="text-sm text-neutral-500">
              {profile.xp_total || 0} / {((profile.level || 1) * 1000)} XP
            </span>
          </div>
          <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((profile.xp_total || 0) % 1000) / 10, 100)}%` }}
            />
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            Complete lições na Academia e ganhe XP para subir de nível
          </p>
        </div>
      )}

      {/* ─── Ações Rápidas ────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-3">
          Acesso Rápido
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Calculator, label: 'Calcular Dose', href: '/calculadora', color: 'bg-emerald-50 text-emerald-600' },
            { icon: GraduationCap, label: 'Academia', href: '/conta/academia', color: 'bg-blue-50 text-blue-600' },
            { icon: Heart, label: 'Favoritos', href: '/favoritos', color: 'bg-red-50 text-red-600' },
            { icon: MapPin, label: 'Onde Encontrar', href: '/onde-encontrar', color: 'bg-amber-50 text-amber-600' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 bg-white rounded-xl border border-neutral-100 p-3.5 hover:border-neutral-200 hover:shadow-sm transition-all group"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}>
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── Dica Contextual ──────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#1a3a2a] to-[#2a5a3a] rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Dica do especialista</h3>
            <p className="text-sm text-white/80 mb-3">
              Para melhores resultados, aplique o fertilizante no início da manhã ou final da tarde,
              quando a temperatura está mais amena. Use a calculadora para a dose exata!
            </p>
            <Link
              href="/calculadora"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-medium transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Usar Calculadora
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
