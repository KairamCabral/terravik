/**
 * Desconto no Pix: fonte única.
 *
 * Percentual definido pelo dono em 12/10/2026. É o mesmo que os Termos de Uso
 * citam. O desconto vale sobre o total do pedido, depois dos outros descontos.
 * Mudou a regra da loja, muda só aqui.
 */
export const PIX = {
  /** Desconto para pagamento no Pix, em %. Zero desliga a exibição. */
  percentual: 5,
} as const

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Valor no Pix, ou null quando não há desconto ou o valor é inválido. */
export function precoNoPix(valor: number): number | null {
  if (PIX.percentual <= 0 || !Number.isFinite(valor) || valor <= 0) return null
  return Math.round(valor * (100 - PIX.percentual)) / 100
}

/** "R$ 142,41 no Pix", ou null quando não se aplica. */
export function frasePix(valor: number): string | null {
  const noPix = precoNoPix(valor)
  return noPix === null ? null : `${brl.format(noPix)} no Pix`
}
