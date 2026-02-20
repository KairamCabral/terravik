'use client';

import { Shield, Lock, RotateCcw, Star, Users } from 'lucide-react';
import { SUBSCRIPTION_STATS } from '@/lib/subscription/mock-data';

interface TrustIndicatorsProps {
  variant?: 'default' | 'compact';
  className?: string;
}

/**
 * Indicadores de confiança e prova social
 * 
 * PSICOLOGIA APLICADA:
 * - Números específicos (não "milhares" mas "2.847 famílias")
 * - Ícones de segurança (SSL, pagamento seguro)
 * - Garantias explícitas e destacadas
 * - Rating com estrelas (prova social)
 * - "Cancele a qualquer momento" em destaque (reduz risco percebido)
 */
export function TrustIndicators({ variant = 'default', className = '' }: TrustIndicatorsProps) {
  const { activeSubscribers, averageRating, totalReviews } = SUBSCRIPTION_STATS;

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-600 ${className}`}>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-green-600" />
          <span>
            <strong className="text-neutral-900">{activeSubscribers.toLocaleString('pt-BR')}</strong> assinantes
          </span>
        </div>
        
        <div className="w-px h-4 bg-neutral-300" />
        
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>
            <strong className="text-neutral-900">{averageRating}/5</strong> ({totalReviews.toLocaleString('pt-BR')} avaliações)
          </span>
        </div>
        
        <div className="w-px h-4 bg-neutral-300" />
        
        <div className="flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-green-600" />
          <span className="font-medium">Cancele quando quiser</span>
        </div>
      </div>
    );
  }

  // Default variant - mais detalhado
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra principal */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="font-bold text-neutral-900">
              {activeSubscribers.toLocaleString('pt-BR')} famílias
            </div>
            <div className="text-xs text-neutral-600">já confiam na Terravik</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-neutral-200 text-neutral-200'
                }`}
              />
            ))}
          </div>
          <div>
            <div className="font-bold text-neutral-900">{averageRating}/5</div>
            <div className="text-xs text-neutral-600">
              {totalReviews.toLocaleString('pt-BR')} avaliações
            </div>
          </div>
        </div>
      </div>

      {/* Garantias */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-sm">
            <div className="font-bold text-neutral-900">Garantia Total</div>
            <div className="text-xs text-neutral-600">30 dias para devolver</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-sm">
            <div className="font-bold text-neutral-900">Cancele Fácil</div>
            <div className="text-xs text-neutral-600">Sem taxas ou burocracia</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-sm">
            <div className="font-bold text-neutral-900">100% Seguro</div>
            <div className="text-xs text-neutral-600">Pagamento protegido</div>
          </div>
        </div>
      </div>
    </div>
  );
}
