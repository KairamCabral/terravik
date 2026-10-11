/**
 * Moldura dos e-mails da Terravik.
 *
 * HTML de e-mail é de tabela e estilo inline: cliente de e-mail não lê
 * folha de estilo nem classe do Tailwind. As cores repetem a paleta de
 * src/design-system/colors.ts.
 *
 * O cabeçalho é texto, não imagem: muito cliente bloqueia imagem por padrão,
 * e um e-mail de recuperação de senha precisa ser reconhecível assim mesmo.
 *
 * Quem monta os parágrafos é responsável por escapar o que veio do usuário
 * (escaparHtml). O título e o texto do botão são escapados aqui.
 */

import { escaparHtml } from '@/lib/texto/escapar'

export const CORES = {
  forest: '#093E28',
  forestInk: '#052317',
  gold: '#B38B25',
  creme: '#FBF7EF',
  superficie: '#FFFFFF',
  superficie2: '#F4EFE5',
  texto: '#111311',
  textoSecundario: '#4C514C',
  borda: '#E6E0D4',
} as const

const NOME_DA_MARCA = 'Terravik'
const ASSINATURA = 'Terravik, fertilizantes para gramado'

function urlDoSite(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.terravik.com.br').replace(/\/$/, '')
}

export interface Corpo {
  titulo: string
  /** Parágrafos em HTML já seguro. */
  paragrafos: string[]
  acao?: { texto: string; url: string }
  /** Caixa de aviso abaixo do botão, em HTML já seguro. */
  aviso?: string
  /** Texto pequeno ao fim do cartão, em HTML já seguro. */
  rodape?: string
  /** Frase de prévia que o cliente de e-mail mostra ao lado do assunto. */
  previa?: string
}

export function montarHtml(corpo: Corpo): string {
  const paragrafos = corpo.paragrafos
    .map(
      (p) =>
        `<p style="margin:0 0 16px;color:${CORES.textoSecundario};font-size:15px;line-height:1.6;">${p}</p>`
    )
    .join('')

  // Botão verde com texto branco: 12:1 de contraste. O dourado da marca com
  // texto claro não chega a 4,5:1.
  const botao = corpo.acao
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
            <tr><td style="background:${CORES.forest};border-radius:999px;">
              <a href="${escaparHtml(corpo.acao.url)}"
                 style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">
                ${escaparHtml(corpo.acao.texto)}
              </a>
            </td></tr>
          </table>`
    : ''

  const aviso = corpo.aviso
    ? `<p style="margin:0;padding:14px 16px;background:${CORES.superficie2};border-radius:12px;color:${CORES.textoSecundario};font-size:13px;line-height:1.6;">${corpo.aviso}</p>`
    : ''

  const rodape = corpo.rodape
    ? `<tr><td style="padding:0 28px 24px;">
          <p style="margin:0;color:${CORES.textoSecundario};font-size:12px;line-height:1.6;">${corpo.rodape}</p>
        </td></tr>`
    : ''

  const previa = corpo.previa
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escaparHtml(corpo.previa)}</div>`
    : ''

  const site = urlDoSite()

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escaparHtml(corpo.titulo)}</title>
</head>
<body style="margin:0;padding:0;background:${CORES.creme};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  ${previa}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CORES.creme};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CORES.superficie};border:1px solid ${CORES.borda};border-radius:16px;overflow:hidden;">
        <tr><td style="background:${CORES.forest};padding:20px 28px;border-bottom:3px solid ${CORES.gold};">
          <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:2px;">TERRAVIK</span>
        </td></tr>
        <tr><td style="padding:28px 28px 24px;">
          <h1 style="margin:0 0 12px;color:${CORES.forest};font-size:22px;line-height:1.3;font-weight:700;">${escaparHtml(corpo.titulo)}</h1>
          ${paragrafos}
          ${botao}
          ${aviso}
        </td></tr>
        ${rodape}
      </table>
      <p style="margin:16px 0 0;color:${CORES.textoSecundario};font-size:12px;line-height:1.6;">
        ${ASSINATURA}<br>
        <a href="${site}" style="color:${CORES.forest};">${site.replace(/^https?:\/\//, '')}</a>
      </p>
    </td></tr>
  </table>
</body>
</html>`
}

/** Tira as marcações simples que os parágrafos usam, para a versão em texto. */
function semHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

/** Versão em texto puro do mesmo e-mail. Todo envio leva as duas. */
export function montarTexto(corpo: Corpo): string {
  const partes = [corpo.titulo, '', ...corpo.paragrafos.map(semHtml)]
  if (corpo.acao) partes.push('', `${corpo.acao.texto}: ${corpo.acao.url}`)
  if (corpo.aviso) partes.push('', semHtml(corpo.aviso))
  partes.push('', NOME_DA_MARCA, urlDoSite())
  return partes.join('\n')
}
