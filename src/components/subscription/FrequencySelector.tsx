'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, TrendingUp } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { FREQUENCY_OPTIONS } from '@/lib/subscription/mock-data';
import { formatPrice, calculateNextDeliveryDate, formatDeliveryDate } from '@/lib/subscription/pricing';
import { SubscriptionFrequency } from '@/lib/subscription/types';

interface FrequencySelectorProps {
  basePrice: number;
  className?: string;
}

/**
 * Seletor de frequência de entrega
 * 
 * PSICOLOGIA APLICADA:
 * - Opção recomendada (45 dias) com badge "Mais Popular" e destaque visual
 * - Economia progressiva visível: mais espaçamento = mais desconto
 * - Próxima data de entrega em cada opção (torna abstrato em concreto)
 * - Tooltip explicativo com contexto de jardinagem
 * - Animação de "pulse" no recomendado
 */
export function FrequencySelector({ basePrice, className = '' }: FrequencySelectorProps) {
  const { state, setFrequency } = useSubscription();
  const { frequency: selectedFrequency } = state;

  const handleSelect = (frequency: SubscriptionFrequency) => {
    setFrequency(frequency);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900">
          Com que frequência você quer receber?
        </h3>
        <span className="text-xs text-neutral-500">
          Você pode mudar depois
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {FREQUENCY_OPTIONS.map((option, index) => {
          const isSelected = selectedFrequency === option.days;
          const isRecommended = option.recommended;
          const subscriptionPrice = basePrice * (1 - option.discountPercent / 100);
          const nextDelivery = calculateNextDeliveryDate(new Date(), option.days);

          return (
            <motion.button
              key={option.days}
              onClick={() => handleSelect(option.days)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: isSelected ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-xl border-2 text-left transition-all
                ${isSelected
                  ? 'border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                  : 'border-neutral-200 bg-white hover:border-green-300 hover:shadow-md'
                }
                ${isRecommended && !isSelected ? 'ring-2 ring-green-200' : ''}
              `}
            >
              {/* Badge "Mais Popular" ou outro */}
              {option.badge && (
                <div className={`
                  absolute -top-2.5 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold
                  ${isRecommended
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md'
                    : isSelected
                    ? 'bg-green-600 text-white'
                    : 'bg-neutral-200 text-neutral-600'
                  }
                `}>
                  {isRecommended && <Sparkles className="w-3 h-3 inline mr-1" />}
                  {option.badge}
                </div>
              )}

              {/* Checkbox */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`
                  mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${isSelected
                    ? 'border-green-600 bg-green-600'
                    : 'border-neutral-300 bg-white'
                  }
                `}>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1">
                  <h4 className={`font-bold mb-1 ${
                    isSelected ? 'text-green-900' : 'text-neutral-900'
                  }`}>
                    {option.label}
                  </h4>
                  <p className={`text-xs leading-relaxed ${
                    isSelected ? 'text-green-700' : 'text-neutral-600'
                  }`}>
                    {option.description}
                  </p>
                </div>
              </div>

              {/* Preço e desconto */}
              <div className="flex items-end justify-between pt-3 border-t border-neutral-200">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-neutral-500 line-through">
                      {formatPrice(basePrice)}
                    </span>
                    <span className={`font-bold text-lg ${
                      isSelected ? 'text-green-700' : 'text-neutral-700'
                    }`}>
                      {formatPrice(subscriptionPrice)}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">por entrega</span>
                </div>

                {/* Badge de desconto */}
                <div className={`
                  flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold
                  ${isSelected
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-700'
                  }
                `}>
                  <TrendingUp className="w-3 h-3" />
                  {option.discountPercent}% OFF
                </div>
              </div>

              {/* Próxima entrega */}
              <div className={`mt-3 text-xs ${
                isSelected ? 'text-green-700' : 'text-neutral-500'
              }`}>
                📦 Próxima entrega: <span className="font-semibold">{formatDeliveryDate(nextDelivery)}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Dica contextual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <p className="text-xs text-blue-800">
          <strong>💡 Dica:</strong> A frequência ideal depende da condição do seu gramado. 
          Gramados estabelecidos: 45-60 dias. Gramados novos ou em recuperação: 30 dias.
        </p>
      </motion.div>
    </div>
  );
}
