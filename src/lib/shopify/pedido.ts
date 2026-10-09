// src/lib/shopify/pedido.ts
//
// Leitura do payload de pedido da Admin API da Shopify (REST), no formato que
// vai para orders_sync. Usado pelo webhook e por /api/sync/orders: os dois
// precisam gravar a MESMA forma, senão o pedido muda de formato conforme o
// caminho por onde entrou.

import type { Json } from '@/types/database'

type Registro = Record<string, unknown>

/**
 * E-mail do comprador, em minúsculas.
 *
 * `order.email` vem nulo em pedido de PDV e em rascunho convertido, e é
 * justamente nesses que `customer.email` está preenchido.
 */
export function emailDoPedido(order: Registro): string | null {
  const cliente = order.customer as Registro | null | undefined

  const bruto = order.email ?? cliente?.email ?? order.contact_email ?? ''
  const limpo = String(bruto).trim().toLowerCase()

  return limpo || null
}

/** Itens do pedido, com product_id e variant_id. */
export function itensDoPedido(lineItems: unknown): Json {
  const itens = Array.isArray(lineItems) ? (lineItems as Registro[]) : []

  return itens.map((item) => ({
    id: String(item.id ?? ''),
    title: String(item.title ?? ''),
    quantity: Number(item.quantity ?? 0),
    price: String(item.price ?? '0'),
    sku: String(item.sku ?? ''),
    variant_id: String(item.variant_id ?? ''),
    product_id: String(item.product_id ?? ''),
  }))
}

export interface DadosDeEnvio {
  tracking_number?: string
  tracking_url?: string
  tracking_company?: string
  fulfilled_at?: string
  delivered_at?: string
}

/**
 * O link de rastreio vira `href` em /conta/pedidos. Só passa http e https:
 * o campo é texto livre no admin da Shopify, e um `javascript:` ali rodaria
 * na sessão de quem clicasse.
 */
function urlDeRastreioSegura(valor: unknown): string | null {
  if (typeof valor !== 'string' || !valor.trim()) return null
  try {
    const url = new URL(valor.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

/**
 * Dados de envio a partir de `order.fulfillments`.
 *
 * "fulfilled" na Shopify quer dizer DESPACHADO. A entrega vem em
 * `shipment_status`, que só é preenchido para transportadora que a Shopify
 * rastreia.
 *
 * Devolve só o que existe, em vez de null para o que falta. O upsert escreve
 * apenas as colunas que recebe: mandar null apagaria o rastreio já gravado no
 * primeiro `orders/updated` que chegasse por outro motivo (troca de status de
 * pagamento, por exemplo), e o botão "Rastrear Pedido" sumiria sem nada ter
 * acontecido com a entrega.
 */
export function dadosDeEnvio(order: Registro): DadosDeEnvio {
  const fulfillments = (Array.isArray(order.fulfillments) ? order.fulfillments : []) as Registro[]

  // Envio cancelado não é envio.
  const validos = fulfillments.filter((f) => f && f.status !== 'cancelled')

  // Envios parciais: o cliente precisa de todos os códigos.
  const codigos = validos
    .flatMap((f) =>
      Array.isArray(f.tracking_numbers) && f.tracking_numbers.length > 0
        ? f.tracking_numbers
        : [f.tracking_number]
    )
    .filter(Boolean)
    .map(String)

  const linkDe = (f: Registro) =>
    urlDeRastreioSegura(f.tracking_url) ??
    urlDeRastreioSegura(Array.isArray(f.tracking_urls) ? f.tracking_urls[0] : null)

  const comLink = validos.find((f) => linkDe(f))
  const comTransportadora = validos.find((f) => f.tracking_company)
  const primeiroEnvio = validos.find((f) => f.created_at)
  const entregue = validos.find((f) => f.shipment_status === 'delivered')

  const campos: DadosDeEnvio = {}
  if (codigos.length > 0) campos.tracking_number = Array.from(new Set(codigos)).join(', ')
  if (comLink) campos.tracking_url = linkDe(comLink) as string
  if (comTransportadora) campos.tracking_company = String(comTransportadora.tracking_company)
  if (primeiroEnvio) campos.fulfilled_at = String(primeiroEnvio.created_at)
  if (entregue && (entregue.updated_at || entregue.created_at)) {
    campos.delivered_at = String(entregue.updated_at ?? entregue.created_at)
  }

  return campos
}
