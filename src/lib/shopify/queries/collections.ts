/**
 * GraphQL queries para coleções Shopify
 */

import { shopifyFetch } from '../client'
import type { CollectionByHandleResponse } from '../types'
import { normalizeProduct } from '../mappers'
import type { Product } from '@/types/product'

const COLLECTION_QUERY = `
  query GetCollectionByHandle($handle: String!, $first: Int = 20) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        title
        description
      }
      image {
        url
        altText
        width
        height
      }
      products(first: $first) {
        edges {
          node {
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
        }
      }
    }
  }
`

export async function getCollectionProducts(
  handle: string,
  first = 20
): Promise<Product[]> {
  const data = await shopifyFetch<CollectionByHandleResponse>({
    query: COLLECTION_QUERY,
    variables: { handle, first },
    tags: ['collections', `collection-${handle}`],
  })

  if (!data.collection) return []

  return data.collection.products.edges.map((edge) =>
    normalizeProduct(edge.node)
  )
}
