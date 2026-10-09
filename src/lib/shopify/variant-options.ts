import type { ProductVariant } from '@/types/product'

/**
 * Rótulo da opção de variante, lido do próprio produto.
 *
 * A tela dizia "Tamanho" fixo. Produto cuja opção na Shopify se chama "Peso"
 * ou "Embalagem" saía com o rótulo errado.
 */

const ROTULO_PADRAO = 'Opção'

export function rotuloDaOpcao(variants: ProductVariant[]): string {
  const nome = Object.keys(variants[0]?.options ?? {})[0]

  // `title` é o nome que a Shopify usa para produto SEM opção real
  // ("Default Title"). Nesse caso não há o que rotular.
  if (!nome || nome.toLowerCase() === 'title') return ROTULO_PADRAO

  return nome.charAt(0).toUpperCase() + nome.slice(1)
}

const PLURAIS: Record<string, string> = {
  tamanho: 'tamanhos',
  peso: 'pesos',
  embalagem: 'embalagens',
  volume: 'volumes',
}

export function rotuloNoPlural(variants: ProductVariant[]): string {
  const rotulo = rotuloDaOpcao(variants)
  if (rotulo === ROTULO_PADRAO) return 'opções'
  return PLURAIS[rotulo.toLowerCase()] ?? 'opções'
}

export function valorDaOpcao(variant: ProductVariant, rotulo: string): string {
  const chave = Object.keys(variant.options).find(
    (k) => k.toLowerCase() === rotulo.toLowerCase()
  )
  return (chave && variant.options[chave]) || variant.title
}
