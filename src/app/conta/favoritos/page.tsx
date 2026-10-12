import { getCatalogoComEstado } from '@/lib/shopify/catalogo'
import { ContaFavoritosClient } from './ContaFavoritosClient'

// Literal de propósito: o Next 15 só aceita valor escrito direto aqui.
// É o mesmo de REVALIDATE.products (src/lib/utils/constants.ts).
export const revalidate = 60

export default async function ContaFavoritosPage() {
  const { produtos, degradado } = await getCatalogoComEstado('conta/favoritos')
  return <ContaFavoritosClient catalogo={produtos} degradado={degradado} />
}
