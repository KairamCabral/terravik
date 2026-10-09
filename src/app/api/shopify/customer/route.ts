// src/app/api/shopify/customer/route.ts
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN
const API_VERSION = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-10'

/**
 * Dados do cliente na Shopify, para /conta/dados.
 *
 * Exige sessão, e o id do cliente vem do perfil de quem está logado, lido no
 * servidor. O corpo da requisição é ignorado: antes a rota lia `customerId`
 * dele sem sessão nenhuma, e qualquer pessoa pedia e-mail, endereços e total
 * gasto de qualquer cliente trocando o número. O PUT, sem chamador no site,
 * alterava o cadastro de qualquer cliente e foi removido.
 *
 * A consulta usa `numberOfOrders`; `ordersCount` não existe mais na Admin API.
 */
const CONSULTA = `
  query getCustomer($id: ID!) {
    customer(id: $id) {
      id
      email
      firstName
      lastName
      phone
      defaultAddress { address1 address2 city province zip country phone }
      addresses { address1 address2 city province zip country phone }
      numberOfOrders
      amountSpent { amount currencyCode }
    }
  }
`

export async function POST() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { data: perfil } = await supabase
    .from('profiles')
    .select('shopify_customer_id')
    .eq('id', user.id)
    .single()

  const idDoPerfil = perfil?.shopify_customer_id ?? null
  if (!idDoPerfil) {
    return NextResponse.json(
      { error: 'Conta sem cliente vinculado na Shopify' },
      { status: 404 }
    )
  }

  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
    console.error('[api/shopify/customer] Admin API da Shopify não configurada')
    return NextResponse.json(
      { error: 'Configuração do Shopify não encontrada' },
      { status: 500 }
    )
  }

  // O webhook grava o id numérico e o sync pode gravar o gid: aceita os dois.
  const gid = idDoPerfil.startsWith('gid://')
    ? idDoPerfil
    : `gid://shopify/Customer/${idDoPerfil}`

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query: CONSULTA, variables: { id: gid } }),
      }
    )

    if (!response.ok) {
      console.error('[api/shopify/customer] Shopify respondeu', response.status)
      return NextResponse.json(
        { error: 'Erro ao buscar dados no Shopify' },
        { status: 502 }
      )
    }

    const { data, errors } = await response.json()

    // O detalhe do erro fica no log do servidor; quem chama recebe só a
    // mensagem genérica.
    if (errors) {
      console.error('[api/shopify/customer] Erro GraphQL:', JSON.stringify(errors).slice(0, 300))
      return NextResponse.json({ error: 'Erro na consulta à Shopify' }, { status: 502 })
    }

    const customer = data?.customer
    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente não encontrado no Shopify' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      defaultAddress: customer.defaultAddress,
      addresses: customer.addresses || [],
      ordersCount: Number(customer.numberOfOrders) || 0,
      totalSpent: customer.amountSpent?.amount || '0',
    })
  } catch (error) {
    console.error('[api/shopify/customer] Exceção:', (error as Error).message)
    return NextResponse.json(
      { error: 'Erro interno ao buscar cliente' },
      { status: 500 }
    )
  }
}
