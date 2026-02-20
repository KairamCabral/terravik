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
} from '@/lib/seo/metadata'
import { normalizeProduct } from '@/lib/shopify/mappers'
import { getMockProductByHandle, MOCK_PRODUCTS } from '@/lib/shopify/mock-data'
import { getProductReviews, getProductRating } from '@/lib/reviews/data'
import { ProductPageClient } from './ProductPageClient'
import { REVALIDATE } from '@/lib/utils/constants'

interface Props {
  params: { handle: string }
}

export const revalidate = REVALIDATE.products

export async function generateStaticParams() {
  try {
    const handles = await getAllProductHandles()
    return handles.map((handle) => ({ handle }))
  } catch (error) {
    return MOCK_PRODUCTS.map((p) => ({ handle: p.handle }))
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let product = getMockProductByHandle(params.handle)

  try {
    const rawProduct = await getProductByHandle(params.handle)
    if (rawProduct) {
      product = normalizeProduct(rawProduct as any)
    }
  } catch (error) {
    console.warn('Shopify não configurado, usando mock data')
  }

  if (!product) {
    return {
      title: 'Produto não encontrado',
    }
  }

  return createProductMetadata(product)
}

export default async function ProductPage({ params }: Props) {
  let product = getMockProductByHandle(params.handle)

  try {
    const rawProduct = await getProductByHandle(params.handle)
    if (rawProduct) {
      product = normalizeProduct(rawProduct as any)
    }
  } catch (error) {
    console.warn('Shopify não configurado, usando mock data')
  }

  if (!product) {
    notFound()
  }

  const reviews = getProductReviews(params.handle)
  const rating = getProductRating(params.handle)

  return (
    <>
      {/* JSON-LD: Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema(product)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Produtos', url: '/produtos' },
              { name: product.title, url: `/produtos/${product.handle}` },
            ])
          ),
        }}
      />

      <ProductPageClient product={product} reviews={reviews} rating={rating} />
    </>
  )
}
