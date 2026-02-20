// src/lib/subscription/pricing.ts

/**
 * Sistema de Pricing para Assinaturas Terravik
 * Calcula descontos, economia e datas de entrega
 */

import { SubscriptionFrequency, PriceComparison } from './types';

// ============================================
// CONFIGURAÇÃO DE DESCONTOS
// ============================================

export const SUBSCRIPTION_DISCOUNTS: Record<SubscriptionFrequency, number> = {
  30: 0.10, // 10% off - cuidado intensivo
  45: 0.12, // 12% off - equilibrado (recomendado)
  60: 0.15, // 15% off - econômico
  90: 0.18, // 18% off - economia máxima
};

export const FREQUENCY_DISCOUNTS: Record<number, number> = {
  30: 10,  // 10% de desconto - Cuidado intensivo
  45: 12,  // 12% de desconto - Equilíbrio perfeito (RECOMENDADO)
  60: 15,  // 15% de desconto - Gramado saudável
  90: 18,  // 18% de desconto - Máxima economia
};

export const FREQUENCY_OPTIONS_EXTENDED = [
  { 
    days: 30 as const, 
    label: '30 dias', 
    shortLabel: '30d',
    description: 'Cuidado intensivo',
    subtitle: 'Para gramados que precisam de atenção extra',
    recommended: false,
    tag: null,
  },
  { 
    days: 45 as const, 
    label: '45 dias', 
    shortLabel: '45d',
    description: 'Equilíbrio perfeito',
    subtitle: 'Ideal para a maioria dos gramados',
    recommended: true,
    tag: 'Mais escolhido',
  },
  { 
    days: 60 as const, 
    label: '60 dias', 
    shortLabel: '60d',
    description: 'Gramado saudável',
    subtitle: 'Para gramados já estabelecidos',
    recommended: false,
    tag: null,
  },
  { 
    days: 90 as const, 
    label: '90 dias', 
    shortLabel: '90d',
    description: 'Máxima economia',
    subtitle: 'Manutenção preventiva',
    recommended: false,
    tag: 'Maior desconto',
  },
] as const;

export type FrequencyDays = 30 | 45 | 60 | 90;

/**
 * Retorna percentual de desconto para uma frequência (ex: 12 para 12%)
 */
export function getDiscountPercent(frequency: SubscriptionFrequency | number): number {
  const discount = SUBSCRIPTION_DISCOUNTS[frequency as SubscriptionFrequency] || FREQUENCY_DISCOUNTS[frequency];
  if (typeof discount === 'number' && discount < 1) {
    return Math.round(discount * 100);
  }
  return discount || 10;
}

/**
 * Calcula preço de assinatura com desconto aplicado
 */
export function calculateSubscriptionPrice(
  basePrice: number,
  frequency: SubscriptionFrequency | number
): number {
  const discountPercent = getDiscountPercent(frequency);
  const discount = discountPercent < 1 ? discountPercent : discountPercent / 100;
  return Number((basePrice * (1 - discount)).toFixed(2));
}

/**
 * Calcula economia por entrega
 */
export function calculateSavingsPerDelivery(
  basePrice: number,
  frequencyOrSubscriptionPrice: SubscriptionFrequency | number,
  quantity: number = 1
): number {
  // Se receber frequência, calcular subscriptionPrice
  let subscriptionPrice: number;
  if (frequencyOrSubscriptionPrice === 30 || frequencyOrSubscriptionPrice === 45 || 
      frequencyOrSubscriptionPrice === 60 || frequencyOrSubscriptionPrice === 90) {
    subscriptionPrice = calculateSubscriptionPrice(basePrice, frequencyOrSubscriptionPrice as SubscriptionFrequency);
  } else {
    subscriptionPrice = frequencyOrSubscriptionPrice;
  }
  return Number(((basePrice - subscriptionPrice) * quantity).toFixed(2));
}

/**
 * Calcula número de entregas por ano
 */
export function calculateDeliveriesPerYear(frequency: number): number {
  return Math.floor(365 / frequency);
}

/**
 * Calcula economia anual total
 */
export function calculateAnnualSavings(
  basePrice: number, 
  frequency: number | SubscriptionFrequency, 
  quantity: number = 1
): number {
  const savingsPerDelivery = calculateSavingsPerDelivery(basePrice, frequency, quantity);
  const deliveriesPerYear = calculateDeliveriesPerYear(frequency);
  return Math.round(savingsPerDelivery * deliveriesPerYear * 100) / 100;
}

