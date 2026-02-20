import type { Metadata } from 'next'
import { getProducts } from '@/lib/shopify/queries/products'
import { createMetadata, breadcrumbSchema } from '@/lib/seo/metadata'
import { normalizeProduct } from '@/lib/shopify/mappers'
import { MOCK_PRODUCTS } from '@/lib/shopify/mock-data'
import { ProductsPageClient } from './ProductsPageClient'
import { REVALIDATE } from '@/lib/utils/constants'

export const metadata: Metadata = createMetadata({
  title: 'Produtos para Gramados',
  description:
    'Fertilizantes premium Terravik: Gramado Novo para implantação, Verde Rápido para crescimento e Resistência Total para proteção do seu gramado.',
  path: '/produtos',
})

export const revalidate = REVALIDATE.products

export default async function ProdutosPage() {
  let products = MOCK_PRODUCTS

  try {
    const rawProducts = await getProducts()
    if (rawProducts && rawProducts.length > 0) {
      products = rawProducts.map((p) => normalizeProduct(p as any))
    }
  } catch (error) {
    console.warn('Shopify não configurado, usando mock data:', error)
  }

  return (
    <>
      {/* JSON-LD: Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Produtos', url: '/produtos' },
            ])
          ),
        }}
      />

      <ProductsPageClient initialProducts={products} />
    </>
  )
}
