/**
 * Verificação de assinatura no padrão Standard Webhooks.
 *
 * O Send Email Hook do Supabase e os webhooks do Resend (via Svix) assinam do
 * mesmo jeito: HMAC-SHA256 de `id.timestamp.corpo`, em base64, com o segredo
 * `whsec_...` (base64). Só os nomes dos cabeçalhos mudam.
 *
 * A verificação é sobre o corpo BRUTO: reserializar o JSON muda os bytes e a
 * assinatura deixa de bater.
 */

import { createHmac, timingSafeEqual } from 'crypto'

/** Aceita "v1,whsec_xxx" (como o Supabase mostra), "whsec_xxx" ou o base64 puro. */
function chaveDoSegredo(segredo: string): Buffer {
  const limpo = segredo.trim()
  const semVersao = limpo.startsWith('v1,') ? limpo.slice(3) : limpo
  const base64 = semVersao.startsWith('whsec_') ? semVersao.slice(6) : semVersao
  return Buffer.from(base64, 'base64')
}

export interface Cabecalhos {
  id: string | null
  timestamp: string | null
  assinatura: string | null
}

export type ResultadoDaVerificacao = { ok: true } | { ok: false; motivo: string }

/** Cinco minutos: fora disso é repetição de requisição antiga. */
const TOLERANCIA_PADRAO = 5 * 60

export function verificarAssinatura(
  corpoBruto: string,
  cabecalhos: Cabecalhos,
  segredo: string,
  toleranciaSegundos: number = TOLERANCIA_PADRAO
): ResultadoDaVerificacao {
  // Sem segredo, nada passa.
  if (!segredo.trim() || chaveDoSegredo(segredo).length === 0) {
    return { ok: false, motivo: 'Segredo do webhook não configurado.' }
  }

  const { id, timestamp, assinatura } = cabecalhos
  if (!id || !timestamp || !assinatura) {
    return { ok: false, motivo: 'Requisição sem cabeçalhos de assinatura.' }
  }

  const agora = Math.floor(Date.now() / 1000)
  const enviadoEm = Number(timestamp)
  if (!Number.isFinite(enviadoEm) || Math.abs(agora - enviadoEm) > toleranciaSegundos) {
    return { ok: false, motivo: 'Requisição fora da janela de tempo aceita.' }
  }

  const esperada = createHmac('sha256', chaveDoSegredo(segredo))
    .update(`${id}.${timestamp}.${corpoBruto}`)
    .digest('base64')
  const alvo = Buffer.from(esperada)

  // O cabeçalho pode trazer várias assinaturas separadas por espaço
  // ("v1,abc v1,def"), durante a troca de segredo. Basta uma bater.
  for (const parte of assinatura.split(' ')) {
    const [versao, valor] = parte.split(',')
    if (versao !== 'v1' || !valor) continue
    const candidata = Buffer.from(valor)
    if (candidata.length !== alvo.length) continue
    if (timingSafeEqual(candidata, alvo)) return { ok: true }
  }

  return { ok: false, motivo: 'Assinatura inválida.' }
}

/** Assina um corpo. Usado em teste e no diagnóstico. */
export function assinar(corpoBruto: string, id: string, timestamp: string, segredo: string): string {
  const hash = createHmac('sha256', chaveDoSegredo(segredo))
    .update(`${id}.${timestamp}.${corpoBruto}`)
    .digest('base64')
  return `v1,${hash}`
}

export function cabecalhosSupabase(h: Headers): Cabecalhos {
  return {
    id: h.get('webhook-id'),
    timestamp: h.get('webhook-timestamp'),
    assinatura: h.get('webhook-signature'),
  }
}

export function cabecalhosResend(h: Headers): Cabecalhos {
  return {
    id: h.get('svix-id'),
    timestamp: h.get('svix-timestamp'),
    assinatura: h.get('svix-signature'),
  }
}
