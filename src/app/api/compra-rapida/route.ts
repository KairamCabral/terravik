import { NextResponse } from 'next/server'
import { getCatalogo } from '@/lib/shopify/catalogo'
import {
  CURADORIA_DA_COMPRA_RAPIDA,
  type QuickPurchaseProduct,
} from '@/lib/quick-purchase/constants'

/**
 * Produtos da Compra Rápida, montados do catálogo no servidor.
 *
 * O painel é client component e não enxerga as credenciais da Shopify, então
 * a lista precisa vir daqui. Só entram variantes disponíveis; produto sem
 * nenhuma fica fora.
 */

// Cinco minutos de cache: preço e estoque mudam pouco.
export const revalidate = 300

export async function GET() {
  const catalogo = await getCatalogo('api/compra-rapida')

  const itens: QuickPurchaseProduct[] = []
  for (const curadoria of CURADORIA_DA_COMPRA_RAPIDA) {
    const produto = catalogo.find((p) => p.handle === curadoria.handle)
    if (!produto) continue

    const variants = produto.variants
      .filter((v) => v.available && v.price > 0)
      .map((v) => ({
        variantId: v.id,
        // "Default Title" é o nome que a Shopify dá à variante de produto sem opção.
        title: v.title === 'Default Title' ? 'Unidade' : v.title,
        price: v.price,
        compareAtPrice:
          v.compareAtPrice && v.compareAtPrice > v.price ? v.compareAtPrice : undefined,
      }))
    if (variants.length === 0) continue

    itens.push({
      id: produto.handle,
      title: produto.title,
      image: produto.featuredImage?.url ?? '',
      badge: curadoria.badge,
      pitch: curadoria.pitch,
      variants,
    })
  }

  return NextResponse.json({ itens })
}
