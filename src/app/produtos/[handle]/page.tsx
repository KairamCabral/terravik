import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getProductByHandle,
  getAllProductHandles,
} from '@/lib/shopify/queries/products'
import {
  createProductMetadata,
  productSchema,
  breadcrumbSchema,
  jsonLd,
  faqSchema,
} from '@/lib/seo/metadata'
import { reportarFalhaShopify } from '@/lib/shopify/fallback'
import { getMockProductByHandle, MOCK_PRODUCTS } from '@/lib/shopify/mock-data'
import { ProductPageClient } from './ProductPageClient'
import { ProductLp } from '@/components/product/lp/ProductLp'
import { KitsDoProduto } from '@/components/kits/KitsDoProduto'
import { getCatalogo } from '@/lib/shopify/catalogo'
import { conteudoDaLp, custoPorM2, PESO_DO_SACO } from '@/lib/produtos/lp'

interface Props {
  params: Promise<{ handle: string }>
}

// Literal de propósito: o Next 15 só aceita valor escrito direto aqui.
// É o mesmo de REVALIDATE.products (src/lib/utils/constants.ts).
export const revalidate = 60

// Sem isto, notFound() em handle fora do generateStaticParams responde 200
// (soft 404). Efeito colateral: produto criado na Shopify depois do build
// responde 404 até o próximo deploy.
export const dynamicParams = false

export async function generateStaticParams() {
  try {
    const handles = await getAllProductHandles()
    return handles.map((handle) => ({ handle }))
  } catch (error) {
    reportarFalhaShopify('generateStaticParams de produto', error)
    return MOCK_PRODUCTS.map((p) => ({ handle: p.handle }))
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  let product = getMockProductByHandle(params.handle)

  try {
    // getProductByHandle() já devolve Product normalizado.
    const real = await getProductByHandle(params.handle)
    if (real) {
      product = real
    }
  } catch (error) {
    reportarFalhaShopify(`metadata do produto ${params.handle}`, error)
  }

  if (!product) {
    return {
      title: 'Produto não encontrado',
    }
  }

  return createProductMetadata(product)
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  let product = getMockProductByHandle(params.handle)

  try {
    const real = await getProductByHandle(params.handle)
    if (real) {
      product = real
    }
  } catch (error) {
    reportarFalhaShopify(`página do produto ${params.handle}`, error)
  }

  if (!product) {
    notFound()
  }

  // Conteúdo da página, lido do rótulo (src/lib/produtos/lp.ts). Produto que
  // ainda não tem conteúdo cadastrado mostra só a área de compra.
  const conteudo = conteudoDaLp(product.handle)
  const fatos = conteudo
    ? [
        'Fórmula concentrada',
        `Rende até ${conteudo.rendimento.m2PorSaco} m²`,
        'Dosador incluso',
      ]
    : []

  // Custo por m² tratado, calculado do preço e do rendimento do rótulo. Só nos
  // produtos em que o argumento do rendimento se aplica (ver `compararDose`).
  const custo =
    conteudo && conteudo.compararDose ? custoPorM2(product.price, conteudo.rendimento) : null
  const notaDoPreco =
    custo !== null
      ? `Saco de ${PESO_DO_SACO} · cerca de ${custo.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })} por m² tratado`
      : undefined

  const catalogo = await getCatalogo('produto-kits')

  return (
    <>
      {/* JSON-LD: Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(productSchema(product)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Produtos', url: '/produtos' },
              { name: product.title, url: `/produtos/${product.handle}` },
            ])
          ),
        }}
      />

      {/* JSON-LD: as mesmas perguntas que aparecem na tela */}
      {conteudo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(
              faqSchema(conteudo.perguntas.map((p) => ({ question: p.pergunta, answer: p.resposta })))
            ),
          }}
        />
      )}

      <ProductPageClient
        product={product}
        paraQuem={conteudo?.paraQuem}
        fatos={fatos}
        notaDoPreco={notaDoPreco}
      />
      {/* Kits logo abaixo da compra: é onde a pessoa decide quanto levar. */}
      <KitsDoProduto produto={product} catalogo={catalogo} />
      {conteudo && <ProductLp product={product} conteudo={conteudo} />}
    </>
  )
}
