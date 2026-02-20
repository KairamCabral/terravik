// src/lib/subscription/mock-data.ts

import { 
  CustomerSubscription, 
  FrequencyOption, 
  CancellationReason,
  LoyaltyTier,
  DeliveryRecord,
  BillingRecord 
} from './types';

/**
 * Opções de frequência com metadata psicológica
 */
export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  {
    days: 30,
    label: 'A cada 30 dias',
    description: 'Cuidado intensivo para gramados novos ou em recuperação',
    savingsMultiplier: 1.0,
    discountPercent: 10,
    badge: 'Intensivo'
  },
  {
    days: 45,
    label: 'A cada 45 dias',
    description: 'Equilíbrio perfeito entre cuidado e praticidade',
    recommended: true,
    savingsMultiplier: 1.05,
    discountPercent: 12,
    badge: 'Mais Popular'
  },
  {
    days: 60,
    label: 'A cada 60 dias',
    description: 'Manutenção ideal para gramados já estabelecidos',
    savingsMultiplier: 1.1,
    discountPercent: 15,
  },
  {
    days: 90,
    label: 'A cada 90 dias',
    description: 'Economia máxima para quem planeja com antecedência',
    savingsMultiplier: 1.15,
    discountPercent: 18,
    badge: 'Maior Economia'
  }
];

/**
 * Níveis de fidelidade
 */
export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'bronze',
    minDeliveries: 0,
    benefits: [
      'Desconto de assinante',
      'Frete grátis',
      'Cancele quando quiser'
    ],
    badgeIcon: '🥉',
    additionalDiscount: 0
  },
  {
    name: 'silver',
    minDeliveries: 4,
    benefits: [
      'Todos os benefícios Bronze',
      'Frete prioritário',
      '+2% de desconto adicional',
      'Suporte preferencial'
    ],
    badgeIcon: '🥈',
    additionalDiscount: 2
  },
  {
    name: 'gold',
    minDeliveries: 9,
    benefits: [
      'Todos os benefícios Prata',
      '+5% de desconto adicional',
      'Brindes exclusivos',
      'Consultoria gratuita'
    ],
    badgeIcon: '🥇',
    additionalDiscount: 5
  },
  {
    name: 'platinum',
    minDeliveries: 16,
    benefits: [
      'Todos os benefícios Ouro',
      '+10% de desconto adicional',
      'Acesso antecipado a lançamentos',
      'Kit premium anual'
    ],
    badgeIcon: '💎',
    additionalDiscount: 10
  }
];

/**
 * Razões de cancelamento com ofertas de retenção
 */
export const CANCELLATION_REASONS: CancellationReason[] = [
  {
    id: 'price',
    label: 'Preço muito alto',
    retentionOffer: {
      type: 'discount',
      message: 'Que tal 20% de desconto nos próximos 3 meses?',
      value: 20
    }
  },
  {
    id: 'product-issue',
    label: 'Produto não atendeu expectativas',
    retentionOffer: {
      type: 'support',
      message: 'Podemos trocar por outro produto ou oferecer consultoria. Qual foi o problema?'
    }
  },
  {
    id: 'no-need',
    label: 'Não preciso mais do produto',
    retentionOffer: {
      type: 'pause',
      message: 'Que tal pausar por alguns meses? Você pode voltar quando quiser!'
    }
  },
  {
    id: 'moving',
    label: 'Mudei de casa / Não tenho mais gramado',
    retentionOffer: {
      type: 'support',
      message: 'Entendemos! Quer indicar para alguém e ganhar um desconto na próxima compra?'
    }
  },
  {
    id: 'frequency',
    label: 'Frequência de entrega inadequada',
    retentionOffer: {
      type: 'frequency',
      message: 'Você pode ajustar a frequência a qualquer momento. Vamos encontrar o intervalo ideal!'
    }
  },
  {
    id: 'other',
    label: 'Outro motivo'
  }
];

/**
 * Assinaturas mock para desenvolvimento
 */
