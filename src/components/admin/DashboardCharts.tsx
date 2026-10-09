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
import { formatPrice } from '@/lib/subscription/pricing';
import { temMovimento } from '@/lib/admin/metricas';

interface RevenueData {
  name: string;
  revenue: number;
  orders: number;
}

interface CourseStatData {
  name: string;
  completions: number;
}

interface DashboardChartsProps {
  revenueChart: RevenueData[];
  courseStats: CourseStatData[];
}

export default function DashboardCharts({ revenueChart, courseStats }: DashboardChartsProps) {
  // Meses todos zerados não são gráfico, são uma linha reta no eixo.
  const temReceita = temMovimento(revenueChart, 'revenue');

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Receita Mensal</h2>
        <div className="h-72">
          {temReceita ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
                formatter={(value: number | undefined) => [formatPrice(value ?? 0), 'Receita']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-neutral-500">
              <p>Nenhuma receita registrada ainda</p>
              <p className="text-xs">
                O gráfico aparece quando houver pedido sincronizado da Shopify.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Cursos - Conclusões</h2>
        <div className="h-72">
          {courseStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="completions"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-400">
              <p>Nenhum curso publicado ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
