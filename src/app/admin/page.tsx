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
  Activity,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ShopifyQuickLinks } from '@/components/admin/ShopifyQuickLinks';
import { formatPrice } from '@/lib/subscription/pricing';

const DashboardCharts = dynamic(
  () => import('@/components/admin/DashboardCharts'),
  { ssr: false }
);

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  activeSubscriptions: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  subscriptionsChange: number;
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
    revenueChange: 12.5,
    ordersChange: 8.2,
    customersChange: 15.3,
    subscriptionsChange: 22.1,
  });
  const [revenueChart, setRevenueChart] = useState<RevenueData[]>([]);
  const [courseStats, setCourseStats] = useState<CourseStatData[]>([]);
  const [recentActivity, setRecentActivity] = useState<OrderSync[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const supabase = createClient();

    // Carregar métricas
    const [ordersRes, customersRes, subscriptionsRes, coursesRes] = await Promise.all([
      supabase.from('orders_sync').select('id, total_price', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
      supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active'),
      supabase.from('courses').select('id, title').eq('is_published', true),
    ]);

    // Calcular receita total
    const totalRevenue = ordersRes.data?.reduce(
      (sum, order) => sum + (order.total_price || 0), 0
    ) || 0;

    setMetrics(prev => ({
      ...prev,
      totalRevenue,
      totalOrders: ordersRes.count || 0,
      totalCustomers: customersRes.count || 0,
      activeSubscriptions: subscriptionsRes.count || 0,
    }));

    // Mock data para gráficos (em produção, buscar de admin_metrics)
    setRevenueChart([
      { name: 'Jan', revenue: 12500, orders: 45 },
      { name: 'Fev', revenue: 15800, orders: 52 },
      { name: 'Mar', revenue: 18200, orders: 61 },
      { name: 'Abr', revenue: 16900, orders: 58 },
      { name: 'Mai', revenue: 21500, orders: 72 },
      { name: 'Jun', revenue: 24800, orders: 85 },
    ]);

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
          color="emerald"
        />
        <StatsCard
          title="Pedidos"
          value={metrics.totalOrders.toString()}
          change={metrics.ordersChange}
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Clientes"
          value={metrics.totalCustomers.toString()}
          change={metrics.customersChange}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Assinaturas Ativas"
          value={metrics.activeSubscriptions.toString()}
          change={metrics.subscriptionsChange}
          icon={RefreshCw}
          color="amber"
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
              color="purple"
            />
            <QuickStat
              icon={MapPin}
              label="Lojas Conveniadas"
              value="--"
              color="red"
            />
            <QuickStat
              icon={Activity}
              label="Assinaturas Ativas"
              value={metrics.activeSubscriptions.toString()}
              color="blue"
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

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
};

function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
}) {
  const isPositive = change >= 0;
  const colors = COLOR_MAP[color] || COLOR_MAP.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-neutral-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
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
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  const colors = COLOR_MAP[color] || COLOR_MAP.emerald;

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
