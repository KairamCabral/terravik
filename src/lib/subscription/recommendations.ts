// src/lib/subscription/recommendations.ts

import { 
  LawnData, 
  SmartRecommendation, 
  SubscriptionFrequency, 
  RecommendedProduct 
} from './types';
import { calculateSubscriptionPrice, calculateAnnualSavings, getDeliveriesPerYear } from './pricing';
import type { Product } from '@/types/product';

/**
 * Papel de cada produto na recomendação.
 *
 * Só o que é do rótulo fica aqui (docs/produtos-fatos-do-rotulo.md): o handle
 * e quantos m² um saco de 1,6 kg rende. Nome, variante e preço vêm do
 * catálogo, entregue por quem chama.
 */
const PAPEIS = [
  // Raiz Forte: plantio, reforma, falhas. 1,6 kg rende até 32 m².
  { handle: 'raiz-forte', type: 'establishment', coverage: 32 },
  // Verde Rápido: gramado amarelado. 1,6 kg rende até 96 m².
  { handle: 'verde-rapido', type: 'recovery', coverage: 96 },
  // Resistência Total: gramado forte o ano inteiro. 1,6 kg rende até 64 m².
  { handle: 'resistencia-total', type: 'maintenance', coverage: 64 },
] as const;

type TipoDeProduto = (typeof PAPEIS)[number]['type'];

interface ProdutoDisponivel {
  productId: string;
  variantId: string;
  name: string;
  basePrice: number;
  coverage: number; // m² por saco
  type: TipoDeProduto;
}

/** Cruza os papéis com o catálogo. Produto que o catálogo não tem fica de fora. */
function produtosDisponiveis(catalogo: Product[]): ProdutoDisponivel[] {
  const lista: ProdutoDisponivel[] = [];
  for (const papel of PAPEIS) {
    const produto = catalogo.find((p) => p.handle === papel.handle);
    const variante = produto?.variants.find((v) => v.available) ?? produto?.variants[0];
    if (!produto || !variante) continue;
    // Produto de variante única na Shopify chega como "Default Title".
    const peso = variante.title && variante.title !== 'Default Title' ? ` ${variante.title}` : '';
    lista.push({
      productId: produto.id,
      variantId: variante.id,
      name: `Terravik ${produto.title}${peso}`,
      basePrice: variante.price,
      coverage: papel.coverage,
      type: papel.type,
    });
  }
  return lista;
}

/**
 * Algoritmo de recomendação inteligente baseado nos dados do gramado
 * 
 * PSICOLOGIA APLICADA:
 * - Personalização aumenta confiança e conversão
 * - Explicação transparente do raciocínio
 * - Confidence score visível para honestidade
 */
export function generateRecommendation(lawnData: LawnData, catalogo: Product[]): SmartRecommendation {
  const AVAILABLE_PRODUCTS = produtosDisponiveis(catalogo);
  let recommendedFrequency: SubscriptionFrequency = 45; // default equilibrado
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  let reasoning = '';
  const recommendedProducts: RecommendedProduct[] = [];

  // LÓGICA 1: Condição do gramado
  if (lawnData.currentCondition === 'new') {
    recommendedFrequency = 30;
    reasoning = 'Gramados novos precisam de nutrição mais frequente (a cada 30 dias) para estabelecer raízes fortes e se desenvolver saudavelmente.';
    confidence = 'high';
    
    // Produto principal: Raiz Forte
    const product = AVAILABLE_PRODUCTS.find(p => p.type === 'establishment');
    if (product) recommendedProducts.push({
      productId: product.productId,
      variantId: product.variantId,
      name: product.name,
      quantity: Math.ceil(lawnData.area / product.coverage),
      reason: 'Fósforo e cálcio para firmar a raiz. Uso pontual, no plantio: não precisa repetir todo mês',
      priority: 'essential',
      basePrice: product.basePrice
    });
    
  } else if (lawnData.currentCondition === 'recovering') {
    recommendedFrequency = 30;
    reasoning = 'Gramados em recuperação se beneficiam de aplicações mais frequentes (a cada 30 dias) para retomar a saúde rapidamente.';
    confidence = 'high';
    
    // Produto principal: Verde Rápido
    const product = AVAILABLE_PRODUCTS.find(p => p.type === 'recovery');
    if (product) recommendedProducts.push({
      productId: product.productId,
      variantId: product.variantId,
      name: product.name,
      quantity: Math.ceil(lawnData.area / product.coverage),
      reason: 'Nitrogênio com reforço de enxofre para devolver a cor ao gramado amarelado',
      priority: 'essential',
      basePrice: product.basePrice
    });
    
    // Produto secundário: Resistência Total (para depois da recuperação)
    const maintenance = AVAILABLE_PRODUCTS.find(p => p.type === 'maintenance');
    if (maintenance) recommendedProducts.push({
      productId: maintenance.productId,
      variantId: maintenance.variantId,
      name: maintenance.name,
      quantity: Math.ceil(lawnData.area / maintenance.coverage),
      reason: 'Nutrição completa com potássio, para depois que a cor voltar',
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
    
    // Produto principal: Resistência Total
    const product = AVAILABLE_PRODUCTS.find(p => p.type === 'maintenance');
    if (product) recommendedProducts.push({
      productId: product.productId,
      variantId: product.variantId,
      name: product.name,
      quantity: Math.ceil(lawnData.area / product.coverage),
      reason: 'Nutrição completa com potássio para a grama resistir à seca, ao sol e ao pisoteio',
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
export function getProductsForArea(area: number, catalogo: Product[]): RecommendedProduct[] {
  const products: RecommendedProduct[] = [];
  
  // Produto principal baseado na área: Resistência Total
  const mainProduct = produtosDisponiveis(catalogo).find(p => p.type === 'maintenance');
  if (!mainProduct) return products;
  const quantity = Math.ceil(area / mainProduct.coverage);
  
  products.push({
    productId: mainProduct.productId,
    variantId: mainProduct.variantId,
    name: mainProduct.name,
    quantity,
    reason: 'Nutrição completa com potássio para a grama resistir à seca, ao sol e ao pisoteio',
    priority: 'essential',
    basePrice: mainProduct.basePrice
  });

  // O antigo produto de "proteção" para áreas grandes é o mesmo Resistência
  // Total que já entrou acima: não há segundo produto a sugerir.

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
      savings: calculateAnnualSavings(totalPrice, adjusted.recommendedFrequency, 1),
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
      savings: calculateAnnualSavings(totalPrice, 90, 1),
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
