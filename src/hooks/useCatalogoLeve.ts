'use client'

import { useEffect, useState } from 'react'
import type { ProdutoLeve } from '@/app/api/catalogo-leve/route'

/**
 * Catálogo resumido para client components que vivem fora de uma página com
 * `CatalogoProvider` (gaveta do carrinho, checkout).
 *
 * Uma busca só por carregamento de página: quem chamar depois reaproveita a
 * mesma promessa. Se a busca falhar, a promessa é descartada para a próxima
 * montagem tentar de novo.
 */
let emAndamento: Promise<ProdutoLeve[]> | null = null

function buscar(): Promise<ProdutoLeve[]> {
  if (!emAndamento) {
    emAndamento = fetch('/api/catalogo-leve')
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject(new Error('catalogo-leve'))))
      .then((dados) => (dados.produtos ?? []) as ProdutoLeve[])
      .catch(() => {
        emAndamento = null
        return []
      })
  }
  return emAndamento
}

/** Lista vazia enquanto carrega ou se a busca falhar. */
export function useCatalogoLeve(): ProdutoLeve[] {
  const [produtos, setProdutos] = useState<ProdutoLeve[]>([])

  useEffect(() => {
    let vivo = true
    buscar().then((lista) => {
      if (vivo) setProdutos(lista)
    })
    return () => {
      vivo = false
    }
  }, [])

  return produtos
}
