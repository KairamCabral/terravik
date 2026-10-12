/**
 * E-mails de conta: confirmação de cadastro, recuperação de senha, link de
 * acesso, troca de e-mail, convite e confirmação de identidade.
 *
 * Quem dispara é o Send Email Hook do Supabase (api/auth/email-hook). Com o
 * hook ligado o Supabase não envia nada por conta própria: ele entrega os
 * dados e o site monta e envia. Por isso todo tipo de ação precisa de uma
 * receita aqui; ação desconhecida cai num texto genérico, nunca em silêncio.
 */

import { escaparHtml } from '@/lib/texto/escapar'
import { montarHtml, montarTexto, type Corpo } from './layout'

export interface DadosDoEmailAuth {
  email: string
  nome?: string
  /** email_action_type do Supabase: signup, recovery, magiclink... */
  acao: string
  tokenHash: string
  /** Código de 6 dígitos, usado na confirmação de identidade. */
  token?: string
  /** URL para onde o site pediu que a pessoa voltasse (já validada pelo Supabase). */
  redirectTo: string
  /** Endereço público do site, usado quando redirectTo não serve. */
  siteUrl: string
}

export interface EmailPronto {
  assunto: string
  html: string
  texto: string
}

/**
 * O link que o botão abre: /auth/confirm do próprio site, com o token_hash.
 *
 * A rota confere o token com verifyOtp e abre a sessão no servidor, então o
 * link funciona em qualquer aparelho. O caminho antigo, pelo /auth/v1/verify
 * do Supabase, só funcionava no mesmo navegador que fez o pedido.
 *
 * A origem vem de `redirectTo`, que o Supabase já conferiu contra a lista de
 * Redirect URLs (é o que faz o link de um pedido feito em localhost voltar
 * para localhost). Sem redirectTo utilizável, vale o endereço do site.
 */
export function linkDeConfirmacao(d: DadosDoEmailAuth): string {
  let origem = d.siteUrl.replace(/\/$/, '')
  try {
    const url = new URL(d.redirectTo)
    if (url.protocol === 'https:' || url.hostname === 'localhost') origem = url.origin
  } catch {
    // redirectTo vazio ou inválido: fica o endereço do site
  }

  const params = new URLSearchParams({ token_hash: d.tokenHash, type: tipoDoLink(d.acao) })
  return `${origem}/auth/confirm?${params.toString()}`
}

/** O Supabase tem três nomes para a troca de e-mail; o verifyOtp aceita um. */
function tipoDoLink(acao: string): string {
  return acao.startsWith('email_change') ? 'email_change' : acao
}

function saudacao(d: DadosDoEmailAuth): string {
  const primeiro = (d.nome ?? '').trim().split(/\s+/)[0]
  return primeiro ? `Olá, ${escaparHtml(primeiro)}.` : 'Olá.'
}

const VALIDADE = 'Por segurança, o link só pode ser usado uma vez e expira em pouco tempo.'

interface Receita {
  assunto: string
  titulo: string
  paragrafos: string[]
  /** Sem botão quando a ação se resolve com um código, não com um link. */
  textoDoBotao?: string
  aviso?: string
  previa: string
}

