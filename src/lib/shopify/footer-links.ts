import 'server-only'

import { getProducts } from '@/lib/shopify/queries/products'
import { MOCK_PRODUCTS } from '@/lib/shopify/mock-data'
import { reportarFalhaShopify } from '@/lib/shopify/fallback'

export interface LinkDeProduto {
  label: string
  href: string
}

/** Quantos produtos o rodapé lista antes do "Ver Todos". */
const SLOTS = 3

/**
 * Links de produto do rodapé, alimentados pelo catálogo.
 *
 * O rodapé trazia três handles escritos à mão. Com a loja real, handle que
 * não existir vira 404 em toda página do site.
 *
 * Degrada sem quebrar: catálogo com menos de SLOTS produtos devolve menos
 * links. O rodapé sempre mantém o "Ver Todos", que é rota estática.
 */
export async function getLinksDeProdutoDoRodape(): Promise<LinkDeProduto[]> {
  let produtos = MOCK_PRODUCTS

  try {
    // Uma hora, e não os 60 s padrão: esta função é chamada pelo root layout,
    // e um fetch com `revalidate` menor que o da rota rebaixa a rota inteira.
    // O frescor vem da tag `products`, revalidada pelo webhook da Shopify.
    const daShopify = await getProducts(SLOTS, { revalidate: 3600 })
    if (daShopify.length > 0) produtos = daShopify
  } catch (error) {
    reportarFalhaShopify('rodapé, getProducts()', error)
  }

  return produtos.slice(0, SLOTS).map((p) => ({
    label: p.title,
    href: `/produtos/${p.handle}`,
  }))
}
