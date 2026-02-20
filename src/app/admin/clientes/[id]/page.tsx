'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Star,
  Package,
  RefreshCw,
  Users,
  Loader2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  xp_total: number | null
  level: number | null
  streak_days: number | null
  created_at: string | null
}

interface Order {
  id: string
  shopify_order_number: string | null
  total_price: number | null
  status: string | null
  shopify_created_at: string | null
}

interface Subscription {
  id: string
  status: string | null
  frequency_days: number
  products: unknown[]
  next_delivery_date: string | null
  delivery_count: number | null
  started_at: string | null
}

export default function AdminClienteDetailPage() {
  const params = useParams()
  const id = params?.id as string | undefined

  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return

    const load = async () => {
      setIsLoading(true)
      const supabase = createClient()

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, xp_total, level, streak_days, created_at')
        .eq('id', id)
        .single()

      if (profileError || !profileData) {
        setNotFound(true)
        setIsLoading(false)
        return
      }

      setProfile(profileData)

      const [ordersRes, subsRes] = await Promise.all([
        supabase
          .from('orders_sync')
          .select('id, shopify_order_number, total_price, status, shopify_created_at')
          .eq('user_id', id)
          .order('shopify_created_at', { ascending: false })
          .limit(10),
        supabase
          .from('subscriptions')
          .select('id, status, frequency_days, products, next_delivery_date, delivery_count, started_at')
          .eq('user_id', id)
          .order('started_at', { ascending: false }),
      ])

      setOrders(ordersRes.data || [])
      setSubscriptions((subsRes.data || []) as Subscription[])

      setIsLoading(false)
    }

    load()
  }, [id])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString('pt-BR') : '-'

  const getFrequencyLabel = (days: number) => {
    if (days === 30) return 'Mensal'
    if (days === 45) return 'A cada 45 dias'
    if (days === 60) return 'Bimestral'
    if (days === 90) return 'Trimestral'
    return `A cada ${days} dias`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/clientes"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Clientes
        </Link>
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <Users className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 font-medium">Cliente não encontrado</p>
          <p className="text-sm text-neutral-500 mt-1">O ID informado pode estar incorreto.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/clientes"
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Clientes
      </Link>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-700 font-bold text-2xl">
                {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {profile.full_name || 'Sem nome'}
              </h1>
              <p className="text-neutral-500">{profile.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  Nível {profile.level}
                </span>
                <span className="text-sm text-neutral-500">
                  {profile.xp_total} XP
                </span>
                {(profile.streak_days ?? 0) > 0 && (
                  <span className="text-sm text-amber-600">
                    {profile.streak_days} dias de sequência
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contato
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-neutral-500">Email</dt>
                <dd className="font-medium text-neutral-900">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Telefone</dt>
                <dd className="font-medium text-neutral-900">{profile.phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Cadastro</dt>
                <dd className="font-medium text-neutral-900 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(profile.created_at)}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Gamificação
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-neutral-500">Nível</dt>
                <dd className="font-medium text-neutral-900">{profile.level}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">XP Total</dt>
                <dd className="font-medium text-neutral-900">{profile.xp_total}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Sequência</dt>
                <dd className="font-medium text-neutral-900">{profile.streak_days} dias</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {orders.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Pedidos Recentes
            </h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 flex items-center justify-between hover:bg-neutral-50"
              >
                <div>
                  <p className="font-medium text-neutral-900">
                    Pedido #{order.shopify_order_number || order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {formatDate(order.shopify_created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">
                    {formatCurrency(order.total_price || 0)}
                  </p>
                  <p className="text-xs text-neutral-500">{order.status || '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subscriptions.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-4 border-b border-neutral-100">
            <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Assinaturas
            </h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 hover:bg-neutral-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        sub.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : sub.status === 'paused'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {sub.status === 'active' ? 'Ativa' : sub.status === 'paused' ? 'Pausada' : sub.status}
                    </span>
                    <p className="text-sm text-neutral-600 mt-1">
                      {getFrequencyLabel(sub.frequency_days)} • {sub.delivery_count ?? 0} entrega(s)
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-neutral-500">Próxima entrega</p>
                    <p className="font-medium text-neutral-900">
                      {formatDate(sub.next_delivery_date)}
                    </p>
                  </div>
                </div>
                {Array.isArray(sub.products) && sub.products.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(sub.products as { title?: string; quantity?: number }[]).map((p, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-neutral-100 rounded text-xs text-neutral-600"
                      >
                        {p.title || 'Produto'} x{p.quantity || 1}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && subscriptions.length === 0 && (
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 text-center">
          <p className="text-neutral-500 text-sm">
            Nenhum pedido ou assinatura registrado para este cliente.
          </p>
        </div>
      )}
    </div>
  )
}