function receita(d: DadosDoEmailAuth): Receita {
  const oi = saudacao(d)
  const conta = `<strong>${escaparHtml(d.email)}</strong>`

  switch (d.acao) {
    case 'recovery':
      return {
        assunto: 'Redefina sua senha da Terravik',
        titulo: 'Redefinição de senha',
        paragrafos: [
          `${oi} Recebemos um pedido para redefinir a senha da conta ${conta}.`,
          `Para criar uma nova senha, clique no botão abaixo. ${VALIDADE}`,
        ],
        textoDoBotao: 'Criar nova senha',
        aviso: 'Não pediu a troca? Ignore este e-mail. Sua senha atual continua valendo.',
        previa: 'Use o link para criar uma nova senha.',
      }

    case 'signup':
      return {
        assunto: 'Confirme seu e-mail para ativar sua conta Terravik',
        titulo: 'Confirme seu e-mail',
        paragrafos: [
          `${oi} Sua conta na Terravik foi criada.`,
          'Para ativá-la, confirme que este endereço é seu. Com a conta ativa você acompanha seus pedidos e salva seus produtos favoritos.',
        ],
        textoDoBotao: 'Confirmar e-mail',
        aviso: 'Não criou esta conta? Ignore este e-mail e nada será ativado.',
        previa: 'Falta um clique para ativar sua conta.',
      }

    case 'magiclink':
      return {
        assunto: 'Seu link de acesso à Terravik',
        titulo: 'Acesso à sua conta',
        paragrafos: [
          `${oi} Clique no botão abaixo para entrar na conta ${conta}, sem precisar de senha.`,
          VALIDADE,
        ],
        textoDoBotao: 'Entrar na minha conta',
        aviso: 'Não pediu este acesso? Ignore este e-mail. Ninguém entra na sua conta sem o link.',
        previa: 'Seu link para entrar na conta.',
      }

    case 'email_change':
    case 'email_change_new':
    case 'email_change_current':
      return {
        assunto: 'Confirme a troca de e-mail da sua conta Terravik',
        titulo: 'Troca de e-mail',
        paragrafos: [
          `${oi} Recebemos um pedido para trocar o e-mail da sua conta Terravik. O endereço ${conta} faz parte dessa troca.`,
          `Clique no botão abaixo para confirmar. Até a confirmação, o e-mail atual da conta continua valendo. ${VALIDADE}`,
        ],
        textoDoBotao: 'Confirmar troca de e-mail',
        aviso:
          'Não pediu a troca? Ignore este e-mail e, por precaução, redefina sua senha pelo site.',
        previa: 'Confirme a troca de e-mail da sua conta.',
      }

    case 'invite':
      return {
        assunto: 'Seu acesso à Terravik está pronto',
        titulo: 'Você recebeu um convite',
        paragrafos: [
          `${oi} Criamos um acesso à Terravik para ${conta}.`,
          `Clique no botão abaixo para definir sua senha e entrar. ${VALIDADE}`,
        ],
        textoDoBotao: 'Definir senha e entrar',
        aviso: 'Não esperava este convite? Ignore este e-mail.',
        previa: 'Defina sua senha e entre na conta.',
      }

    case 'reauthentication':
      return {
        assunto: 'Seu código de confirmação da Terravik',
        titulo: 'Código de confirmação',
        paragrafos: [
          `${oi} Para concluir a operação na sua conta, informe o código abaixo na tela em que ele foi pedido.`,
          d.token
            ? `<span style="display:inline-block;padding:12px 20px;background:#F4EFE5;border-radius:12px;color:#093E28;font-size:26px;font-weight:700;letter-spacing:6px;">${escaparHtml(d.token)}</span>`
            : 'O código não pôde ser gerado. Peça um novo na tela em que ele foi solicitado.',
        ],
        aviso: 'Não foi você? Ignore este e-mail e, por precaução, redefina sua senha pelo site.',
        previa: 'Use este código para confirmar que é você.',
      }

    default:
      return {
        assunto: 'Confirmação de segurança da sua conta Terravik',
        titulo: 'Confirmação necessária',
        paragrafos: [
          `${oi} Precisamos confirmar uma ação na conta ${conta}.`,
          `Clique no botão abaixo para continuar. ${VALIDADE}`,
        ],
        textoDoBotao: 'Confirmar',
        aviso: 'Não reconhece este pedido? Ignore este e-mail.',
        previa: 'Confirme uma ação na sua conta.',
      }
  }
}

export function montarEmailDeAuth(d: DadosDoEmailAuth): EmailPronto {
  const r = receita(d)
  const url = linkDeConfirmacao(d)

  const corpo: Corpo = {
    titulo: r.titulo,
    paragrafos: r.paragrafos,
    aviso: r.aviso,
    previa: r.previa,
    motivo: 'Você recebeu este e-mail porque este endereço foi informado em uma conta da Terravik.',
  }

  if (r.textoDoBotao) {
    corpo.acao = { texto: r.textoDoBotao, url }
    corpo.rodape =
      'Se o botão não funcionar, copie e cole este endereço no navegador:<br>' +
      `<span style="word-break:break-all;">${escaparHtml(url)}</span>`
  }

  return {
    assunto: r.assunto,
    html: montarHtml(corpo),
    texto: montarTexto(corpo),
  }
}
