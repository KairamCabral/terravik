import type { Review } from '@/types/product'

// Mock data de reviews (em produção, viria de um CMS ou banco de dados)
export const PRODUCT_REVIEWS: Record<string, Review[]> = {
  // Gramado Novo (P1)
  'gramado-novo': [
    {
      id: 'review-1',
      productId: 'gramado-novo',
      author: 'Carlos Silva',
      rating: 5,
      title: 'Excelente para gramado novo!',
      comment:
        'Usei na implantação do meu gramado e o resultado foi incrível. Em 30 dias já estava verde e denso. Recomendo muito!',
      date: '2024-11-15',
      verified: true,
    },
    {
      id: 'review-2',
      productId: 'gramado-novo',
      author: 'Maria Santos',
      rating: 5,
      title: 'Melhor custo-benefício',
      comment:
        'Produto de qualidade com preço justo. A calculadora do site ajudou muito a saber a quantidade certa. Gramado ficou lindo!',
      date: '2024-10-20',
      verified: true,
    },
    {
      id: 'review-3',
      productId: 'gramado-novo',
      author: 'João Oliveira',
      rating: 4,
      title: 'Bom produto',
      comment:
        'Resultado positivo, mas precisa reaplicar conforme instruções. No geral, recomendo.',
      date: '2024-09-05',
      verified: false,
    },
  ],
  // Verde Rápido (P2)
  'verde-rapido': [
    {
      id: 'review-4',
      productId: 'verde-rapido',
      author: 'Ana Paula',
      rating: 5,
      title: 'Verde em 7 dias!',
      comment:
        'Incrível como o gramado ficou verde rapidamente. Usei após o verão e recuperou totalmente a cor. Muito satisfeita!',
      date: '2024-12-01',
      verified: true,
    },
    {
      id: 'review-5',
      productId: 'verde-rapido',
      author: 'Roberto Lima',
      rating: 5,
      title: 'Resultado rápido mesmo',
      comment:
        'Nome não mente, o efeito é rápido. Gramado que estava amarelado voltou a ficar bonito. Ótimo custo-benefício.',
      date: '2024-11-10',
      verified: true,
    },
  ],
  // Resistência Total (P3)
  'resistencia-total': [
    {
      id: 'review-6',
      productId: 'resistencia-total',
      author: 'Fernando Costa',
      rating: 5,
      title: 'Protegeu contra seca',
      comment:
        'Apliquei antes do verão e meu gramado resistiu muito bem ao calor e falta de chuva. Produto excelente!',
      date: '2024-10-25',
      verified: true,
    },
    {
      id: 'review-7',
      productId: 'resistencia-total',
      author: 'Luciana Martins',
      rating: 4,
      title: 'Bom para manutenção',
      comment:
        'Uso regularmente para manter o gramado forte. Resultados consistentes. Recomendo!',
      date: '2024-09-30',
      verified: true,
    },
  ],
}

export function getProductReviews(productHandle: string): Review[] {
  return PRODUCT_REVIEWS[productHandle] || []
}

// Média de estrelas por produto (ex.: 4.9, 4.8) e total de avaliações exibido na página
const PRODUCT_RATING_DISPLAY: Record<string, { average: number; count: number }> = {
  'gramado-novo': { average: 4.9, count: 327 },
  'verde-rapido': { average: 4.9, count: 327 },
  'resistencia-total': { average: 4.8, count: 327 },
}

export function getProductRating(productHandle: string): {
  average: number
  count: number
} {
  const display = PRODUCT_RATING_DISPLAY[productHandle]
  if (display) return display

  const reviews = getProductReviews(productHandle)
  if (reviews.length === 0) {
    return { average: 0, count: 0 }
  }

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  const average = sum / reviews.length

  return {
    average: Math.round(average * 10) / 10,
    count: reviews.length,
  }
}
