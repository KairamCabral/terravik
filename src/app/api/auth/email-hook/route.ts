import { NextRequest, NextResponse } from 'next/server'
import { enviarEmail } from '@/lib/email/enviar'
import { verificarAssinatura, cabecalhosSupabase } from '@/lib/webhooks/standard'
import { montarEmailDeAuth } from '@/lib/email/templates/auth'

/**
 * POST /api/auth/email-hook
 *
 * Send Email Hook do Supabase. Com o hook ligado no painel (Authentication,
 * Hooks), o Supabase deixa de enviar os e-mails de conta e chama esta rota,
 * que monta o e-mail com a marca da Terravik e envia pelo Resend.
 *
 * FALHA FECHADA, de propósito: sem segredo, com assinatura errada ou com o
 * Resend fora, a rota responde erro e o Supabase devolve erro para quem pediu
 * (cadastro ou recuperação de senha). Responder 200 sem enviar deixaria a
 * pessoa esperando um e-mail que nunca sai.
 *
 * Por isso o hook só deve ser ligado no painel com o diagnóstico de
 * /admin/emails verde.
 */

export const dynamic = 'force-dynamic'

interface CorpoDoHook {
  user?: { id?: string; email?: string; new_email?: string; user_metadata?: Record<string, unknown> }
  email_data?: {
    token?: string
    token_hash?: string
    token_new?: string
    token_hash_new?: string
    redirect_to?: string
    email_action_type?: string
    site_url?: string
  }
}

/** Formato de erro que o Supabase espera de um hook. */
function erro(mensagem: string, status: number) {
  return NextResponse.json({ error: { http_code: status, message: mensagem } }, { status })
}

export async function POST(request: NextRequest) {
  const segredo = (process.env.SUPABASE_AUTH_HOOK_SECRET ?? '').trim()
  if (!segredo) {
    console.error('[auth-hook] SUPABASE_AUTH_HOOK_SECRET não configurado. Hook recusado.')
    return erro('Hook não configurado.', 500)
  }

  const bruto = await request.text()

  const conferido = verificarAssinatura(bruto, cabecalhosSupabase(request.headers), segredo)
  if (!conferido.ok) {
    return erro(conferido.motivo, 401)
  }

  let corpo: CorpoDoHook
  try {
    corpo = JSON.parse(bruto)
  } catch {
    return erro('Corpo inválido.', 400)
  }

  const dados = corpo.email_data
  const acao = dados?.email_action_type
  const email = corpo.user?.email
  if (!email || !dados?.token_hash || !acao) {
    return erro('Payload sem e-mail, token_hash ou email_action_type.', 400)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    console.error('[auth-hook] NEXT_PUBLIC_SUPABASE_URL ausente no servidor.')
    return erro('Servidor sem NEXT_PUBLIC_SUPABASE_URL.', 500)
  }

  const nome =
    typeof corpo.user?.user_metadata?.full_name === 'string'
      ? (corpo.user.user_metadata.full_name as string)
      : undefined

  const redirectTo = dados.redirect_to || dados.site_url || process.env.NEXT_PUBLIC_SITE_URL || ''

  /**
   * Troca de e-mail com "Secure email change" ligado: o Supabase manda os
   * dois tokens num hook só, e cada endereço recebe o seu.
   *   token_hash_new  vai para o e-mail ATUAL
   *   token_hash      vai para o e-mail NOVO
   * (os nomes são contraintuitivos; é como a documentação do Supabase define).
   * Sem a opção ligada só vem token_hash, para o endereço novo.
   */
  const envios: Array<{ para: string; tokenHash: string; token?: string }> = []
  if (acao === 'email_change' && corpo.user?.new_email) {
    envios.push({ para: corpo.user.new_email, tokenHash: dados.token_hash, token: dados.token })
    if (dados.token_hash_new) {
      envios.push({ para: email, tokenHash: dados.token_hash_new, token: dados.token_new })
    }
  } else {
    envios.push({ para: email, tokenHash: dados.token_hash, token: dados.token })
  }

  try {
    for (const envio of envios) {
      const pronto = montarEmailDeAuth({
        email: envio.para,
        nome,
        acao,
        tokenHash: envio.tokenHash,
        token: envio.token,
        redirectTo,
        supabaseUrl,
      })

      await enviarEmail({
        tipo: `auth-${acao}`,
        para: envio.para,
        assunto: pronto.assunto,
        html: pronto.html,
        texto: pronto.texto,
        userId: corpo.user?.id,
        referencia: acao,
        tags: { tipo: 'auth', acao: acao.replace(/[^a-zA-Z0-9_-]/g, '_') },
      })
    }
  } catch (falha) {
    const mensagem = falha instanceof Error ? falha.message : 'erro desconhecido'
    console.error('[auth-hook] Falha ao enviar:', mensagem)
    return erro('Não foi possível enviar o e-mail agora.', 500)
  }

  return NextResponse.json({})
}
