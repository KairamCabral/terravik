// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  ShoppingCart,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ShopifyQuickLinks } from '@/components/admin/ShopifyQuickLinks';
import { formatPrice } from '@/lib/subscription/pricing';
import {
  agruparReceitaPorMes,
  dentroDe,
  formatarVariacao,
  janelas,
  somarReceita,
  temVariacao,
  variacao,
} from '@/lib/admin/metricas';

/** Tamanho, em dias, da janela usada nos selos de variação. */
const DIAS_DA_VARIACAO = 30;

const DashboardCharts = dynamic(
  () => import('@/components/admin/DashboardCharts'),
  { ssr: false }
);

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  activeSubscriptions: number;
  /** Undefined quando o período anterior não tem base de comparação. */
  revenueChange?: number;
  ordersChange?: number;
  customersChange?: number;
}

interface RevenueData {
  name: string;
  revenue: number;
  orders: number;
}

interface CourseStatData {
  name: string;
  completions: number;
}

interface OrderSync {
  id: string;
  shopify_order_number: string | null;
  total_price: number | null;
  synced_at: string | null;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeSubscriptions: 0,
  });
  /** null: a contagem não veio (erro na consulta), e o painel mostra "--". */
  const [activeStores, setActiveStores] = useState<number | null>(null);
  const [revenueChart, setRevenueChart] = useState<RevenueData[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStatData[]>([]);
  const [recentActivity, setRecentActivity] = useState<OrderSync[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const supabase = createClient();

    const agora = new Date();
    const { inicioAtual, inicioAnterior } = janelas(agora, DIAS_DA_VARIACAO);
    const isoAtual = inicioAtual.toISOString();
    const isoAnterior = inicioAnterior.toISOString();

    const contarClientes = () =>
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'customer');

    const [
      ordersRes,
      customersRes,
      customersAtualRes,
      customersAnteriorRes,
      subscriptionsRes,
      coursesRes,
      storesRes,
    ] = await Promise.all([
      // shopify_created_at vem junto: sem a data não há receita por mês nem variação.
      supabase
        .from('orders_sync')
        .select('id, total_price, shopify_created_at', { count: 'exact' }),
      contarClientes(),
      contarClientes().gte('created_at', isoAtual),
      contarClientes().gte('created_at', isoAnterior).lt('created_at', isoAtual),
      supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
      supabase.from('courses').select('id, title').eq('is_published', true),
      supabase.from('stores').select('id', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    const pedidos = ordersRes.data || [];
    const pedidosAtuais = pedidos.filter((o) =>
      dentroDe(o.shopify_created_at, inicioAtual, agora)
    );
    const pedidosAnteriores = pedidos.filter((o) =>
      dentroDe(o.shopify_created_at, inicioAnterior, inicioAtual)
    );

    setMetrics({
      totalRevenue: somarReceita(pedidos),
      totalOrders: ordersRes.count || 0,
      totalCustomers: customersRes.count || 0,
      activeSubscriptions: subscriptionsRes.count || 0,
      // Últimos 30 dias contra os 30 anteriores. Sem base, fica undefined e o selo não aparece.
      revenueChange: variacao(somarReceita(pedidosAtuais), somarReceita(pedidosAnteriores)),
      ordersChange: variacao(pedidosAtuais.length, pedidosAnteriores.length),
      customersChange:
        customersAtualRes.count === null || customersAnteriorRes.count === null
          ? undefined
          : variacao(customersAtualRes.count, customersAnteriorRes.count),
      // Assinaturas ativas é um retrato do agora. Comparar com "ativas há 30 dias"
      // exigiria histórico de status, que o banco não guarda: fica sem selo.
    });

    setActiveStores(storesRes.error ? null : storesRes.count);

    // Receita dos últimos seis meses, agrupada dos pedidos sincronizados.
    setRevenueChart(agruparReceitaPorMes(pedidos, agora, 6));

    // Estatísticas dos cursos
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('course_id')
      .not('completed_at', 'is', null);

    const courseCompletion: CourseStatData[] = coursesRes.data?.map(course => {
      const completions = progressData?.filter(p => p.course_id === course.id).length || 0;
      return { name: course.title, completions };
    }) || [];

    setCourseStats(courseCompletion);

    // Atividade recente
    const { data: recentOrders } = await supabase
      .from('orders_sync')
      .select('id, shopify_order_number, total_price, synced_at')
      .order('synced_at', { ascending: false })
      .limit(5);

    setRecentActivity(recentOrders || []);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse" />
          <div className="h-5 w-64 bg-neutral-100 rounded animate-pulse mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-neutral-200 p-6 h-36 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500">Visão geral do seu negócio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Receita Total"
          value={formatPrice(metrics.totalRevenue)}
          change={metrics.revenueChange}
          icon={DollarSign}
        />
        <StatsCard
          title="Pedidos"
          value={metrics.totalOrders.toString()}
          change={metrics.ordersChange}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Clientes"
          value={metrics.totalCustomers.toString()}
          change={metrics.customersChange}
          icon={Users}
        />
        <StatsCard
          title="Assinaturas Ativas"
          value={metrics.activeSubscriptions.toString()}
          icon={RefreshCw}
        />
      </div>

      {/* Atalhos Shopify */}
      <ShopifyQuickLinks />

      {/* Charts — carregados sob demanda para reduzir bundle inicial */}
      <DashboardCharts revenueChart={revenueChart} courseStats={courseStats} />

      {/* Quick Stats and Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Estatísticas Rápidas
          </h2>
          <div className="space-y-4">
            <QuickStat
              icon={GraduationCap}
              label="Cursos Publicados"
              value={courseStats.length.toString()}
            />
            <QuickStat
              icon={MapPin}
              label="Lojas Conveniadas"
              value={activeStores === null ? '--' : activeStores.toString()}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Atividade Recente
          </h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">
                        Novo pedido #{order.shopify_order_number || '---'}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {order.synced_at
                          ? new Date(order.synced_at).toLocaleString('pt-BR')
                          : '--'
                        }
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-600">
                    {formatPrice(order.total_price || 0)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-400">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Nenhum pedido sincronizado ainda</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Componentes auxiliares ──────────────────────────────────────

// Cor só para estado: os ícones dos cartões são neutros, e a única cor que
// carrega informação é a do selo de variação (subiu ou caiu).
const ICONE_NEUTRO = { bg: 'bg-neutral-100', text: 'text-neutral-600' };

function StatsCard({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  /** Variação percentual sobre o período anterior. Sem número, sem selo. */
  change?: number;
  icon: React.ElementType;
}) {
  const colors = ICONE_NEUTRO;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-neutral-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.text}`} aria-hidden="true" />
        </div>
        {temVariacao(change) && (
          <div
            className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-emerald-700' : 'text-red-600'}`}
            title={`Últimos ${DIAS_DA_VARIACAO} dias contra os ${DIAS_DA_VARIACAO} anteriores`}
          >
            {change >= 0 ? (
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <TrendingDown className="w-4 h-4" aria-hidden="true" />
            )}
            <span className="sr-only">{change >= 0 ? 'Alta de' : 'Queda de'}</span>
            {formatarVariacao(change)}
            <span className="text-xs text-neutral-500">em {DIAS_DA_VARIACAO} dias</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500">{title}</p>
    </motion.div>
  );
}

function QuickStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  const colors = ICONE_NEUTRO;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`w-4 h-4 ${colors.text}`} />
        </div>
        <span className="text-neutral-600">{label}</span>
      </div>
      <span className="font-semibold text-neutral-900">{value}</span>
    </div>
  );
}