export const MOCK_SUBSCRIPTIONS: CustomerSubscription[] = [
  {
    id: 'sub_001',
    status: 'active',
    createdAt: new Date('2024-06-15'),
    nextBillingDate: new Date('2025-02-15'),
    nextDeliveryDate: new Date('2025-02-18'),
    frequency: 45,
    loyaltyTier: 'silver',
    products: [
      {
        productId: 'prod_nutricao',
        variantId: 'var_nutricao_5kg',
        name: 'Terravik Nutrição Completa 5kg',
        image: '/images/produtos/nutricao-completa.jpg',
        basePrice: 89.90,
        subscriptionPrice: 79.12,
        quantity: 2,
        frequency: 45,
      },
    ],
    totalMonthly: 158.24,
    totalAnnualSavings: 173.44,
    deliveryHistory: [
      {
        id: 'del_001',
        date: new Date('2024-12-20'),
        status: 'delivered',
        trackingCode: 'BR123456789',
        products: [
          {
            productId: 'prod_nutricao',
            variantId: 'var_nutricao_5kg',
            name: 'Terravik Nutrição Completa 5kg',
            image: '/images/produtos/nutricao-completa.jpg',
            basePrice: 89.90,
            subscriptionPrice: 79.12,
            quantity: 2,
            frequency: 45,
          },
        ],
        total: 158.24
      },
      {
        id: 'del_002',
        date: new Date('2024-11-05'),
        status: 'delivered',
        trackingCode: 'BR987654321',
        products: [
          {
            productId: 'prod_nutricao',
            variantId: 'var_nutricao_5kg',
            name: 'Terravik Nutrição Completa 5kg',
            image: '/images/produtos/nutricao-completa.jpg',
            basePrice: 89.90,
            subscriptionPrice: 79.12,
            quantity: 2,
            frequency: 45,
          },
        ],
        total: 158.24
      }
    ],
    billingHistory: [
      {
        id: 'bill_001',
        date: new Date('2024-12-20'),
        amount: 158.24,
        status: 'paid',
        paymentMethod: 'Cartão •••• 4242',
        invoiceUrl: '/invoices/001.pdf'
      },
      {
        id: 'bill_002',
        date: new Date('2024-11-05'),
        amount: 158.24,
        status: 'paid',
        paymentMethod: 'Cartão •••• 4242',
        invoiceUrl: '/invoices/002.pdf'
      }
    ],
  },
];

/**
 * Depoimentos de assinantes
 */
export const MOCK_TESTIMONIALS = [
  {
    id: '1',
    name: 'Roberto M.',
    location: 'Florianópolis, SC',
    photo: '/images/testimonials/roberto.jpg',
    text: 'Nunca mais esqueci de cuidar do gramado. A assinatura da Terravik simplificou tudo e ainda economizo!',
    savings: 'R$ 320/ano',
    rating: 5,
    loyaltyTier: 'gold' as const,
    deliveries: 12
  },
  {
    id: '2',
    name: 'Ana Carolina S.',
    location: 'Porto Alegre, RS',
    photo: '/images/testimonials/ana.jpg',
    text: 'O gramado nunca esteve tão bonito. Recebo exatamente quando preciso, sem preocupação.',
    savings: 'R$ 180/ano',
    rating: 5,
    loyaltyTier: 'silver' as const,
    deliveries: 6
  },
  {
    id: '3',
    name: 'Marcos T.',
    location: 'Curitiba, PR',
    photo: '/images/testimonials/marcos.jpg',
    text: 'Tentei cancelar só pra testar e foi super fácil. Mas vale muito a pena, então continuei assinante!',
    savings: 'R$ 450/ano',
    rating: 5,
    loyaltyTier: 'platinum' as const,
    deliveries: 18
  },
  {
    id: '4',
    name: 'Patricia L.',
    location: 'São Paulo, SP',
    photo: '/images/testimonials/patricia.jpg',
    text: 'Adoro o lembrete no WhatsApp de quando aplicar. É como ter um jardineiro pessoal!',
    savings: 'R$ 240/ano',
    rating: 5,
    loyaltyTier: 'silver' as const,
    deliveries: 7
  }
];

/**
 * FAQ específico de assinaturas
 */
