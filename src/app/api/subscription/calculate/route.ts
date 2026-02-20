import { NextRequest, NextResponse } from 'next/server';
import {
  calculateSubscriptionPrice,
  calculateDeliveryDates,
  getDeliveriesPerYear,
  getSavingsAnalogy,
} from '@/lib/subscription/pricing';

/**
 * POST /api/subscription/calculate
 * 
 * Calcula economia e detalhes de uma assinatura potencial
 * 
 * Body esperado:
 * {
 *   products: Array<{basePrice, quantity}>,
 *   frequency: 30 | 45 | 60 | 90
 * }
 * 
 * Retorna:
 * - Preços (base vs assinatura)
 * - Economia (por entrega e anual)
 * - Calendário de entregas
 * - Comparativos
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação
    if (!body.products || !Array.isArray(body.products) || !body.frequency) {
      return NextResponse.json(
        { error: 'Products (array) e frequency são obrigatórios' },
        { status: 400 }
      );
    }
    
    const { products, frequency } = body;
    const validFrequencies = [30, 45, 60, 90];
    
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { error: 'Frequência deve ser 30, 45, 60 ou 90 dias' },
        { status: 400 }
      );
    }
    
    // Calcular totais
    let totalBasePrice = 0;
    let totalSubscriptionPrice = 0;
    
    const calculatedProducts = products.map((product: any) => {
      const { basePrice, quantity = 1 } = product;
      
      if (!basePrice || basePrice <= 0) {
        throw new Error('BasePrice inválido');
      }
      
      const subscriptionPrice = calculateSubscriptionPrice(basePrice, frequency);
      
      totalBasePrice += basePrice * quantity;
      totalSubscriptionPrice += subscriptionPrice * quantity;
      
      return {
        basePrice,
        subscriptionPrice,
        quantity,
        savingsPerUnit: basePrice - subscriptionPrice,
        discountPercent: Math.round(((basePrice - subscriptionPrice) / basePrice) * 100),
      };
    });
    
    // Cálculos gerais
    const savingsPerDelivery = totalBasePrice - totalSubscriptionPrice;
    const deliveriesPerYear = getDeliveriesPerYear(frequency);
    const annualSavings = Math.round(savingsPerDelivery * deliveriesPerYear * 100) / 100;
    const deliverySchedule = calculateDeliveryDates(new Date(), frequency, 12); // 12 meses
    const savingsAnalogy = getSavingsAnalogy(annualSavings);
    
    // Calcular custo anual
    const annualCostWithoutSubscription = (totalBasePrice + 15.90) * deliveriesPerYear; // +frete
    const annualCostWithSubscription = totalSubscriptionPrice * deliveriesPerYear; // frete grátis
    
    // Comparativo
    const comparison = {
      oneTime: {
        pricePerDelivery: totalBasePrice,
        shippingPerDelivery: 15.90,
        totalPerDelivery: totalBasePrice + 15.90,
        deliveriesPerYear,
        annualCost: annualCostWithoutSubscription,
      },
      subscription: {
        pricePerDelivery: totalSubscriptionPrice,
        shippingPerDelivery: 0, // frete grátis
        totalPerDelivery: totalSubscriptionPrice,
        deliveriesPerYear,
        annualCost: annualCostWithSubscription,
      },
      savings: {
        perDelivery: savingsPerDelivery + 15.90, // incluindo frete
        annual: annualSavings,
        percentOff: Math.round((annualSavings / annualCostWithoutSubscription) * 100),
      },
    };
    
    // ROI (Return on Investment)
    const paybackDeliveries = Math.ceil(0 / savingsPerDelivery) || 1; // Primeira entrega já compensa
    const paybackDays = paybackDeliveries * frequency;
    
    // Resposta completa
    return NextResponse.json({
      success: true,
      calculation: {
        products: calculatedProducts,
        frequency,
        pricing: {
          totalBasePrice,
          totalSubscriptionPrice,
          savingsPerDelivery,
          annualSavings,
        },
        schedule: {
          deliveriesPerYear,
          nextDeliveries: deliverySchedule.slice(0, 6), // Próximas 6
        },
        comparison,
        insights: {
          savingsAnalogy,
          paybackDeliveries,
          paybackDays,
          breakEvenMessage: `A assinatura se paga já na ${paybackDeliveries}ª entrega!`,
          recommendation: frequency === 45 
            ? 'Frequência ideal! Equilibra cuidado e economia.'
            : frequency === 90
            ? 'Máxima economia! Ideal para quem planeja com antecedência.'
            : frequency === 30
            ? 'Cuidado intensivo! Perfeito para gramados novos ou em recuperação.'
            : 'Ótima escolha para gramados já estabelecidos.',
        },
      },
      metadata: {
        calculatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      },
    });
    
  } catch (error) {
    console.error('Erro ao calcular assinatura:', error);
    
    return NextResponse.json(
      {
        error: 'Erro ao processar cálculo',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/subscription/calculate
 * 
 * Retorna informações sobre as opções de frequência disponíveis
 */
export async function GET() {
  return NextResponse.json({
    frequencies: [
      {
        days: 30,
        label: 'A cada 30 dias',
        discount: 10,
        description: 'Cuidado intensivo',
        recommended: false,
      },
      {
        days: 45,
        label: 'A cada 45 dias',
        discount: 12,
        description: 'Equilíbrio perfeito',
        recommended: true,
      },
      {
        days: 60,
        label: 'A cada 60 dias',
        discount: 15,
        description: 'Manutenção tranquila',
        recommended: false,
      },
      {
        days: 90,
        label: 'A cada 90 dias',
        discount: 18,
        description: 'Máxima economia',
        recommended: false,
      },
    ],
    benefits: [
      'Frete grátis em todas as entregas',
      'Desconto progressivo (10% a 18%)',
      'Cancele quando quiser, sem taxas',
      'Lembretes de aplicação',
      'Suporte prioritário',
    ],
  });
}
