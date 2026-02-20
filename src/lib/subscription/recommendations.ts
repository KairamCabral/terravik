// src/lib/subscription/recommendations.ts

import { 
  LawnData, 
  SmartRecommendation, 
  SubscriptionFrequency, 
  RecommendedProduct 
} from './types';
import { calculateSubscriptionPrice, calculateAnnualSavings, getDeliveriesPerYear } from './pricing';

/**
 * Produtos disponíveis (mock - em produção virá do Shopify)
 */
const AVAILABLE_PRODUCTS = [
  {
    productId: 'prod_nutricao',
    variantId: 'var_nutricao_5kg',
    name: 'Terravik Nutrição Completa 5kg',
    basePrice: 89.90,
    coverage: 100, // m² por unidade
    type: 'maintenance'
  },
  {
    productId: 'prod_gramado_novo',
    variantId: 'var_gramado_novo_5kg',
    name: 'Terravik Gramado Novo 5kg',
    basePrice: 94.90,
    coverage: 100,
    type: 'establishment'
  },
  {
    productId: 'prod_verde_rapido',
    variantId: 'var_verde_rapido_3kg',
    name: 'Terravik Verde Rápido 3kg',
    basePrice: 69.90,
    coverage: 60,
    type: 'recovery'
  },
  {
    productId: 'prod_resistencia',
    variantId: 'var_resistencia_5kg',
    name: 'Terravik Resistência Total 5kg',
    basePrice: 84.90,
    coverage: 100,
    type: 'protection'
  }
];

/**
 * Algoritmo de recomendação inteligente baseado nos dados do gramado
 * 
 * PSICOLOGIA APLICADA:
 * - Personalização aumenta confiança e conversão
 * - Explicação transparente do raciocínio
 * - Confidence score visível para honestidade
 */
