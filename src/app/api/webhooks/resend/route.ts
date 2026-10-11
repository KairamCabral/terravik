import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { verificarAssinatura, cabecalhosResend } from '@/lib/webhooks/standard'

/**
 * POST /api/webhooks/resend
 *
 * O Resend avisa aqui o que aconteceu com cada e-mail depois do envio:
 * entregue, aberto, rejeitado (bounce), marcado como spam. A rota atualiza a
 * linha correspondente em `email_log`, e o /admin/emails mostra.
 *
 * Falha fechada: sem RESEND_WEBHOOK_SECRET ou com assinatura errada, recusa.
 */

export const dynamic = 'force-dynamic'

const STATUS_POR_EVENTO: Record<string, string> = {
  'email.sent': 'enviado',
  'email.delivered': 'entregue',
  'email.opened': 'aberto',
  'email.clicked': 'clicado',
  'email.bounced': 'rejeitado',
  'email.complained': 'reclamado',
  'email.delivery_delayed': 'enviado',
  'email.failed': 'falhou',
}

/**
 * Os eventos chegam fora de ordem (o "entregue" pode vir depois do "aberto").
 * O status só anda para a frente; rejeição e reclamação vencem tudo.
 */
const PESO: Record<string, number> = {
  falhou: 0,
  enviado: 1,
  entregue: 2,
  aberto: 3,
  clicado: 4,
  rejeitado: 9,
  reclamado: 9,
}

interface EventoResend {
  type?: string
  data?: {
    email_id?: string
    bounce?: { message?: string }
    reason?: string
  }
}

export async function POST(request: NextRequest) {
  const segredo = (process.env.RESEND_WEBHOOK_SECRET ?? '').trim()
  if (!segredo) {
    console.error('[resend-webhook] RESEND_WEBHOOK_SECRET não configurado. Webhook recusado.')
    return NextResponse.json({ erro: 'Webhook não configurado.' }, { status: 500 })
  }

  const bruto = await request.text()

  const conferido = verificarAssinatura(bruto, cabecalhosResend(request.headers), segredo)
  if (!conferido.ok) {
    return NextResponse.json({ erro: conferido.motivo }, { status: 401 })
  }

  let evento: EventoResend
  try {
    evento = JSON.parse(bruto)
  } catch {
    return NextResponse.json({ erro: 'Corpo inválido.' }, { status: 400 })
  }

  const tipo = evento.type ?? ''
  const emailId = evento.data?.email_id
  const novoStatus = STATUS_POR_EVENTO[tipo]

  // Evento que não interessa: 200, senão o Resend fica reenviando.
  if (!novoStatus || !emailId) {
    return NextResponse.json({ ignorado: tipo || 'sem tipo' })
  }

  const db = getSupabaseAdmin()

  const { data: linha, error: erroBusca } = await db
    .from('email_log')
    .select('id, status')
    .eq('resend_id', emailId)
    .maybeSingle()

  if (erroBusca) {
    console.error('[resend-webhook] Falha ao buscar o envio:', erroBusca.message)
    // 502: o Resend tenta de novo mais tarde.
    return NextResponse.json({ erro: 'Banco indisponível.' }, { status: 502 })
  }

  // E-mail que não saiu pelo site (teste feito no painel do Resend, por exemplo).
  if (!linha) {
    return NextResponse.json({ ignorado: 'envio desconhecido' })
  }

  if ((PESO[novoStatus] ?? 0) <= (PESO[linha.status] ?? 0)) {
    return NextResponse.json({ ignorado: 'evento fora de ordem' })
  }

  const motivo = evento.data?.bounce?.message ?? evento.data?.reason ?? null

  const { error: erroUpdate } = await db
    .from('email_log')
    .update({
      status: novoStatus,
      erro: novoStatus === 'rejeitado' || novoStatus === 'falhou' ? motivo : null,
    })
    .eq('id', linha.id)

  if (erroUpdate) {
    console.error('[resend-webhook] Falha ao atualizar:', erroUpdate.message)
    return NextResponse.json({ erro: 'Banco indisponível.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, status: novoStatus })
}
