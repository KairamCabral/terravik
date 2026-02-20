'use client';

import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useState } from 'react';
import { calculateDeliveryDates, formatPrice } from '@/lib/subscription/pricing';
import { SubscriptionFrequency, SubscriptionProduct } from '@/lib/subscription/types';

interface DeliveryCalendarProps {
  frequency: SubscriptionFrequency;
  products: SubscriptionProduct[];
  startDate?: Date;
  className?: string;
}

/**
 * Calendário visual de entregas futuras
 * 
 * PSICOLOGIA APLICADA:
 * - Visualização mensal cria senso de controle
 * - Datas específicas reduzem ansiedade
 * - Countdown para próxima entrega (antecipação positiva)
 * - Cores suaves e design clean (reduz sobrecarga cognitiva)
 */
export function DeliveryCalendar({ 
  frequency, 
  products, 
  startDate = new Date(),
  className = '' 
}: DeliveryCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const deliveryDates = calculateDeliveryDates(startDate, frequency, 12);
  
  // Filtrar entregas do mês atual
  const deliveriesThisMonth = deliveryDates.filter(date => 
    date.getMonth() === currentMonth.getMonth() &&
    date.getFullYear() === currentMonth.getFullYear()
  );

  const totalPerDelivery = products.reduce(
    (sum, p) => sum + (p.subscriptionPrice * p.quantity),
    0
  );

  const goToPreviousMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const goToNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const monthName = currentMonth.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className={`bg-white rounded-xl border-2 border-neutral-200 p-6 ${className}`}>
      {/* Header do calendário */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-600" />
        </button>
        
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-lg text-neutral-900 capitalize">
              {monthName}
            </h3>
          </div>
          {deliveriesThisMonth.length > 0 && (
            <p className="text-sm text-neutral-600">
              {deliveriesThisMonth.length} {deliveriesThisMonth.length === 1 ? 'entrega' : 'entregas'}
            </p>
          )}
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-neutral-600" />
        </button>
      </div>

      {/* Entregas do mês */}
      {deliveriesThisMonth.length > 0 ? (
        <div className="space-y-3">
          {deliveriesThisMonth.map((date, index) => {
            const isNext = index === 0 && 
              date.getMonth() === new Date().getMonth() && 
              date >= new Date();

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${isNext
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md'
                    : 'bg-neutral-50 border-neutral-200'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Data */}
                  <div className={`
                    w-14 h-14 rounded-xl flex flex-col items-center justify-center
                    ${isNext
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-900'
                    }
                  `}>
                    <div className="text-xs font-medium">
                      {date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                    </div>
                    <div className="text-2xl font-bold">
                      {date.getDate()}
                    </div>
                  </div>

                  {/* Detalhes */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className={`w-4 h-4 ${
                        isNext ? 'text-green-600' : 'text-neutral-600'
                      }`} />
                      <span className={`font-semibold ${
                        isNext ? 'text-green-900' : 'text-neutral-900'
                      }`}>
                        Entrega Programada
                      </span>
                      {isNext && (
                        <span className="ml-auto text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                          Próxima
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {products.map(p => `${p.quantity}x ${p.name}`).join(', ')}
                    </div>
                    <div className="text-sm font-semibold text-neutral-900 mt-1">
                      {formatPrice(totalPerDelivery)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-neutral-500">
          <Calendar className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p>Nenhuma entrega programada para este mês</p>
          <p className="text-sm mt-1">Navegue pelos meses para ver o calendário completo</p>
        </div>
      )}

      {/* Legenda */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span>Próxima entrega</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-neutral-300" />
            <span>Entregas futuras</span>
          </div>
        </div>
      </div>
    </div>
  );
}
