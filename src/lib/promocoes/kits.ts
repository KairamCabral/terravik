/**
 * Os kits como o site os apresenta: nome, para quem é, o que vem dentro e o
 * preço, montados a partir do catálogo.
 *
 * O PREÇO NUNCA É ESCRITO AQUI. Ele sai de `calcularPromocoes`, a mesma função
 * que o carrinho usa: o que a vitrine anuncia é o que o carrinho cobra.
 *
 * Os textos seguem o rótulo (docs/produtos-fatos-do-rotulo.md): a linha do
 * tempo 1 firmar raiz, 2 devolver cor, 3 recuperar vigor; o "para quem" de
 * cada embalagem; e o uso contínuo a cada 60 dias do Resistência Total.
 */

import type { Product } from '@/types/product'
import { conteudoDaLp } from '@/lib/produtos/lp'
import { calcularPromocoes, FAIXAS_DE_QUANTIDADE } from './regras'

interface KitDeVitrine {
  id: string
  nome: string
  /** O momento do gramado, na voz de quem compra. Vira a aba. */
  momento: string
  titulo: string
  texto: string
  /** O que vem dentro. */
  itens: readonly { handle: string; quantidade: number }[]
}

export const KITS_DE_VITRINE: readonly KitDeVitrine[] = [
  {
    id: 'kit-gramado-completo',
    nome: 'Kit Gramado Completo',
    momento: 'Cuidado completo',
    titulo: 'A linha do tempo inteira do seu gramado',
    texto:
      'Os três produtos, um para cada momento: firmar a raiz, devolver a cor e manter a grama forte o ano inteiro. Aplique um de cada vez, na ordem da embalagem.',
    itens: [
      { handle: 'raiz-forte', quantidade: 1 },
      { handle: 'verde-rapido', quantidade: 1 },
      { handle: 'resistencia-total', quantidade: 1 },
    ],
  },
  {
    id: 'kit-recuperacao',
    nome: 'Kit Recuperação',
    momento: 'Está amarelado',
    titulo: 'Devolve a cor e mantém o gramado forte',
    texto:
      'Para o gramado amarelado ou sem vida. Verde Rápido devolve a cor em poucas semanas. Depois, Resistência Total entra na rotina, a cada 60 dias, para a grama aguentar seca, sol e pisoteio.',
    itens: [
      { handle: 'verde-rapido', quantidade: 1 },
      { handle: 'resistencia-total', quantidade: 1 },
    ],
  },
  {
    id: 'kit-plantio',
    nome: 'Kit Plantio',
    momento: 'Vou plantar',
    titulo: 'Raiz firme primeiro, cor depois',
    texto:
      'Para quem vai plantar, reformar ou recuperar falhas. Raiz Forte prepara o solo e firma a raiz. Verde Rápido fica à mão para devolver a cor se o gramado amarelar.',
    itens: [
      { handle: 'raiz-forte', quantidade: 1 },
      { handle: 'verde-rapido', quantidade: 1 },
    ],
  },
  {
    id: 'kit-seis-meses',
    nome: 'Kit Seis Meses Forte',
    momento: 'Manter forte',
    titulo: 'Três aplicações, seis meses de gramado forte',
    texto:
      'Resistência Total é de uso contínuo: uma aplicação a cada 60 dias. Três sacos são três aplicações em até 64 m², sem precisar lembrar de comprar de novo.',
    itens: [{ handle: 'resistencia-total', quantidade: 3 }],
  },
]

export interface ItemDoKit {
  handle: string
  nome: string
  /** Papel na linha do tempo da embalagem ("Devolver cor"). */
  papel: string
  /** Passo na linha do tempo: 1, 2 ou 3. */
  etapa: number
  quantidade: number
  variantId: string
  precoUnitario: number
  /** Área que um saco cobre, do rótulo. */
  m2PorSaco: number
  imagem: { url: string; width: number; height: number } | null
}

export interface KitMontado {
  id: string
  nome: string
  momento: string
  titulo: string
  texto: string
  itens: ItemDoKit[]
  /** Soma dos produtos vendidos separados. */
  precoCheio: number
  precoComDesconto: number
  economia: number
  /** Desconto efetivo, em %, arredondado. */
  percentual: number
}

/**
 * Monta os kits com o catálogo recebido. Kit com algum produto indisponível ou
 * sem preço fica de fora: não se anuncia o que não dá para vender.
 */
