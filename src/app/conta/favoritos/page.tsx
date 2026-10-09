import { getCatalogoComEstado } from '@/lib/shopify/catalogo'
import { REVALIDATE } from '@/lib/utils/constants'
import { ContaFavoritosClient } from './ContaFavoritosClient'

export const revalidate = REVALIDATE.products

export default async function ContaFavoritosPage() {
  const { produtos, degradado } = await getCatalogoComEstado('conta/favoritos')
  return <ContaFavoritosClient catalogo={produtos} degradado={degradado} />
}
