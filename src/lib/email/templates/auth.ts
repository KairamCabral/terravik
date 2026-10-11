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
  redirectTo: string
  supabaseUrl: string
}

export interface EmailPronto {
  assunto: string
  html: string
  texto: string
}

/**
 * O link que o botão abre.
 *
 * O parâmetro se chama `token`, mas carrega o `token_hash`: é o que o
 * endpoint /auth/v1/verify espera. Trocar o nome ou o valor quebra o botão.
 * O Supabase valida, e só então redireciona para `redirect_to` com o código
 * que o /auth/callback do site troca por sessão.
 */
export function linkDeVerificacao(d: DadosDoEmailAuth): string {
  const params = new URLSearchParams({
    token: d.tokenHash,
    type: d.acao,
    redirect_to: d.redirectTo,
  })
  return `${d.supabaseUrl.replace(/\/$/, '')}/auth/v1/verify?${params.toString()}`
}

function saudacao(d: DadosDoEmailAuth): string {
  const primeiro = (d.nome ?? '').trim().split(/\s+/)[0]
  return primeiro ? `Olá, ${escaparHtml(primeiro)}.` : 'Olá.'
}

const AVISO_IGNORAR =
  'Se não foi você quem pediu, pode ignorar este e-mail: nada muda enquanto o link não for aberto.'

const VALIDADE = 'O link vale por tempo limitado e só funciona uma vez.'

interface Receita {
  assunto: string
  titulo: string
  paragrafos: string[]
  textoDoBotao: string
  aviso?: string
  previa: string
}

function receita(d: DadosDoEmailAuth): Receita {
  const oi = saudacao(d)
  const conta = `<strong>${escaparHtml(d.email)}</strong>`

  switch (d.acao) {
    case 'recovery':
      return {
        assunto: 'Redefinir sua senha na Terravik',
        titulo: 'Vamos redefinir sua senha',
        paragrafos: [
          `${oi} Recebemos um pedido para trocar a senha da conta ${conta}.`,
          `Clique no botão abaixo para escolher uma senha nova. ${VALIDADE}`,
          'Abra o link no mesmo navegador em que você fez o pedido.',
        ],
        textoDoBotao: 'Criar nova senha',
        aviso: AVISO_IGNORAR,
        previa: 'Use o link para escolher uma senha nova.',
      }

    case 'signup':
      return {
        assunto: 'Confirme seu e-mail na Terravik',
        titulo: 'Falta só confirmar o e-mail',
        paragrafos: [
          `${oi} Que bom ter você por aqui.`,
          'Confirme este endereço para ativar sua conta. Com ela você acompanha seus pedidos, salva favoritos e acessa os cursos sobre gramado.',
        ],
        textoDoBotao: 'Confirmar meu e-mail',
        aviso: 'Se você não criou conta na Terravik, pode ignorar este e-mail.',
        previa: 'Confirme seu e-mail para ativar a conta.',
      }

    case 'magiclink':
      return {
        assunto: 'Seu link de acesso à Terravik',
        titulo: 'Entrar sem senha',
        paragrafos: [`${oi} Use o botão abaixo para entrar na sua conta. ${VALIDADE}`],
        textoDoBotao: 'Entrar na minha conta',
        aviso: AVISO_IGNORAR,
        previa: 'Seu link para entrar na conta.',
      }

    case 'email_change':
    case 'email_change_new':
    case 'email_change_current':
      return {
        assunto: 'Confirme a troca de e-mail na Terravik',
        titulo: 'Confirme a troca de e-mail',
        paragrafos: [
          `${oi} Recebemos um pedido para trocar o e-mail da sua conta Terravik. Este endereço, ${conta}, faz parte da troca.`,
          'Confirme para concluir. Até lá, o endereço atual continua valendo.',
        ],
        textoDoBotao: 'Confirmar a troca',
        aviso: AVISO_IGNORAR,
        previa: 'Confirme a troca de e-mail da sua conta.',
      }

    case 'invite':
      return {
        assunto: 'Você foi convidado para a Terravik',
        titulo: 'Seu convite chegou',
        paragrafos: [
          `${oi} Criamos um acesso para ${conta}.`,
          'Use o botão abaixo para definir sua senha e entrar.',
        ],
        textoDoBotao: 'Aceitar o convite',
        previa: 'Defina sua senha e entre na conta.',
      }

    case 'reauthentication':
      return {
        assunto: 'Confirme que é você, na Terravik',
        titulo: 'Confirmação de identidade',
        paragrafos: [
          `${oi} Para concluir a operação, confirme que é você.`,
          d.token
            ? `Seu código é <strong style="font-size:20px;letter-spacing:2px;">${escaparHtml(d.token)}</strong>.`
            : 'Use o botão abaixo para confirmar.',
        ],
        textoDoBotao: 'Confirmar',
        aviso: AVISO_IGNORAR,
        previa: 'Confirme que é você para concluir.',
      }

    default:
      return {
        assunto: 'Confirmação de segurança na Terravik',
        titulo: 'Confirmação necessária',
        paragrafos: [`${oi} Precisamos confirmar uma ação na conta ${conta}.`],
        textoDoBotao: 'Confirmar',
        aviso: AVISO_IGNORAR,
        previa: 'Confirme uma ação na sua conta.',
      }
  }
}

export function montarEmailDeAuth(d: DadosDoEmailAuth): EmailPronto {
  const r = receita(d)
  const url = linkDeVerificacao(d)

  const corpo: Corpo = {
    titulo: r.titulo,
    paragrafos: r.paragrafos,
    acao: { texto: r.textoDoBotao, url },
    aviso: r.aviso,
    previa: r.previa,
    rodape:
      'Se o botão não funcionar, copie e cole este endereço no navegador:<br>' +
      `<span style="word-break:break-all;">${escaparHtml(url)}</span>`,
  }

  return {
    assunto: r.assunto,
    html: montarHtml(corpo),
    texto: montarTexto(corpo),
  }
}
