/**
 * Shopify Favorites Integration
 * 
 * Armazena favoritos no Customer Metafield
 * Namespace: custom
 * Key: favorites
 * Type: json
 */

import { shopifyFetch } from '../client'

const CUSTOMER_FAVORITES_QUERY = `
  query getCustomerFavorites($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      metafield(namespace: "custom", key: "favorites") {
        value
      }
    }
  }
`

const UPDATE_CUSTOMER_FAVORITES_MUTATION = `
  mutation updateCustomerFavorites(
    $customerAccessToken: String!
    $metafields: [MetafieldsSetInput!]!
  ) {
    customerUpdate(
      customerAccessToken: $customerAccessToken
      customer: {
        metafields: $metafields
      }
    ) {
      customer {
        id
        metafield(namespace: "custom", key: "favorites") {
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

interface FavoritesMetafield {
  productIds: string[]
  updatedAt: string
}

interface CustomerFavoritesResponse {
  customer?: { metafield?: { value?: string } }
}

/**
 * Busca favoritos do cliente no Shopify
 */
export async function getShopifyFavorites(
  customerAccessToken: string
): Promise<string[]> {
  try {
    const response = await shopifyFetch<CustomerFavoritesResponse>({
      query: CUSTOMER_FAVORITES_QUERY,
      variables: { customerAccessToken },
    })

    const metafieldValue = response?.customer?.metafield?.value
    
    if (!metafieldValue) {
      return []
    }

    const data: FavoritesMetafield = JSON.parse(metafieldValue)
    return data.productIds || []
  } catch (error) {
    console.error('[Shopify Favorites] Error fetching favorites:', error)
    return []
  }
}

/**
 * Salva favoritos do cliente no Shopify
 */
export async function saveShopifyFavorites(
  customerAccessToken: string,
  productIds: string[]
): Promise<void> {
  try {
    const metafieldValue: FavoritesMetafield = {
      productIds,
      updatedAt: new Date().toISOString(),
    }

    await shopifyFetch({
      query: UPDATE_CUSTOMER_FAVORITES_MUTATION,
      variables: {
        customerAccessToken,
        metafields: [
          {
            namespace: 'custom',
            key: 'favorites',
            value: JSON.stringify(metafieldValue),
            type: 'json',
          },
        ],
      },
    })
  } catch (error) {
    console.error('[Shopify Favorites] Error saving favorites:', error)
    throw error
  }
}

/**
 * Mescla favoritos locais com Shopify (após login)
 * Retorna array unificado sem duplicatas
 */
export async function mergeFavorites(
  localFavorites: string[],
  customerAccessToken: string
): Promise<string[]> {
  try {
    // Buscar favoritos do Shopify
    const shopifyFavorites = await getShopifyFavorites(customerAccessToken)

    // Mesclar arrays removendo duplicatas
    const mergedFavorites = Array.from(
      new Set([...localFavorites, ...shopifyFavorites])
    )

    // Salvar resultado mesclado no Shopify
    await saveShopifyFavorites(customerAccessToken, mergedFavorites)

    return mergedFavorites
  } catch (error) {
    console.error('[Shopify Favorites] Error merging favorites:', error)
    // Em caso de erro, retornar favoritos locais
    return localFavorites
  }
}
