/**
 * Descontos automáticos do carrinho: fonte única.
 *
 * KITS (combinações de produtos diferentes):
 * - Gramado Completo: um saco de cada um dos três produtos, 15% (definido pelo
 *   dono em 12/10/2026).
 * - Plantio (Raiz Forte + Verde Rápido) e Recuperação (Verde Rápido +
 *   Resistência Total): 10%. PERCENTUAL PROPOSTO na implementação, aguardando
 *   a confirmação do dono.
 *
 * QUANTIDADE (o mesmo produto): 2 sacos, 5%; 3 ou mais, 10%. Também proposto
 * na implementação.
 *
 * As regras não se somam na mesma unidade: primeiro formam-se os kits, do
 * maior desconto para o menor; o que sobra de cada produto entra na faixa de
 * quantidade. Item de assinatura já tem o desconto dele e fica de fora.
 *
 * ATENÇÃO: hoje quem aplica isto é o carrinho de demonstração. Com a Shopify
 * ligada, os mesmos descontos precisam existir lá como descontos automáticos,
 * senão o site anuncia um preço que o checkout não cobra.
 */

export interface RegraDeKit {
  id: string
  nome: string
  /** Um saco de cada. Na ordem da linha do tempo da embalagem. */
  handles: readonly string[]
  percentual: number
}

/** Do maior desconto para o menor: é a ordem em que o carrinho forma os kits. */
export const KITS: readonly RegraDeKit[] = [
  {
    id: 'kit-gramado-completo',
    nome: 'Kit Gramado Completo',
    handles: ['raiz-forte', 'verde-rapido', 'resistencia-total'],
    percentual: 15,
  },
  {
    id: 'kit-plantio',
    nome: 'Kit Plantio',
    handles: ['raiz-forte', 'verde-rapido'],
    percentual: 10,
  },
  {
    id: 'kit-recuperacao',
    nome: 'Kit Recuperação',
    handles: ['verde-rapido', 'resistencia-total'],
    percentual: 10,
  },
]

/** Da maior para a menor. */
export const FAIXAS_DE_QUANTIDADE = [
  { minimo: 3, percentual: 10 },
  { minimo: 2, percentual: 5 },
] as const

export interface LinhaParaPromocao {
  handle: string
  nome: string
  precoUnitario: number
  quantidade: number
  /** Item de assinatura não entra nas promoções. */
  assinatura?: boolean
}

export interface PromocaoAplicada {
  id: string
  rotulo: string
  /** Desconto em reais, positivo. */
  valor: number
}

export interface ResultadoDasPromocoes {
  promocoes: PromocaoAplicada[]
  /** Soma dos descontos, em reais. */
  desconto: number
}

const centavos = (valor: number) => Math.round(valor * 100) / 100

/** Percentual da faixa de quantidade para `quantidade` sacos do mesmo produto. */
export function percentualPorQuantidade(quantidade: number): number {
  return FAIXAS_DE_QUANTIDADE.find((f) => quantidade >= f.minimo)?.percentual ?? 0
}

export function calcularPromocoes(linhas: LinhaParaPromocao[]): ResultadoDasPromocoes {
  // Junta linhas do mesmo produto (compra única).
  const porHandle = new Map<string, { nome: string; preco: number; quantidade: number }>()
  for (const linha of linhas) {
    if (linha.assinatura || linha.quantidade <= 0 || linha.precoUnitario <= 0) continue
    const atual = porHandle.get(linha.handle)
    if (atual) atual.quantidade += linha.quantidade
    else porHandle.set(linha.handle, { nome: linha.nome, preco: linha.precoUnitario, quantidade: linha.quantidade })
  }

  const promocoes: PromocaoAplicada[] = []

  // 1) Kits, do maior desconto para o menor: quantos conjuntos completos cabem.
  for (const kit of KITS) {
    const conjuntos = Math.min(...kit.handles.map((h) => porHandle.get(h)?.quantidade ?? 0))
    if (conjuntos <= 0) continue
    const precoDoConjunto = kit.handles.reduce((soma, h) => soma + (porHandle.get(h)?.preco ?? 0), 0)
    promocoes.push({
      id: kit.id,
      rotulo: `${conjuntos > 1 ? `${conjuntos} × ` : ''}${kit.nome} (${kit.percentual}%)`,
      valor: centavos((precoDoConjunto * conjuntos * kit.percentual) / 100),
    })
    for (const h of kit.handles) {
      const item = porHandle.get(h)
      if (item) item.quantidade -= conjuntos
    }
  }

  // 2) Quantidade: o que sobrou de cada produto.
  porHandle.forEach((item, handle) => {
    const percentual = percentualPorQuantidade(item.quantidade)
    if (percentual === 0) return
    promocoes.push({
      id: `quantidade-${handle}`,
      rotulo: `${item.quantidade} sacos de ${item.nome} (${percentual}%)`,
      valor: centavos((item.preco * item.quantidade * percentual) / 100),
    })
  })

  return { promocoes, desconto: centavos(promocoes.reduce((soma, p) => soma + p.valor, 0)) }
}
