'use client';

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
} from 'recharts';
import { temMovimento } from '@/lib/admin/metricas';

interface RevenueChartPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface MetricsChartsProps {
  revenueChart: RevenueChartPoint[];
  ordersChart: RevenueChartPoint[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(value);
}

export default function MetricsCharts({ revenueChart, ordersChart }: MetricsChartsProps) {
  // Período sem pedido: estado vazio no lugar de uma linha reta no zero.
  const temReceita = temMovimento(revenueChart, 'revenue');
  const temPedidos = temMovimento(ordersChart, 'orders');

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Receita ao Longo do Tempo
        </h2>
        <div className="h-72">
          {temReceita ? (
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
                formatter={(value: number | undefined) => [formatCurrency(value ?? 0), 'Receita']}
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
          ) : (
            <GraficoVazio texto="Nenhuma receita registrada no período" />
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          Pedidos por Período
        </h2>
        <div className="h-72">
          {temPedidos ? (
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
          ) : (
            <GraficoVazio texto="Nenhum pedido sincronizado no período" />
          )}
        </div>
      </div>
    </div>
  );
}

function GraficoVazio({ texto }: { texto: string }) {
  return (
    <div className="flex h-full items-center justify-center text-center text-neutral-500">
      <p>{texto}</p>
    </div>
  );
}
