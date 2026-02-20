'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SUBSCRIPTION_BENEFITS } from '@/lib/subscription/mock-data';

interface SubscriptionBenefitsProps {
  variant?: 'default' | 'compact';
  maxItems?: number;
  className?: string;
}

/**
 * Seção de benefícios da assinatura
 * 
 * PSICOLOGIA APLICADA:
 * - Ícones animados ao entrar na viewport
 * - Benefícios ordenados por impacto emocional
 * - Checkmarks verdes (sensação de conquista)
 * - Números específicos (não "desconto" mas "até 18%")
 * - Destaque visual nos 3 principais
 */
export function SubscriptionBenefits({ 
  variant = 'default',
  maxItems,
  className = '' 
}: SubscriptionBenefitsProps) {
  const benefits = maxItems 
    ? SUBSCRIPTION_BENEFITS.slice(0, maxItems) 
    : SUBSCRIPTION_BENEFITS;

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 text-sm">{benefit.title}</h4>
              <p className="text-xs text-neutral-600">{benefit.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Default variant - grid completo
  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-3">
          Por que assinar a Terravik?
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Benefícios exclusivos que transformam o cuidado com seu gramado
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => {
          const isHighlight = benefit.highlight;

          return (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className={`
                p-6 rounded-xl border-2 transition-all
                ${isHighlight
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md'
                  : 'bg-white border-neutral-200 hover:border-green-200 hover:shadow-sm'
                }
              `}
            >
              {/* Ícone */}
              <div className={`
                w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4
                ${isHighlight
                  ? 'bg-white shadow-sm'
                  : 'bg-neutral-50'
                }
              `}>
                {benefit.icon}
              </div>

              {/* Conteúdo */}
              <h3 className={`font-bold text-lg mb-2 ${
                isHighlight ? 'text-green-900' : 'text-neutral-900'
              }`}>
                {benefit.title}
              </h3>
              <p className={`text-sm leading-relaxed ${
                isHighlight ? 'text-green-800' : 'text-neutral-600'
              }`}>
                {benefit.description}
              </p>

              {/* Checkmark de confirmação */}
              <div className={`
                mt-4 pt-4 border-t flex items-center gap-2
                ${isHighlight ? 'border-green-200' : 'border-neutral-200'}
              `}>
                <Check className={`w-4 h-4 ${
                  isHighlight ? 'text-green-600' : 'text-neutral-400'
                }`} />
                <span className={`text-xs font-medium ${
                  isHighlight ? 'text-green-700' : 'text-neutral-500'
                }`}>
                  Incluso em todos os planos
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA após benefícios */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-neutral-600 mb-4">
          Mais de {(2847).toLocaleString('pt-BR')} famílias já confiam na Terravik
        </p>
        <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
          <Check className="w-4 h-4 text-green-600" />
          <span>Cancele quando quiser</span>
          <span className="text-neutral-300">•</span>
          <Check className="w-4 h-4 text-green-600" />
          <span>Sem taxas ocultas</span>
          <span className="text-neutral-300">•</span>
          <Check className="w-4 h-4 text-green-600" />
          <span>Suporte especializado</span>
        </div>
      </motion.div>
    </div>
  );
}
