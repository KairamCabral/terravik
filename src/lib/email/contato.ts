// src/lib/email/contato.ts
//
// Ponto único de envio do formulário de contato. Só servidor: a chave do
// Resend nunca pode entrar no pacote do navegador.
//
// Sem as três variáveis abaixo, NADA é enviado e a função devolve falha. Quem
// chama precisa repassar essa falha para a tela: um formulário que agradece e
// some com a mensagem é pior do que um que avisa que não funcionou.
//
//   RESEND_API_KEY   chave da API do Resend
//   EMAIL_CONTATO    caixa que recebe as mensagens do site
//   EMAIL_REMETENTE  remetente, em domínio verificado no Resend
//                    (ex.: "Terravik <site@terravik.com.br>")
//
// Nada aqui grava em log o nome, o e-mail, o telefone ou a mensagem.

import 'server-only'

const RESEND_URL = 'https://api.resend.com/emails'
const TEMPO_LIMITE_MS = 10_000

export interface DadosDeContato {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export type ResultadoDoEnvio =
  | { ok: true }
  | { ok: false; motivo: 'nao_configurado' | 'falha_no_envio' }

/** Cabeçalho de e-mail não aceita quebra de linha. */
function emUmaLinha(valor: string, maximo: number): string {
  return valor.replace(/[\r\n\t]+/g, ' ').trim().slice(0, maximo)
}

export async function enviarContato(dados: DadosDeContato): Promise<ResultadoDoEnvio> {
  const chave = (process.env.RESEND_API_KEY ?? '').trim()
  const destino = (process.env.EMAIL_CONTATO ?? '').trim()
  const remetente = (process.env.EMAIL_REMETENTE ?? '').trim()

  if (!chave || !destino || !remetente) {
    const faltando = [
      !chave && 'RESEND_API_KEY',
      !destino && 'EMAIL_CONTATO',
      !remetente && 'EMAIL_REMETENTE',
    ].filter(Boolean)
    console.error(
      `[contato] E-mail não configurado (falta ${faltando.join(', ')}). Mensagem NÃO enviada.`
    )
    return { ok: false, motivo: 'nao_configurado' }
  }

  const nome = emUmaLinha(dados.name, 200)
  const assunto = emUmaLinha(dados.subject || 'Contato pelo site', 200)
  const email = dados.email.trim()
  const telefone = emUmaLinha(dados.phone || '', 30)

  // Texto puro de propósito: nada do que a pessoa digitou é interpretado
  // como HTML pelo cliente de e-mail de quem atende.
  const corpo = [
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    `Telefone: ${telefone || 'não informado'}`,
    `Assunto: ${assunto}`,
    '',
    dados.message.trim(),
  ].join('\n')

  try {
    const resposta = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${chave}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: remetente,
        to: [destino],
        // Responder no cliente de e-mail vai direto para quem escreveu.
        reply_to: email,
        subject: `[Site] ${assunto}, de ${nome}`,
        text: corpo,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
    })

    if (!resposta.ok) {
      // Só o status e o tipo do erro. A mensagem do Resend pode repetir o
      // endereço de quem escreveu.
      const tipo = await resposta
        .json()
        .then((json: { name?: unknown }) => (typeof json?.name === 'string' ? json.name : ''))
        .catch(() => '')
      console.error(`[contato] Resend recusou o envio: HTTP ${resposta.status} ${tipo}`.trim())
      return { ok: false, motivo: 'falha_no_envio' }
    }

    return { ok: true }
  } catch (erro) {
    const tipo = erro instanceof Error ? erro.name : 'erro desconhecido'
    console.error(`[contato] Falha de rede ao chamar o Resend: ${tipo}`)
    return { ok: false, motivo: 'falha_no_envio' }
  }
}
