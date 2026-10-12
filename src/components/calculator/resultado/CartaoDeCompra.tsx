'use client'

import Image from 'next/image'
import { forwardRef } from 'react'
import { Check, Loader2, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/formatters'
import { fraseParcelamento } from '@/lib/pagamento/parcelas'
import { progressoDoFreteGratis } from '@/lib/shipping/config'
import { frasePix } from '@/lib/pagamento/pix'
import type { CompraDoPlano } from './useCompraDoPlano'

interface CartaoDeCompraProps {
  compra: CompraDoPlano
  areaM2: number
}

/**
 * O plano em forma de compra: o que levar, quanto custa e um botão só.
 * É o primeiro bloco depois do título, porque é a resposta que a pessoa veio
 * buscar. O ref marca o botão principal: quando ele sai da tela, a barra fixa
 * assume.
 */
export const CartaoDeCompra = forwardRef<HTMLDivElement, CartaoDeCompraProps>(function CartaoDeCompra(
  { compra, areaM2 },
  botaoRef
) {
  const { itens, assinavel, modo, setModo, total, totalAvulso, economia, promocoes, estado, comprar } = compra
  const pix = frasePix(total)
  const frete = progressoDoFreteGratis(total)
  const parcelas = fraseParcelamento(total)
  const disponiveis = itens.filter((i) => i.disponivel)

  return (
    <section
      aria-labelledby="titulo-da-compra"
      className="overflow-hidden rounded-3xl border border-border-subtle bg-bg-surface shadow-[0_18px_50px_-24px_rgba(9,62,40,0.45)]"
    >
      <div className="px-5 pt-5 sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">O que levar</p>
        <h2 id="titulo-da-compra" className="mt-1 font-heading text-2xl font-bold text-txt-primary">
          {itens.length === 1 ? 'Um produto resolve' : `${itens.length} produtos, um de cada vez`}
        </h2>
      </div>

      <ul className="mt-2 divide-y divide-border-subtle px-5 sm:px-7">
        {itens.map((item, indice) => (
          <li key={item.id} className="flex items-center gap-4 py-3">
            <div className="relative flex h-24 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-bg-surface-2">
              {item.imagem && (
                <Image
                  src={item.imagem}
                  alt=""
                  width={160}
                  height={192}
                  sizes="80px"
                  className="h-[88px] w-auto object-contain drop-shadow-md"
                />
              )}
              {itens.length > 1 && (
                <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">
                  {indice + 1}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-lg font-bold leading-tight text-txt-primary">{item.nome}</p>
              <p className="mt-0.5 text-sm text-txt-secondary">{item.papel}</p>
              <p className="mt-2 text-sm font-semibold text-forest">{item.sacos}</p>
              {!item.disponivel && <p className="mt-1 text-xs font-medium text-error">Indisponível no momento</p>}
            </div>
            {item.disponivel && (
              <div className="text-right">
                {item.precoComDesconto !== null && (
                  <p className="text-xs text-txt-muted line-through">{formatCurrency(item.precoCheio)}</p>
                )}
                <p className="font-heading text-lg font-bold text-txt-primary">
                  {formatCurrency(item.precoComDesconto ?? item.precoCheio)}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>

      {assinavel && (
        <fieldset className="mx-5 mb-1 mt-1 sm:mx-7">
          <legend className="sr-only">Como você quer receber</legend>
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-bg-surface-2 p-1.5">
            {(
              [
                { valor: 'avulsa', titulo: 'Compra única', detalhe: formatCurrency(totalAvulso) },
                {
                  valor: 'assinatura',
                  titulo: itens.length > 1 ? 'Com assinatura' : `A cada ${assinavel.intervalo} dias`,
                  detalhe:
                    itens.length > 1
                      ? `${assinavel.desconto}% no ${assinavel.nome}`
                      : `${assinavel.desconto}% de desconto`,
                },
              ] as const
            ).map((opcao) => (
              <button
                key={opcao.valor}
                type="button"
                aria-pressed={modo === opcao.valor}
                onClick={() => setModo(opcao.valor)}
                className={cn(
                  'min-h-[56px] rounded-xl px-3 py-2 text-left transition-all',
                  modo === opcao.valor ? 'bg-bg-surface shadow-sm ring-1 ring-forest/20' : 'hover:bg-bg-surface/60'
                )}
              >
                <span className="flex items-center gap-1.5 text-sm font-semibold text-txt-primary">
                  {modo === opcao.valor && <Check className="h-3.5 w-3.5 text-forest" aria-hidden="true" />}
                  {opcao.titulo}
                </span>
                <span className={cn('text-xs', opcao.valor === 'assinatura' ? 'font-semibold text-gold-ink' : 'text-txt-secondary')}>
                  {opcao.detalhe}
                </span>
              </button>
            ))}
          </div>
          {modo === 'assinatura' && (
            <p className="mt-2 text-xs leading-relaxed text-txt-secondary">
              Você recebe o {assinavel.nome} a cada {assinavel.intervalo} dias, o intervalo de aplicação do rótulo.
              Pause ou cancele quando quiser.{itens.length > 1 ? ' Os outros produtos entram como compra única.' : ''}
            </p>
          )}
        </fieldset>
      )}

      <div className="mt-3 bg-bg-surface-2/60 px-5 pb-6 pt-4 sm:px-7">
        {promocoes.length > 0 && (
          <ul className="mb-3 space-y-1.5 border-b border-border-subtle pb-3">
            {promocoes.map((promocao) => (
              <li key={promocao.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-forest">{promocao.rotulo}</span>
                <span className="font-semibold text-forest">-{formatCurrency(promocao.valor)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-txt-secondary">Total do plano</p>
            <p className="text-xs text-txt-muted">Cobre {areaM2} m² em uma aplicação</p>
          </div>
          <div className="text-right">
            <p className="font-heading text-3xl font-bold leading-none text-forest">{formatCurrency(total)}</p>
            {pix && <p className="mt-1 text-sm font-semibold text-forest">{pix}</p>}
            {parcelas && <p className="mt-0.5 text-xs text-txt-secondary">ou {parcelas}</p>}
            {economia > 0 && (
              <p className="mt-1 text-xs font-semibold text-gold-ink">Você economiza {formatCurrency(economia)}</p>
            )}
          </div>
        </div>

        <div ref={botaoRef} className="mt-4">
          <button
            type="button"
            onClick={comprar}
            disabled={estado === 'adicionando' || disponiveis.length === 0}
            className={cn(
              'flex min-h-[58px] w-full items-center justify-center gap-3 rounded-2xl px-6 text-base font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
              estado === 'adicionado' ? 'bg-success-ink' : 'bg-forest shadow-lg shadow-forest/25 hover:bg-forest-ink'
            )}
          >
            {estado === 'adicionando' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                Adicionando
              </>
            ) : estado === 'adicionado' ? (
              <>
                <Check className="h-5 w-5" aria-hidden="true" />
                No carrinho. Ver carrinho
              </>
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {modo === 'assinatura' ? 'Assinar o plano' : 'Adicionar o plano ao carrinho'}
              </>
            )}
          </button>
        </div>

        {frete.liberada ? (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-success-ink">
            <Truck className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            Frete grátis para {frete.liberada.regiao}
          </p>
        ) : frete.proxima ? (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-txt-secondary">
            <Truck className="h-4 w-4 flex-shrink-0 text-forest" aria-hidden="true" />
            Faltam {formatCurrency(frete.falta)} para frete grátis em {frete.proxima.regiao}
          </p>
        ) : null}

        <ul className="mt-4 grid grid-cols-3 gap-2 border-t border-border-subtle pt-4">
          {[
            { icone: ShieldCheck, texto: 'Compra segura' },
            { icone: RotateCcw, texto: 'Devolução em 7 dias' },
            { icone: Truck, texto: 'Entrega para todo o Brasil' },
          ].map(({ icone: Icone, texto }) => (
            <li key={texto} className="flex flex-col items-center gap-1 text-center text-[11px] font-medium leading-tight text-txt-secondary">
              <Icone className="h-4 w-4 text-forest" strokeWidth={1.75} aria-hidden="true" />
              {texto}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
})
