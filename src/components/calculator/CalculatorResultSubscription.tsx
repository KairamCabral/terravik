'use client';

/**
 * CalculatorResultSubscription - Resultado da Calculadora com Opção de Assinatura
 * 
 * INTEGRAÇÃO CRÍTICA: Calculadora → Assinatura
 * 
 * Este é o componente que converte usuários da calculadora em assinantes.
 * Momento perfeito pois:
 * - Usuário já demonstrou interesse
 * - Forneceu dados do gramado
 * - Está no mindset de "resolver o problema"
 * - Personalização aumenta conversão
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { useCalculator } from '@/hooks/useCalculator';
import { TrustIndicators } from '@/components/subscription';
import { Button, Badge } from '@/components/ui';
import { ProductPlanCard } from './ProductPlanCard';
import { CalendarBlock } from './CalendarBlock';
import { PackRecommendation } from './PackRecommendation';
import { CalculatorSubscriptionOffer } from './CalculatorSubscriptionOffer';
import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { OBJECTIVE_LABELS, CLIMATE_LABELS } from '@/lib/calculator/constants';
import { produtoDaCalculadora } from '@/lib/calculator/produtos';
import { useCatalogo } from '@/contexts/CatalogoContext';

interface CalculatorResultSubscriptionProps {
  calculator: ReturnType<typeof useCalculator>;
  onAddToCart?: (config: {
    products: any[];
    mode: 'one-time' | 'subscription';
    frequency?: number;
  }) => void;
}

export function CalculatorResultSubscription({
  calculator,
  onAddToCart,
}: CalculatorResultSubscriptionProps) {
  const { result, reset } = calculator;
  const catalogo = useCatalogo();
  
  if (!result) {
    return (
      <div className="text-center">
        <p className="text-gray-700">Erro ao gerar resultado. Tente novamente.</p>
        <Button onClick={reset} className="mt-4">
          Recomeçar
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-10 md:space-y-12">
      {/* ====================================================================
          HEADER DO RESULTADO
          ==================================================================== */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 md:h-24 md:w-24">
          <CheckCircle2 className="h-10 w-10 text-brand-green md:h-12 md:w-12" />
        </div>
        <h1 className="font-bold text-3xl text-gray-900 md:text-4xl lg:text-5xl mb-3">
          Seu plano personalizado está pronto! 🎉
        </h1>
        <p className="text-lg text-gray-600 md:text-xl">
          A dose do rótulo, na quantidade certa para o seu gramado de <strong>{result.area_m2} m²</strong>
        </p>
      </motion.div>
      
      {/* ====================================================================
          RESUMO DO GRAMADO
          ==================================================================== */}
      <motion.div
        className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-6 md:p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Sobre seu gramado
        </h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default" size="lg">
            📏 {result.area_m2} m²
          </Badge>
          <Badge variant="default" size="lg">
            🎯 {OBJECTIVE_LABELS[result.context.objetivo].title}
          </Badge>
          <Badge variant="default" size="lg">
            🌤️ {CLIMATE_LABELS[result.context.clima_hoje]}
          </Badge>
        </div>
      </motion.div>
      
      {/* ====================================================================
          AVISOS DO PLANO
          ==================================================================== */}
      {result.alerts.length > 0 && (
        <div className="space-y-3">
          {result.alerts.map((alerta) => (
            <div
              key={alerta}
              className="flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 p-4 md:p-5"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-700" aria-hidden="true" />
              <p className="text-sm text-yellow-900 md:text-base">{alerta}</p>
            </div>
          ))}
        </div>
      )}

      {/* ====================================================================
          PRODUTOS RECOMENDADOS (Cards tradicionais)
          ==================================================================== */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Produtos recomendados
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {result.plan.map((productPlan) => (
            <ProductPlanCard key={productPlan.product_id} plan={productPlan} />
          ))}
        </div>
      </div>
      
      {/* ====================================================================
          OFERTA DE ASSINATURA NOVA (CRÍTICA PARA CONVERSÃO)
          ==================================================================== */}
      <PackRecommendation plan={result.plan} />

      {result.plan.length > 0 && (() => {
        // Entrega recorrente só para o produto de uso contínuo do rótulo
        // (Resistência Total, a cada 60 dias). Raiz Forte é uso pontual e
        // Verde Rápido só se repete enquanto o gramado estiver amarelado:
        // nenhum dos dois sustenta assinatura.
        const continuo = result.plan.find((p) => p.frequency_kind === 'continuo');
        const mainProduct = continuo ?? result.plan[0];
        const mockProduct = produtoDaCalculadora(catalogo, mainProduct.product_id);

        if (!mockProduct || mockProduct.variants.length === 0) {
          return null;
        }

        const variant = mockProduct.variants.find(v => v.available) || mockProduct.variants[0];

        return (
          <CalculatorSubscriptionOffer
            calculatedArea={result.area_m2}
            recommendedProduct={{
              id: mockProduct.id,
              name: mockProduct.title,
              handle: mockProduct.handle,
              price: variant.price,
              variantId: variant.id,
              image: mockProduct.featuredImage?.url,
            }}
            recommendedQuantity={Math.max(1, mainProduct.packs_qty)}
            allowSubscription={Boolean(continuo)}
            frequencyDays={continuo ? continuo.frequency_days : undefined}
            usageNote={mainProduct.frequency_display}
          />
        );
      })()}
      
      {/* O bloco SmartRecommendation saiu daqui. Ele monta um plano anual próprio
          (src/lib/subscription/recommendations.ts) com produtos e embalagens que
          não existem e com intervalo fixo para todos os produtos, o que
          contradiz o rótulo: Raiz Forte é uso pontual, Verde Rápido repete só
          se precisar e Resistência Total é a cada 60 dias. Volta quando aquela lista usar os
          fatos de docs/produtos-fatos-do-rotulo.md. */}

      {/* ====================================================================
          CALENDÁRIO DE APLICAÇÃO
          ==================================================================== */}
      <CalendarBlock plan={result.plan} />

      <div className="text-center">
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
          Refazer o cálculo
        </Button>
      </div>
      
      {/* ====================================================================
          TRUST INDICATORS
          ==================================================================== */}
      <div className="py-6 border-t border-b border-gray-200">
        <TrustIndicators />
      </div>
    </div>
  );
}

export default CalculatorResultSubscription;