/**
 * Calcula economia mensal média
 */
export function calculateMonthlySavings(
  basePrice: number, 
  frequency: number, 
  quantity: number = 1
): number {
  const annualSavings = calculateAnnualSavings(basePrice, frequency, quantity);
  return Math.round((annualSavings / 12) * 100) / 100;
}

/**
 * Calcula o custo anual com assinatura
 */
export function calculateAnnualCostSubscription(
  basePrice: number,
  frequency: number,
  quantity: number = 1
): number {
  const subscriptionPrice = calculateSubscriptionPrice(basePrice, frequency);
  const deliveriesPerYear = calculateDeliveriesPerYear(frequency);
  return Math.round(subscriptionPrice * quantity * deliveriesPerYear * 100) / 100;
}

/**
 * Calcula o custo anual SEM assinatura (compras avulsas)
 */
export function calculateAnnualCostWithoutSubscription(
  basePrice: number,
  frequency: number,
  quantity: number = 1
): number {
  const deliveriesPerYear = calculateDeliveriesPerYear(frequency);
  return Math.round(basePrice * quantity * deliveriesPerYear * 100) / 100;
}

/**
 * Calcula porcentagem de economia
 */
export function calculateSavingsPercent(
  basePrice: number,
  subscriptionPrice: number
): number {
  return Number((((basePrice - subscriptionPrice) / basePrice) * 100).toFixed(1));
}

/**
 * Calcula número de entregas por ano
 */
export function getDeliveriesPerYear(frequency: SubscriptionFrequency): number {
  return Math.floor(365 / frequency);
}

/**
 * Calcula custo anual total
 */
export function calculateAnnualCost(
  pricePerDelivery: number,
  frequency: SubscriptionFrequency,
  quantity: number = 1
): number {
  const deliveriesPerYear = getDeliveriesPerYear(frequency);
  return Number((pricePerDelivery * quantity * deliveriesPerYear).toFixed(2));
}

/**
 * Calcula próxima data de entrega
 */
export function calculateNextDeliveryDate(
  startDate: Date,
  frequency: SubscriptionFrequency
): Date {
  const next = new Date(startDate);
  next.setDate(next.getDate() + frequency);
  return next;
}

/**
 * Calcula datas de entrega futuras
 */
export function calculateDeliveryDates(
  startDate: Date,
  frequency: SubscriptionFrequency,
  count: number = 6
): Date[] {
  const dates: Date[] = [];
  let current = new Date(startDate);
  
  for (let i = 0; i < count; i++) {
    dates.push(new Date(current));
    current = calculateNextDeliveryDate(current, frequency);
  }
  
  return dates;
}

/**
 * Formata data para exibição
 */
export function formatDeliveryDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Calcula dias até próxima entrega
 */
