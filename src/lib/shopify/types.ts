/**
 * Tipos raw da Shopify Storefront API
 * Esses tipos refletem exatamente o que a API retorna.
 * Componentes devem usar os tipos normalizados de src/types/
 */

// ---- Comum ----

export interface ShopifyImage {
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifySEO {
  title: string | null
  description: string | null
}

// ---- Produto ----

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  availableForSale: boolean
  tags: string[]
  seo: ShopifySEO
  featuredImage: ShopifyImage | null
  images: {
    edges: Array<{ node: ShopifyImage }>
  }
  variants: {
    edges: Array<{ node: ShopifyVariant }>
  }
  priceRange: {
    minVariantPrice: ShopifyMoney
    maxVariantPrice: ShopifyMoney
  }
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney
    maxVariantPrice: ShopifyMoney
  }
  metafields: Array<ShopifyMetafield | null>
}

export interface ShopifyVariant {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: number | null
  price: ShopifyMoney
  compareAtPrice: ShopifyMoney | null
  selectedOptions: Array<{
    name: string
    value: string
  }>
  image: ShopifyImage | null
}

export interface ShopifyMetafield {
  key: string
  value: string
  type: string
  namespace: string
}

// ---- Coleção ----

export interface ShopifyCollection {
  id: string
  handle: string
  title: string
  description: string
  seo: ShopifySEO
  image: ShopifyImage | null
  products: {
    edges: Array<{ node: ShopifyProduct }>
  }
}

// ---- Carrinho ----

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: ShopifyMoney
    totalAmount: ShopifyMoney
    totalTaxAmount: ShopifyMoney | null
  }
  lines: {
    edges: Array<{ node: ShopifyCartLine }>
  }
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  cost: {
    totalAmount: ShopifyMoney
  }
  merchandise: {
    id: string
    title: string
    product: {
      id: string
      handle: string
      title: string
      featuredImage: ShopifyImage | null
    }
    price: ShopifyMoney
    selectedOptions: Array<{
      name: string
      value: string
    }>
  }
}

// ---- Blog / Article ----

export interface ShopifyArticle {
  id: string
  handle: string
  title: string
  contentHtml: string
  excerpt: string | null
  publishedAt: string
  seo: ShopifySEO
  image: ShopifyImage | null
  author: {
    name: string
  }
  blog: {
    handle: string
  }
}

// ---- Respostas da API ----

export interface ProductsResponse {
  products: {
    edges: Array<{ node: ShopifyProduct }>
  }
}

export interface ProductByHandleResponse {
  product: ShopifyProduct | null
}

export interface CollectionByHandleResponse {
  collection: ShopifyCollection | null
}

export interface CartResponse {
  cart: ShopifyCart
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart
    userErrors: Array<{ field: string[]; message: string }>
  }
}

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart
    userErrors: Array<{ field: string[]; message: string }>
  }
}

export interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart
    userErrors: Array<{ field: string[]; message: string }>
  }
}

export interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart
    userErrors: Array<{ field: string[]; message: string }>
  }
}
