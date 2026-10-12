'use client'

import { useState } from 'react'
import { Loader2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { calcularParaArea, PESO_DO_SACO, type ConteudoDaLp } from '@/lib/produtos/lp'
import { formatCurrency } from '@/lib/utils/formatters'

interface CalculadoraDeAreaProps {
  nomeDoProduto: string
  variantId: string
  preco: number
  moeda: string
  disponivel: boolean
  rendimento: ConteudoDaLp['rendimento']
}

const AREA_MAXIMA = 5000

/**
 * "Quanto eu preciso?": a pessoa informa a área e vê quantos sacos e quantos
 * dosadores usar. A conta usa só o rendimento impresso no rótulo: sacos para
 * cima, dosadores em passos de meio e para baixo, para não passar da dose. O
 * botão já adiciona a quantidade certa de sacos.
 */
export function CalculadoraDeArea({
  nomeDoProduto,
  variantId,
  preco,
  moeda,
  disponivel,
  rendimento,
}: CalculadoraDeAreaProps) {
  const { addItem, openCart, isLoading } = useCart()
  const [texto, setTexto] = useState('')

  const area = Math.min(AREA_MAXIMA, parseInt(texto.replace(/\D/g, ''), 10))
  const resultado = calcularParaArea(area, rendimento)
  const podeComprar = disponivel && preco > 0

  const adicionar = async () => {
    if (!resultado) return
    try {
      await addItem(variantId, resultado.sacos, { purchaseMode: 'one-time' }, 'pdp')
      openCart()
    } catch {
      // O CartProvider já avisou por toast.
    }
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5 sm:p-6">
      <label htmlFor="area-do-gramado" className="block text-sm font-semibold text-txt-primary">
        Qual o tamanho do seu gramado?
      </label>
      <div className="mt-2 flex items-center gap-2">
        <input
          id="area-do-gramado"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={texto}
          onChange={(e) => setTexto(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="Ex.: 80"
          aria-describedby="resultado-da-area"
          className="h-12 w-full min-w-0 rounded-xl border-2 border-border-subtle bg-bg-surface px-4 text-base font-semibold text-txt-primary placeholder:font-normal placeholder:text-txt-secondary focus:border-forest focus:outline-none"
        />
        <span className="shrink-0 text-sm font-medium text-txt-secondary">m²</span>
      </div>

      <div id="resultado-da-area" aria-live="polite" className="mt-4">
        {resultado ? (
          <>
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-bg-surface-2 p-4">
                <dt className="text-xs text-txt-secondary">
                  {resultado.sacos === 1 ? 'Saco' : 'Sacos'} de {PESO_DO_SACO}
                </dt>
                <dd className="font-heading text-3xl font-bold text-forest">{resultado.sacos}</dd>
              </div>
              <div className="rounded-xl bg-bg-surface-2 p-4">
                <dt className="text-xs text-txt-secondary">
                  {resultado.dosadores <= 1 ? 'Dosador raso' : 'Dosadores rasos'}, cerca de
                </dt>
                <dd className="font-heading text-3xl font-bold text-forest">
                  {resultado.dosadores < 0.5
                    ? 'menos de meio'
                    : resultado.dosadores.toLocaleString('pt-BR')}
                </dd>
              </div>
            </dl>

            {podeComprar && (
              <button
                type="button"
                onClick={adicionar}
                disabled={isLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-3.5 text-base font-semibold text-white transition-all hover:bg-forest-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                )}
                Adicionar {resultado.sacos} {resultado.sacos === 1 ? 'saco' : 'sacos'} de {nomeDoProduto}
                <span className="font-normal opacity-90">
                  · {formatCurrency(preco * resultado.sacos, moeda)}
                </span>
              </button>
            )}
          </>
        ) : (
          <p className="text-sm text-txt-secondary">
            Informe a área em metros quadrados para ver quantos sacos e quantos dosadores usar.
          </p>
        )}
      </div>
    </div>
  )
}
