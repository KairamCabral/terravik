'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  SubscriptionState, 
  SubscriptionFrequency, 
  SubscriptionProduct,
  CustomerSubscription 
} from '@/lib/subscription/types';
import { calculateSubscriptionPrice } from '@/lib/subscription/pricing';

interface SubscriptionContextType {
  // Estado global
  state: SubscriptionState;
  
  // Ações
  setMode: (mode: 'one-time' | 'subscription') => void;
  setFrequency: (frequency: SubscriptionFrequency) => void;
  setQuantity: (quantity: number) => void;
  addProduct: (product: Omit<SubscriptionProduct, 'subscriptionPrice' | 'frequency'>) => void;
  removeProduct: (productId: string) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  clearProducts: () => void;
  
  // Computed values
  getTotalPrice: () => number;
  getTotalSavings: () => number;
  getAnnualSavings: () => number;
  
  // Assinatura do usuário (se logado)
  customerSubscription: CustomerSubscription | null;
  setCustomerSubscription: (subscription: CustomerSubscription | null) => void;
  
  // Loading states
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const STORAGE_KEY = 'terravik_subscription_state';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>({
    mode: 'subscription', // Default: assinatura pré-selecionada (psicologia aplicada)
    frequency: 45, // Default: 45 dias (recomendado)
    quantity: 1,
    selectedProducts: []
  });

  const [customerSubscription, setCustomerSubscription] = useState<CustomerSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  // Carregar estado do localStorage na montagem
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setState(prev => ({
            ...prev,
            ...parsed,
            // Garantir defaults
            mode: parsed.mode || 'subscription',
            frequency: parsed.frequency || 45,
          }));
        } catch (error) {
          console.error('Erro ao carregar estado de assinatura:', error);
        }
      }
    }
  }, []);

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const setMode = useCallback((mode: 'one-time' | 'subscription') => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const setFrequency = useCallback((frequency: SubscriptionFrequency) => {
    setState(prev => {
      // Atualizar preço de assinatura de todos os produtos
      const updatedProducts = prev.selectedProducts.map(product => ({
        ...product,
        frequency,
        subscriptionPrice: calculateSubscriptionPrice(product.basePrice, frequency)
      }));

      return {
        ...prev,
        frequency,
        selectedProducts: updatedProducts
      };
    });
  }, []);

  const setQuantity = useCallback((quantity: number) => {
    setState(prev => ({ ...prev, quantity: Math.max(1, quantity) }));
  }, []);

  const addProduct = useCallback((
    product: Omit<SubscriptionProduct, 'subscriptionPrice' | 'frequency'>
  ) => {
    setState(prev => {
      // Verificar se produto já existe
      const exists = prev.selectedProducts.find(p => p.productId === product.productId);
      if (exists) {
        // Atualizar quantidade
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.map(p =>
            p.productId === product.productId
              ? { ...p, quantity: p.quantity + product.quantity }
              : p
          )
        };
      }

      // Adicionar novo produto
      const subscriptionPrice = calculateSubscriptionPrice(product.basePrice, prev.frequency);
      return {
        ...prev,
        selectedProducts: [
          ...prev.selectedProducts,
          {
            ...product,
            frequency: prev.frequency,
            subscriptionPrice
          }
        ]
      };
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setState(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter(p => p.productId !== productId)
    }));
  }, []);

  const updateProductQuantity = useCallback((productId: string, quantity: number) => {
    setState(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.map(p =>
        p.productId === productId
          ? { ...p, quantity: Math.max(1, quantity) }
          : p
      )
    }));
  }, []);

  const clearProducts = useCallback(() => {
    setState(prev => ({ ...prev, selectedProducts: [] }));
  }, []);

  const getTotalPrice = useCallback((): number => {
    return state.selectedProducts.reduce((total, product) => {
      const price = state.mode === 'subscription' 
        ? product.subscriptionPrice 
        : product.basePrice;
      return total + (price * product.quantity);
    }, 0);
  }, [state]);

  const getTotalSavings = useCallback((): number => {
    if (state.mode === 'one-time') return 0;
    
    return state.selectedProducts.reduce((total, product) => {
      const savings = (product.basePrice - product.subscriptionPrice) * product.quantity;
      return total + savings;
    }, 0);
  }, [state]);

  const getAnnualSavings = useCallback((): number => {
    if (state.mode === 'one-time') return 0;
    
    const deliveriesPerYear = Math.floor(365 / state.frequency);
    return getTotalSavings() * deliveriesPerYear;
  }, [state, getTotalSavings]);

  const value: SubscriptionContextType = {
    state,
    setMode,
    setFrequency,
    setQuantity,
    addProduct,
    removeProduct,
    updateProductQuantity,
    clearProducts,
    getTotalPrice,
    getTotalSavings,
    getAnnualSavings,
    customerSubscription,
    setCustomerSubscription,
    loading,
    setLoading
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription deve ser usado dentro de um SubscriptionProvider');
  }
  return context;
}
