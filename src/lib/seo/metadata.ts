/**
 * Helpers de SEO: Metadata e JSON-LD
 */

import type { Metadata } from 'next'
import type { Product } from '@/types/product'
import type { BlogArticle } from '@/lib/blog/articles'
import { ALLOW_INDEXING, SOCIAL_LINKS } from '@/lib/utils/constants'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://terravik.com.br'
const SITE_NAME = 'Terravik'
const DEFAULT_DESCRIPTION =
  'Fertilizantes premium para gramados residenciais. Dose certa, resultado visível. Gramado Novo, Verde Rápido e Resistência Total.'

/** Imagem social padrão, 1200x630, em public/images/og/default.jpg. */
const IMAGEM_PADRAO = '/images/og/default.jpg'

/** Torna absoluta uma URL que pode vir relativa (mock, public/) ou do CDN. */
function urlAbsoluta(url: string): string {
  return url.startsWith('http') ? url : `${SITE_URL}${url}`
}

// ============================================================
// METADATA HELPERS
// ============================================================

interface PageMetadata {
  title: string
  description?: string
  path?: string
  image?: string
  /**
   * Dimensões reais de `image`. O default é o da imagem padrão, 1200x630.
   * Declarar 1200x630 para uma foto quadrada faz a rede social reservar o
   * quadro errado e recortar a imagem.
   */
  imageWidth?: number
  imageHeight?: number
  noIndex?: boolean
  /** Só vale com noIndex: página fora do índice que ainda distribui link. */
  follow?: boolean
}

export function createMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = IMAGEM_PADRAO,
  imageWidth = 1200,
  imageHeight = 630,
  noIndex = false,
  follow = false,
}: PageMetadata): Metadata {
  const url = `${SITE_URL}${path}`
  const imagem = urlAbsoluta(image)
  const home = path === ''

  // O título vai cru: o template do layout raiz (`%s | Terravik`) já põe a
  // marca. Concatenar aqui também gerava "Sobre a Terravik | Terravik |
  // Terravik". Open Graph e Twitter não passam pelo template, então lá a
  // marca entra na mão. A home já traz a marca no próprio título.
  const tituloSocial = home ? title : `${title} | ${SITE_NAME}`

  return {
    title: home ? { absolute: title } : title,
    description,
    metadataBase: new URL(SITE_URL),
    // Página noindex não declara canonical: canonical pede "indexe esta URL",
    // o contrário do noindex.
    ...(noIndex ? {} : { alternates: { canonical: url } }),
    openGraph: {
      title: tituloSocial,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'pt_BR',
      type: 'website',
      images: [
        {
          url: imagem,
          width: imageWidth,
          height: imageHeight,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tituloSocial,
      description,
      images: [imagem],
    },
    robots: !ALLOW_INDEXING
      ? { index: false, follow: false, nocache: true }
      : noIndex
        ? { index: false, follow }
        : {
            index: true,
            follow: true,
            // O `robots` da página substitui o do layout, não mescla. Sem
            // repetir o googleBot aqui, toda página indexável perdia as
            // diretivas de prévia que o layout declara.
            googleBot: {
              index: true,
              follow: true,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          },
  }
}

/**
 * Descrição com no máximo `limite` caracteres, cortada em fim de palavra.
 * O corte seco anterior (`substring(0, 155)`) parava no meio da palavra.
 */
export function resumoParaMeta(texto: string, limite = 155): string {
  const limpo = texto.replace(/\s+/g, ' ').trim()
  if (limpo.length <= limite) return limpo
  const corte = limpo.slice(0, limite)
  const fim = corte.lastIndexOf(' ')
  return (fim > 0 ? corte.slice(0, fim) : corte).replace(/[,;:.\s]+$/, '') + '…'
}

/**
 * Imagem social da PDP: a primeira foto com o lado menor de 600 px ou mais,
 * declarada com as dimensões reais. SVG fica de fora, rede social não o
 * renderiza. Sem nenhuma que sirva, vale a imagem padrão.
 */
function imagemSocialDoProduto(product: Product) {
  return [product.featuredImage, ...product.images].find(
    (img): img is NonNullable<Product['featuredImage']> =>
      img !== null &&
      Math.min(img.width, img.height) >= 600 &&
      !/\.svg(\?|$)/i.test(img.url)
  )
}

export function createProductMetadata(product: Product): Metadata {
  const fonte =
    product.seo.description ||
    product.description ||
    `${product.title}. Fertilizante Terravik para gramados residenciais.`
  const imagem = imagemSocialDoProduto(product)
  return createMetadata({
    title: product.seo.title || product.title,
    description: resumoParaMeta(fonte),
    path: `/produtos/${product.handle}`,
    ...(imagem
      ? { image: imagem.url, imageWidth: imagem.width, imageHeight: imagem.height }
      : {}),
  })
}

// ============================================================
// JSON-LD SCHEMAS
// ============================================================

/**
 * Serializa um schema para dentro de `<script type="application/ld+json">`.
 *
 * `JSON.stringify` não escapa `<`, e o parser de HTML encerra o `<script>` ao
 * encontrar `</script` mesmo dentro de uma string JSON. Uma descrição de
 * produto com `<` quebraria o bloco inteiro. `\\u003c` é JSON válido e volta a
 * ser `<` para quem lê o JSON-LD.
 */
export function jsonLd(schema: unknown): string {
  return JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    // U+2028 e U+2029 são válidos em JSON e quebram o bloco no navegador.
    .replace(/[\u2028]/g, '\\u2028')
    .replace(/[\u2029]/g, '\\u2029')
}

/**
 * Logo em raster, caminho único, usado por Organization. Fica em
 * public/images/logo.png (600x600), gerado a partir de public/favicon.svg.
 */
const LOGO_URL = `${SITE_URL}/images/logo.png`

/** `@id` estável da entidade. É o alvo de `seller` e de `publisher`. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`

/**
 * E-mail do SAC publicado em /trocas-devolucoes e /termos. Telefone fica de
 * fora: o 0800 daquela página e o WhatsApp de SOCIAL_LINKS são de exemplo.
 */
const EMAIL_SAC = 'sac@terravik.com.br'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    description: DEFAULT_DESCRIPTION,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: EMAIL_SAC,
      url: `${SITE_URL}/contato`,
      availableLanguage: 'Portuguese',
      areaServed: 'BR',
    },
    // Só os perfis, nunca o link de WhatsApp.
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook],
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
    publisher: { '@id': ORGANIZATION_ID },
    // Sem SearchAction de propósito: ele apontava para /produtos?q=, e a
    // listagem ignora o parâmetro. Era marcação de uma busca que não existe.
  }
}

