'use client';

import { motion } from 'framer-motion';
import { Package, Calendar, TrendingUp } from 'lucide-react';
import { calculateDeliveryDates, formatDeliveryDate, formatPrice } from '@/lib/subscription/pricing';
import { SubscriptionFrequency, SubscriptionProduct } from '@/lib/subscription/types';

interface SubscriptionTimelineProps {
  startDate?: Date;
  frequency: SubscriptionFrequency;
  products: SubscriptionProduct[];
  monthsToShow?: number;
  className?: string;
}

/**
 * Timeline visual de entregas futuras
 * 
 * PSICOLOGIA APLICADA:
 * - Visualização de futuro cria compromisso mental
 * - Datas específicas tornam abstrato em concreto
 * - Economia acumulada visível (reforço positivo)
 * - Ícones de estação do ano (conexão emocional)
 * - Próxima entrega destacada
 */
export function SubscriptionTimeline({ 
  startDate = new Date(),
  frequency,
  products,
  monthsToShow = 6,
  className = '' 
}: SubscriptionTimelineProps) {
  const deliveryDates = calculateDeliveryDates(startDate, frequency, monthsToShow);
  
  const totalPerDelivery = products.reduce(
    (sum, p) => sum + (p.subscriptionPrice * p.quantity),
    0
  );
  
  const savingsPerDelivery = products.reduce(
    (sum, p) => sum + ((p.basePrice - p.subscriptionPrice) * p.quantity),
    0
  );

  // Ícones de estação
  const getSeasonIcon = (date: Date) => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return '🌸'; // Outono
    if (month >= 5 && month <= 7) return '❄️'; // Inverno
    if (month >= 8 && month <= 10) return '🌱'; // Primavera
    return '☀️'; // Verão
  };

  return (
    <div className={`${className}`}>
      <div className="text-center mb-8">
        <h3 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
          Seu calendário de entregas
        </h3>
        <p className="text-neutral-600">
          Próximas {deliveryDates.length} entregas programadas
        </p>
      </div>

      {/* Timeline horizontal (scroll em mobile) */}
      <div className="relative">
        {/* Linha conectora */}
        <div className="hidden md:block absolute top-12 left-12 right-12 h-1 bg-gradient-to-r from-green-200 via-green-300 to-green-200 rounded-full" />

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {deliveryDates.map((date, index) => {
            const isNext = index === 0;
            const accumulatedSavings = savingsPerDelivery * (index + 1);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Card da entrega */}
                <div className={`
                  p-4 rounded-xl border-2 transition-all
                  ${isNext
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                    : 'bg-white border-neutral-200 hover:border-green-200'
                  }
                `}>
                  {/* Número da entrega */}
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-3 mx-auto
                    ${isNext
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-600'
                    }
                  `}>
                    {index + 1}
                  </div>

                  {/* Ícone de estação */}
                  <div className="text-2xl text-center mb-2">
                    {getSeasonIcon(date)}
                  </div>

                  {/* Data */}
                  <div className="text-center mb-3">
                    <div className={`text-xs font-semibold mb-1 ${
                      isNext ? 'text-green-700' : 'text-neutral-600'
                    }`}>
                      {date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                    </div>
                    <div className={`text-lg font-bold ${
                      isNext ? 'text-green-900' : 'text-neutral-900'
                    }`}>
                      {date.getDate()}
                    </div>
                  </div>

                  {/* Valor */}
                  <div className="text-center py-2 bg-neutral-50 rounded-lg mb-2">
                    <div className="text-xs text-neutral-500 mb-0.5">Valor</div>
                    <div className="font-bold text-neutral-900">
                      {formatPrice(totalPerDelivery)}
                    </div>
                  </div>

                  {/* Economia acumulada */}
                  {index > 0 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-semibold">
                          {formatPrice(accumulatedSavings)}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500">economizados</div>
                    </div>
                  )}

                  {/* Badge "Próxima" */}
                  {isNext && (
                    <div className="mt-3 text-center">
                      <div className="inline-flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        <Package className="w-3 h-3" />
                        Próxima
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Resumo final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white text-center"
        >
          <Calendar className="w-8 h-8 mx-auto mb-3 opacity-90" />
          <h4 className="font-bold text-xl mb-2">
            Economia Total em {monthsToShow} Meses
          </h4>
          <div className="text-4xl font-bold mb-2">
            {formatPrice(savingsPerDelivery * deliveryDates.length)}
          </div>
          <p className="text-green-100 text-sm">
            Sem contar o frete grátis em todas as entregas!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
