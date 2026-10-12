import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { enviarEmail } from '@/lib/email/enviar'
import { montarHtml, montarTexto, type Corpo } from '@/lib/email/templates/layout'

/**
 * Diagnóstico da configuração de e-mail, para /admin/emails.
 *
 *   GET   confere cada peça e devolve a lista (nunca devolve valor de segredo)
 *   POST  envia um e-mail de teste para o próprio admin logado
 *
 * Só admin. O hook de e-mail do Supabase falha fechado: ligar o hook com
 * alguma peça faltando impede cadastro e recuperação de senha. Esta rota é o
 * que diz se pode ligar.
 */

export const dynamic = 'force-dynamic'

interface Item {
  chave: string
  ok: boolean
  detalhe: string
  /** Crítico: sem isto os e-mails de conta não saem. */
  critico: boolean
}

function presente(nome: string): string {
  return (process.env[nome] ?? '').trim()
}

async function exigirAdmin(): Promise<{ id: string; email: string } | NextResponse> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ erro: 'Não autenticado.' }, { status: 401 })

  const { data: perfil } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (perfil?.role !== 'admin' && perfil?.role !== 'super_admin') {
    return NextResponse.json({ erro: 'Sem permissão.' }, { status: 403 })
  }
  return { id: user.id, email: user.email ?? '' }
}

async function conferirResend(chave: string): Promise<Item[]> {
  let resposta: Response
  try {
    resposta = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${chave}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return [
      { chave: 'Resend, conexão', ok: false, critico: true, detalhe: 'Não foi possível falar com a API do Resend.' },
    ]
  }

  // Chave restrita a "sending access" não lista domínios: o Resend responde
  // 401 com restricted_api_key. A chave é válida para enviar; só não dá para
  // conferir o domínio por aqui.
  if (resposta.status === 401 || resposta.status === 403) {
    const corpo = await resposta.json().catch(() => null)
    if (corpo?.name === 'restricted_api_key') {
      return [
        {
          chave: 'Resend, chave',
          ok: true,
          critico: true,
          detalhe:
            'Chave só de envio: não permite conferir o domínio por aqui. Use o e-mail de teste para confirmar.',
        },
      ]
    }
    return [
      {
        chave: 'Resend, chave',
        ok: false,
        critico: true,
        detalhe: `A chave existe mas foi recusada (${resposta.status}). Gere outra em resend.com/api-keys.`,
      },
    ]
  }

  if (!resposta.ok) {
    return [{ chave: 'Resend, chave', ok: false, critico: true, detalhe: `A API respondeu ${resposta.status}.` }]
  }

  const itens: Item[] = [{ chave: 'Resend, chave', ok: true, critico: true, detalhe: 'Autenticou na API.' }]

  const corpo = await resposta.json().catch(() => null)
  const dominios: Array<{ name?: string; status?: string }> = corpo?.data ?? []
  const dominioDoRemetente = presente('EMAIL_REMETENTE').match(/@([^>\s]+)/)?.[1] ?? ''
  const oDoRemetente = dominios.find((d) => d.name === dominioDoRemetente)

  if (!oDoRemetente) {
    itens.push({
      chave: 'Domínio de envio',
      ok: false,
      critico: true,
      detalhe:
        `EMAIL_REMETENTE usa "${dominioDoRemetente || 'domínio não identificado'}", que não está no Resend. ` +
        `Cadastrados: ${dominios.map((d) => d.name).join(', ') || 'nenhum'}.`,
    })
  } else {
    const verificado = oDoRemetente.status === 'verified'
    itens.push({
      chave: 'Domínio de envio',
      ok: verificado,
      critico: true,
      detalhe: verificado
        ? `${oDoRemetente.name} verificado.`
        : `${oDoRemetente.name} está "${oDoRemetente.status}". Falta concluir os registros DNS.`,
    })
  }

  return itens
}

