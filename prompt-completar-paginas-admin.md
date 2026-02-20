# COMPLETAR PÁGINAS ADMIN - CLIENTES, ASSINATURAS E MÉTRICAS

## Contexto
As páginas de Clientes, Assinaturas e Métricas estão vazias no dashboard admin.
Precisamos criar a estrutura que irá exibir dados do Supabase (sincronizados do Shopify).

---

# PÁGINA 1: CLIENTES (/admin/clientes)

## Criar arquivo: src/app/admin/clientes/page.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  ChevronRight,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  Star,
  TrendingUp,
  Crown,
  RefreshCw,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  shopify_customer_id: string | null;
  xp_total: number;
  level: number;
  streak_days: number;
  created_at: string;
  orders_count?: number;
  total_spent?: number;
  has_subscription?: boolean;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'subscribers' | 'active'>('all');
  const [stats, setStats] = useState({
    total: 0,
    newThisMonth: 0,
    subscribers: 0,
    avgLevel: 0,
  });

  useEffect(() => {
    loadCustomers();
  }, [filter]);

  const loadCustomers = async () => {
    setIsLoading(true);
    const supabase = createClient();

    // Buscar clientes (profiles com role = customer)
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

    const { data: profilesData, error } = await query;

    if (error) {
      console.error('Erro ao carregar clientes:', error);
      setIsLoading(false);
      return;
    }

    // Buscar estatísticas de pedidos para cada cliente
    const customersWithStats = await Promise.all(
      (profilesData || []).map(async (profile) => {
        // Contar pedidos
        const { count: ordersCount } = await supabase
          .from('orders_sync')
          .select('id', { count: 'exact' })
          .eq('user_id', profile.id);

        // Soma total gasto
        const { data: ordersData } = await supabase
          .from('orders_sync')
          .select('total_price')
          .eq('user_id', profile.id);

        const totalSpent = ordersData?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;

        // Verificar se tem assinatura ativa
        const { count: subsCount } = await supabase
          .from('subscriptions')
          .select('id', { count: 'exact' })
          .eq('user_id', profile.id)
          .eq('status', 'active');

        return {
          ...profile,
          orders_count: ordersCount || 0,
          total_spent: totalSpent,
          has_subscription: (subsCount || 0) > 0,
        };
      })
    );

    // Aplicar filtros
    let filtered = customersWithStats;
    if (filter === 'subscribers') {
      filtered = filtered.filter(c => c.has_subscription);
    } else if (filter === 'active') {
      filtered = filtered.filter(c => c.orders_count > 0);
    }

    setCustomers(filtered);

    // Calcular stats
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    setStats({
      total: profilesData?.length || 0,
      newThisMonth: profilesData?.filter(c => new Date(c.created_at) >= thisMonth).length || 0,
      subscribers: customersWithStats.filter(c => c.has_subscription).length,
      avgLevel: customersWithStats.length > 0
        ? Math.round(customersWithStats.reduce((sum, c) => sum + c.level, 0) / customersWithStats.length)
        : 0,
    });

    setIsLoading(false);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getLevelBadge = (level: number) => {
    if (level >= 8) return { color: 'amber', icon: Crown, label: 'VIP' };
    if (level >= 5) return { color: 'purple', icon: Star, label: 'Gold' };
    if (level >= 3) return { color: 'blue', icon: TrendingUp, label: 'Silver' };
    return { color: 'neutral', icon: Users, label: 'Bronze' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Clientes</h1>
          <p className="text-neutral-500">
            {stats.total} clientes cadastrados
          </p>
        </div>
        <button
          onClick={loadCustomers}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total de Clientes"
          value={stats.total}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Novos este Mês"
          value={stats.newThisMonth}
          icon={Calendar}
          color="emerald"
        />
        <StatCard
          label="Assinantes Ativos"
          value={stats.subscribers}
          icon={RefreshCw}
          color="purple"
        />
        <StatCard
          label="Nível Médio"
          value={stats.avgLevel}
          icon={Star}
          color="amber"
        />
      </div>

      {/* Filters */}
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
              onClick={() => setFilter(f.key as any)}
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

      {/* Customers List */}
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
              const badge = getLevelBadge(customer.level);
              
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
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-700 font-semibold text-lg">
                          {customer.full_name?.charAt(0) || customer.email.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
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
                          <span className={`px-2 py-0.5 bg-${badge.color}-100 text-${badge.color}-700 text-xs font-medium rounded-full`}>
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

                    {/* Stats */}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className={`inline-flex p-2 rounded-lg bg-${color}-100 mb-2`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}
```

---

# PÁGINA 2: ASSINATURAS (/admin/assinaturas)

## Criar arquivo: src/app/admin/assinaturas/page.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  Search,
  Calendar,
  Package,
  TrendingUp,
  Pause,
  Play,
  XCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Users,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'paused' | 'cancelled' | 'pending';
  frequency_days: number;
  products: any[];
  next_delivery_date: string | null;
  delivery_count: number;
  created_at: string;
  user?: {
    full_name: string | null;
    email: string;
  };
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    paused: 0,
    mrr: 0, // Monthly Recurring Revenue
  });

  useEffect(() => {
    loadSubscriptions();
  }, [filter]);

  const loadSubscriptions = async () => {
    setIsLoading(true);
    const supabase = createClient();

    let query = supabase
      .from('subscriptions')
      .select(`
        *,
        user:profiles(full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao carregar assinaturas:', error);
      setIsLoading(false);
      return;
    }

    setSubscriptions(data || []);

    // Calcular stats
    const allSubs = data || [];
    const activeSubs = allSubs.filter(s => s.status === 'active');
    
    // MRR = soma dos valores mensais das assinaturas ativas
    const mrr = activeSubs.reduce((sum, sub) => {
      const monthlyValue = sub.products?.reduce((pSum: number, p: any) => {
        const price = p.subscriptionPrice || p.price || 0;
        const qty = p.quantity || 1;
        const deliveriesPerMonth = 30 / sub.frequency_days;
        return pSum + (price * qty * deliveriesPerMonth);
      }, 0) || 0;
      return sum + monthlyValue;
    }, 0);

    setStats({
      total: allSubs.length,
      active: activeSubs.length,
      paused: allSubs.filter(s => s.status === 'paused').length,
      mrr,
    });

    setIsLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'emerald', label: 'Ativa', icon: Play };
      case 'paused':
        return { color: 'amber', label: 'Pausada', icon: Pause };
      case 'cancelled':
        return { color: 'red', label: 'Cancelada', icon: XCircle };
      default:
        return { color: 'neutral', label: 'Pendente', icon: Clock };
    }
  };

  const getFrequencyLabel = (days: number) => {
    if (days === 30) return 'Mensal';
    if (days === 45) return 'A cada 45 dias';
    if (days === 60) return 'Bimestral';
    if (days === 90) return 'Trimestral';
    return `A cada ${days} dias`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Assinaturas</h1>
          <p className="text-neutral-500">
            Gerencie as assinaturas recorrentes
          </p>
        </div>
        <button
          onClick={loadSubscriptions}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-xl text-sm font-medium hover:bg-neutral-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total de Assinaturas"
          value={stats.total}
          icon={RefreshCw}
          color="blue"
        />
        <StatCard
          label="Assinaturas Ativas"
          value={stats.active}
          icon={Play}
          color="emerald"
        />
        <StatCard
          label="Assinaturas Pausadas"
          value={stats.paused}
          icon={Pause}
          color="amber"
        />
        <StatCard
          label="MRR (Receita Mensal)"
          value={formatCurrency(stats.mrr)}
          icon={DollarSign}
          color="purple"
          isText
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'active', label: 'Ativas' },
          { key: 'paused', label: 'Pausadas' },
          { key: 'cancelled', label: 'Canceladas' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
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

      {/* Subscriptions List */}
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
            {subscriptions.map((subscription, index) => {
              const status = getStatusBadge(subscription.status);
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  key={subscription.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Status Icon */}
                      <div className={`w-12 h-12 rounded-full bg-${status.color}-100 flex items-center justify-center`}>
                        <StatusIcon className={`w-6 h-6 text-${status.color}-600`} />
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-neutral-900">
                            {subscription.user?.full_name || subscription.user?.email || 'Cliente'}
                          </h3>
                          <span className={`px-2 py-0.5 bg-${status.color}-100 text-${status.color}-700 text-xs font-medium rounded-full`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">
                          {getFrequencyLabel(subscription.frequency_days)} • {subscription.products?.length || 0} produto(s)
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Entregas</p>
                        <p className="font-semibold text-neutral-900">{subscription.delivery_count}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Próxima Entrega</p>
                        <p className="font-medium text-neutral-700">
                          {formatDate(subscription.next_delivery_date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">Desde</p>
                        <p className="font-medium text-neutral-700">
                          {formatDate(subscription.created_at)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </div>
                  </div>

                  {/* Produtos */}
                  {subscription.products && subscription.products.length > 0 && (
                    <div className="mt-3 ml-16 flex flex-wrap gap-2">
                      {subscription.products.map((product: any, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600"
                        >
                          {product.title} x{product.quantity}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">Gerenciamento de Assinaturas</p>
          <p className="text-sm text-amber-700 mt-1">
            Para pausar, cancelar ou modificar assinaturas, acesse o painel do Shopify ou o app de assinaturas configurado.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, isText = false }: any) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4">
      <div className={`inline-flex p-2 rounded-lg bg-${color}-100 mb-2`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <p className={`${isText ? 'text-xl' : 'text-2xl'} font-bold text-neutral-900`}>{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  );
}
```

---

# PÁGINA 3: MÉTRICAS (/admin/metricas)

## Criar arquivo: src/app/admin/metricas/page.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  RefreshCw,
  GraduationCap,
  Calculator,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { createClient } from '@/lib/supabase/client';

export default function AdminMetricsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  
  const [metrics, setMetrics] = useState({
    revenue: { value: 0, change: 0 },
    orders: { value: 0, change: 0 },
    customers: { value: 0, change: 0 },
    subscriptions: { value: 0, change: 0 },
    calculatorUses: { value: 0, change: 0 },
    courseCompletions: { value: 0, change: 0 },
  });

  const [revenueChart, setRevenueChart] = useState<any[]>([]);
  const [ordersChart, setOrdersChart] = useState<any[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<any[]>([]);

  useEffect(() => {
    loadMetrics();
  }, [period]);

  const loadMetrics = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Buscar pedidos
    const { data: orders } = await supabase
      .from('orders_sync')
      .select('total_price, shopify_created_at')
      .gte('shopify_created_at', startDate.toISOString());

    // Buscar clientes
    const { count: customersCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('role', 'customer')
      .gte('created_at', startDate.toISOString());

    // Buscar assinaturas ativas
    const { count: subsCount } = await supabase
      .from('subscriptions')
      .select('id', { count: 'exact' })
      .eq('status', 'active');

    // Buscar usos da calculadora
    const { count: calcCount } = await supabase
      .from('calculator_logs')
      .select('id', { count: 'exact' })
      .gte('created_at', startDate.toISOString());

    // Buscar conclusões de cursos
    const { count: courseCount } = await supabase
      .from('user_progress')
      .select('id', { count: 'exact' })
      .not('completed_at', 'is', null)
      .gte('completed_at', startDate.toISOString());

    // Calcular totais
    const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;
    const totalOrders = orders?.length || 0;

    setMetrics({
      revenue: { value: totalRevenue, change: 12.5 }, // TODO: calcular comparação real
      orders: { value: totalOrders, change: 8.2 },
      customers: { value: customersCount || 0, change: 15.3 },
      subscriptions: { value: subsCount || 0, change: 22.1 },
      calculatorUses: { value: calcCount || 0, change: 5.4 },
      courseCompletions: { value: courseCount || 0, change: 18.7 },
    });

    // Dados para gráficos (mock - em produção agregar por dia)
    const chartData = generateChartData(days);
    setRevenueChart(chartData);
    setOrdersChart(chartData);

    // Funil de conversão
    setConversionFunnel([
      { name: 'Visitantes', value: 1000 },
      { name: 'Usou Calculadora', value: calcCount || 0 },
      { name: 'Adicionou ao Carrinho', value: Math.round((calcCount || 0) * 0.6) },
      { name: 'Finalizou Compra', value: totalOrders },
      { name: 'Assinou', value: subsCount || 0 },
    ]);

    setIsLoading(false);
  };

  const generateChartData = (days: number) => {
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        revenue: Math.random() * 5000 + 1000,
        orders: Math.floor(Math.random() * 20 + 5),
      });
    }
    return data;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Métricas</h1>
          <p className="text-neutral-500">
            Acompanhe o desempenho do seu negócio
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {[
            { key: '7d', label: '7 dias' },
            { key: '30d', label: '30 dias' },
            { key: '90d', label: '90 dias' },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key as any)}
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

      {/* Main Stats */}
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

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Receita ao Longo do Tempo
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Receita']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Pedidos por Período
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Funil de Conversão
        </h2>
        <div className="flex items-center justify-between">
          {conversionFunnel.map((step, index) => (
            <div key={step.name} className="flex items-center">
              <div className="text-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: `${COLORS[index]}20` }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: COLORS[index] }}
                  >
                    {step.value}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">{step.name}</p>
                {index > 0 && (
                  <p className="text-xs text-neutral-400 mt-1">
                    {((step.value / conversionFunnel[index - 1].value) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
              {index < conversionFunnel.length - 1 && (
                <ArrowRight className="w-6 h-6 text-neutral-300 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, icon: Icon, color }: any) {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-neutral-200 p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon className={`w-4 h-4 text-${color}-600`} />
        </div>
        <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-xl font-bold text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </motion.div>
  );
}
```

---

# RESUMO: O QUE FAZER NO CURSOR

## Comando para o Cursor Agent:

```
Crie as seguintes páginas no dashboard admin que estão faltando:

1. src/app/admin/clientes/page.tsx
   - Lista de clientes com busca e filtros
   - Stats: total, novos este mês, assinantes, nível médio
   - Cada cliente mostra: nome, email, pedidos, total gasto, nível

2. src/app/admin/assinaturas/page.tsx
   - Lista de assinaturas com status (ativa, pausada, cancelada)
   - Stats: total, ativas, pausadas, MRR
   - Cada assinatura mostra: cliente, frequência, produtos, próxima entrega

3. src/app/admin/metricas/page.tsx
   - Cards com métricas principais (receita, pedidos, clientes, etc)
   - Gráfico de receita ao longo do tempo
   - Gráfico de pedidos por período
   - Funil de conversão

Todas as páginas devem:
- Buscar dados do Supabase
- Ter estado de loading
- Mostrar estado vazio se não tiver dados
- Usar os componentes já existentes do projeto (framer-motion, lucide-react, recharts)
```

---

# OBSERVAÇÃO IMPORTANTE

As páginas vão aparecer **vazias** até você ter:

1. ✅ **Dados de teste no Supabase** (criar manualmente)
2. ✅ **Shopify conectado** (webhooks enviando dados)
3. ✅ **Clientes reais** (se cadastrando/comprando)

Para testar, você pode criar dados manualmente no Supabase:
- Inserir um profile de teste
- Inserir uma subscription de teste
- Inserir um order_sync de teste
