import { NextResponse } from 'next/server'
import { getCatalogo } from '@/lib/shopify/catalogo'

/**
 * Catálogo resumido para client components (seletor de produto do admin de
 * banners, sugestões, "leve junto" do carrinho). Client não enxerga as
 * credenciais da Shopify e não deve importar `mock-data`: a lista vem daqui.
 */
export interface ProdutoLeve {
  id: string
  handle: string
  title: string
  price: number
  image: string | null
  /** Produto com alguma variante à venda. */
  available: boolean
  /**
   * Variante que o "leve junto" põe no carrinho: a primeira disponível.
   * `null` quando o produto não tem variante. Preço e preço de comparação
   * abaixo são DESSA variante, lidos do catálogo, nunca escritos à mão.
   */
  variantId: string | null
  variantTitle: string | null
  variantPrice: number | null
  variantCompareAtPrice: number | null
}

export const revalidate = 300

export async function GET() {
  const catalogo = await getCatalogo('api/catalogo-leve')

  const produtos: ProdutoLeve[] = catalogo.map((p) => {
    const variante = p.variants.find((v) => v.available) ?? p.variants[0] ?? null
    return {
      id: p.id,
      handle: p.handle,
      title: p.title,
      price: p.price,
      image: p.featuredImage?.url ?? null,
      available: p.available,
      variantId: variante?.id ?? null,
      variantTitle: variante?.title ?? null,
      variantPrice: variante?.price ?? null,
      variantCompareAtPrice: variante?.compareAtPrice ?? null,
    }
  })

  return NextResponse.json({ produtos })
}
