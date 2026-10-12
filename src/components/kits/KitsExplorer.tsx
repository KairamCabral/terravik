'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useId, useRef, useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { sacosDoKit, type KitMontado } from '@/lib/promocoes/kits'
import { frasePix } from '@/lib/pagamento/pix'
import { fraseParcelamento } from '@/lib/pagamento/parcelas'
import { formatCurrency } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'
import { BotaoDoKit } from './BotaoDoKit'

interface KitsExplorerProps {
  kits: KitMontado[]
  /** Nível do título: h1 na página de kits, h2 na home. */
  titulo?: 'h1' | 'h2'
}

const LINHA_DO_TEMPO = [
  { etapa: 1, papel: 'Firmar raiz' },
  { etapa: 2, papel: 'Devolver cor' },
  { etapa: 3, papel: 'Recuperar vigor' },
] as const

/**
 * Os kits, escolhidos pelo momento do gramado.
 *
 * A pessoa não precisa conhecer a linha: toca no que está vivendo ("está
 * amarelado") e vê o kit, o que vem dentro, onde ele fica na linha do tempo da
 * embalagem e quanto economiza. Um toque adiciona tudo.
 */
export function KitsExplorer({ kits, titulo = 'h2' }: KitsExplorerProps) {
  const [ativo, setAtivo] = useState(0)
  const abas = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()
  const Titulo = titulo
  // O título do kit vem um nível abaixo do título da seção.
  const TituloDoKit = titulo === 'h1' ? 'h2' : 'h3'
  const kit = kits[ativo]
  if (!kit) return null

  const pix = frasePix(kit.precoComDesconto)
  const parcelas = fraseParcelamento(kit.precoComDesconto)
  const etapas = new Set(kit.itens.map((i) => i.etapa))

  // Setas do teclado andam entre as abas, como manda o padrão de tablist.
  const aoTeclar = (e: React.KeyboardEvent) => {
    const passo = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!passo) return
    e.preventDefault()
    const proximo = (ativo + passo + kits.length) % kits.length
    setAtivo(proximo)
    abas.current[proximo]?.focus()
  }

  return (
    <section aria-labelledby={`${id}-titulo`} className="relative overflow-hidden bg-gradient-forest text-white">
      <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-gold/10 blur-[120px]" aria-hidden="true" />

      <div className="container-main relative py-12 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">Kits Terravik</p>
          <Titulo id={`${id}-titulo`} className="mt-2 font-heading text-3xl font-bold leading-tight md:text-5xl">
            Qual é o momento do seu gramado?
          </Titulo>
          <p className="mt-3 text-base leading-relaxed text-white/80">
            Escolha a situação e leve o kit certo, com desconto. Cada saco vem com o dosador.
          </p>
        </div>

        {/* Abas: o momento do gramado */}
        <div
          role="tablist"
          aria-label="Momento do gramado"
          onKeyDown={aoTeclar}
          className="scrollbar-hide -mx-4 mt-8 flex snap-x gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:justify-center md:px-0"
        >
          {kits.map((k, indice) => (
            <button
              key={k.id}
              ref={(el) => {
                abas.current[indice] = el
              }}
              role="tab"
              type="button"
              id={`${id}-aba-${indice}`}
              aria-selected={indice === ativo}
              aria-controls={`${id}-painel`}
              tabIndex={indice === ativo ? 0 : -1}
              onClick={() => setAtivo(indice)}
              className={cn(
                'flex min-h-[48px] flex-shrink-0 snap-start items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-soft',
                indice === ativo
                  ? 'border-white bg-white text-forest shadow-lg'
                  : 'border-white/25 bg-white/5 text-white hover:bg-white/10'
              )}
            >
              {k.momento}
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[11px] font-bold',
                  indice === ativo ? 'bg-gold text-forest-ink' : 'bg-white/15 text-gold-soft'
                )}
              >
                {k.percentual}% OFF
              </span>
            </button>
          ))}
        </div>

        {/* Painel do kit escolhido */}
        <div
          role="tabpanel"
          id={`${id}-painel`}
          aria-labelledby={`${id}-aba-${ativo}`}
          tabIndex={0}
          className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-soft sm:p-8 lg:grid lg:grid-cols-[1fr,1fr] lg:items-center lg:gap-12 lg:p-10"
        >
          {/* O que vem dentro, em imagem */}
          <div key={kit.id} className="animate-fade-in motion-reduce:animate-none">
            <div className="flex items-end justify-center gap-1.5 sm:gap-3">
              {sacosDoKit(kit).map((item, indice, sacos) => (
                <div key={`${item.handle}-${indice}`} className="flex min-w-0 items-center gap-1 sm:gap-3">
                  {indice > 0 && <Plus className="h-4 w-4 flex-shrink-0 text-gold-soft sm:h-5 sm:w-5" aria-hidden="true" />}
                  <div className="relative">
                    {item.imagem && (
                      <Image
                        src={item.imagem.url}
                        alt={`Saco de ${item.nome}`}
                        width={item.imagem.width}
                        height={item.imagem.height}
                        sizes="(max-width: 640px) 30vw, 190px"
                        className={cn(
                          'h-auto drop-shadow-2xl',
                          sacos.length === 1 ? 'w-40 sm:w-52' : sacos.length === 2 ? 'w-32 sm:w-44' : 'w-[20vw] max-w-[150px] sm:w-36'
                        )}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Onde o kit fica na linha do tempo impressa na embalagem */}
            <ol className="mx-auto mt-7 flex max-w-md items-start" aria-label="Linha do tempo do gramado">
              {LINHA_DO_TEMPO.map((passo, indice) => {
                const incluso = etapas.has(passo.etapa)
                return (
                  <li key={passo.etapa} className="relative flex flex-1 flex-col items-center text-center">
                    {indice > 0 && (
                      <span className="absolute right-1/2 top-4 h-px w-full bg-white/20" aria-hidden="true" />
                    )}
                    <span
                      className={cn(
                        'relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                        incluso ? 'bg-gold text-forest-ink' : 'border border-white/25 bg-forest-ink text-white/50'
                      )}
                    >
                      {passo.etapa}
                    </span>
                    <span className={cn('mt-2 text-xs font-medium', incluso ? 'text-white' : 'text-white/45')}>
                      {passo.papel}
                      <span className="sr-only">{incluso ? ', incluso neste kit' : ', não incluso'}</span>
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* A oferta */}
          <div className="mt-8 lg:mt-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-soft">{kit.nome}</p>
            <TituloDoKit className="mt-2 font-heading text-2xl font-bold leading-tight md:text-3xl">{kit.titulo}</TituloDoKit>
            <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">{kit.texto}</p>

            <ul className="mt-5 space-y-2 text-sm">
              {kit.itens.map((item) => (
                <li key={item.handle} className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
                  <span className="font-medium">
                    {item.quantidade} {item.quantidade === 1 ? 'saco' : 'sacos'} de {item.nome}
                  </span>
                  <span className="flex-shrink-0 text-xs text-white/65">rende até {item.m2PorSaco} m² por saco</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1">
              <p className="font-heading text-4xl font-bold leading-none">{formatCurrency(kit.precoComDesconto)}</p>
              <p className="text-sm text-white/65">
                <span className="sr-only">Separados custam </span>
                <span className="line-through">{formatCurrency(kit.precoCheio)}</span> separados
              </p>
            </div>
            <p className="mt-2 text-sm text-white/85">
              {pix && <strong className="font-semibold text-gold-soft">{pix}</strong>}
              {pix && parcelas && ' ou '}
              {parcelas}
            </p>
            <p className="mt-1 text-sm font-semibold text-gold-soft">Você economiza {formatCurrency(kit.economia)}</p>

            <BotaoDoKit
              tom="claro"
              itens={kit.itens.map((i) => ({ variantId: i.variantId, quantidade: i.quantidade }))}
              className="mt-6 sm:w-auto sm:px-10"
            />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-white/70">
          Gramado maior ou menor?{' '}
          <Link href="/calculadora" className="inline-flex items-center gap-1 font-semibold text-gold-soft underline-offset-4 hover:underline">
            A calculadora ajusta a quantidade para a sua área
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  )
}
