import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Layers, Plus } from 'lucide-react'
import { sacosDoKit, type KitMontado } from '@/lib/promocoes/kits'
import { FAIXAS_DE_QUANTIDADE } from '@/lib/promocoes/regras'
import { formatCurrency } from '@/lib/utils/formatters'
import { BotaoDoKit } from './BotaoDoKit'

interface AtalhoDeKitsProps {
  kits: KitMontado[]
}

/**
 * Atalho para os kits no topo da página de produtos: uma fileira de cartões
 * que desliza, cada um com as embalagens, o preço e um botão que já adiciona.
 * O último cartão leva aos combos de 2 e 3 sacos.
 */
export function AtalhoDeKits({ kits }: AtalhoDeKitsProps) {
  if (kits.length === 0) return null
  const maiorFaixa = FAIXAS_DE_QUANTIDADE[0]

  return (
    <section aria-labelledby="titulo-atalho-de-kits" className="bg-bg-primary">
      <div className="container-main pt-10 md:pt-14">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Leve mais, pague menos</p>
            <h2 id="titulo-atalho-de-kits" className="mt-1 font-heading text-2xl font-bold text-txt-primary md:text-3xl">
              Kits e combos
            </h2>
          </div>
          <Link
            href="/kits"
            className="flex min-h-[44px] flex-shrink-0 items-center gap-1 text-sm font-semibold text-forest underline-offset-4 hover:underline"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="scrollbar-hide -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 pt-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {kits.map((kit) => (
            <li key={kit.id} className="w-[66%] flex-shrink-0 snap-start sm:w-[40%] lg:w-auto">
              <article className="relative flex h-full flex-col rounded-2xl border border-border-subtle bg-bg-surface p-4">
                {/* Etiqueta sobre a borda do cartão: fora da área das fotos, nunca fica atrás delas. */}
                <span className="absolute -top-3 left-4 z-10 rounded-full bg-gold px-3 py-1 text-xs font-bold text-forest-ink shadow-md ring-2 ring-bg-primary">
                  {kit.percentual}% OFF
                </span>
                <div className="relative flex h-28 items-end justify-center gap-1 rounded-xl bg-gradient-forest px-2 pb-2 pt-3">
                  {/* Um saco por unidade: 3 sacos aparecem como 3 sacos. */}
                  {sacosDoKit(kit).map((item, indice) => (
                    <div key={`${item.handle}-${indice}`} className="flex h-full min-w-0 items-end gap-1">
                      {indice > 0 && <Plus className="mb-8 h-3 w-3 flex-shrink-0 text-gold-soft" aria-hidden="true" />}
                      {item.imagem && (
                        <Image
                          src={item.imagem.url}
                          alt=""
                          width={item.imagem.width}
                          height={item.imagem.height}
                          sizes="72px"
                          className="h-full w-auto min-w-0 object-contain drop-shadow-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-gold-ink">{kit.momento}</p>
                <h3 className="font-heading text-base font-bold leading-snug text-txt-primary">{kit.nome}</h3>
                <p className="mt-1 text-xs text-txt-secondary">
                  {kit.itens.map((i) => (i.quantidade > 1 ? `${i.quantidade} × ${i.nome}` : i.nome)).join(' + ')}
                </p>

                <div className="mt-auto pt-3">
                  <p className="font-heading text-xl font-bold leading-none text-forest">{formatCurrency(kit.precoComDesconto)}</p>
                  <p className="mt-1 text-xs text-txt-muted">
                    <span className="sr-only">Separados custam </span>
                    <span className="line-through">{formatCurrency(kit.precoCheio)}</span> separados
                  </p>
                  <BotaoDoKit
                    itens={kit.itens.map((i) => ({ variantId: i.variantId, quantidade: i.quantidade }))}
                    texto="Adicionar"
                    className="mt-3 min-h-[44px] rounded-xl px-3 text-sm"
                  />
                </div>
              </article>
            </li>
          ))}

          <li className="w-[66%] flex-shrink-0 snap-start sm:w-[40%] lg:w-auto">
            <Link
              href="/kits#combos"
              className="group flex h-full flex-col justify-between rounded-2xl border-2 border-dashed border-forest/30 bg-forest/5 p-4 transition-colors hover:border-forest/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest text-white">
                <Layers className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="mt-6">
                <h3 className="font-heading text-base font-bold leading-snug text-txt-primary">Combos de 2 ou 3 sacos</h3>
                <p className="mt-1 text-xs leading-relaxed text-txt-secondary">
                  Para gramado grande: o mesmo produto com até {maiorFaixa.percentual}% de desconto.
                </p>
                <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-forest">
                  Ver os combos
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
