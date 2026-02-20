'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, PiggyBank, Check } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { 
  formatPrice, 
  getSavingsAnalogy, 
  getSavingsEmoji,
  getDeliveriesPerYear 
} from '@/lib/subscription/pricing';

interface SavingsCalculatorProps {
  basePrice: number;
  showAnnualProjection?: boolean;
  className?: string;
}

/**
 * Calculadora visual de economia
 * 
 * PSICOLOGIA APLICADA:
 * - Números grandes e animados (contagem progressiva = satisfação)
 * - Verde para economia, destaque em valores grandes
 * - Comparativo lado a lado visual (Sem vs Com assinatura)
 * - Analogia tangível do que dá pra fazer com a economia
 * - Emoji de cofrinho/dinheiro para reforço visual
 */
export function SavingsCalculator({ 
  basePrice, 
  showAnnualProjection = true,
  className = '' 
}: SavingsCalculatorProps) {
  const { state, getTotalSavings, getAnnualSavings } = useSubscription();
  const { mode, frequency } = state;

  const [animatedSavings, setAnimatedSavings] = useState(0);
  const [animatedAnnual, setAnimatedAnnual] = useState(0);

  const actualSavings = getTotalSavings();
  const annualSavings = getAnnualSavings();
  const deliveriesPerYear = getDeliveriesPerYear(frequency);

  // Animação de contagem progressiva
  useEffect(() => {
    if (mode !== 'subscription') {
      setAnimatedSavings(0);
      setAnimatedAnnual(0);
      return;
    }

    const duration = 1500; // 1.5s
    const steps = 60;
    const incrementSavings = actualSavings / steps;
    const incrementAnnual = annualSavings / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setAnimatedSavings(prev => Math.min(prev + incrementSavings, actualSavings));
      setAnimatedAnnual(prev => Math.min(prev + incrementAnnual, annualSavings));

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [actualSavings, annualSavings, mode]);

  if (mode !== 'subscription') {
    return null;
  }

  const savingsEmoji = getSavingsEmoji(annualSavings);
  const analogy = getSavingsAnalogy(annualSavings);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <PiggyBank className="w-6 h-6 text-green-600" />
        <h3 className="font-bold text-lg text-green-900">
          Sua Economia com Assinatura
        </h3>
      </div>

      {/* Grid de valores */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {/* Economia por entrega */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-neutral-600">Por entrega</span>
          </div>
          <motion.div
            key={animatedSavings}
            className="text-3xl font-bold text-green-600"
          >
            {formatPrice(animatedSavings)}
          </motion.div>
          <p className="text-xs text-neutral-500 mt-1">
            Comparado à compra avulsa
          </p>
        </div>

        {/* Economia anual */}
        {showAnnualProjection && (
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg p-4 shadow-md text-white">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-medium">Economia anual</span>
            </div>
            <motion.div
              key={animatedAnnual}
              className="text-3xl font-bold"
            >
              {formatPrice(animatedAnnual)}
            </motion.div>
            <p className="text-xs text-green-100 mt-1">
              Em {deliveriesPerYear} entregas por ano
            </p>
          </div>
        )}
      </div>

      {/* Analogia tangível */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-green-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{savingsEmoji}</span>
          <div className="flex-1">
            <p className="text-sm text-neutral-700 leading-relaxed">
              Com essa economia anual, você poderia{' '}
              <strong className="text-green-700">pagar {analogy}</strong>!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Breakdown detalhado */}
      <div className="mt-4 pt-4 border-t border-green-200 space-y-2 text-sm">
        <div className="flex justify-between text-neutral-700">
          <span>Preço por entrega (sem assinatura)</span>
          <span className="font-semibold">{formatPrice(basePrice)}</span>
        </div>
        <div className="flex justify-between text-green-700">
          <span>Preço por entrega (com assinatura)</span>
          <span className="font-bold">{formatPrice(basePrice - actualSavings)}</span>
        </div>
        <div className="flex justify-between text-green-700 font-bold pt-2 border-t border-green-200">
          <span className="flex items-center gap-1">
            <Check className="w-4 h-4" />
            Você economiza
          </span>
          <span>{formatPrice(actualSavings)} por entrega</span>
        </div>
      </div>
    </motion.div>
  );
}
