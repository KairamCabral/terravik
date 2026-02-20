'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Calendar, CreditCard, Settings, 
  Pause, Edit, XCircle, TrendingUp, Crown,
  ChevronRight, MapPin, Phone, Check 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CustomerSubscription } from '@/lib/subscription/types';
import { LOYALTY_TIERS } from '@/lib/subscription/mock-data';
import { 
  formatPrice, 
  formatDeliveryDate, 
  getDaysUntilNextDelivery 
} from '@/lib/subscription/pricing';

interface SubscriptionDashboardProps {
  subscription: CustomerSubscription;
  onPause: () => void;
  onModify: () => void;
  onCancel: () => void;
}

/**
 * Dashboard completo do assinante
 * 
 * PSICOLOGIA APLICADA:
 * - Gamificação: níveis de fidelidade com badges
 * - Economia acumulada em destaque (reforço positivo)
 * - Próxima entrega com countdown (antecipação)
 * - Histórico como "conquistas" não apenas transações
 * - Ações rápidas acessíveis (reduz fricção)
 */
export function SubscriptionDashboard({ 
  subscription, 
  onPause, 
  onModify, 
  onCancel 
}: SubscriptionDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'deliveries' | 'billing' | 'settings'>('overview');

  const daysUntilNext = getDaysUntilNextDelivery(subscription.nextDeliveryDate);
  const loyaltyTier = LOYALTY_TIERS.find(t => t.name === subscription.loyaltyTier);
  const deliveryCount = subscription.deliveryHistory.length;

  const statusConfig = {
    active: { label: 'Ativa', color: 'bg-green-100 text-green-700 border-green-300' },
    paused: { label: 'Pausada', color: 'bg-amber-100 text-amber-700 border-amber-300' },
    cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-700 border-red-300' },
    pending: { label: 'Pendente', color: 'bg-blue-100 text-blue-700 border-blue-300' }
  }[subscription.status];

  return (
    <div className="space-y-6">
      {/* Header com nível de fidelidade */}
      <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
              {loyaltyTier?.badgeIcon}
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold capitalize">
                {subscription.loyaltyTier}
              </h2>
              <p className="text-white/90 text-sm">
                {deliveryCount} {deliveryCount === 1 ? 'entrega recebida' : 'entregas recebidas'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full border-2 ${statusConfig.color}`}>
            {statusConfig.label}
          </div>
        </div>

        {/* Economia total */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/80 mb-1">Economia Acumulada</div>
              <div className="text-3xl font-bold">
                {formatPrice(subscription.totalAnnualSavings)}
              </div>
            </div>
            <TrendingUp className="w-10 h-10 text-white/60" />
          </div>
        </div>
      </div>

      {/* Próxima Entrega (destaque) */}
      {subscription.status === 'active' && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-lg text-green-900">Próxima Entrega</h3>
            <Badge variant="success" size="sm">
              Em {daysUntilNext} {daysUntilNext === 1 ? 'dia' : 'dias'}
            </Badge>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-neutral-600 mb-1">Data prevista</div>
              <div className="font-bold text-neutral-900">
                {formatDeliveryDate(subscription.nextDeliveryDate)}
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-600 mb-1">Valor</div>
              <div className="font-bold text-green-700">
                {formatPrice(subscription.products.reduce(
                  (sum, p) => sum + (p.subscriptionPrice * p.quantity),
                  0
                ))}
              </div>
            </div>
          </div>

          {/* Produtos */}
          <div className="mb-4">
            <div className="text-sm font-semibold text-neutral-700 mb-2">Produtos</div>
            <div className="space-y-2">
              {subscription.products.map((product, index) => (
                <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-3">
                  <span className="text-2xl">📦</span>
                  <div className="flex-1">
                    <div className="font-medium text-neutral-900 text-sm">
                      {product.quantity}x {product.name}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-neutral-700">
                    {formatPrice(product.subscriptionPrice * product.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full">
            Antecipar esta entrega
          </Button>
        </div>
      )}

      {/* Ações Rápidas */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Button
          variant="outline"
          onClick={onPause}
          disabled={subscription.status !== 'active'}
        >
          <Pause className="w-4 h-4 mr-2" />
          Pausar
        </Button>
        <Button
          variant="outline"
          onClick={onModify}
          disabled={subscription.status === 'cancelled'}
        >
          <Edit className="w-4 h-4 mr-2" />
          Modificar
        </Button>
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={subscription.status === 'cancelled'}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      </div>

      {/* Tabs de Conteúdo */}
      <div className="bg-white rounded-xl border-2 border-neutral-200 overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-neutral-200">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Crown },
            { id: 'deliveries', label: 'Entregas', icon: Package },
            { id: 'billing', label: 'Pagamentos', icon: CreditCard },
            { id: 'settings', label: 'Configurações', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-3 font-medium text-sm transition-colors
                  ${isActive
                    ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Benefícios do tier atual */}
              <div>
                <h4 className="font-bold text-neutral-900 mb-3">Seus Benefícios {loyaltyTier?.name}</h4>
                <div className="space-y-2">
                  {loyaltyTier?.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-neutral-700">
                      <Check className="w-4 h-4 text-green-600" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progresso para próximo nível */}
              {subscription.loyaltyTier !== 'platinum' && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-amber-900">Próximo Nível</h4>
                  </div>
                  <p className="text-sm text-amber-800 mb-3">
                    Faltam {LOYALTY_TIERS.find(t => t.minDeliveries > deliveryCount)?.minDeliveries! - deliveryCount} entregas 
                    para desbloquear mais benefícios!
                  </p>
                  <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                      style={{ 
                        width: `${(deliveryCount / (LOYALTY_TIERS.find(t => t.minDeliveries > deliveryCount)?.minDeliveries || 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Stats rápidos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-lg">
                  <div className="text-2xl font-bold text-neutral-900">{deliveryCount}</div>
                  <div className="text-xs text-neutral-600">Entregas recebidas</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {formatPrice(subscription.totalAnnualSavings)}
                  </div>
                  <div className="text-xs text-green-600">Economia total</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deliveries' && (
            <div className="space-y-4">
              <h4 className="font-bold text-neutral-900">Histórico de Entregas</h4>
              {subscription.deliveryHistory.length > 0 ? (
                <div className="space-y-3">
                  {subscription.deliveryHistory.map((delivery) => (
                    <div 
                      key={delivery.id}
                      className="p-4 border border-neutral-200 rounded-lg hover:border-green-200 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-neutral-900">
                            {formatDeliveryDate(delivery.date)}
                          </span>
                        </div>
                        <Badge 
                          variant={delivery.status === 'delivered' ? 'success' : 'default'}
                          size="sm"
                        >
                          {delivery.status === 'delivered' ? 'Entregue' : delivery.status}
                        </Badge>
                      </div>
                      {delivery.trackingCode && (
                        <div className="text-sm text-neutral-600 mb-2">
                          Rastreio: <span className="font-mono">{delivery.trackingCode}</span>
                        </div>
                      )}
                      <div className="text-sm text-neutral-900 font-semibold">
                        {formatPrice(delivery.total)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma entrega realizada ainda</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-4">
              <h4 className="font-bold text-neutral-900">Histórico de Pagamentos</h4>
              {subscription.billingHistory.length > 0 ? (
                <div className="space-y-3">
                  {subscription.billingHistory.map((billing) => (
                    <div 
                      key={billing.id}
                      className="p-4 border border-neutral-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-neutral-900">
                            {formatDeliveryDate(billing.date)}
                          </span>
                        </div>
                        <Badge 
                          variant={billing.status === 'paid' ? 'success' : 'default'}
                          size="sm"
                        >
                          {billing.status === 'paid' ? 'Pago' : billing.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-neutral-600">
                          {billing.paymentMethod}
                        </div>
                        <div className="text-lg font-bold text-neutral-900">
                          {formatPrice(billing.amount)}
                        </div>
                      </div>
                      {billing.invoiceUrl && (
                        <a 
                          href={billing.invoiceUrl}
                          className="text-sm text-green-600 hover:text-green-700 mt-2 inline-flex items-center gap-1"
                        >
                          Ver nota fiscal <ChevronRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum pagamento processado ainda</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Frequência atual */}
              <div>
                <h4 className="font-bold text-neutral-900 mb-3">Frequência de Entrega</h4>
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-neutral-900">
                        A cada {subscription.frequency} dias
                      </div>
                      <div className="text-sm text-neutral-600">
                        {Math.floor(365 / subscription.frequency)} entregas por ano
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={onModify}>
                      Alterar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Produtos */}
              <div>
                <h4 className="font-bold text-neutral-900 mb-3">Produtos da Assinatura</h4>
                <div className="space-y-2">
                  {subscription.products.map((product, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      <div>
                        <div className="font-semibold text-neutral-900">
                          {product.quantity}x {product.name}
                        </div>
                        <div className="text-sm text-neutral-600">
                          {formatPrice(product.subscriptionPrice)} por unidade
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Adicionar Produto
                </Button>
              </div>

              {/* Informações de cobrança (placeholder) */}
              <div>
                <h4 className="font-bold text-neutral-900 mb-3">Método de Pagamento</h4>
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-neutral-600" />
                      <div>
                        <div className="font-semibold text-neutral-900">
                          Cartão •••• 4242
                        </div>
                        <div className="text-sm text-neutral-600">Expira em 12/2026</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Alterar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Endereço de entrega (placeholder) */}
              <div>
                <h4 className="font-bold text-neutral-900 mb-3">Endereço de Entrega</h4>
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-neutral-900">
                        <MapPin className="w-4 h-4 text-neutral-600" />
                        João Silva
                      </div>
                      <div className="text-sm text-neutral-600">
                        Rua Exemplo, 123 - Bairro
                      </div>
                      <div className="text-sm text-neutral-600">
                        Florianópolis, SC - 88000-000
                      </div>
                      <div className="flex items-center gap-1 text-sm text-neutral-600">
                        <Phone className="w-3 h-3" />
                        (48) 99999-9999
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Alterar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
