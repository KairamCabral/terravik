// src/hooks/useSubscription.ts

import { useSubscription as useSubscriptionContext } from '@/contexts/SubscriptionContext';

/**
 * Hook customizado para acessar funcionalidades de assinatura
 * 
 * Re-exporta o context hook com funcionalidades adicionais se necessário
 */
export function useSubscription() {
  const context = useSubscriptionContext();
  
  // Adicionar funcionalidades extras aqui se necessário
  // Por exemplo: analytics, validações, etc.
  
  return context;
}

/**
 * Hook para verificar se usuário é assinante
 */
export function useIsSubscriber() {
  const { customerSubscription } = useSubscriptionContext();
  return customerSubscription?.status === 'active';
}

/**
 * Hook para obter tier de fidelidade
 */
export function useLoyaltyTier() {
  const { customerSubscription } = useSubscriptionContext();
  return customerSubscription?.loyaltyTier || 'bronze';
}

/**
 * Hook para verificar se modo assinatura está ativo
 */
export function useIsSubscriptionMode() {
  const { state } = useSubscriptionContext();
  return state.mode === 'subscription';
}

/**
 * Hook para calcular economia total
 */
export function useSubscriptionSavings() {
  const { getTotalSavings, getAnnualSavings, state } = useSubscriptionContext();
  
  return {
    perDelivery: getTotalSavings(),
    annual: getAnnualSavings(),
    isSubscriptionMode: state.mode === 'subscription'
  };
}
