/**
 * E-mail que a equipe recebe quando alguém preenche um formulário do site
 * (contato ou representantes).
 *
 * Tudo o que a pessoa digitou é escapado antes de entrar no HTML: quem atende
 * abre isso no cliente de e-mail, e ali um <a> ou <img> digitado no
 * formulário não pode virar marcação.
 */

import { escaparHtml } from '@/lib/texto/escapar'
import { montarHtml, CORES } from './layout'

export interface DadosDaMensagem {
  nome: string
  email: string
  telefone: string
  assunto: string
  mensagem: string
}

function linha(rotulo: string, valorHtml: string): string {
  return `<tr>
      <td style="padding:6px 12px 6px 0;color:${CORES.textoSecundario};font-size:13px;white-space:nowrap;vertical-align:top;">${rotulo}</td>
      <td style="padding:6px 0;color:${CORES.texto};font-size:14px;">${valorHtml}</td>
    </tr>`
}

export function montarEmailDeContato(d: DadosDaMensagem): { html: string; texto: string } {
  const email = escaparHtml(d.email)
  const telefone = d.telefone ? escaparHtml(d.telefone) : 'não informado'

  const ficha = `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 4px;">
      ${linha('Nome', escaparHtml(d.nome))}
      ${linha('E-mail', `<a href="mailto:${email}" style="color:${CORES.forest};">${email}</a>`)}
      ${linha('Telefone', telefone)}
      ${linha('Assunto', escaparHtml(d.assunto))}
    </table>`

  // Quebras de linha preservadas; o resto é texto.
  const mensagem = escaparHtml(d.mensagem).replace(/\r?\n/g, '<br>')

  const html = montarHtml({
    titulo: 'Nova mensagem pelo site',
    paragrafos: [
      ficha,
      `<span style="display:block;padding:16px;background:${CORES.superficie2};border-radius:12px;color:${CORES.texto};">${mensagem}</span>`,
    ],
    aviso: 'Para responder, use o botão de responder do seu e-mail: a resposta vai direto para quem escreveu.',
    previa: `${d.nome}: ${d.assunto}`,
  })

  // Texto puro escrito à mão: é o que aparece em cliente sem HTML e na prévia.
  const texto = [
    'Nova mensagem pelo site',
    '',
    `Nome: ${d.nome}`,
    `E-mail: ${d.email}`,
    `Telefone: ${d.telefone || 'não informado'}`,
    `Assunto: ${d.assunto}`,
    '',
    d.mensagem,
  ].join('\n')

  return { html, texto }
}
