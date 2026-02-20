'use client';

import { motion } from 'framer-motion';
import { Check, X, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { generatePriceComparison, formatPrice } from '@/lib/subscription/pricing';
import { SubscriptionFrequency } from '@/lib/subscription/types';

interface SubscriptionCompareProps {
  basePrice: number;
  frequency: SubscriptionFrequency;
  quantity?: number;
  className?: string;
}

/**
 * Comparativo visual: Compra Única vs Assinatura
 * 
 * PSICOLOGIA APLICADA:
 * - Tabela lado a lado clara e visual
 * - Coluna de assinatura visualmente superior (verde, destacada)
 * - Checkmarks verdes vs X vermelho (binary choice clarity)
 * - Economia destacada em negrito e tamanho maior
 * - Números específicos (não apenas "mais barato")
 */
export function SubscriptionCompare({ 
  basePrice, 
  frequency, 
  quantity = 1,
  className = '' 
}: SubscriptionCompareProps) {
  const comparison = generatePriceComparison(basePrice, frequency, quantity);

  const features = [
    {
      label: 'Preço por entrega',
      oneTime: formatPrice(comparison.oneTime.pricePerDelivery),
      subscription: formatPrice(comparison.subscription.pricePerDelivery),
    },
    {
      label: 'Frete',
      oneTime: 'Pago',
      subscription: 'GRÁTIS',
      highlight: true
    },
    {
      label: 'Entregas automáticas',
      oneTime: false,
      subscription: true
    },
    {
      label: 'Lembretes de aplicação',
      oneTime: false,
      subscription: true
    },
    {
      label: 'Suporte prioritário',
      oneTime: false,
      subscription: true
    },
    {
      label: 'Pause ou cancele fácil',
      oneTime: '—',
      subscription: 'Sim',
    },
    {
      label: 'Programa de fidelidade',
      oneTime: false,
      subscription: true
    },
    {
      label: 'Brindes exclusivos',
      oneTime: false,
      subscription: true
    },
    {
      label: `Custo anual (${comparison.subscription.totalDeliveries} entregas)`,
      oneTime: formatPrice(comparison.oneTime.annualCost),
      subscription: formatPrice(comparison.subscription.annualCost),
      emphasized: true
    }
  ];

  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-3">
          Compare e escolha o melhor para você
        </h2>
        <p className="text-lg text-neutral-600">
          Veja todas as vantagens da assinatura lado a lado
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header da tabela */}
        <div className="grid grid-cols-3 gap-4 mb-2">
          <div /> {/* Espaço para labels */}
          <div className="text-center p-3 bg-neutral-100 rounded-t-xl">
            <div className="font-bold text-neutral-900">Compra Única</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-t-xl shadow-md">
            <div className="font-bold">Assinatura</div>
            <div className="text-xs text-green-100">Recomendado</div>
          </div>
        </div>

        {/* Linhas de comparação */}
        <div className="bg-white rounded-xl border-2 border-neutral-200 overflow-hidden shadow-sm">
          {features.map((feature, index) => {
            const isEmphasized = feature.emphasized;
            const isHighlight = feature.highlight;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`
                  grid grid-cols-3 gap-4 p-4
                  ${index < features.length - 1 ? 'border-b border-neutral-100' : ''}
                  ${isEmphasized ? 'bg-green-50' : ''}
                `}
              >
                {/* Label */}
                <div className={`flex items-center ${
                  isEmphasized ? 'font-bold text-neutral-900' : 'text-neutral-700'
                }`}>
                  {feature.label}
                </div>

                {/* Compra Única */}
                <div className="text-center flex items-center justify-center">
                  {typeof feature.oneTime === 'boolean' ? (
                    feature.oneTime ? (
                      <Check className="w-5 h-5 text-neutral-400" />
                    ) : (
                      <X className="w-5 h-5 text-neutral-300" />
                    )
                  ) : (
                    <span className={`${isEmphasized ? 'font-bold text-lg' : ''} text-neutral-700`}>
                      {feature.oneTime}
                    </span>
                  )}
                </div>

                {/* Assinatura */}
                <div className="text-center flex items-center justify-center">
                  {typeof feature.subscription === 'boolean' ? (
                    feature.subscription ? (
                      <Check className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                    ) : (
                      <X className="w-5 h-5 text-neutral-300" />
                    )
                  ) : (
                    <span className={`
                      ${isEmphasized ? 'font-bold text-xl text-green-700' : 'text-neutral-900'}
                      ${isHighlight ? 'font-bold text-green-600' : ''}
                    `}>
                      {feature.subscription}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Linha de economia */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-bold">Economia Anual</div>
              <div className="text-center">—</div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-2xl font-bold">
                    {formatPrice(comparison.subscription.annualSavings)}
                  </span>
                </div>
                <div className="text-xs text-green-100 mt-1">
                  ({comparison.subscription.percentSavings.toFixed(1)}% de desconto)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <p className="text-neutral-600 mb-4">
            A escolha é clara: economize e simplifique sua vida!
          </p>
          <Button variant="premium" size="lg">
            <Sparkles className="w-5 h-5 mr-2" />
            Começar a Economizar
          </Button>
        </div>
      </div>
    </div>
  );
}