export const SUBSCRIPTION_FAQ = [
  {
    question: 'Posso cancelar quando quiser?',
    answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento, sem taxa de cancelamento e sem perguntas. Basta acessar seu painel ou nos chamar no WhatsApp. O cancelamento é processado em até 24 horas.',
    highlight: true,
    category: 'cancelamento'
  },
  {
    question: 'Como funciona a entrega?',
    answer: 'Enviamos seus produtos alguns dias antes da data programada, para você receber exatamente quando precisar aplicar. Você acompanha tudo pelo código de rastreamento que enviamos por email e WhatsApp.',
    category: 'entrega'
  },
  {
    question: 'Posso mudar os produtos ou frequência?',
    answer: 'Claro! Você pode adicionar, remover ou trocar produtos, e alterar a frequência de entrega quando quiser, direto pelo seu painel de assinante. As mudanças valem a partir da próxima entrega.',
    category: 'modificacao'
  },
  {
    question: 'E se eu precisar pular uma entrega?',
    answer: 'Sem problema! Você pode pausar sua assinatura por 1, 2 ou 3 meses. É útil para viagens, reformas ou quando o estoque ainda está cheio. Depois volta automaticamente ou você pode reativar quando quiser.',
    category: 'pausa'
  },
  {
    question: 'O desconto é aplicado em todos os produtos?',
    answer: 'Sim! O desconto de assinante (de 10% a 18% dependendo da frequência escolhida) vale para todos os produtos do seu plano. Quanto maior o intervalo entre entregas, maior o desconto!',
    category: 'desconto'
  },
  {
    question: 'Preciso pagar frete?',
    answer: 'Não! Frete grátis é um dos benefícios exclusivos dos assinantes Terravik. Você economiza em cada entrega.',
    category: 'frete'
  },
  {
    question: 'Como funciona o sistema de níveis?',
    answer: 'A cada entrega recebida, você acumula pontos e sobe de nível: Bronze (início), Prata (4 entregas), Ouro (9 entregas) e Platina (16 entregas). Cada nível desbloqueia benefícios e descontos adicionais!',
    category: 'fidelidade'
  },
  {
    question: 'Recebo lembrete de quando aplicar?',
    answer: 'Sim! Enviamos lembretes por email e WhatsApp alguns dias antes da entrega, com instruções de como e quando aplicar. É como ter um especialista te orientando!',
    category: 'lembretes'
  },
  {
    question: 'Posso pausar e voltar depois?',
    answer: 'Com certeza! Você pode pausar por 1, 2 ou 3 meses e reativar quando quiser. Seu desconto e nível de fidelidade são mantidos. É perfeito para viagens ou períodos que não precisa.',
    category: 'pausa'
  },
  {
    question: 'E se o produto não der certo?',
    answer: 'Trabalhamos com garantia de satisfação. Se não ficar satisfeito, entre em contato em até 30 dias e faremos a troca ou devolveremos seu dinheiro. Nossa meta é seu gramado perfeito!',
    category: 'garantia'
  }
];

/**
 * Benefícios da assinatura (ordem de impacto psicológico)
 */
export const SUBSCRIPTION_BENEFITS = [
  {
    icon: '💰',
    title: 'Economia garantida de até 18%',
    description: 'Quanto maior o intervalo entre entregas, maior seu desconto',
    highlight: true
  },
  {
    icon: '📦',
    title: 'Frete grátis em todas entregas',
    description: 'Economize ainda mais sem pagar envio',
    highlight: true
  },
  {
    icon: '🔔',
    title: 'Nunca mais esqueça',
    description: 'Receba automaticamente quando seu gramado precisar',
    highlight: true
  },
  {
    icon: '⏸️',
    title: 'Pause ou cancele quando quiser',
    description: 'Sem taxas, sem burocracia, sem perguntas',
  },
  {
    icon: '🎁',
    title: 'Brindes exclusivos',
    description: 'Surpresas especiais para assinantes em cada entrega',
  },
  {
    icon: '📱',
    title: 'Lembretes no WhatsApp',
    description: 'Orientações de quando e como aplicar',
  },
  {
    icon: '👨‍🌾',
    title: 'Suporte prioritário',
    description: 'Tire dúvidas com nossos especialistas quando precisar',
  },
  {
    icon: '🔄',
    title: 'Troque produtos a qualquer momento',
    description: 'Adapte seu plano conforme as necessidades do gramado',
  },
  {
    icon: '🏆',
    title: 'Programa de fidelidade',
    description: 'Ganhe mais descontos a cada entrega recebida',
  },
  {
    icon: '🌱',
    title: 'Gramado sempre saudável',
    description: 'Cuidado contínuo = resultados consistentes',
  }
];

/**
 * Stats para prova social
 */
export const SUBSCRIPTION_STATS = {
  activeSubscribers: 2847,
  averageRating: 4.8,
  totalReviews: 1423,
  averageAnnualSavings: 285,
  deliveriesCompleted: 18942
};
