/**
 * Mock data para desenvolvimento sem credenciais Shopify
 * Baseado no CATALOG de src/lib/calculator/constants.ts
 */

import type { Product } from '@/types/product'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-p1',
    handle: 'gramado-novo',
    title: 'Gramado Novo',
    description: 'MAP 11-52-00 para enraizar, firmar e pegar mais rápido.',
    descriptionHtml:
      '<p>Fertilizante granulado MAP 11-52-00, rico em fósforo para enraizamento forte desde o início.</p><p>Ideal para plantio de tapetes, mudas ou sementes de gramado.</p>',
    available: true,
    tags: ['implantacao', 'novo'],
    seo: {
      title: 'Gramado Novo (MAP 11-52-00) — Fertilizante para Implantação',
      description:
        'Fertilizante para implantação de gramado. Rico em fósforo para enraizamento forte.',
    },
    featuredImage: {
      url: '/images/Gramado-novo.png',
      alt: 'Gramado Novo - Fertilizante para Implantação',
      width: 800,
      height: 800,
    },
    images: [
      {
        url: '/images/Gramado-novo.png',
        alt: 'Gramado Novo - Embalagem do fertilizante',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800',
        alt: 'Plantio de gramado - tapetes e mudas',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
        alt: 'Gramado novo em crescimento',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800',
        alt: 'Aplicação do fertilizante no solo',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
        alt: 'Enraizamento forte - resultado',
        width: 800,
        height: 800,
      },
    ],
    variants: [
      {
        id: 'mock-p1-1kg',
        title: '1kg',
        available: true,
        quantityAvailable: 50,
        price: 89.9,
        compareAtPrice: 0,
        currency: 'BRL',
        options: { Tamanho: '1kg' },
        image: null,
      },
      {
        id: 'mock-p1-5kg',
        title: '5kg',
        available: true,
        quantityAvailable: 30,
        price: 379.9,
        compareAtPrice: 399.9,
        currency: 'BRL',
        options: { Tamanho: '5kg' },
        image: null,
      },
      {
        id: 'mock-p1-10kg',
        title: '10kg',
        available: true,
        quantityAvailable: 20,
        price: 699.9,
        compareAtPrice: 749.9,
        currency: 'BRL',
        options: { Tamanho: '10kg' },
        image: null,
      },
    ],
    price: 89.9,
    maxPrice: 699.9,
    compareAtPrice: 0,
    currency: 'BRL',
  },
  {
    id: 'mock-p2',
    handle: 'verde-rapido',
    title: 'Verde Rápido',
    description:
      'Sulfato de Amônio 21-0-0 + 24S para recuperar o verde e acelerar o crescimento.',
    descriptionHtml:
      '<p>Fertilizante granulado Sulfato de Amônio 21-0-0 + 24S, alta carga de nitrogênio para resultado visível em dias.</p><p>Ideal para gramados fracos, amarelados ou que precisam de crescimento rápido.</p>',
    available: true,
    tags: ['crescimento', 'verde'],
    seo: {
      title: 'Verde Rápido (Sulfato de Amônio 21-0-0) — Fertilizante para Crescimento',
      description:
        'Fertilizante para crescimento e cor intensa. Alta carga de nitrogênio.',
    },
    featuredImage: {
      url: '/images/Verde-Rápido.png',
      alt: 'Verde Rápido - Fertilizante para Crescimento',
      width: 800,
      height: 800,
    },
    images: [
      {
        url: '/images/Verde-Rápido.png',
        alt: 'Verde Rápido - Embalagem do fertilizante',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=800',
        alt: 'Gramado verde intenso - resultado',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800',
        alt: 'Recuperação do verde em dias',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
        alt: 'Crescimento acelerado',
        width: 800,
        height: 800,
      },
    ],
    variants: [
      {
        id: 'mock-p2-1kg',
        title: '1kg',
        available: true,
        quantityAvailable: 40,
        price: 64.9,
        compareAtPrice: 99.9,
        currency: 'BRL',
        options: { Tamanho: '1kg' },
        image: null,
      },
      {
        id: 'mock-p2-5kg',
        title: '5kg',
        available: true,
        quantityAvailable: 25,
        price: 292.4,
        compareAtPrice: 449.9,
        currency: 'BRL',
        options: { Tamanho: '5kg' },
        image: null,
      },
      {
        id: 'mock-p2-10kg',
        title: '10kg',
        available: true,
        quantityAvailable: 15,
        price: 552.4,
        compareAtPrice: 849.9,
        currency: 'BRL',
        options: { Tamanho: '10kg' },
        image: null,
      },
    ],
    price: 64.9,
    maxPrice: 552.4,
    compareAtPrice: 99.9,
    currency: 'BRL',
  },
  {
    id: 'mock-p3',
    handle: 'resistencia-total',
    title: 'Resistência Total',
    description:
      'NPK 19-4-19 para calor intenso, pisoteio e uso frequente do gramado.',
    descriptionHtml:
      '<p>Fertilizante granulado NPK 19-4-19 com Tecnologia Grânulo Único, balanceado para proteção contra estresse.</p><p>Ideal para gramados sob calor, pisoteio intenso ou uso frequente.</p>',
    available: true,
    tags: ['resistencia', 'protecao'],
    seo: {
      title: 'Resistência Total (NPK 19-4-19) — Fertilizante para Proteção',
      description:
        'Fertilizante para gramados sob estresse. Proteção contra calor e pisoteio.',
    },
    featuredImage: {
      url: '/images/Resistencia-total.png',
      alt: 'Resistência Total - Fertilizante para Proteção',
      width: 800,
      height: 800,
    },
    images: [
      {
        url: '/images/Resistencia-total.png',
        alt: 'Resistência Total - Embalagem do fertilizante',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=800',
        alt: 'Gramado resistente ao calor',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
        alt: 'Proteção contra pisoteio',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
        alt: 'Gramado sob sol intenso',
        width: 800,
        height: 800,
      },
      {
        url: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800',
        alt: 'Manutenção e proteção prolongada',
        width: 800,
        height: 800,
      },
    ],
    variants: [
      {
        id: 'mock-p3-1kg',
        title: '1kg',
        available: true,
        quantityAvailable: 45,
        price: 71.2,
        compareAtPrice: 94.9,
        currency: 'BRL',
        options: { Tamanho: '1kg' },
        image: null,
      },
      {
        id: 'mock-p3-5kg',
        title: '5kg',
        available: true,
        quantityAvailable: 25,
        price: 322.4,
        compareAtPrice: 429.9,
        currency: 'BRL',
        options: { Tamanho: '5kg' },
        image: null,
      },
      {
        id: 'mock-p3-10kg',
        title: '10kg',
        available: true,
        quantityAvailable: 15,
        price: 599.9,
        compareAtPrice: 799.9,
        currency: 'BRL',
        options: { Tamanho: '10kg' },
        image: null,
      },
    ],
    price: 71.2,
    maxPrice: 599.9,
    compareAtPrice: 94.9,
    currency: 'BRL',
  },
]

// Mapeamento de product_id (P1, P2, P3) para handles do Shopify
export const PRODUCT_HANDLE_MAP = {
  P1: 'gramado-novo',
  P2: 'verde-rapido',
  P3: 'resistencia-total',
} as const

// Helper para buscar produto mock por handle
export function getMockProductByHandle(handle: string): Product | null {
  return MOCK_PRODUCTS.find((p) => p.handle === handle) || null
}

// Helper para buscar produto mock por calculator product_id
export function getMockProductByCalculatorId(
  productId: 'P1' | 'P2' | 'P3'
): Product | null {
  const handle = PRODUCT_HANDLE_MAP[productId]
  return getMockProductByHandle(handle)
}
