/**
 * Catálogo usado enquanto a Shopify não está ligada.
 *
 * Os dados vêm do rótulo das embalagens (public/images/produtos): nome, peso
 * líquido, rendimento e composição. Hoje só existe o saco de 1,6 kg.
 *
 * PREÇOS: informados pelo dono em 11/10/2026 para o saco de 1,6 kg. Não há
 * preço "de": preço riscado sem histórico de venda é oferta enganosa.
 *
 * FOTOS: frente, lateral, verso e grânulo. O verso foi trocado pelo dono em
 * 11/10/2026.
 *
 * SKU: nulo de propósito. O código de barras das artes muda de uma imagem para
 * outra e não serve de fonte; preencher com o cadastro real.
 */

import type { Product, ProductImage } from '@/types/product'
import { PRODUCT_HANDLE_MAP } from '@/lib/utils/constants'

const PESO = '1,6 kg'

function foto(handle: string, arquivo: string, alt: string, width: number, height: number): ProductImage {
  return { url: `/images/produtos/${handle}/${arquivo}.webp`, alt, width, height }
}

function variante(id: string, preco: number, sku: string | null, image: ProductImage) {
  return {
    id,
    title: PESO,
    sku,
    available: true,
    quantityAvailable: 50,
    price: preco,
    compareAtPrice: 0,
    currency: 'BRL',
    options: { Tamanho: PESO },
    image,
  }
}

const RAIZ_FORTE_FRENTE = foto('raiz-forte', 'frente', 'Raiz Forte Terravik, embalagem de 1,6 kg, frente', 966, 1383)
const VERDE_RAPIDO_FRENTE = foto('verde-rapido', 'frente', 'Verde Rápido Terravik, embalagem de 1,6 kg, frente', 964, 1325)
const RESISTENCIA_TOTAL_FRENTE = foto('resistencia-total', 'frente', 'Resistência Total Terravik, embalagem de 1,6 kg, frente', 994, 1397)

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-p1',
    handle: 'raiz-forte',
    title: 'Raiz Forte',
    description:
      'Fósforo e cálcio para firmar a raiz no plantio, na reforma e na recuperação de falhas do gramado.',
    descriptionHtml:
      '<p>Gramado forte começa embaixo da terra. Raiz Forte é a base do plantio: prepara o solo e firma a raiz para o gramado crescer forte.</p>' +
      '<p>Entrega fósforo e cálcio, os nutrientes que constroem raiz e estrutura desde o plantio. Uso pontual: no plantio, na reforma ou quando o gramado estiver muito falhado.</p>',
    available: true,
    tags: ['implantacao'],
    seo: {
      title: 'Raiz Forte: fertilizante para plantio e reforma de gramado',
      description:
        'Fertilizante com fósforo e cálcio para firmar a raiz do gramado no plantio, na reforma e na recuperação de falhas. Saco de 1,6 kg que rende até 32 m².',
    },
    featuredImage: RAIZ_FORTE_FRENTE,
    images: [
      RAIZ_FORTE_FRENTE,
      foto('raiz-forte', 'lateral', 'Raiz Forte Terravik, embalagem vista de lado', 923, 1365),
      foto('raiz-forte', 'verso', 'Raiz Forte Terravik, verso da embalagem com modo de usar e garantias', 878, 1399),
      foto('raiz-forte', 'granulo', 'Grânulos do fertilizante Raiz Forte', 1200, 788),
    ],
    variants: [variante('mock-p1-1600g', 169.9, null, RAIZ_FORTE_FRENTE)],
    price: 169.9,
    maxPrice: 169.9,
    compareAtPrice: 0,
    currency: 'BRL',
  },
  {
    id: 'mock-p2',
    handle: 'verde-rapido',
    title: 'Verde Rápido',
    description:
      'Nitrogênio com reforço de enxofre para recuperar o gramado amarelado e devolver a cor em poucas semanas.',
    descriptionHtml:
      '<p>O verde de volta, sem pintura: nutrição de verdade. Verde Rápido recupera o gramado amarelado e devolve a cor em poucas semanas.</p>' +
      '<p>Repõe o nitrogênio do solo com um reforço de enxofre, a dupla que forma clorofila e intensifica o verde. Não é tinta: é o gramado saudável de novo, verde de dentro para fora.</p>',
    available: true,
    tags: ['crescimento', 'verde'],
    seo: {
      title: 'Verde Rápido: fertilizante para gramado amarelado',
      description:
        'Fertilizante com nitrogênio e enxofre para devolver a cor ao gramado amarelado. Saco de 1,6 kg que rende até 96 m².',
    },
    featuredImage: VERDE_RAPIDO_FRENTE,
    images: [
      VERDE_RAPIDO_FRENTE,
      foto('verde-rapido', 'lateral', 'Verde Rápido Terravik, embalagem vista de lado', 963, 1191),
      foto('verde-rapido', 'verso', 'Verde Rápido Terravik, verso da embalagem com modo de usar e garantias', 874, 1393),
      foto('verde-rapido', 'granulo', 'Grânulos do fertilizante Verde Rápido', 1200, 805),
    ],
    variants: [variante('mock-p2-1600g', 129.9, null, VERDE_RAPIDO_FRENTE)],
    price: 129.9,
    maxPrice: 129.9,
    compareAtPrice: 0,
    currency: 'BRL',
  },
  {
    id: 'mock-p3',
    handle: 'resistencia-total',
    title: 'Resistência Total',
    description:
      'Nutrição completa com potássio (NPK 10-04-16) para a grama resistir à seca, ao sol e ao pisoteio o ano inteiro.',
    descriptionHtml:
      '<p>Seu gramado forte o ano inteiro. Resistência Total é a nutrição completa com potássio que deixa a grama resistente à seca, ao sol e ao pisoteio.</p>' +
      '<p>Para o gramado que precisa de força e beleza em todas as estações.</p>',
    available: true,
    tags: ['resistencia', 'protecao'],
    seo: {
      title: 'Resistência Total: fertilizante para gramado forte o ano inteiro',
      description:
        'Fertilizante com potássio para o gramado resistir à seca, ao sol e ao pisoteio. Saco de 1,6 kg que rende até 64 m².',
    },
    featuredImage: RESISTENCIA_TOTAL_FRENTE,
    images: [
      RESISTENCIA_TOTAL_FRENTE,
      foto('resistencia-total', 'lateral', 'Resistência Total Terravik, embalagem vista de lado', 1025, 1195),
      foto('resistencia-total', 'verso', 'Resistência Total Terravik, verso da embalagem com modo de usar e garantias', 875, 1391),
      foto('resistencia-total', 'granulo', 'Grânulos do fertilizante Resistência Total', 1200, 804),
    ],
    variants: [variante('mock-p3-1600g', 149.9, null, RESISTENCIA_TOTAL_FRENTE)],
    price: 149.9,
    maxPrice: 149.9,
    compareAtPrice: 0,
    currency: 'BRL',
  },
]

// Helper para buscar produto mock por handle
export function getMockProductByHandle(handle: string): Product | null {
  return MOCK_PRODUCTS.find((p) => p.handle === handle) || null
}

// Helper para buscar produto mock por calculator product_id
export function getMockProductByCalculatorId(
  productId: 'P1' | 'P2' | 'P3'
): Product | null {
  return getMockProductByHandle(PRODUCT_HANDLE_MAP[productId])
}