/**
 * Política de devolução das ofertas, espelho de /trocas-devolucoes. Só o que
 * a página diz; mudou a página, muda aqui:
 *
 *   7 dias corridos do recebimento (arrependimento, art. 49 do CDC)
 *   devolução por postagem, com código enviado pela Terravik
 *   arrependimento: o cliente arca com o frete de volta
 *   defeito, produto errado ou dano no transporte: o frete é reembolsado
 */
const POLITICA_DE_DEVOLUCAO = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'BR',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 7,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
  customerRemorseReturnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
  itemDefectReturnFees: 'https://schema.org/FreeReturn',
  merchantReturnLink: `${SITE_URL}/trocas-devolucoes`,
}

/**
 * Uma Offer, ou `null` quando a variante ainda não tem preço.
 *
 * A Shopify aceita variante com preço zero (produto recém-criado). Emitir
 * `price: "0.00"` anunciaria fertilizante de graça, e oferta sem preço é
 * marcação incompleta. Sem preço, a oferta inteira sai.
 */
function ofertaDaVariante(product: Product, variant: Product['variants'][number]) {
  if (!(variant.price > 0)) return null
  return {
    '@type': 'Offer',
    ...(product.variants.length > 1 ? { name: `${product.title} ${variant.title}` } : {}),
    url: `${SITE_URL}/produtos/${product.handle}`,
    price: variant.price.toFixed(2),
    priceCurrency: variant.currency || product.currency || 'BRL',
    availability: variant.available
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@id': ORGANIZATION_ID },
    hasMerchantReturnPolicy: POLITICA_DE_DEVOLUCAO,
    ...(variant.sku ? { sku: variant.sku } : {}),
  }
}

/**
 * JSON-LD de Product.
 *
 * Usa `Offer`, uma por variante, e não `AggregateOffer`: o Google exige
 * `Offer` para a listagem de lojista, e com `AggregateOffer` a PDP fica sem
 * preço nem disponibilidade no resultado.
 *
 * Sem `aggregateRating` nem `review` de propósito: as avaliações exibidas
 * hoje vêm de src/lib/reviews/data.ts e não são de compradores reais.
 */
export function productSchema(product: Product) {
  const url = `${SITE_URL}/produtos/${product.handle}`
  // `sku` é o código cadastrado na Shopify, nunca o id (gid) da variante.
  const sku = product.variants.find((v) => v.sku)?.sku
  const ofertas = product.variants
    .map((v) => ofertaDaVariante(product, v))
    .filter((o): o is NonNullable<typeof o> => o !== null)
  const imagens = product.images.map((img) => urlAbsoluta(img.url))

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.title,
    ...(product.description?.trim()
      ? { description: product.description.trim() }
      : {}),
    url,
    ...(imagens.length > 0 ? { image: imagens } : {}),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    ...(sku ? { sku } : {}),
    // Só as variantes com preço. Sem nenhuma, `offers` não existe.
    ...(ofertas.length === 0
      ? {}
      : { offers: ofertas.length === 1 ? ofertas[0] : ofertas }),
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
  const pagina = `${SITE_URL}/blog/${article.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pagina}#article`,
    headline: article.title,
    description: article.excerpt,
    inLanguage: 'pt-BR',
    datePublished: article.publishedAt,
    // Sem `updatedAt`, vale a data de publicação, que é a verdade disponível.
    dateModified: article.updatedAt ?? article.publishedAt,
    // Artigo sem imagem própria usa a imagem padrão do site.
    image: urlAbsoluta(article.featuredImage || IMAGEM_PADRAO),
    author: {
      '@type': 'Person',
      name: article.author,
    },
    // Referência ao `@id` da Organization, em vez de redeclarar a empresa.
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pagina,
    },
  }
}
