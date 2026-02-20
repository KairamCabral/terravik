// src/app/api/shopify/customer/route.ts
import { NextRequest, NextResponse } from 'next/server'

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

/**
 * GET/POST - Buscar dados do cliente no Shopify
 */
export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json()

    if (!customerId) {
      return NextResponse.json(
        { error: 'customerId é obrigatório' },
        { status: 400 }
      )
    }

    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
      console.error('[API] Variáveis de ambiente do Shopify não configuradas')
      return NextResponse.json(
        { error: 'Configuração do Shopify não encontrada' },
        { status: 500 }
      )
    }

    // Extrair ID numérico do GID
    const numericId = customerId.includes('/')
      ? customerId.split('/').pop()
      : customerId

    console.log('[API] Buscando cliente Shopify:', numericId)

    // GraphQL Query para buscar dados do cliente
    const query = `
      query getCustomer($id: ID!) {
        customer(id: $id) {
          id
          email
          firstName
          lastName
          phone
          defaultAddress {
            address1
            address2
            city
            province
            zip
            country
            phone
          }
          addresses {
            address1
            address2
            city
            province
            zip
            country
            phone
          }
          ordersCount
          amountSpent {
            amount
            currencyCode
          }
        }
      }
    `

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query,
          variables: {
            id: customerId.includes('gid://') ? customerId : `gid://shopify/Customer/${numericId}`,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API] Erro do Shopify:', errorText)
      return NextResponse.json(
        { error: 'Erro ao buscar dados no Shopify' },
        { status: response.status }
      )
    }

    const { data, errors } = await response.json()

    if (errors) {
      console.error('[API] Erros GraphQL:', errors)
      return NextResponse.json(
        { error: 'Erro na consulta GraphQL', details: errors },
        { status: 400 }
      )
    }

    if (!data?.customer) {
      console.warn('[API] Cliente não encontrado:', customerId)
      return NextResponse.json(
        { error: 'Cliente não encontrado no Shopify' },
        { status: 404 }
      )
    }

    const customer = data.customer

    // Formatar resposta
    const customerData = {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      defaultAddress: customer.defaultAddress,
      addresses: customer.addresses || [],
      ordersCount: customer.ordersCount || 0,
      totalSpent: customer.amountSpent?.amount || '0',
    }

    console.log('[API] Cliente encontrado:', customerData.email)
    return NextResponse.json(customerData)
  } catch (error: any) {
    console.error('[API] Exceção ao buscar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno ao buscar cliente', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * PUT - Atualizar dados do cliente no Shopify
 */
export async function PUT(request: NextRequest) {
  try {
    const { customerId, updates } = await request.json()

    if (!customerId || !updates) {
      return NextResponse.json(
        { error: 'customerId e updates são obrigatórios' },
        { status: 400 }
      )
    }

    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Configuração do Shopify não encontrada' },
        { status: 500 }
      )
    }

    console.log('[API] Atualizando cliente:', customerId, updates)

    // GraphQL Mutation para atualizar cliente
    const mutation = `
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
            phone
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const input: any = {
      id: customerId.includes('gid://') ? customerId : `gid://shopify/Customer/${customerId}`,
    }

    if (updates.firstName) input.firstName = updates.firstName
    if (updates.lastName) input.lastName = updates.lastName
    if (updates.phone) input.phone = updates.phone

    // Se houver endereço, adicionar
    if (updates.address) {
      input.addresses = [{
        address1: updates.address.address1,
        address2: updates.address.address2,
        city: updates.address.city,
        province: updates.address.province,
        zip: updates.address.zip,
        country: updates.address.country || 'BR',
        phone: updates.address.phone,
      }]
    }

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: mutation,
          variables: { input },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API] Erro ao atualizar:', errorText)
      return NextResponse.json(
        { error: 'Erro ao atualizar no Shopify' },
        { status: response.status }
      )
    }

    const { data, errors } = await response.json()

    if (errors || data?.customerUpdate?.userErrors?.length > 0) {
      const errorDetails = errors || data.customerUpdate.userErrors
      console.error('[API] Erros na atualização:', errorDetails)
      return NextResponse.json(
        { error: 'Erro ao atualizar cliente', details: errorDetails },
        { status: 400 }
      )
    }

    console.log('[API] Cliente atualizado com sucesso')
    return NextResponse.json({ success: true, customer: data.customerUpdate.customer })
  } catch (error: any) {
    console.error('[API] Exceção ao atualizar:', error)
    return NextResponse.json(
      { error: 'Erro interno ao atualizar', details: error.message },
      { status: 500 }
    )
  }
}
