/**
 * Armadilha de foco para diálogos com aria-modal (Modal, menu mobile).
 *
 * Com aria-modal o leitor de tela deixa de anunciar a página de trás. Se o
 * Tab escapa para ela, a pessoa passa a andar por elementos que não ouve.
 * Fica num lugar só para os diálogos não divergirem.
 */

/** O que recebe foco por Tab dentro de um diálogo. */
export const SELETOR_FOCAVEIS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/** Elementos focáveis e visíveis dentro de `container`, na ordem do DOM. */
export function focaveisDentro(container: HTMLElement): HTMLElement[] {
  // getClientRects descarta o que está com display:none, que o seletor
  // sozinho não distingue.
  return Array.from(
    container.querySelectorAll<HTMLElement>(SELETOR_FOCAVEIS)
  ).filter((el) => el.getClientRects().length > 0)
}

interface EventoDeTecla {
  key: string
  shiftKey: boolean
  preventDefault: () => void
}

/**
 * Mantém o Tab dentro de `container`: do último volta ao primeiro, e o
 * Shift+Tab do primeiro vai ao último. Use no onKeyDown do diálogo.
 */
export function prenderFoco(evento: EventoDeTecla, container: HTMLElement | null) {
  if (evento.key !== 'Tab' || !container) return

  const focaveis = focaveisDentro(container)

  if (focaveis.length === 0) {
    evento.preventDefault()
    return
  }

  const primeiro = focaveis[0]
  const ultimo = focaveis[focaveis.length - 1]
  const ativo = document.activeElement

  if (evento.shiftKey && (ativo === primeiro || ativo === container)) {
    evento.preventDefault()
    ultimo.focus()
  } else if (!evento.shiftKey && (ativo === ultimo || !container.contains(ativo))) {
    evento.preventDefault()
    primeiro.focus()
  }
}
