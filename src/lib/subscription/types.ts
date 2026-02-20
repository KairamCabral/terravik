// src/lib/subscription/types.ts

/**
 * Sistema de Assinaturas Terravik
 * Tipos TypeScript completos
 */

// Frequências disponíveis com metadados psicológicos
export type SubscriptionFrequency = 30 | 45 | 60 | 90;

export interface FrequencyOption {
  days: SubscriptionFrequency;
  label: string;
  description: string;
  recommended?: boolean;
  savingsMultiplier: number; // Ex: 1.0, 1.05, 1.1
  badge?: string;
  discountPercent: number;
}

export interface SubscriptionPlan {
  id: string;
  productId: string;
  variantId: string;
  frequency: SubscriptionFrequency;
  quantity: number;
  basePrice: number;
  discountPercent: number;
  finalPrice: number;
  savings: {
    perDelivery: number;
    annual: number;
    percentOff: number;
  };
  nextDeliveryDate: Date;
  deliverySchedule: Date[];
}

export interface SubscriptionState {
  mode: 'one-time' | 'subscription';
  frequency: SubscriptionFrequency;
  quantity: number;
  selectedProducts: SubscriptionProduct[];
}

export interface SubscriptionProduct {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  basePrice: number;
  subscriptionPrice: number;
  quantity: number;
  frequency: SubscriptionFrequency;
}

export interface CustomerSubscription {
  id: string;
  status: 'active' | 'paused' | 'cancelled' | 'pending';
  createdAt: Date;
  nextBillingDate: Date;
  nextDeliveryDate: Date;
  products: SubscriptionProduct[];
  frequency: SubscriptionFrequency;
  totalMonthly: number;
  totalAnnualSavings: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  deliveryHistory: DeliveryRecord[];
  billingHistory: BillingRecord[];
}

export interface DeliveryRecord {
  id: string;
  date: Date;
  status: 'delivered' | 'in-transit' | 'scheduled' | 'cancelled';
  trackingCode?: string;
  products: SubscriptionProduct[];
  total: number;
}

export interface BillingRecord {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  invoiceUrl?: string;
}

// Dados da calculadora para recomendação inteligente
export interface LawnData {
  area: number; // m²
  grassType: string;
  currentCondition: 'new' | 'established' | 'recovering';
  lastFertilization?: Date;
  sunlight?: 'full-sun' | 'partial-shade' | 'full-shade';
  traffic?: 'low' | 'medium' | 'high';
}

export interface SmartRecommendation {
  recommendedFrequency: SubscriptionFrequency;
  recommendedProducts: RecommendedProduct[];
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
  annualPlan: {
    totalCost: number;
    savings: number;
    deliveries: number;
  };
}

export interface RecommendedProduct {
  productId: string;
  variantId: string;
  name: string;
  quantity: number;
  reason: string;
  priority: 'essential' | 'recommended' | 'optional';
  basePrice: number;
}

export interface LoyaltyTier {
  name: 'bronze' | 'silver' | 'gold' | 'platinum';
  minDeliveries: number;
  benefits: string[];
  badgeIcon: string;
  additionalDiscount: number; // percentual adicional
}

export interface CancellationReason {
  id: string;
  label: string;
  retentionOffer?: {
    type: 'discount' | 'pause' | 'frequency' | 'support';
    message: string;
    value?: number;
  };
}

export interface PauseOption {
  months: 1 | 2 | 3;
  label: string;
  resumeDate: Date;
}

// Tipos para comparação de preços
export interface PriceComparison {
  oneTime: {
    pricePerDelivery: number;
    annualCost: number;
    totalDeliveries: number;
  };
  subscription: {
    pricePerDelivery: number;
    annualCost: number;
    totalDeliveries: number;
    annualSavings: number;
    percentSavings: number;
  };
}

// Tipos para API
export interface CreateSubscriptionRequest {
  customerId?: string;
  email: string;
  products: {
    productId: string;
    variantId: string;
    quantity: number;
  }[];
  frequency: SubscriptionFrequency;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
}

export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  action: 'pause' | 'resume' | 'cancel' | 'modify';
  pauseMonths?: number;
  newFrequency?: SubscriptionFrequency;
  newProducts?: {
    productId: string;
    variantId: string;
    quantity: number;
  }[];
  cancellationReason?: string;
  cancellationFeedback?: string;
}

export interface SubscriptionWebhookPayload {
  event: 'created' | 'billing_success' | 'billing_failed' | 'paused' | 'cancelled' | 'resumed';
  subscriptionId: string;
  customerId: string;
  timestamp: string;
  data: any;
}
