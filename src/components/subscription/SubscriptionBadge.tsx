'use client';

import { Crown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionBadgeProps {
  discount: number;
  variant?: 'default' | 'premium' | 'compact';
  showIcon?: boolean;
  className?: string;
}

/**
 * Badge de desconto de assinatura
 * 
 * PSICOLOGIA APLICADA:
 * - Cor dourada/premium para criar sensação de exclusividade
 * - Ícone de coroa para status elevado
 * - Animação sutil de brilho
 * - Texto claro e direto
 */
export function SubscriptionBadge({ 
  discount, 
  variant = 'default',
  showIcon = true,
  className = '' 
}: SubscriptionBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold
        bg-gradient-to-r from-green-600 to-emerald-600 text-white
        ${className}
      `}>
        {showIcon && <Crown className="w-3 h-3" />}
        -{discount}% Assinante
      </div>
    );
  }

  if (variant === 'premium') {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`
          relative overflow-hidden rounded-xl p-4
          bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500
          text-white shadow-lg
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
            repeatDelay: 5,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        <div className="relative flex items-center gap-3">
          {showIcon && (
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="text-3xl font-bold">-{discount}%</div>
            <div className="text-sm font-medium text-white/90">Desconto Assinante</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <div className={`
      inline-flex items-center gap-2 px-4 py-2 rounded-full
      bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md
      ${className}
    `}>
      {showIcon && <Sparkles className="w-4 h-4" />}
      <span className="font-bold">-{discount}% OFF</span>
      <span className="text-sm">com Assinatura</span>
    </div>
  );
}