export async function GET() {
  const admin = await exigirAdmin()
  if (admin instanceof NextResponse) return admin

  const itens: Item[] = []

  const chave = presente('RESEND_API_KEY')
  if (!chave) {
    itens.push({
      chave: 'RESEND_API_KEY',
      ok: false,
      critico: true,
      detalhe: 'Ausente. Nenhum e-mail sai, e cada tentativa fica registrada como falha.',
    })
  } else {
    itens.push(...(await conferirResend(chave)))
  }

  const remetente = presente('EMAIL_REMETENTE')
  itens.push({
    chave: 'EMAIL_REMETENTE',
    ok: Boolean(remetente),
    critico: true,
    detalhe: remetente ? remetente : 'Ausente. Sem remetente o envio é recusado.',
  })

  const contato = presente('EMAIL_CONTATO')
  itens.push({
    chave: 'EMAIL_CONTATO',
    ok: Boolean(contato),
    critico: false,
    detalhe: contato
      ? `Formulários de contato chegam em ${contato}.`
      : 'Ausente. Os formulários de contato e de representantes respondem erro.',
  })

  itens.push({
    chave: 'SUPABASE_AUTH_HOOK_SECRET',
    ok: Boolean(presente('SUPABASE_AUTH_HOOK_SECRET')),
    critico: true,
    detalhe: presente('SUPABASE_AUTH_HOOK_SECRET')
      ? 'Presente. Precisa ser o mesmo segredo mostrado no hook do Supabase.'
      : 'Ausente. Com o hook ligado no Supabase, ninguém recebe e-mail de cadastro nem de senha.',
  })

  itens.push({
    chave: 'RESEND_WEBHOOK_SECRET',
    ok: Boolean(presente('RESEND_WEBHOOK_SECRET')),
    critico: false,
    detalhe: presente('RESEND_WEBHOOK_SECRET')
      ? 'Presente. O status dos e-mails é atualizado pelo Resend.'
      : 'Ausente. Os e-mails saem, mas o status fica parado em "enviado".',
  })

  // A tabela do histórico existe e o servidor consegue ler?
  try {
    const { error } = await getSupabaseAdmin().from('email_log').select('id').limit(1)
    itens.push({
      chave: 'Histórico (email_log)',
      ok: !error,
      critico: false,
      detalhe: error
        ? `Tabela indisponível (${error.message}). Aplique a migration 20261011000000_email_log.sql.`
        : 'Tabela acessível.',
    })
  } catch (erro) {
    itens.push({
      chave: 'Histórico (email_log)',
      ok: false,
      critico: false,
      detalhe: erro instanceof Error ? erro.message : 'Servidor sem acesso ao banco.',
    })
  }

  const prontoParaOHook = itens.filter((i) => i.critico).every((i) => i.ok)

  return NextResponse.json({ itens, prontoParaOHook })
}

export async function POST(_request: NextRequest) {
  const admin = await exigirAdmin()
  if (admin instanceof NextResponse) return admin

  if (!admin.email) {
    return NextResponse.json({ erro: 'Sua conta não tem e-mail.' }, { status: 400 })
  }

  const corpo: Corpo = {
    titulo: 'E-mail de teste',
    paragrafos: [
      'Este é um envio de teste feito pelo painel da Terravik.',
      'Se você está lendo isto, a chave do Resend, o remetente e o domínio de envio estão funcionando.',
    ],
    aviso: 'Nenhuma ação é necessária.',
    previa: 'Envio de teste do painel.',
  }

  try {
    const { id } = await enviarEmail({
      tipo: 'teste',
      para: admin.email,
      assunto: 'Teste de envio da Terravik',
      html: montarHtml(corpo),
      texto: montarTexto(corpo),
      userId: admin.id,
      tags: { tipo: 'teste' },
    })
    return NextResponse.json({ ok: true, id, para: admin.email })
  } catch (erro) {
    return NextResponse.json(
      { erro: erro instanceof Error ? erro.message : 'Falha no envio.' },
      { status: 502 }
    )
  }
}
