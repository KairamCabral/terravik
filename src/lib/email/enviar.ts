// src/lib/email/enviar.ts
//
// Ponto único de envio de e-mail do site, pelo Resend (REST, sem SDK).
// Só servidor: a chave do Resend nunca pode entrar no pacote do navegador.
//
// Toda tentativa, tenha saído ou não, grava uma linha em `email_log`. É o que
// o /admin/emails mostra, e o webhook do Resend atualiza o status depois.
//
//   RESEND_API_KEY   chave da API do Resend
//   EMAIL_REMETENTE  remetente, em domínio verificado no Resend
//                    (ex.: "Terravik <site@notificacoes.terravik.com.br>")
//
// O log do servidor nunca recebe o corpo da mensagem.

import 'server-only'

import { getSupabaseAdmin } from '@/lib/supabase/admin'

const RESEND_API = 'https://api.resend.com/emails'
const TEMPO_LIMITE_MS = 10_000

/** Lançado quando falta configuração: nada foi enviado. */
export class EmailNaoConfigurado extends Error {}

export interface Mensagem {
  /** Categoria do envio: 'contato', 'auth-recovery'... Vai para o histórico. */
  tipo: string
  para: string
  assunto: string
  html: string
  texto: string
  responderPara?: string
  /** Etiquetas do Resend. Só letras, números, hífen e sublinhado. */
  tags?: Record<string, string>
  userId?: string
  referencia?: string
}

interface LinhaDoHistorico {
  tipo: string
  destinatario: string
  assunto: string
  resend_id?: string | null
  status: 'enviado' | 'falhou'
  erro?: string | null
  user_id?: string | null
  referencia?: string | null
}

/**
 * Grava o histórico. Falha aqui NÃO derruba o envio: e-mail que saiu e não
 * foi registrado é melhor do que recuperação de senha travada por causa do log.
 */
async function registrar(linha: LinhaDoHistorico): Promise<void> {
  try {
    const { error } = await getSupabaseAdmin().from('email_log').insert(linha)
    if (error) {
      console.error('[email] Histórico não gravado:', error.message, '| tipo:', linha.tipo)
    }
  } catch (erro) {
    console.error(
      '[email] Histórico indisponível:',
      erro instanceof Error ? erro.message : 'erro desconhecido'
    )
  }
}

/** true quando há chave e remetente. Não prova que o domínio está verificado. */
export function emailConfigurado(): boolean {
  return Boolean(
    (process.env.RESEND_API_KEY ?? '').trim() && (process.env.EMAIL_REMETENTE ?? '').trim()
  )
}

/** Cabeçalho de e-mail não aceita quebra de linha. */
export function emUmaLinha(valor: string, maximo: number): string {
  return valor.replace(/[\r\n\t]+/g, ' ').trim().slice(0, maximo)
}

/**
 * Envia um e-mail e registra a tentativa.
 *
 * @throws EmailNaoConfigurado sem chave ou sem remetente
 * @throws Error quando o Resend recusa ou não responde
 */
export async function enviarEmail(mensagem: Mensagem): Promise<{ id: string }> {
  const chave = (process.env.RESEND_API_KEY ?? '').trim()
  const remetente = (process.env.EMAIL_REMETENTE ?? '').trim()

  const base = {
    tipo: mensagem.tipo,
    destinatario: mensagem.para,
    assunto: mensagem.assunto,
    user_id: mensagem.userId ?? null,
    referencia: mensagem.referencia ?? null,
  }

  if (!chave || !remetente) {
    const faltando = [!chave && 'RESEND_API_KEY', !remetente && 'EMAIL_REMETENTE']
      .filter(Boolean)
      .join(', ')
    const motivo = `E-mail não configurado (falta ${faltando}). Nada foi enviado.`
    await registrar({ ...base, status: 'falhou', erro: motivo })
    throw new EmailNaoConfigurado(motivo)
  }

  const falhar = async (motivo: string): Promise<never> => {
    await registrar({ ...base, status: 'falhou', erro: motivo })
    throw new Error(motivo)
  }

  let resposta: Response
  try {
    resposta = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${chave}`,
      },
      body: JSON.stringify({
        from: remetente,
        to: [mensagem.para],
        subject: mensagem.assunto,
        html: mensagem.html,
        text: mensagem.texto,
        ...(mensagem.responderPara ? { reply_to: mensagem.responderPara } : {}),
        ...(mensagem.tags
          ? { tags: Object.entries(mensagem.tags).map(([name, value]) => ({ name, value })) }
          : {}),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    })
  } catch (erro) {
    return falhar(
      `Não foi possível falar com o Resend: ${erro instanceof Error ? erro.name : 'erro desconhecido'}`
    )
  }

  const corpo = await resposta.text()

  if (!resposta.ok) {
    // Só o status e o nome do erro: a mensagem do Resend pode repetir o
    // endereço de quem escreveu.
    let nome = ''
    try {
      const json = JSON.parse(corpo) as { name?: unknown; message?: unknown }
      nome = [json.name, json.message].filter((v) => typeof v === 'string').join(': ')
    } catch {
      // corpo que não é JSON: fica só o status
    }
    return falhar(`Resend respondeu ${resposta.status}${nome ? ` (${nome.slice(0, 200)})` : ''}`)
  }

  let id: string
  try {
    const dados = JSON.parse(corpo) as { id?: unknown }
    if (typeof dados?.id !== 'string' || !dados.id) throw new Error('sem id')
    id = dados.id
  } catch {
    return falhar('Resend respondeu 200 sem o id da mensagem.')
  }

  await registrar({ ...base, status: 'enviado', resend_id: id })
  return { id }
}