export function getDaysUntilNextDelivery(nextDeliveryDate: Date): number {
  const today = new Date();
  const diffTime = nextDeliveryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Comparação completa: compra única vs assinatura
 */
export function generatePriceComparison(
  basePrice: number,
  frequency: SubscriptionFrequency,
  quantity: number = 1
): PriceComparison {
  const subscriptionPrice = calculateSubscriptionPrice(basePrice, frequency);
  const deliveriesPerYear = getDeliveriesPerYear(frequency);
  
  const oneTimeAnnualCost = basePrice * quantity * deliveriesPerYear;
  const subscriptionAnnualCost = subscriptionPrice * quantity * deliveriesPerYear;
  const annualSavings = oneTimeAnnualCost - subscriptionAnnualCost;
  
  return {
    oneTime: {
      pricePerDelivery: basePrice * quantity,
      annualCost: oneTimeAnnualCost,
      totalDeliveries: deliveriesPerYear
    },
    subscription: {
      pricePerDelivery: subscriptionPrice * quantity,
      annualCost: subscriptionAnnualCost,
      totalDeliveries: deliveriesPerYear,
      annualSavings,
      percentSavings: calculateSavingsPercent(oneTimeAnnualCost, subscriptionAnnualCost)
    }
  };
}

/**
 * Calcula desconto adicional por tier de fidelidade
 */
export function getLoyaltyDiscount(
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
): number {
  const discounts = {
    bronze: 0,
    silver: 0.02,
    gold: 0.05,
    platinum: 0.10
  };
  return discounts[tier];
}

/**
 * Calcula preço final com desconto de fidelidade
 */
export function calculatePriceWithLoyalty(
  subscriptionPrice: number,
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
): number {
  const loyaltyDiscount = getLoyaltyDiscount(tier);
  return Number((subscriptionPrice * (1 - loyaltyDiscount)).toFixed(2));
}

/**
 * Determina o melhor plano baseado na área do gramado
 * Psicologia: simplificar escolha com recomendação clara
 */
export function getRecommendedFrequencyByArea(area: number): SubscriptionFrequency {
  if (area < 100) return 60; // Área pequena: menos frequente
  if (area < 200) return 45; // Área média: equilibrado
  if (area < 400) return 45; // Área grande: equilibrado
  return 30; // Área muito grande: mais frequente para distribuir custo
}

/**
 * Calcula urgência do desconto (para criar senso de urgência ético)
 */
export function getDiscountUrgency(
  currentDiscount: number,
  frequency: SubscriptionFrequency
): {
  hasUrgency: boolean;
  message?: string;
  expiryDate?: Date;
} {
  // Exemplo: primeira assinatura tem desconto extra por tempo limitado
  const now = new Date();
  const expiryDate = new Date(now.setDate(now.getDate() + 7)); // 7 dias
  
  const bonusDiscount = 0.05; // 5% adicional
  const totalDiscount = SUBSCRIPTION_DISCOUNTS[frequency] + bonusDiscount;
  
  if (totalDiscount > currentDiscount) {
    return {
      hasUrgency: true,
      message: `Desconto extra de ${Math.round(bonusDiscount * 100)}% para primeira assinatura`,
      expiryDate
    };
  }
  
  return { hasUrgency: false };
}

/**
 * Calcula "valor por dia" para tornar preço mais acessível psicologicamente
 */
export function getPricePerDay(
  pricePerDelivery: number,
  frequency: SubscriptionFrequency
): number {
  return Number((pricePerDelivery / frequency).toFixed(2));
}

// ============================================
// FUNÇÕES DE UX E PSICOLOGIA
// ============================================

/**
 * Retorna uma analogia tangível para a economia
 * Ajuda o usuário a visualizar o valor
 */
export function getSavingsAnalogy(annualSavings: number): string {
  if (annualSavings < 30) return 'alguns cafés';
  if (annualSavings < 50) return 'alguns cafés especiais';
  if (annualSavings < 100) return 'um jantar delivery';
  if (annualSavings < 150) return 'um jantar fora';
  if (annualSavings < 200) return 'um jantar especial a dois';
  if (annualSavings < 300) return 'um presente legal';
  if (annualSavings < 400) return 'aquele gadget da sua wishlist';
  if (annualSavings < 500) return 'uma experiência especial';
  if (annualSavings < 600) return 'uma escapada de fim de semana';
  if (annualSavings < 800) return 'quase uma mini-viagem';
  return 'uma viagem de verdade';
}

/**
 * Retorna emoji baseado no nível de economia
 */
export function getSavingsEmoji(annualSavings: number): string {
  if (annualSavings < 50) return '☕';
  if (annualSavings < 150) return '🍽️';
  if (annualSavings < 300) return '🎁';
  if (annualSavings < 500) return '🎮';
  if (annualSavings < 700) return '✈️';
  return '🏝️';
}

/**
 * Retorna cor baseada no nível de economia
 */
export function getSavingsColor(discountPercent: number): string {
  if (discountPercent >= 18) return 'text-emerald-600';
  if (discountPercent >= 15) return 'text-emerald-500';
  if (discountPercent >= 12) return 'text-green-500';
  return 'text-green-400';
}

/**
 * Retorna a frequência recomendada baseada na condição do gramado
 */
export function getRecommendedFrequency(
  lawnCondition: 'poor' | 'fair' | 'good' | 'excellent'
): FrequencyDays {
  switch (lawnCondition) {
    case 'poor':
      return 30;
    case 'fair':
      return 45;
    case 'good':
      return 60;
    case 'excellent':
      return 90;
    default:
      return 45;
  }
}

/**
 * Traduz condição do gramado para português
 */
export function translateLawnCondition(
  condition: 'poor' | 'fair' | 'good' | 'excellent'
): string {
  const translations = {
    poor: 'Ruim',
    fair: 'Regular',
    good: 'Bom',
    excellent: 'Excelente',
  };
  return translations[condition] || condition;
}

// ============================================
// FUNÇÕES DE DATA
// ============================================

/**
 * Calcula próximas datas de entrega
 */
export function calculateDeliverySchedule(
  startDate: Date = new Date(),
  frequency: number,
  count: number = 3
): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  // Primeira entrega em 7 dias
  currentDate.setDate(currentDate.getDate() + 7);
  dates.push(new Date(currentDate));
  
  // Próximas entregas baseadas na frequência
  for (let i = 1; i < count; i++) {
    currentDate.setDate(currentDate.getDate() + frequency);
    dates.push(new Date(currentDate));
  }
  
  return dates;
}

