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
 * Busca dados do cliente no Shopify via Admin API
 * @param shopifyCustomerId - ID do cliente no Shopify (ex: "gid://shopify/Customer/123")
 */
export async function getShopifyCustomer(
  shopifyCustomerId: string
): Promise<{ data: ShopifyCustomerData | null; error: string | null }> {
  try {
    console.log('[ShopifyService] Buscando dados do cliente:', shopifyCustomerId)

    const response = await fetch('/api/shopify/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: shopifyCustomerId }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[ShopifyService] Erro na resposta:', error)
      return { data: null, error: `Erro ao buscar dados: ${response.status}` }
    }

    const data = await response.json()
    console.log('[ShopifyService] Dados obtidos:', data)
    return { data, error: null }
  } catch (error: any) {
    console.error('[ShopifyService] Exceção:', error)
    return { data: null, error: error.message }
  }
}

/**
 * Atualiza dados do cliente no Shopify via Admin API
 * @param shopifyCustomerId - ID do cliente no Shopify
 * @param updates - Dados a serem atualizados
 */
export async function updateShopifyCustomer(
  shopifyCustomerId: string,
  updates: {
    firstName?: string
    lastName?: string
    phone?: string
    address?: {
      address1?: string
      address2?: string
      city?: string
      province?: string
      zip?: string
      country?: string
      phone?: string
    }
  }
): Promise<{ success: boolean; error: string | null }> {
  try {
    console.log('[ShopifyService] Atualizando cliente:', shopifyCustomerId, updates)

    const response = await fetch('/api/shopify/customer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: shopifyCustomerId, updates }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[ShopifyService] Erro ao atualizar:', error)
      return { success: false, error: `Erro ao atualizar: ${response.status}` }
    }

    console.log('[ShopifyService] Cliente atualizado com sucesso')
    return { success: true, error: null }
  } catch (error: any) {
    console.error('[ShopifyService] Exceção ao atualizar:', error)
    return { success: false, error: error.message }
  }
}
