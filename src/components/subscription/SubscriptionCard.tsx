'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SubscriptionBadge } from './SubscriptionBadge';
import { formatPrice, calculateSubscriptionPrice, SUBSCRIPTION_DISCOUNTS } from '@/lib/subscription/pricing';

interface SubscriptionCardProps {
  product: {
    id: string;
    handle: string;
    name: string;
    description: string;
    price: number;
    image: string;
    coverage?: number; // m² cobertos
  };
  variant?: 'default' | 'featured';
  onAddToCart?: (productId: string, isSubscription: boolean) => void;
}

/**
 * Card de produto com opção de assinatura integrada
 * 
 * PSICOLOGIA APLICADA:
 * - Badge de desconto em destaque
 * - Preço original riscado (anchoring)
 * - Preço de assinatura em verde (positivo)
 * - CTA diferenciado para assinatura (mais premium)
 * - Hover eleva card (micro-interação)
 */
export function SubscriptionCard({ 
  product, 
  variant = 'default',
  onAddToCart 
}: SubscriptionCardProps) {
  const defaultFrequency = 45; // frequência padrão para exibição
  const subscriptionPrice = calculateSubscriptionPrice(product.price, defaultFrequency);
  const discount = SUBSCRIPTION_DISCOUNTS[defaultFrequency] * 100;

  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-200 overflow-hidden shadow-lg"
      >
        {/* Badge "Assinatura Disponível" */}
        <div className="absolute top-4 right-4 z-10">
          <SubscriptionBadge discount={Math.round(discount)} variant="compact" />
        </div>

        {/* Imagem */}
        <div className="relative h-64 bg-gradient-to-br from-neutral-100 to-neutral-200">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-6"
          />
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <h3 className="font-heading text-xl font-bold text-neutral-900 mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
            {product.description}
          </p>

          {product.coverage && (
            <div className="text-xs text-neutral-500 mb-4">
              Cobertura: {product.coverage}m²
            </div>
          )}

          {/* Preços */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg text-neutral-400 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(subscriptionPrice)}
              </span>
            </div>
            <p className="text-xs text-neutral-600">
              por entrega na assinatura
            </p>
          </div>

          {/* CTAs */}
          <div className="space-y-2">
            <Button
              variant="premium"
              className="w-full"
              onClick={() => onAddToCart?.(product.id, true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Assinar e Economizar
            </Button>
            <Link href={`/produtos/${product.handle}`}>
              <Button variant="outline" size="sm" className="w-full">
                Ver detalhes
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default card
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border-2 border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
    >
      <div className="relative">
        {/* Badge */}
        <div className="absolute top-2 right-2 z-10">
          <SubscriptionBadge discount={Math.round(discount)} variant="compact" />
        </div>

        {/* Imagem */}
        <div className="relative h-48 bg-neutral-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4"
          />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-heading font-bold text-neutral-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-neutral-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Preços */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.price)}
            </span>
            <span className="text-xl font-bold text-green-600">
              {formatPrice(subscriptionPrice)}
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            com assinatura
          </p>
        </div>

        {/* CTA */}
        <Link href={`/produtos/${product.handle}`}>
          <Button variant="primary" size="sm" className="w-full">
            Ver opções
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
