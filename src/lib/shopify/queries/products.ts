/**
 * GraphQL queries para produtos Shopify
 */

import { cache } from 'react'
import { shopifyFetch } from '../client'
import type { ProductsResponse, ProductByHandleResponse } from '../types'
import { normalizeProduct } from '../mappers'
import type { Product } from '@/types/product'

// ---- Fragments ----

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    tags
    seo {
      title
      description
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          sku
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`

// ---- Queries ----

const GET_ALL_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query GetAllProducts($first: Int = 20) {
    products(first: $first, sortKey: TITLE) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`

const GET_PRODUCT_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`

const GET_PRODUCTS_BY_TAG = `
  ${PRODUCT_FRAGMENT}
  query GetProductsByTag($query: String!, $first: Int = 20) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`

// ---- Funções exportadas ----

/**
 * shopifyFetch é POST, e a memoização automática de fetch do Next só cobre
 * GET: chamadas repetidas no mesmo render saíam todas pela rede. `cache()` da
 * React deduplica por passe de renderização (não substitui o cache de dados
 * do Next, que segue valendo entre requisições pelo `revalidate`).
 *
 * `cache()` compara argumentos por identidade. Por isso a função memoizada
 * recebe só primitivos, e `getProducts` (abaixo) desmonta o objeto de opções e
 * resolve o default antes de chamar: `getProducts()` e `getProducts(20)` caem
 * na mesma entrada, e um objeto de opções novo a cada chamada não fura a
 * deduplicação.
 */
const buscarProdutos = cache(async function buscarProdutos(
  first: number,
  revalidate: number | undefined
): Promise<Product[]> {
  const data = await shopifyFetch<ProductsResponse>({
    query: GET_ALL_PRODUCTS,
    variables: { first },
    tags: ['products'],
    ...(revalidate !== undefined ? { revalidate } : {}),
  })

  return data.products.edges.map((edge) => normalizeProduct(edge.node))
})

export function getProducts(
  first = 20,
  opcoes: { revalidate?: number } = {}
): Promise<Product[]> {
  return buscarProdutos(first, opcoes.revalidate)
}

/**
 * Memoizada pelo handle (string, comparada por valor): generateMetadata e a
 * página da PDP chamam com o mesmo handle no mesmo render e fazem um POST só.
 */
export const getProductByHandle = cache(async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const data = await shopifyFetch<ProductByHandleResponse>({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle },
    tags: ['products', `product-${handle}`],
  })

  if (!data.product) return null
  return normalizeProduct(data.product)
})

export async function getProductsByTag(
  tag: string,
  first = 20
): Promise<Product[]> {
  const data = await shopifyFetch<ProductsResponse>({
    query: GET_PRODUCTS_BY_TAG,
    variables: { query: `tag:${tag}`, first },
    tags: ['products'],
  })

  return data.products.edges.map((edge) => normalizeProduct(edge.node))
}

export async function getAllProductHandles(): Promise<string[]> {
  const data = await shopifyFetch<{
    products: { edges: Array<{ node: { handle: string } }> }
  }>({
    query: `
      query GetAllHandles {
        products(first: 100) {
          edges {
            node {
              handle
            }
          }
        }
      }
    `,
    tags: ['products'],
  })

  return data.products.edges.map((edge) => edge.node.handle)
}
