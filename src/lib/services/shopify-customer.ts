// src/lib/services/shopify-customer.ts
// Serviço para buscar dados de clientes do Shopify

export interface ShopifyCustomerAddress {
  address1: string | null
  address2: string | null
  city: string | null
  province: string | null
  zip: string | null
  country: string | null
  phone: string | null
}

export interface ShopifyCustomerData {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  defaultAddress: ShopifyCustomerAddress | null
  addresses: ShopifyCustomerAddress[]
  ordersCount: number
  totalSpent: string
}

/**
 * Busca os dados do cliente logado na Shopify.
 * O servidor descobre o cliente pelo perfil da sessão; nada é enviado no corpo.
 */
export async function getShopifyCustomer(): Promise<{ data: ShopifyCustomerData | null; error: string | null }> {
  try {
    const response = await fetch('/api/shopify/customer', { method: 'POST' })

    if (!response.ok) {
      return { data: null, error: `Erro ao buscar dados: ${response.status}` }
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}