/**
 * Calcula data da próxima entrega
 */
export function calculateNextDeliveryDateFromNow(startDate: Date = new Date()): Date {
  const nextDate = new Date(startDate);
  nextDate.setDate(nextDate.getDate() + 7);
  return nextDate;
}

/**
 * Retorna próxima data formatada
 */
export function getNextDeliveryFormatted(): string {
  const nextDate = calculateNextDeliveryDateFromNow();
  return formatDate(nextDate);
}

// ============================================
// FUNÇÕES DE FORMATAÇÃO
// ============================================

/**
 * Formata valor como moeda BRL
 */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata valor como moeda BRL (versão compacta sem centavos)
 */
export function formatPriceCompact(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formata data em português
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
  }).format(date);
}

/**
 * Formata data curta
 */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

/**
 * Formata data completa
 */
export function formatDateFull(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(date);
}

// ============================================
// GERADOR DE PLANO COMPLETO
// ============================================

export interface SubscriptionPlanDetails {
  frequency: FrequencyDays;
  discountPercent: number;
  basePrice: number;
  subscriptionPrice: number;
  savingsPerDelivery: number;
  annualSavings: number;
  annualCost: number;
  annualCostWithout: number;
  deliveriesPerYear: number;
  deliverySchedule: Date[];
  quantity: number;
  totalPerDelivery: number;
  formattedPrice: string;
  formattedBasePrice: string;
  formattedSavings: string;
  formattedAnnualSavings: string;
  formattedAnnualCost: string;
  savingsAnalogy: string;
  savingsEmoji: string;
  nextDelivery: string;
}

/**
 * Gera um plano de assinatura completo com todos os dados
 */
export function generateSubscriptionPlan(
  basePrice: number,
  frequency: FrequencyDays,
  quantity: number = 1,
  startDate: Date = new Date()
): SubscriptionPlanDetails {
  const discountPercent = getDiscountPercent(frequency);
  const subscriptionPrice = calculateSubscriptionPrice(basePrice, frequency);
  const savingsPerDelivery = calculateSavingsPerDelivery(basePrice, frequency, 1);
  const annualSavings = calculateAnnualSavings(basePrice, frequency, quantity);
  const annualCost = calculateAnnualCostSubscription(basePrice, frequency, quantity);
  const annualCostWithout = calculateAnnualCostWithoutSubscription(basePrice, frequency, quantity);
  const deliveriesPerYear = calculateDeliveriesPerYear(frequency);
  const deliverySchedule = calculateDeliverySchedule(startDate, frequency, 6);
  
  return {
    frequency,
    discountPercent,
    basePrice,
    subscriptionPrice,
    savingsPerDelivery,
    annualSavings,
    annualCost,
    annualCostWithout,
    deliveriesPerYear,
    deliverySchedule,
    quantity,
    totalPerDelivery: subscriptionPrice * quantity,
    formattedPrice: formatPrice(subscriptionPrice),
    formattedBasePrice: formatPrice(basePrice),
    formattedSavings: formatPrice(savingsPerDelivery),
    formattedAnnualSavings: formatPrice(annualSavings),
    formattedAnnualCost: formatPrice(annualCost),
    savingsAnalogy: getSavingsAnalogy(annualSavings),
    savingsEmoji: getSavingsEmoji(annualSavings),
    nextDelivery: formatDate(deliverySchedule[0]),
  };
}

/**
 * Compara planos de diferentes frequências
 */
export function comparePlans(
  basePrice: number,
  quantity: number = 1
): SubscriptionPlanDetails[] {
  return FREQUENCY_OPTIONS_EXTENDED.map(option => 
    generateSubscriptionPlan(basePrice, option.days, quantity)
  );
}