export function montarKits(produtos: Product[]): KitMontado[] {
  const kits: KitMontado[] = []

  for (const kit of KITS_DE_VITRINE) {
    const itens: ItemDoKit[] = []
    for (const { handle, quantidade } of kit.itens) {
      const produto = produtos.find((p) => p.handle === handle)
      const variante = produto?.variants.find((v) => v.available && v.price > 0)
      const conteudo = conteudoDaLp(handle)
      if (!produto || !variante || !conteudo) break
      itens.push({
        handle,
        nome: produto.title,
        papel: conteudo.papel,
        etapa: conteudo.etapa,
        quantidade,
        variantId: variante.id,
        precoUnitario: variante.price,
        m2PorSaco: conteudo.rendimento.m2PorSaco,
        imagem: produto.featuredImage
          ? { url: produto.featuredImage.url, width: produto.featuredImage.width, height: produto.featuredImage.height }
          : null,
      })
    }
    if (itens.length !== kit.itens.length) continue

    const precoCheio = Math.round(itens.reduce((s, i) => s + i.precoUnitario * i.quantidade, 0) * 100) / 100
    const { desconto } = calcularPromocoes(
      itens.map((i) => ({ handle: i.handle, nome: i.nome, precoUnitario: i.precoUnitario, quantidade: i.quantidade }))
    )
    if (desconto <= 0) continue

    kits.push({
      id: kit.id,
      nome: kit.nome,
      momento: kit.momento,
      titulo: kit.titulo,
      texto: kit.texto,
      itens,
      precoCheio,
      precoComDesconto: Math.round((precoCheio - desconto) * 100) / 100,
      economia: desconto,
      percentual: Math.round((desconto / precoCheio) * 100),
    })
  }

  return kits
}

/** Os sacos do kit, um por unidade, para desenhar: 3 × Resistência Total vira três sacos. */
export function sacosDoKit(kit: KitMontado): ItemDoKit[] {
  return kit.itens.flatMap((item) => Array.from({ length: item.quantidade }, () => item))
}

/** Kits que levam o produto, na ordem em que fazem mais sentido para quem está na página dele. */
export function kitsDoProduto(kits: KitMontado[], handle: string): KitMontado[] {
  const comEle = kits.filter((k) => k.itens.some((i) => i.handle === handle))
  // Primeiro os menores (o passo seguinte natural), por último o completo.
  return comEle.sort((a, b) => a.precoComDesconto - b.precoComDesconto)
}

export interface ComboDeProduto {
  handle: string
  nome: string
  papel: string
  variantId: string
  precoUnitario: number
  m2PorSaco: number
  imagem: { url: string; width: number; height: number } | null
  /** Uma opção por faixa de quantidade, da menor para a maior. */
  opcoes: { quantidade: number; percentual: number; precoCheio: number; precoComDesconto: number }[]
}

/**
 * Combos: o mesmo produto em 2 ou 3 sacos. As quantidades e os percentuais
 * vêm das faixas de quantidade, as mesmas que o carrinho aplica.
 */
export function montarCombos(produtos: Product[]): ComboDeProduto[] {
  const combos: ComboDeProduto[] = []
  for (const produto of produtos) {
    const variante = produto.variants.find((v) => v.available && v.price > 0)
    const conteudo = conteudoDaLp(produto.handle)
    if (!variante || !conteudo) continue
    combos.push({
      handle: produto.handle,
      nome: produto.title,
      papel: conteudo.papel,
      variantId: variante.id,
      precoUnitario: variante.price,
      m2PorSaco: conteudo.rendimento.m2PorSaco,
      imagem: produto.featuredImage
        ? { url: produto.featuredImage.url, width: produto.featuredImage.width, height: produto.featuredImage.height }
        : null,
      opcoes: [...FAIXAS_DE_QUANTIDADE]
        .sort((a, b) => a.minimo - b.minimo)
        .map((faixa) => {
          const precoCheio = Math.round(variante.price * faixa.minimo * 100) / 100
          const { desconto } = calcularPromocoes([
            { handle: produto.handle, nome: produto.title, precoUnitario: variante.price, quantidade: faixa.minimo },
          ])
          return {
            quantidade: faixa.minimo,
            percentual: faixa.percentual,
            precoCheio,
            precoComDesconto: Math.round((precoCheio - desconto) * 100) / 100,
          }
        }),
    })
  }
  // Na ordem da linha do tempo da embalagem.
  return combos.sort((a, b) => (conteudoDaLp(a.handle)?.etapa ?? 9) - (conteudoDaLp(b.handle)?.etapa ?? 9))
}
