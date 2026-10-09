// src/lib/shipping/config.ts

import type { FreeShippingConfig, OrderBumpConfig } from './types'

/**
 * FRETE GRÁTIS: FONTE ÚNICA.
 *
 * Cada faixa diz para quais UFs o frete é grátis e a partir de que valor.
 * Barra do carrinho, barra de anúncio, PDP, listagem, FAQ e termos leem daqui.
 * UF fora de todas as faixas não tem frete grátis (ver `ufSemFaixa`).
 *
 * Para mudar a regra, edite só esta lista. Pode haver uma faixa só.
 */
export interface FaixaDeFreteGratis {
  /** Como a região aparece no texto: "SP, RJ, MG, PR, SC e RS". */
  regiao: string
  ufs: string[]
  /** Subtotal mínimo, em reais. */
  minimo: number
}

export const FAIXAS_DE_FRETE_GRATIS: FaixaDeFreteGratis[] = [
  {
    regiao: 'SP, RJ, MG, PR, SC e RS',
    ufs: ['SP', 'RJ', 'MG', 'PR', 'SC', 'RS'],
    minimo: 150,
  },
]

export const TODAS_AS_UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

/** Faixa que atende a UF, ou null quando a UF não tem frete grátis. */
export function faixaDaUf(uf: string): FaixaDeFreteGratis | null {
  const alvo = uf.trim().toUpperCase()
  return FAIXAS_DE_FRETE_GRATIS.find((f) => f.ufs.includes(alvo)) ?? null
}

/** UFs que nenhuma faixa atende. Vazio quando o frete grátis cobre o país todo. */
export function ufSemFaixa(): string[] {
  return TODAS_AS_UFS.filter((uf) => !faixaDaUf(uf))
}

/** A faixa de menor mínimo: é a que a copy geral anuncia. */
function faixaPrincipal(): FaixaDeFreteGratis | null {
  if (FAIXAS_DE_FRETE_GRATIS.length === 0) return null
  return [...FAIXAS_DE_FRETE_GRATIS].sort((a, b) => a.minimo - b.minimo)[0]
}

/** Compatibilidade: forma antiga do config, derivada das faixas. */
export const FREE_SHIPPING_CONFIG: FreeShippingConfig = {
  threshold: faixaPrincipal()?.minimo ?? 0,
  enabled: FAIXAS_DE_FRETE_GRATIS.length > 0,
  message: faixaPrincipal() ? `Frete grátis para ${faixaPrincipal()!.regiao}` : '',
  regions: FAIXAS_DE_FRETE_GRATIS.flatMap((f) => f.ufs),
}

/**
 * Valor mínimo do frete grátis, pronto para texto: "R$ 150".
 * Toda copy do site que cita o valor lê daqui.
 */
export function limiteFreteGratis(): string {
  return `R$ ${FREE_SHIPPING_CONFIG.threshold.toLocaleString('pt-BR')}`
}

/**
 * Onde o frete grátis vale, pronto para texto: "SP, RJ, MG, PR, SC e RS", ou
 * "todo o Brasil" quando as faixas cobrem as 27 UFs.
 */
export function regiaoDoFreteGratis(): string {
  if (ufSemFaixa().length === 0) return 'todo o Brasil'
  return FAIXAS_DE_FRETE_GRATIS.map((f) => f.regiao).join('; ')
}

/**
 * Frase curta de frete grátis, com o valor do config, ou null quando não há
 * faixa: quem chama não renderiza.
 */
export function fraseFreteGratis(): string | null {
  if (!FREE_SHIPPING_CONFIG.enabled) return null
  return `Frete grátis acima de ${limiteFreteGratis()}`
}

/**
 * Frase completa, com a região. Use onde houver espaço: dizer só o valor
 * promete frete grátis a quem mora fora das faixas.
 */
export function fraseDoFreteGratis(): string | null {
  const curta = fraseFreteGratis()
  if (!curta) return null
  return `${curta} para ${regiaoDoFreteGratis()}`
}

export interface ProgressoDoFreteGratis {
  /** Faixa já alcançada pelo subtotal, se houver. */
  liberada: FaixaDeFreteGratis | null
  /** Próxima faixa a alcançar, se houver. */
  proxima: FaixaDeFreteGratis | null
  /** Quanto falta, em reais, para a próxima faixa. Zero quando não há próxima. */
  falta: number
  /** Avanço dentro do trecho atual, de 0 a 100. */
  percentual: number
}

/**
 * Mede o trecho atual: do mínimo da faixa já liberada (ou zero) até o mínimo
 * da próxima. A barra só desenha o que esta função devolve.
 */
export function progressoDoFreteGratis(subtotal: number): ProgressoDoFreteGratis {
  const valor = Number.isFinite(subtotal) && subtotal > 0 ? subtotal : 0
  const ordenadas = [...FAIXAS_DE_FRETE_GRATIS].sort((a, b) => a.minimo - b.minimo)

  const liberadas = ordenadas.filter((f) => valor >= f.minimo)
  const liberada = liberadas.length > 0 ? liberadas[liberadas.length - 1] : null
  const proxima = ordenadas.find((f) => valor < f.minimo) ?? null

  if (!proxima) {
    return { liberada, proxima: null, falta: 0, percentual: liberada ? 100 : 0 }
  }

  const inicio = liberada?.minimo ?? 0
  const trecho = proxima.minimo - inicio
  const percentual = trecho > 0 ? Math.min(100, Math.max(0, ((valor - inicio) / trecho) * 100)) : 0

  return {
    liberada,
    proxima,
    falta: Math.round((proxima.minimo - valor) * 100) / 100,
    percentual,
  }
}

export const ORDER_BUMP_CONFIG: OrderBumpConfig = {
  enabled: true,
  maxItems: 2,
  position: 'before-summary',
}

// Mapeamento de estados por região (para cálculo de prazo)
export const REGIONS: Record<string, string[]> = {
  sudeste: ['SP', 'RJ', 'MG', 'ES'],
  sul: ['PR', 'SC', 'RS'],
  nordeste: ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'],
  norte: ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'],
  centroOeste: ['GO', 'MT', 'MS', 'DF'],
}

export function getRegion(state: string): string {
  for (const [region, states] of Object.entries(REGIONS)) {
    if (states.includes(state.toUpperCase())) {
      return region
    }
  }
  return 'outros'
}
