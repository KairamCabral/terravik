'use client'

import { useMemo, useState } from 'react'
import type { ProductPlan } from '@/types/calculator'
import { useCart } from '@/components/cart'
import { useCatalogo } from '@/contexts/CatalogoContext'
import { produtoDaCalculadora } from '@/lib/calculator/produtos'
import { intervaloDaAssinatura } from '@/lib/produtos/assinatura'
import { conteudoDaLp } from '@/lib/produtos/lp'
import { calculateSubscriptionPrice, getDiscountPercent } from '@/lib/subscription/pricing'

export interface ItemDaCompra {
  id: string
  nome: string
  /** Papel do produto na linha do tempo da embalagem ("Devolver cor"). */
  papel: string
  /** "2 sacos de 1,6 kg" */
  sacos: string
  quantidade: number
  imagem: string | null
  variantId: string | null
  disponivel: boolean
  /** Preço da quantidade do plano, sem desconto. */
  precoCheio: number
  /** Preço com o desconto da assinatura, quando ela está escolhida para este item. */
  precoComDesconto: number | null
}

export interface CompraDoPlano {
  itens: ItemDaCompra[]
  /** Produto do plano que aceita assinatura, se houver. */
  assinavel: { nome: string; intervalo: number; desconto: number } | null
  modo: 'avulsa' | 'assinatura'
  setModo: (modo: 'avulsa' | 'assinatura') => void
  total: number
  totalAvulso: number
  economia: number
  estado: 'pronto' | 'adicionando' | 'adicionado'
  /** Adiciona o plano inteiro ao carrinho; depois de adicionado, abre o carrinho. */
  comprar: () => Promise<void>
}

/**
 * A compra do plano: junta o plano da calculadora com o catálogo (preço,
 * variante, foto) e cuida de adicionar tudo ao carrinho de uma vez.
 *
 * Assinatura só para o produto de uso contínuo do rótulo, no intervalo do
 * rótulo. Os outros produtos do plano entram como compra única.
 */
export function useCompraDoPlano(plano: ProductPlan[]): CompraDoPlano {
  const catalogo = useCatalogo()
  const { addItem, openCart } = useCart()
  const [modo, setModoBruto] = useState<'avulsa' | 'assinatura'>('avulsa')
  const [estado, setEstado] = useState<CompraDoPlano['estado']>('pronto')

  const base = useMemo(
    () =>
      plano.map((p) => {
        const produto = produtoDaCalculadora(catalogo, p.product_id)
        const variante = produto?.variants.find((v) => v.available && v.price > 0) ?? null
        const quantidade = Math.max(1, p.packs_qty)
        return {
          plano: p,
          handle: produto?.handle ?? '',
          variante,
          quantidade,
          imagem: produto?.featuredImage?.url ?? null,
          papel: produto ? (conteudoDaLp(produto.handle)?.papel ?? '') : '',
          intervalo: produto && variante ? intervaloDaAssinatura(produto.handle) : null,
        }
      }),
    [plano, catalogo]
  )

  const comAssinatura = base.find((b) => b.intervalo !== null) ?? null
  const assinavel = comAssinatura
    ? {
        nome: comAssinatura.plano.name,
        intervalo: comAssinatura.intervalo as number,
        desconto: getDiscountPercent(comAssinatura.intervalo as number),
      }
    : null
  const assinando = modo === 'assinatura' && assinavel !== null

  const itens: ItemDaCompra[] = base.map((b) => {
    const precoCheio = (b.variante?.price ?? 0) * b.quantidade
    const comDesconto =
      assinando && b === comAssinatura && b.variante
        ? calculateSubscriptionPrice(b.variante.price, b.intervalo as number) * b.quantidade
        : null
    return {
      id: b.plano.product_id,
      nome: b.plano.name,
      papel: b.papel,
      sacos: b.plano.packs_display,
      quantidade: b.quantidade,
      imagem: b.imagem,
      variantId: b.variante?.id ?? null,
      disponivel: b.variante !== null,
      precoCheio,
      precoComDesconto: comDesconto,
    }
  })

  const totalAvulso = itens.reduce((soma, i) => soma + (i.disponivel ? i.precoCheio : 0), 0)
  const total = itens.reduce((soma, i) => soma + (i.disponivel ? (i.precoComDesconto ?? i.precoCheio) : 0), 0)

  const setModo = (novo: 'avulsa' | 'assinatura') => {
    setModoBruto(novo)
    // Mudou a forma de compra: o que foi adicionado antes não vale mais como "feito".
    setEstado('pronto')
  }

  const comprar = async () => {
    if (estado === 'adicionando') return
    if (estado === 'adicionado') {
      openCart()
      return
    }
    setEstado('adicionando')
    try {
      for (const b of base) {
        if (!b.variante) continue
        const assinatura = assinando && b === comAssinatura
        const intervalo = b.intervalo as number
        await addItem(
          b.variante.id,
          b.quantidade,
          assinatura
            ? {
                purchaseMode: 'subscription',
                frequency: intervalo,
                subscriptionPrice: calculateSubscriptionPrice(b.variante.price, intervalo),
                discountPercent: getDiscountPercent(intervalo),
              }
            : { purchaseMode: 'one-time' },
          'calculadora'
        )
      }
      setEstado('adicionado')
      openCart()
    } catch {
      // O CartProvider já avisou por toast. O botão volta ao normal.
      setEstado('pronto')
    }
  }

  return {
    itens,
    assinavel,
    modo: assinando ? 'assinatura' : 'avulsa',
    setModo,
    total,
    totalAvulso,
    economia: Math.max(0, totalAvulso - total),
    estado,
    comprar,
  }
}
