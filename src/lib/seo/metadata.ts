/**
 * Helpers de SEO — Metadata e JSON-LD
 */

import type { Metadata } from 'next'
import type { Product } from '@/types/product'
import type { BlogArticle } from '@/lib/blog/articles'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://terravik.com.br'
const SITE_NAME = 'Terravik'
const DEFAULT_DESCRIPTION =
  'Fertilizantes premium para gramados residenciais. Dose certa, resultado visível. Gramado Novo, Verde Rápido e Resistência Total.'

// ============================================================
// METADATA HELPERS
// ============================================================

interface PageMetadata {
  title: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}

export function createMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = '/images/og/default.jpg',
  noIndex = false,
}: PageMetadata): Metadata {
  const url = `${SITE_URL}${path}`
  const fullTitle = path === '' ? title : `${title} | ${SITE_NAME}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
      images: [
        {
          url: image.startsWith('http') ? image : `${SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image.startsWith('http') ? image : `${SITE_URL}${image}`],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

export function createProductMetadata(product: Product): Metadata {
  return createMetadata({
    title: product.seo.title || product.title,
    description:
      product.seo.description ||
      `${product.description.substring(0, 155)}...`,
    path: `/produtos/${product.handle}`,
    image: product.featuredImage?.url || '/images/og/default.jpg',
  })
}

// ============================================================
// JSON-LD SCHEMAS
// ============================================================

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Terravik',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: DEFAULT_DESCRIPTION,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
    },
    sameAs: [],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/produtos?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function productSchema(product: Product) {
  const variant = product.variants[0]
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    url: `${SITE_URL}/produtos/${product.handle}`,
    image: product.images.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: 'Terravik',
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: product.price.toFixed(2),
      highPrice: product.maxPrice.toFixed(2),
      priceCurrency: 'BRL',
      availability: product.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      offerCount: product.variants.length,
    },
    sku: variant?.id || '',
  }
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

export function faqSchema(
  questions: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

export function howToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Como adubar seu gramado com Terravik',
    description:
      'Use a calculadora Terravik para descobrir a dose certa de fertilizante para o seu gramado.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Informe a área do gramado',
        text: 'Multiplique largura × comprimento em metros.',
      },
      {
        '@type': 'HowToStep',
        name: 'Responda sobre as condições',
        text: 'Clima, sol, irrigação e uso do gramado.',
      },
      {
        '@type': 'HowToStep',
        name: 'Receba seu plano personalizado',
        text: 'Dose por m², quantidade total e embalagens recomendadas.',
      },
      {
        '@type': 'HowToStep',
        name: 'Aplique e regue',
        text: 'Espalhe uniformemente e regue após aplicar.',
      },
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Calculadora Terravik',
      },
    ],
  }
}

/**
 * JSON-LD: Article schema
 */
export function articleSchema(article: BlogArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${article.slug}`,
    },
  }
}

