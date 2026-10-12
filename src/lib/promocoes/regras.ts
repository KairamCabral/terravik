/**
 * Descontos automáticos do carrinho: fonte única.
 *
 * Duas regras, definidas pelo dono em 12/10/2026:
 * - KIT: um saco de cada um dos três produtos, 15% sobre o conjunto.
 * - QUANTIDADE: 2 sacos do mesmo produto, 5%; 3 ou mais, 10%.
 *   (Os percentuais de quantidade foram propostos na implementação e aguardam
 *   a confirmação do dono.)
 *
 * As regras não se somam na mesma unidade: primeiro formam-se os kits; o que
 * sobra de cada produto entra na faixa de quantidade. Item de assinatura já
 * tem o desconto dele e fica de fora.
 *
 * ATENÇÃO: hoje quem aplica isto é o carrinho de demonstração. Com a Shopify
 * ligada, os mesmos descontos precisam existir lá como descontos automáticos,
 * senão o site anuncia um preço que o checkout não cobra.
 */

export const KIT = {
  id: 'kit-gramado-completo',
  nome: 'Kit Gramado Completo',
  /** Na ordem da linha do tempo da embalagem. */
  handles: ['raiz-forte', 'verde-rapido', 'resistencia-total'],
  percentual: 15,
} as const

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

  // 1) Kits: quantos conjuntos completos cabem no carrinho.
  const kits = Math.min(...KIT.handles.map((h) => porHandle.get(h)?.quantidade ?? 0))
  if (kits > 0) {
    const precoDoConjunto = KIT.handles.reduce((soma, h) => soma + (porHandle.get(h)?.preco ?? 0), 0)
    promocoes.push({
      id: KIT.id,
      rotulo: kits > 1 ? `${kits} × ${KIT.nome} (${KIT.percentual}%)` : `${KIT.nome} (${KIT.percentual}%)`,
      valor: centavos((precoDoConjunto * kits * KIT.percentual) / 100),
    })
    for (const h of KIT.handles) {
      const item = porHandle.get(h)
      if (item) item.quantidade -= kits
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

/** Preço do kit a partir dos preços unitários dos três produtos. */
export function precoDoKit(precos: number[]): { cheio: number; comDesconto: number; economia: number } {
  const cheio = centavos(precos.reduce((soma, p) => soma + p, 0))
  const economia = centavos((cheio * KIT.percentual) / 100)
  return { cheio, comDesconto: centavos(cheio - economia), economia }
}
