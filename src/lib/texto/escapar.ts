/**
 * Escapa texto para entrar em HTML.
 *
 * Mora fora de lib/email de propósito: é função pura, sem `server-only`, e
 * pode ser usada por tela de cliente sem arrastar o cliente de e-mail junto.
 */
export function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
