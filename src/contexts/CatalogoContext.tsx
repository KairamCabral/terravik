'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Product } from '@/types/product'

/**
 * Catálogo resolvido no servidor, entregue a uma árvore de client components.
 *
 * A página (server) busca com `getCatalogo` e embrulha a árvore. Nenhum
 * client deve importar `lib/shopify/mock-data` para descobrir produto.
 */
const CatalogoContext = createContext<Product[] | null>(null)

export function CatalogoProvider({
  produtos,
  children,
}: {
  produtos: Product[]
  children: ReactNode
}) {
  return <CatalogoContext.Provider value={produtos}>{children}</CatalogoContext.Provider>
}

export function useCatalogo(): Product[] {
  const catalogo = useContext(CatalogoContext)
  if (!catalogo) {
    throw new Error('useCatalogo precisa de um CatalogoProvider na página')
  }
  return catalogo
}
