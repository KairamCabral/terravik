import type { Metadata } from 'next'
import { getProducts } from '@/lib/shopify/queries/products'
import { createMetadata, breadcrumbSchema, jsonLd } from '@/lib/seo/metadata'
import { reportarFalhaShopify } from '@/lib/shopify/fallback'
import { MOCK_PRODUCTS } from '@/lib/shopify/mock-data'
import { ProductsPageClient } from './ProductsPageClient'
import { AtalhoDeKits } from '@/components/kits/AtalhoDeKits'
import { montarKits } from '@/lib/promocoes/kits'

export const metadata: Metadata = createMetadata({
  title: 'Produtos para Gramados',
  description:
    'Fertilizantes premium Terravik: Raiz Forte para firmar a raiz, Verde Rápido para devolver a cor e Resistência Total para o gramado forte o ano inteiro.',
  path: '/produtos',
})

// Literal de propósito: o Next 15 só aceita valor escrito direto aqui.
// É o mesmo de REVALIDATE.products (src/lib/utils/constants.ts).
export const revalidate = 60

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
          __html: jsonLd(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Produtos', url: '/produtos' },
            ])
          ),
        }}
      />

      <ProductsPageClient
        initialProducts={products}
        atalhoDeKits={<AtalhoDeKits kits={montarKits(products)} />}
      />
    </>
  )
}
