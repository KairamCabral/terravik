import { NextResponse } from 'next/server'
import { getCatalogo } from '@/lib/shopify/catalogo'

/**
 * Catálogo resumido para client components (seletor de produto do admin de
 * banners, sugestões). Client não enxerga as credenciais da Shopify e não deve
 * importar `mock-data`: a lista vem daqui.
 */
export interface ProdutoLeve {
  id: string
  handle: string
  title: string
  price: number
  image: string | null
}

export const revalidate = 300

export async function GET() {
  const catalogo = await getCatalogo('api/catalogo-leve')

  const produtos: ProdutoLeve[] = catalogo.map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    price: p.price,
    image: p.featuredImage?.url ?? null,
  }))

  return NextResponse.json({ produtos })
}
