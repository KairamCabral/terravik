// src/hooks/useCalculatorToCart.ts

import { useState, useCallback } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { generateSubscriptionPlan, FrequencyDays } from '@/lib/subscription/pricing';

interface UseCalculatorToCartProps {
  productId: string;
  variantId: string;
  basePrice: number;
  quantity: number;
}

export function useCalculatorToCart({
  productId,
  variantId,
  basePrice,
  quantity,
}: UseCalculatorToCartProps) {
  const { addItem, openCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const addSubscriptionToCart = useCallback(async (frequency: FrequencyDays) => {
    setIsLoading(true);
    
    try {
      // Gerar plano para referência
      const plan = generateSubscriptionPlan(basePrice, frequency, quantity);
      
      // Adicionar ao carrinho
      // Nota: Em produção, aqui você passaria metadados de assinatura
      await addItem(variantId, quantity);
      
      setIsSuccess(true);
      openCart();
      
      return plan;
    } catch (error) {
      console.error('Erro ao adicionar assinatura:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addItem, openCart, variantId, quantity, basePrice]);

  const addOneTimeToCart = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await addItem(variantId, quantity);
      setIsSuccess(true);
      openCart();
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addItem, openCart, variantId, quantity]);

  return {
    addSubscriptionToCart,
    addOneTimeToCart,
    isLoading,
    isSuccess,
    resetSuccess: () => setIsSuccess(false),
  };
}
