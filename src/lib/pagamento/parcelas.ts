/**
 * Parcelamento: fonte única.
 *
 * O site mostrava "6x" na vitrine e nos favoritos, "3x sem juros" na página
 * do produto e "até 12x" num selo, cada número escrito à mão num componente.
 * Três promessas diferentes para o mesmo checkout.
 *
 * A regra abaixo repete o que a página do produto já exibia (3 parcelas sem
 * juros, a partir de R$ 30). ELA PRECISA SER CONFIRMADA PELO DONO contra a
 * configuração real do meio de pagamento: parcela anunciada e não oferecida
 * no checkout é oferta enganosa. Mudou a regra da loja, muda só aqui.
 */
export const PARCELAMENTO = {
  /** Número de parcelas anunciado. */
  parcelas: 3,
  /** Valor total mínimo da compra para anunciar parcelamento, em reais. */
  valorMinimo: 30,
  /** Se as parcelas anunciadas são sem juros. */
  semJuros: true,
} as const

export interface Parcelamento {
  parcelas: number
  valorParcela: number
  semJuros: boolean
}

/** Parcelamento de um preço, ou null quando a regra não se aplica. */
export function calcularParcelamento(preco: number): Parcelamento | null {
  if (!Number.isFinite(preco) || preco < PARCELAMENTO.valorMinimo) return null
  if (PARCELAMENTO.parcelas < 2) return null
  return {
    parcelas: PARCELAMENTO.parcelas,
    valorParcela: preco / PARCELAMENTO.parcelas,
    semJuros: PARCELAMENTO.semJuros,
  }
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/**
 * Frase pronta, por exemplo "3x de R$ 29,97 sem juros", ou null quando o
 * preço não entra na regra. Quem chama não renderiza nada com null.
 */
export function fraseParcelamento(preco: number): string | null {
  const p = calcularParcelamento(preco)
  if (!p) return null
  return `${p.parcelas}x de ${brl.format(p.valorParcela)}${p.semJuros ? ' sem juros' : ''}`
}
