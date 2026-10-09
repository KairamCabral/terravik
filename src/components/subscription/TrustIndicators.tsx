'use client';

import { Shield, Lock, RotateCcw } from 'lucide-react';

interface TrustIndicatorsProps {
  variant?: 'default' | 'compact';
  className?: string;
}

/**
 * Indicadores de confiança: só garantias, que são fatos da política da loja.
 *
 * A contagem de assinantes, a nota média e o total de avaliações saíram
 * (H-06): vinham de constantes inventadas. Só voltam com número medido.
 */
export function TrustIndicators({ variant = 'default', className = '' }: TrustIndicatorsProps) {
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-600 ${className}`}>
        <div className="flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-green-600" />
          <span className="font-medium">Cancele quando quiser</span>
        </div>

        <div className="w-px h-4 bg-neutral-300" />

        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="font-medium">Sem taxas ou burocracia</span>
        </div>

        <div className="w-px h-4 bg-neutral-300" />

        <div className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-green-600" />
          <span className="font-medium">Pagamento protegido</span>
        </div>
      </div>
    );
  }

  // Default variant - mais detalhado
  return (
    <div className={className}>
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
