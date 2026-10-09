// src/components/product/PurchaseSection.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, ProductVariant } from '@/types/product';
import { PurchaseModeToggle } from './PurchaseModeToggle';
import { FrequencyPicker } from './FrequencyPicker';
import { PriceDisplay } from './PriceDisplay';
import { SavingsHighlight } from './SavingsHighlight';
import { SubscriptionBenefits } from './SubscriptionBenefits';
import { TrustSignals } from './TrustSignals';
import { AddToCartSection } from './AddToCartSection';
import { VariantSelector } from './VariantSelector';
import { 
  calculateSubscriptionPrice, 
  calculateAnnualSavings,
  getDiscountPercent 
} from '@/lib/subscription/pricing';

interface PurchaseSectionProps {
  product: Product;
  selectedVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
  /** Conteúdo entre a variante e a quantidade (simulador de frete). */
  freteSlot?: React.ReactNode;
  /** Mostra a barra fixa de compra no celular. */
  barraFixaVisivel?: boolean;
}

export function PurchaseSection({ 
  product, 
  selectedVariant,
  onVariantChange,
  freteSlot,
  barraFixaVisivel = false,
}: PurchaseSectionProps) {
  // Estado do modo de compra (compra única como padrão)
  const [purchaseMode, setPurchaseMode] = useState<'one-time' | 'subscription'>('one-time');
  const [frequency, setFrequency] = useState<30 | 60 | 90>(60);
  const [quantity, setQuantity] = useState(1);
  const [showBenefits, setShowBenefits] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Preços calculados
  const basePrice = selectedVariant.price;
  const compareAtPrice = selectedVariant.compareAtPrice || null;
  
  const subscriptionPrice = calculateSubscriptionPrice(basePrice, frequency);
  const discountPercent = getDiscountPercent(frequency);
  const savingsPerDelivery = basePrice - subscriptionPrice;
  const annualSavings = calculateAnnualSavings(basePrice, frequency, quantity);

  // Efeito: Mostrar benefícios após interação
  useEffect(() => {
    if (hasInteracted && purchaseMode === 'subscription') {
      const timer = setTimeout(() => setShowBenefits(true), 300);
      return () => clearTimeout(timer);
    }
  }, [hasInteracted, purchaseMode]);

  // Handler para mudança de modo
  const handleModeChange = useCallback((mode: 'one-time' | 'subscription') => {
    setPurchaseMode(mode);
    setHasInteracted(true);
    
    // Analytics event (se tiver)
    // trackEvent('purchase_mode_change', { mode, product: product.handle });
  }, [product.handle]);

  // Handler para mudança de frequência
  const handleFrequencyChange = useCallback((newFrequency: 30 | 60 | 90) => {
    setFrequency(newFrequency);
    setHasInteracted(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* ========== PREÇO PRINCIPAL ========== */}
      <PriceDisplay
        basePrice={basePrice}
        compareAtPrice={compareAtPrice}
        subscriptionPrice={subscriptionPrice}
        discountPercent={discountPercent}
        purchaseMode={purchaseMode}
        quantity={quantity}
      />

      {/* ========== TOGGLE COMPRA/ASSINATURA ========== */}
      <PurchaseModeToggle
        currentMode={purchaseMode}
        onModeChange={handleModeChange}
        savingsPercent={discountPercent}
        savingsAmount={savingsPerDelivery}
      />

      {/* ========== SELETOR DE FREQUÊNCIA ========== */}
      <AnimatePresence mode="wait">
        {purchaseMode === 'subscription' && (
          <motion.div
            key="frequency-picker"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <FrequencyPicker
              selectedFrequency={frequency}
              onFrequencyChange={handleFrequencyChange}
              basePrice={basePrice}
              quantity={quantity}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== DESTAQUE DE ECONOMIA ========== */}
      <AnimatePresence mode="wait">
        {purchaseMode === 'subscription' && (
          <motion.div
            key="savings-highlight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <SavingsHighlight
              annualSavings={annualSavings}
              frequency={frequency}
              quantity={quantity}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== TAMANHO (seletor intuitivo como quantidade) ========== */}
      <VariantSelector
        variants={product.variants}
        selectedVariantId={selectedVariant.id}
        onSelect={(variantId) => {
          const variant = product.variants.find((v) => v.id === variantId);
          if (variant) onVariantChange(variant);
        }}
        intuitive
      />

      {freteSlot}

      {/* ========== SEÇÃO DE ADICIONAR AO CARRINHO ========== */}
      <AddToCartSection
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        onQuantityChange={setQuantity}
        purchaseMode={purchaseMode}
        frequency={frequency}
        subscriptionPrice={subscriptionPrice}
        barraFixaVisivel={barraFixaVisivel}
      />

      {/* ========== BENEFÍCIOS DA ASSINATURA ========== */}
      <AnimatePresence>
        {purchaseMode === 'subscription' && showBenefits && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <SubscriptionBenefits compact />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== AVISO DE PERDA (se compra única) ========== */}
      <AnimatePresence>
        {purchaseMode === 'one-time' && hasInteracted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <LossAversionNotice
              annualSavings={annualSavings}
              onSwitchToSubscription={() => handleModeChange('subscription')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== INDICADORES DE CONFIANÇA ========== */}
      <TrustSignals />
    </div>
  );
}

// ============================================
// SUB-COMPONENTE: Aviso de Perda (Loss Aversion)
// ============================================
function LossAversionNotice({ 
  annualSavings, 
  onSwitchToSubscription 
}: { 
  annualSavings: number;
  onSwitchToSubscription: () => void;
}) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
      {/* Ícone decorativo */}
      <div className="absolute -right-4 -top-4 text-6xl opacity-10">
        💸
      </div>
      
      <div className="relative flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
          <span className="text-lg">⚠️</span>
        </div>
        
        <div className="flex-1">
          <p className="font-semibold text-amber-900">
            Você está deixando de economizar {formatPrice(annualSavings)}/ano
          </p>
          <p className="mt-1 text-sm text-amber-700">
            Com a assinatura você recebe frete grátis e pode cancelar quando quiser.
          </p>
          
          <button
            onClick={onSwitchToSubscription}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-900 underline decoration-amber-300 underline-offset-2 transition-colors hover:text-amber-700 hover:decoration-amber-500"
          >
            Quero economizar
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
