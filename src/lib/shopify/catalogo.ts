import 'server-only'

import type { Product } from '@/types/product'
import { getProducts } from './queries/products'
import { reportarFalhaShopify } from './fallback'
import { shouldUseMock } from './client'
import { MOCK_PRODUCTS } from './mock-data'

export interface CatalogoResolvido {
  produtos: Product[]
  /**
   * `true` quando a loja está configurada, a Shopify falhou e os produtos
   * vieram do catálogo de exemplo.
   *
   * Quem desenha a tela precisa saber disso. Sem o sinal, /favoritos concluiria
   * que o produto saiu do catálogo e ofereceria "remover da lista" para itens
   * reais só porque a Shopify oscilou. Em modo mock de propósito (loja não
   * configurada) o catálogo de exemplo É o catálogo, e o sinal fica desligado.
   */
  degradado: boolean
}

/**
 * Catálogo para componentes de servidor.
 *
 * Client component não vê as credenciais da Shopify: todo client que importa
 * `mock-data` mostra o catálogo de exemplo em produção. A página de servidor
 * resolve o catálogo aqui e entrega por prop.
 */
export async function getCatalogoComEstado(contexto: string): Promise<CatalogoResolvido> {
  if (shouldUseMock()) return { produtos: MOCK_PRODUCTS, degradado: false }

  try {
    const daShopify = await getProducts()
    if (daShopify.length > 0) return { produtos: daShopify, degradado: false }
  } catch (erro) {
    reportarFalhaShopify(contexto, erro)
  }
  return { produtos: MOCK_PRODUCTS, degradado: true }
}

export async function getCatalogo(contexto: string): Promise<Product[]> {
  return (await getCatalogoComEstado(contexto)).produtos
}
