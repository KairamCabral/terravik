// src/lib/email/contato.ts
//
// Envio do formulário de contato e de representantes. Só servidor.
//
// Sem configuração, NADA é enviado e a função devolve falha. Quem chama
// precisa repassar essa falha para a tela: um formulário que agradece e some
// com a mensagem é pior do que um que avisa que não funcionou.
//
//   RESEND_API_KEY   chave da API do Resend
//   EMAIL_CONTATO    caixa que recebe as mensagens do site
//   EMAIL_REMETENTE  remetente, em domínio verificado no Resend
//
// O envio passa por enviarEmail(), que registra a tentativa em email_log
// (visível em /admin/emails). O log do servidor não recebe nome, e-mail,
// telefone nem mensagem.

import 'server-only'

import { enviarEmail, emUmaLinha, EmailNaoConfigurado } from './enviar'
import { montarEmailDeContato } from './templates/contato'

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

export async function enviarContato(dados: DadosDeContato): Promise<ResultadoDoEnvio> {
  const destino = (process.env.EMAIL_CONTATO ?? '').trim()

  if (!destino) {
    console.error('[contato] E-mail não configurado (falta EMAIL_CONTATO). Mensagem NÃO enviada.')
    return { ok: false, motivo: 'nao_configurado' }
  }

  const nome = emUmaLinha(dados.name, 200)
  const assunto = emUmaLinha(dados.subject || 'Contato pelo site', 200)
  const email = dados.email.trim()
  const telefone = emUmaLinha(dados.phone || '', 30)

  const { html, texto } = montarEmailDeContato({
    nome,
    email,
    telefone,
    assunto,
    mensagem: dados.message.trim(),
  })

  try {
    await enviarEmail({
      tipo: 'contato',
      para: destino,
      assunto: `[Site] ${assunto}, de ${nome}`,
      html,
      texto,
      // Responder no cliente de e-mail vai direto para quem escreveu.
      responderPara: email,
      tags: { tipo: 'contato' },
    })
    return { ok: true }
  } catch (erro) {
    if (erro instanceof EmailNaoConfigurado) {
      console.error('[contato] E-mail não configurado. Mensagem NÃO enviada.')
      return { ok: false, motivo: 'nao_configurado' }
    }
    // A mensagem do erro já vem sem dado pessoal (ver enviarEmail).
    console.error('[contato]', erro instanceof Error ? erro.message : 'falha no envio')
    return { ok: false, motivo: 'falha_no_envio' }
  }
}