export function generateRecommendation(lawnData: LawnData): SmartRecommendation {
  let recommendedFrequency: SubscriptionFrequency = 45; // default equilibrado
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  let reasoning = '';
  const recommendedProducts: RecommendedProduct[] = [];

  // LÓGICA 1: Condição do gramado
  if (lawnData.currentCondition === 'new') {
    recommendedFrequency = 30;
    reasoning = 'Gramados novos precisam de nutrição mais frequente (a cada 30 dias) para estabelecer raízes fortes e se desenvolver saudavelmente.';
    confidence = 'high';
    
    // Produto principal: Gramado Novo
    const product = AVAILABLE_PRODUCTS.find(p => p.type === 'establishment')!;
    const quantity = Math.ceil(lawnData.area / product.coverage);
    recommendedProducts.push({
      productId: product.productId,
      variantId: product.variantId,
      name: product.name,
      quantity,
      reason: 'Rico em fósforo, ideal para desenvolvimento de raízes',
      priority: 'essential',
      basePrice: product.basePrice
    });
    
  } else if (lawnData.currentCondition === 'recovering') {
    recommendedFrequency = 30;
    reasoning = 'Gramados em recuperação se beneficiam de aplicações mais frequentes (a cada 30 dias) para retomar a saúde rapidamente.';
    confidence = 'high';
    
    // Produto principal: Verde Rápido
    const product = AVAILABLE_PRODUCTS.find(p => p.type === 'recovery')!;
    const quantity = Math.ceil(lawnData.area / product.coverage);
    recommendedProducts.push({
      productId: product.productId,
      variantId: product.variantId,
      name: product.name,
      quantity,
      reason: 'Fórmula de ação rápida para recuperação acelerada',
      priority: 'essential',
      basePrice: product.basePrice
    });
    
    // Produto secundário: Nutrição Completa (para manutenção após recuperação)
    const maintenance = AVAILABLE_PRODUCTS.find(p => p.type === 'maintenance')!;
    recommendedProducts.push({
      productId: maintenance.productId,
      variantId: maintenance.variantId,
      name: maintenance.name,
      quantity: Math.ceil(lawnData.area / maintenance.coverage),
      reason: 'Para manutenção após recuperação inicial',
      priority: 'recommended',
      basePrice: maintenance.basePrice
    });
    
  } else {
    // Gramado estabelecido
    
    // LÓGICA 2: Tamanho da área
    if (lawnData.area > 200) {
      recommendedFrequency = 45;
      reasoning = `Para áreas maiores como a sua (${lawnData.area}m²), a frequência de 45 dias oferece o melhor equilíbrio entre custo-benefício e resultado consistente.`;
      confidence = 'high';
    } else if (lawnData.area < 100) {
      recommendedFrequency = 60;
      reasoning = `Para áreas menores (${lawnData.area}m²), aplicações a cada 60 dias são suficientes e mais econômicas.`;
      confidence = 'high';
    } else {
      recommendedFrequency = 45;
      reasoning = `Para gramados estabelecidos em áreas médias (${lawnData.area}m²), o intervalo de 45 dias mantém excelente resultado com economia.`;
      confidence = 'medium';
    }
    
    // Produto principal: Nutrição Completa
    const product = AVAILABLE_PRODUCTS.find(p => p.type === 'maintenance')!;
    const quantity = Math.ceil(lawnData.area / product.coverage);
    recommendedProducts.push({
      productId: product.productId,
      variantId: product.variantId,
      name: product.name,
      quantity,
      reason: 'Fórmula balanceada para manutenção regular',
      priority: 'essential',
      basePrice: product.basePrice
    });
  }

  // LÓGICA 3: Ajuste se última fertilização foi há muito tempo
  if (lawnData.lastFertilization) {
    const daysSinceLast = Math.floor(
      (Date.now() - lawnData.lastFertilization.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLast > 90 && recommendedFrequency !== 30) {
      recommendedFrequency = 30;
      reasoning = `Como faz mais de 3 meses desde a última fertilização (${Math.floor(daysSinceLast / 30)} meses), recomendamos começar com aplicações mais frequentes (30 dias) para recuperar a nutrição do solo. Depois você pode ajustar.`;
      confidence = 'high';
    }
  }

  // LÓGICA 4: Considerar exposição solar (se disponível)
  if (lawnData.sunlight === 'full-sun') {
    // Sol pleno = crescimento mais rápido = pode precisar mais nutrição
    if (recommendedFrequency > 45) {
      reasoning += ' Com sol pleno, seu gramado cresce mais rápido e pode se beneficiar de nutrição mais frequente.';
    }
  } else if (lawnData.sunlight === 'full-shade') {
    // Sombra = crescimento mais lento = pode espaçar mais
    if (recommendedFrequency < 60) {
      reasoning += ' Em áreas sombreadas, o crescimento é mais lento, então a frequência pode ser um pouco maior.';
    }
  }

  // LÓGICA 5: Considerar tráfego (se disponível)
  if (lawnData.traffic === 'high') {
    reasoning += ' O alto tráfego exige nutrição mais regular para manter o gramado resistente.';
  }

  // Calcular plano anual
  const totalBasePrice = recommendedProducts.reduce(
    (sum, p) => sum + (p.basePrice * p.quantity),
    0
  );
  
  const subscriptionPrice = calculateSubscriptionPrice(totalBasePrice, recommendedFrequency);
  const deliveriesPerYear = getDeliveriesPerYear(recommendedFrequency);
  const annualCost = subscriptionPrice * deliveriesPerYear;
  const annualSavings = calculateAnnualSavings(
    totalBasePrice,
    subscriptionPrice,
    recommendedFrequency,
    1
  );

  return {
    recommendedFrequency,
    recommendedProducts,
    reasoning,
    confidence,
    annualPlan: {
      totalCost: annualCost,
      savings: annualSavings,
      deliveries: deliveriesPerYear,
    },
  };
}

/**
 * Gera produtos recomendados baseado apenas na área (simplificado)
 */
export function getProductsForArea(area: number, grassType?: string): RecommendedProduct[] {
  const products: RecommendedProduct[] = [];
  
  // Produto principal baseado na área
  const mainProduct = AVAILABLE_PRODUCTS.find(p => p.type === 'maintenance')!;
  const quantity = Math.ceil(area / mainProduct.coverage);
  
  products.push({
    productId: mainProduct.productId,
    variantId: mainProduct.variantId,
    name: mainProduct.name,
    quantity,
    reason: 'Nutrição completa para manutenção regular',
    priority: 'essential',
    basePrice: mainProduct.basePrice
  });

  // Se área grande, sugerir também proteção
  if (area > 300) {
    const protection = AVAILABLE_PRODUCTS.find(p => p.type === 'protection')!;
    products.push({
      productId: protection.productId,
      variantId: protection.variantId,
      name: protection.name,
      quantity: Math.ceil(area / protection.coverage),
      reason: 'Aumenta resistência em áreas grandes com mais desafios',
      priority: 'recommended',
      basePrice: protection.basePrice
    });
  }

  return products;
}

/**
 * Ajusta recomendação baseada em preferências do usuário
 */
export function adjustRecommendationByPreference(
  recommendation: SmartRecommendation,
  userPreference: {
    maxBudget?: number;
    preferredFrequency?: SubscriptionFrequency;
    prioritizeSavings?: boolean;
  }
): SmartRecommendation {
  let adjusted = { ...recommendation };

  // Ajustar por orçamento
  if (userPreference.maxBudget) {
    const monthlyBudget = userPreference.maxBudget;
    const currentMonthly = adjusted.annualPlan.totalCost / 12;
    
    if (currentMonthly > monthlyBudget) {
      // Reduzir quantidade ou frequência
      adjusted.reasoning += ` Ajustamos para caber no seu orçamento de R$ ${monthlyBudget.toFixed(2)}/mês.`;
    }
  }

  // Ajustar por frequência preferida
  if (userPreference.preferredFrequency) {
    adjusted.recommendedFrequency = userPreference.preferredFrequency;
    adjusted.reasoning += ` Respeitando sua preferência de entrega a cada ${userPreference.preferredFrequency} dias.`;
    adjusted.confidence = 'medium';
    
    // Recalcular plano anual
    const totalPrice = adjusted.recommendedProducts.reduce(
      (sum, p) => sum + (p.basePrice * p.quantity),
      0
    );
    const subPrice = calculateSubscriptionPrice(totalPrice, adjusted.recommendedFrequency);
    const deliveries = getDeliveriesPerYear(adjusted.recommendedFrequency);
    
    adjusted.annualPlan = {
      totalCost: subPrice * deliveries,
      savings: calculateAnnualSavings(totalPrice, subPrice, adjusted.recommendedFrequency, 1),
      deliveries
    };
  }

  // Se priorizar economia, sugerir frequência maior
  if (userPreference.prioritizeSavings) {
    adjusted.recommendedFrequency = 90; // máxima economia
    adjusted.reasoning = 'Ajustamos para frequência de 90 dias para maximizar sua economia anual (18% de desconto).';
    
    const totalPrice = adjusted.recommendedProducts.reduce(
      (sum, p) => sum + (p.basePrice * p.quantity),
      0
    );
    const subPrice = calculateSubscriptionPrice(totalPrice, 90);
    const deliveries = getDeliveriesPerYear(90);
    
    adjusted.annualPlan = {
      totalCost: subPrice * deliveries,
      savings: calculateAnnualSavings(totalPrice, subPrice, 90, 1),
      deliveries
    };
  }

  return adjusted;
}

/**
 * Valida se recomendação faz sentido
 */
export function validateRecommendation(
  recommendation: SmartRecommendation
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Validar quantidade de produtos
  if (recommendation.recommendedProducts.length === 0) {
    warnings.push('Nenhum produto recomendado');
  }

  // Validar economia anual positiva
  if (recommendation.annualPlan.savings <= 0) {
    warnings.push('Economia anual deveria ser positiva');
  }

  // Validar número de entregas
  if (recommendation.annualPlan.deliveries < 1 || recommendation.annualPlan.deliveries > 13) {
    warnings.push('Número de entregas anuais fora do esperado');
  }

  return {
    valid: warnings.length === 0,
    warnings
  };
}
