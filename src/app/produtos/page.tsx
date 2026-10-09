import type { Metadata } from 'next'
import { getProducts } from '@/lib/shopify/queries/products'
import { createMetadata, breadcrumbSchema } from '@/lib/seo/metadata'
import { reportarFalhaShopify } from '@/lib/shopify/fallback'
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
    // getProducts() já devolve Product normalizado.
    const reais = await getProducts()
    if (reais.length > 0) {
      products = reais
    }
  } catch (error) {
    reportarFalhaShopify('listagem de produtos', error)
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
