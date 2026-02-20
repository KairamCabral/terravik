// src/components/calculator/CalculatorSubscriptionOffer.tsx

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Check, 
  Truck, 
  Calendar, 
  TrendingUp,
  Gift,
  Shield,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import {
  getDiscountPercent,
  calculateSubscriptionPrice,
  calculateAnnualSavings,
  formatPrice,
  getRecommendedFrequency,
  getSavingsAnalogy,
  FREQUENCY_OPTIONS_EXTENDED,
  FrequencyDays,
} from '@/lib/subscription/pricing';

interface CalculatorSubscriptionOfferProps {
  // Dados da calculadora
  calculatedArea: number;           // m² do gramado
  recommendedProduct: {
    id: string;
    name: string;
    handle: string;
    price: number;
    variantId: string;
    image?: string;
  };
  recommendedQuantity: number;      // Quantidade calculada
  lawnCondition?: 'poor' | 'fair' | 'good' | 'excellent';
  
  // Callbacks
  onAddToCart?: () => void;
  onClose?: () => void;
}

export function CalculatorSubscriptionOffer({
  calculatedArea,
  recommendedProduct,
  recommendedQuantity,
  lawnCondition = 'fair',
  onAddToCart,
  onClose,
}: CalculatorSubscriptionOfferProps) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  
  // Estados
  const [purchaseMode, setPurchaseMode] = useState<'one-time' | 'subscription'>('subscription');
  const [frequency, setFrequency] = useState<FrequencyDays>(() => 
    getRecommendedFrequency(lawnCondition)
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Cálculos
  const basePrice = recommendedProduct.price;
  const totalBasePrice = basePrice * recommendedQuantity;
  
  const calculations = useMemo(() => {
    const discountPercent = getDiscountPercent(frequency);
    const subscriptionPrice = calculateSubscriptionPrice(basePrice, frequency);
    const totalSubscriptionPrice = subscriptionPrice * recommendedQuantity;
    const savingsPerDelivery = (totalBasePrice - totalSubscriptionPrice);
    const annualSavings = calculateAnnualSavings(basePrice, frequency, recommendedQuantity);
    
    return {
      discountPercent,
      subscriptionPrice,
      totalSubscriptionPrice,
      savingsPerDelivery,
      annualSavings,
      savingsAnalogy: getSavingsAnalogy(annualSavings),
    };
  }, [basePrice, frequency, recommendedQuantity, totalBasePrice]);

  // Handler de adicionar ao carrinho
  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      // Adicionar ao carrinho (mock ou real)
      await addItem(recommendedProduct.variantId, recommendedQuantity);
      
      setIsAdded(true);
      
      // Feedback e abrir carrinho
      setTimeout(() => {
        openCart();
        onAddToCart?.();
      }, 500);
      
    } catch (error) {
      console.error('Erro ao adicionar:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden"
    >
      {/* ===== HEADER COM DESTAQUE ===== */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium text-emerald-100">
            Recomendação personalizada
          </span>
        </div>
        <h3 className="text-xl font-bold">
          Plano ideal para seu gramado de {calculatedArea}m²
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* ===== PRODUTO RECOMENDADO ===== */}
        <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
          {recommendedProduct.image && (
            <Image
              src={recommendedProduct.image}
              alt={recommendedProduct.name}
              width={80}
              height={80}
              className="object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <h4 className="font-semibold text-neutral-900">
              {recommendedProduct.name}
            </h4>
            <p className="text-sm text-neutral-500">
              {recommendedQuantity} {recommendedQuantity > 1 ? 'unidades' : 'unidade'} • 
              Cobre {calculatedArea}m²
            </p>
          </div>
        </div>

        {/* ===== TOGGLE COMPRA/ASSINATURA ===== */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-neutral-700">
            Como você quer receber?
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Compra Única */}
            <button
              onClick={() => setPurchaseMode('one-time')}
              className={`
                relative p-4 rounded-xl border-2 text-left transition-all
                ${purchaseMode === 'one-time'
                  ? 'border-neutral-900 bg-neutral-50'
                  : 'border-neutral-200 hover:border-neutral-300'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${purchaseMode === 'one-time' ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'}
                `}>
                  {purchaseMode === 'one-time' && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="font-medium">Compra única</span>
              </div>
              <p className="text-lg font-bold text-neutral-900">
                {formatPrice(totalBasePrice)}
              </p>
            </button>

            {/* Assinatura */}
            <button
              onClick={() => setPurchaseMode('subscription')}
              className={`
                relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden
                ${purchaseMode === 'subscription'
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300'
                }
              `}
            >
              {/* Badge Popular */}
              <div className="absolute -right-8 top-2 rotate-45 bg-amber-400 text-white text-[10px] font-bold px-8 py-0.5">
                POPULAR
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${purchaseMode === 'subscription' ? 'border-emerald-600 bg-emerald-600' : 'border-emerald-300'}
                `}>
                  {purchaseMode === 'subscription' && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="font-medium text-emerald-900">Assinar</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-emerald-700">
                  {formatPrice(calculations.totalSubscriptionPrice)}
                </span>
                <span className="text-sm text-emerald-600">
                  -{calculations.discountPercent}%
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* ===== SELETOR DE FREQUÊNCIA ===== */}
        <AnimatePresence>
          {purchaseMode === 'subscription' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-neutral-700">
                Frequência de entrega
              </p>
              
              <div className="grid grid-cols-4 gap-2">
                {FREQUENCY_OPTIONS_EXTENDED.map((option) => {
                  const isSelected = frequency === option.days;
                  const discount = getDiscountPercent(option.days);
                  
                  return (
                    <button
                      key={option.days}
                      onClick={() => setFrequency(option.days)}
                      className={`
                        relative flex flex-col items-center p-3 rounded-xl border-2 transition-all
                        ${isSelected
                          ? 'border-emerald-600 bg-emerald-50'
                          : 'border-neutral-200 hover:border-emerald-200'
                        }
                      `}
                    >
                      {option.tag && (
                        <div className={`
                          absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap
                          ${option.recommended ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-700'}
                        `}>
                          {option.tag}
                        </div>
                      )}
                      
                      <span className="text-lg font-bold">{option.days}</span>
                      <span className="text-[10px] text-neutral-500">dias</span>
                      <span className={`
                        mt-1 text-xs font-bold px-2 py-0.5 rounded-full
                        ${isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'}
                      `}>
                        -{discount}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== DESTAQUE DE ECONOMIA ===== */}
        <AnimatePresence>
          {purchaseMode === 'subscription' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-5 text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium text-emerald-100">Sua economia anual</span>
              </div>
              
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-bold">
                  {formatPrice(calculations.annualSavings)}
                </span>
                <span className="text-emerald-200">/ano</span>
              </div>
              
              <p className="text-sm text-emerald-100">
                💡 Com esse valor você poderia ter {calculations.savingsAnalogy}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== AVISO DE PERDA (se compra única) ===== */}
        <AnimatePresence>
          {purchaseMode === 'one-time' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">💸</span>
                <div>
                  <p className="font-semibold text-amber-900">
                    Você está deixando de economizar {formatPrice(calculations.annualSavings)}/ano
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Assinantes têm frete grátis e podem cancelar quando quiser.
                  </p>
                  <button
                    onClick={() => setPurchaseMode('subscription')}
                    className="mt-2 text-sm font-semibold text-amber-900 underline"
                  >
                    Quero economizar →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== BENEFÍCIOS RÁPIDOS ===== */}
        {purchaseMode === 'subscription' && (
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Truck, text: 'Frete grátis' },
              { icon: Calendar, text: 'Flexível' },
              { icon: Shield, text: 'Cancele grátis' },
            ].map((benefit) => (
              <div
                key={benefit.text}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full text-xs font-medium text-emerald-700"
              >
                <benefit.icon className="h-3.5 w-3.5" />
                {benefit.text}
              </div>
            ))}
          </div>
        )}

        {/* ===== BOTÃO DE AÇÃO ===== */}
        <motion.button
          onClick={handleAddToCart}
          disabled={isAdding || isAdded}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`
            w-full py-4 rounded-xl text-lg font-semibold text-white transition-all
            ${purchaseMode === 'subscription'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-200'
              : 'bg-neutral-900'
            }
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
        >
          {isAdding ? (
            <span className="flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 animate-pulse" />
              Adicionando...
            </span>
          ) : isAdded ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="h-5 w-5" />
              Adicionado!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {purchaseMode === 'subscription' ? (
                <>
                  <Sparkles className="h-5 w-5" />
                  Assinar e economizar {formatPrice(calculations.annualSavings)}/ano
                </>
              ) : (
                <>
                  Adicionar ao carrinho • {formatPrice(totalBasePrice)}
                </>
              )}
            </span>
          )}
        </motion.button>

        {/* ===== NOTA DE SEGURANÇA ===== */}
        <p className="text-center text-xs text-neutral-500">
          {purchaseMode === 'subscription' 
            ? 'Primeira entrega em até 7 dias • Cancele quando quiser'
            : 'Compra segura via Shopify'
          }
        </p>
      </div>
    </motion.div>
  );
}
