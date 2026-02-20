/**
 * Tipos normalizados de Produto
 * Usados em todos os componentes (nunca usar tipos raw do Shopify)
 */

export interface ProductImage {
  url: string
  alt: string
  width: number
  height: number
}

export interface ProductVariant {
  id: string
  title: string
  available: boolean
  quantityAvailable: number | null
  price: number
  compareAtPrice: number | null
  currency: string
  options: Record<string, string>
  image: ProductImage | null
}

export interface Product {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  available: boolean
  tags: string[]
  seo: {
    title: string
    description: string
  }
  featuredImage: ProductImage | null
  images: ProductImage[]
  variants: ProductVariant[]
  price: number
  maxPrice: number
  compareAtPrice: number
  currency: string
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number // 1-5
  title: string
  comment: string
  date: string // ISO date
  verified: boolean
}
