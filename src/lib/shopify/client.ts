/**
 * Shopify Storefront API — GraphQL Client
 *
 * Wrapper para todas as chamadas à Storefront API.
 * Usa fetch nativo do Next.js com suporte a ISR (revalidate).
 */

// ============================================
// VERIFICAÇÃO DE MOCK MODE
// ============================================

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-10'

// Verificar se deve usar mock
function shouldUseMock(): boolean {
  if (USE_MOCK_DATA) return true
  if (!domain || domain.trim() === '') return true
  if (!storefrontAccessToken || storefrontAccessToken.trim() === '') return true
  return false
}

const endpoint = domain ? `https://${domain}/api/${apiVersion}/graphql.json` : ''

type ShopifyResponse<T> = {
  data: T
  errors?: Array<{ message: string }>
}

interface ShopifyFetchOptions {
  query: string
  variables?: Record<string, unknown>
  tags?: string[]
  revalidate?: number | false
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  tags = [],
  revalidate = 60,
}: ShopifyFetchOptions): Promise<T> {
  // VERIFICAR MOCK MODE PRIMEIRO
  if (shouldUseMock()) {
    console.log('[Shopify Client] Mock mode ativo - retornando erro controlado')
    throw new Error('MOCK_MODE_ACTIVE')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
    },
    body: JSON.stringify({ query, variables }),
    next: {
      revalidate,
      tags,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Shopify API error: ${response.status} ${response.statusText}`
    )
  }

  const json: ShopifyResponse<T> = await response.json()

  if (json.errors) {
    const messages = json.errors.map((e) => e.message).join(', ')
    throw new Error(`Shopify GraphQL errors: ${messages}`)
  }

  return json.data
}

/**
 * Client-side fetch (sem cache do Next.js)
 * Usado para mutations (carrinho, etc.)
 */
export async function shopifyMutate<T>({
  query,
  variables = {},
}: {
  query: string
  variables?: Record<string, unknown>
}): Promise<T> {
  // VERIFICAR MOCK MODE PRIMEIRO
  if (shouldUseMock()) {
    console.log('[Shopify Client] Mock mode ativo - retornando erro controlado')
    throw new Error('MOCK_MODE_ACTIVE')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(
      `Shopify API error: ${response.status} ${response.statusText}`
    )
  }

  const json: ShopifyResponse<T> = await response.json()

  if (json.errors) {
    const messages = json.errors.map((e) => e.message).join(', ')
    throw new Error(`Shopify GraphQL errors: ${messages}`)
  }

  return json.data
}
