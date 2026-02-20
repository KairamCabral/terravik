'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, TrendingDown } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { formatPrice } from '@/lib/subscription/pricing';

interface PurchaseToggleProps {
  basePrice: number;
  className?: string;
  showWarning?: boolean; // Mostrar aviso ao escolher compra única
}

/**
 * Toggle principal entre Compra Única e Assinatura
 * 
 * PSICOLOGIA APLICADA:
 * - Assinatura visualmente maior e mais atraente (default effect)
 * - Compra única aparece "desbotada" em comparação
 * - Badge de economia flutua sobre opção de assinatura
 * - Animação suave ao trocar (reward visual)
 * - Micro-aviso de perda ao selecionar compra única (loss aversion)
 */
export function PurchaseToggle({ 
  basePrice, 
  className = '',
  showWarning = true 
}: PurchaseToggleProps) {
  const { state, setMode, getTotalSavings, getAnnualSavings } = useSubscription();
  const { mode } = state;

  const subscriptionSavings = getTotalSavings();
  const annualSavings = getAnnualSavings();
  const savingsPercent = basePrice > 0 
    ? Math.round((subscriptionSavings / basePrice) * 100) 
    : 0;

  const handleModeChange = (newMode: 'one-time' | 'subscription') => {
    // Se tentar mudar para compra única e showWarning está ativo
    if (newMode === 'one-time' && showWarning && mode === 'subscription') {
      const confirmChange = window.confirm(
        `Tem certeza? Você deixará de economizar ${formatPrice(annualSavings)} por ano com a assinatura.`
      );
      if (!confirmChange) return;
    }
    
    setMode(newMode);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-neutral-900">Como deseja comprar?</h3>
        {mode === 'subscription' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 text-sm text-green-600"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">Economizando!</span>
          </motion.div>
        )}
      </div>

      {/* Toggle Options */}
      <div className="grid gap-3">
        {/* OPÇÃO 1: ASSINATURA (Pré-selecionada, visualmente superior) */}
        <motion.button
          onClick={() => handleModeChange('subscription')}
          whileHover={{ scale: mode === 'subscription' ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative p-5 rounded-xl border-2 text-left transition-all
            ${mode === 'subscription'
              ? 'border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
              : 'border-neutral-200 bg-white hover:border-green-300 hover:shadow-md'
            }
          `}
        >
          {/* Badge "Mais Popular" */}
          {mode === 'subscription' && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute -top-3 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md"
            >
              💎 Recomendado
            </motion.div>
          )}

          <div className="flex items-start gap-3">
            {/* Checkbox estilizado */}
            <div className={`
              mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${mode === 'subscription'
                ? 'border-green-600 bg-green-600'
                : 'border-neutral-300 bg-white'
              }
            `}>
              <AnimatePresence>
                {mode === 'subscription' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`font-bold text-lg ${
                  mode === 'subscription' ? 'text-green-900' : 'text-neutral-700'
                }`}>
                  Assinatura Inteligente
                </h4>
                {subscriptionSavings > 0 && (
                  <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                    -{savingsPercent}%
                  </span>
                )}
              </div>
              
              <p className={`text-sm mb-3 ${
                mode === 'subscription' ? 'text-green-800' : 'text-neutral-600'
              }`}>
                Receba automaticamente quando precisar e economize
              </p>

              {/* Benefícios rápidos */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 ${
                    mode === 'subscription' ? 'text-green-600' : 'text-neutral-400'
                  }`} />
                  <span className={mode === 'subscription' ? 'text-green-900' : 'text-neutral-600'}>
                    Economia de até {formatPrice(annualSavings)}/ano
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 ${
                    mode === 'subscription' ? 'text-green-600' : 'text-neutral-400'
                  }`} />
                  <span className={mode === 'subscription' ? 'text-green-900' : 'text-neutral-600'}>
                    Frete grátis em todas entregas
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 ${
                    mode === 'subscription' ? 'text-green-600' : 'text-neutral-400'
                  }`} />
                  <span className={mode === 'subscription' ? 'text-green-900' : 'text-neutral-600'}>
                    Cancele quando quiser, sem taxas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.button>

        {/* OPÇÃO 2: COMPRA ÚNICA (Visualmente inferior) */}
        <motion.button
          onClick={() => handleModeChange('one-time')}
          whileHover={{ scale: mode === 'one-time' ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            p-5 rounded-xl border-2 text-left transition-all
            ${mode === 'one-time'
              ? 'border-neutral-400 bg-white shadow-md'
              : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
            }
          `}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox estilizado */}
            <div className={`
              mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${mode === 'one-time'
                ? 'border-neutral-600 bg-neutral-600'
                : 'border-neutral-300 bg-white'
              }
            `}>
              <AnimatePresence>
                {mode === 'one-time' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1">
              <h4 className={`font-bold text-lg mb-1 ${
                mode === 'one-time' ? 'text-neutral-900' : 'text-neutral-500'
              }`}>
                Compra Única
              </h4>
              <p className={`text-sm ${
                mode === 'one-time' ? 'text-neutral-600' : 'text-neutral-400'
              }`}>
                Compre apenas quando precisar
              </p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Aviso de Perda (Loss Aversion) */}
      <AnimatePresence>
        {mode === 'one-time' && showWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-amber-900 mb-1">
                  Você está deixando de economizar
                </h5>
                <p className="text-sm text-amber-800">
                  Com a assinatura, você economizaria <strong>{formatPrice(annualSavings)}</strong> por ano, 
                  além de frete grátis em todas as entregas.
                </p>
                <button
                  onClick={() => setMode('subscription')}
                  className="mt-3 text-sm font-semibold text-amber-900 underline hover:text-amber-700"
                >
                  Mudar para assinatura e economizar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
