'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain, Check, ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { generateRecommendation } from '@/lib/subscription/recommendations';
import { formatPrice } from '@/lib/subscription/pricing';
import { LawnData, SmartRecommendation as Recommendation } from '@/lib/subscription/types';

interface SmartRecommendationProps {
  lawnData: LawnData;
  onAccept: (recommendation: Recommendation) => void;
  onCustomize: () => void;
  className?: string;
}

/**
 * Recomendação inteligente baseada nos dados do gramado
 * 
 * PSICOLOGIA APLICADA:
 * - Personalização aumenta confiança e conversão
 * - "Criado especialmente para você" (exclusividade)
 * - Explicação transparente do raciocínio (confiança)
 * - Confidence score visível (honestidade)
 * - Avatar de especialista (autoridade)
 */
export function SmartRecommendation({ 
  lawnData, 
  onAccept, 
  onCustomize,
  className = '' 
}: SmartRecommendationProps) {
  const recommendation = generateRecommendation(lawnData);

  const confidenceColor = {
    high: 'text-green-600',
    medium: 'text-amber-600',
    low: 'text-neutral-500'
  }[recommendation.confidence];

  const confidenceLabel = {
    high: 'Alta confiança',
    medium: 'Média confiança',
    low: 'Baixa confiança'
  }[recommendation.confidence];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative overflow-hidden rounded-2xl border-2 border-amber-300 
        bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 
        shadow-xl
        ${className}
      `}
    >
      {/* Shine effect */}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 7,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      <div className="relative p-6">
        {/* Header com especialista */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
            👨‍🌾
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading text-xl font-bold text-neutral-900">
                Recomendação Personalizada
              </h3>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-sm text-neutral-600">
              Baseado nas informações do seu gramado de <strong>{lawnData.area}m²</strong>
            </p>
            <div className={`flex items-center gap-1 mt-1 text-xs ${confidenceColor}`}>
              <Brain className="w-3 h-3" />
              <span className="font-semibold">{confidenceLabel}</span>
            </div>
          </div>
        </div>

        {/* Raciocínio */}
        <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 mb-6">
          <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Por que recomendamos isso?
          </h4>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {recommendation.reasoning}
          </p>
        </div>

        {/* Plano recomendado */}
        <div className="space-y-4 mb-6">
          {/* Frequência */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-neutral-700">Frequência</span>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                Recomendado
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">
              A cada {recommendation.recommendedFrequency} dias
            </div>
            <div className="text-xs text-neutral-600">
              {recommendation.annualPlan.deliveries} entregas por ano
            </div>
          </div>

          {/* Produtos */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm font-semibold text-neutral-700 mb-3">
              Produtos Incluídos
            </div>
            <div className="space-y-2">
              {recommendation.recommendedProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-neutral-900 text-sm">
                      {product.quantity}x {product.name}
                    </div>
                    <div className="text-xs text-neutral-600">{product.reason}</div>
                  </div>
                  <div className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${product.priority === 'essential' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                    }
                  `}>
                    {product.priority === 'essential' ? 'Essencial' : 'Recomendado'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumo financeiro */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-green-100 mb-1">Custo anual</div>
              <div className="text-2xl font-bold">
                {formatPrice(recommendation.annualPlan.totalCost)}
              </div>
            </div>
            <div>
              <div className="text-xs text-green-100 mb-1">Economia anual</div>
              <div className="text-2xl font-bold flex items-center gap-1">
                <TrendingUp className="w-5 h-5" />
                {formatPrice(recommendation.annualPlan.savings)}
              </div>
            </div>
          </div>
          <div className="text-xs text-green-100">
            Incluindo frete grátis em todas as {recommendation.annualPlan.deliveries} entregas
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="premium"
            size="lg"
            onClick={() => onAccept(recommendation)}
            className="flex-1"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Aceitar Recomendação
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onCustomize}
            className="flex-1 sm:flex-none"
          >
            Personalizar
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-neutral-600 text-center mt-4">
          Esta recomendação é baseada nas melhores práticas de jardinagem. 
          Você pode ajustar a qualquer momento.
        </p>
      </div>
    </motion.div>
  );
}
