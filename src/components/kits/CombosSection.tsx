import Image from 'next/image'
import type { ComboDeProduto } from '@/lib/promocoes/kits'
import { frasePix } from '@/lib/pagamento/pix'
import { formatCurrency } from '@/lib/utils/formatters'
import { BotaoDoKit } from './BotaoDoKit'

interface CombosSectionProps {
  combos: ComboDeProduto[]
}

/**
 * Combos: o mesmo produto em 2 ou 3 sacos, com o desconto por quantidade.
 * Uma linha por produto, com as duas opções lado a lado para comparar.
 */
export function CombosSection({ combos }: CombosSectionProps) {
  if (combos.length === 0) return null

  return (
    <section id="combos" aria-labelledby="titulo-combos" className="scroll-mt-32 bg-bg-surface">
      <div className="container-main py-14 md:py-20">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Combos</p>
          <h2 id="titulo-combos" className="mt-2 font-heading text-2xl font-bold text-txt-primary md:text-4xl">
            Gramado grande? Leve 2 ou 3 sacos
          </h2>
          <p className="mt-3 text-base leading-relaxed text-txt-secondary">
            Quanto mais sacos do mesmo produto, menor o preço de cada um. O desconto entra sozinho no carrinho.
          </p>
        </div>

        <ul className="mx-auto max-w-5xl space-y-4">
          {combos.map((combo) => (
            <li
              key={combo.handle}
              className="rounded-3xl border border-border-subtle bg-bg-primary p-4 sm:p-6 md:grid md:grid-cols-[220px,1fr] md:items-center md:gap-6"
            >
              <div className="flex items-center gap-4 md:flex-col md:text-center">
                {combo.imagem && (
                  <Image
                    src={combo.imagem.url}
                    alt={`Saco de ${combo.nome}`}
                    width={combo.imagem.width}
                    height={combo.imagem.height}
                    sizes="140px"
                    className="h-28 w-auto object-contain drop-shadow-xl md:h-40"
                  />
                )}
                <div>
                  <h3 className="font-heading text-xl font-bold text-txt-primary">{combo.nome}</h3>
                  <p className="text-sm text-txt-secondary">{combo.papel}</p>
                  <p className="mt-1 text-xs text-txt-muted">
                    1 saco: {formatCurrency(combo.precoUnitario)}, rende até {combo.m2PorSaco} m²
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 md:mt-0">
                {combo.opcoes.map((opcao) => (
                  <div
                    key={opcao.quantidade}
                    className="flex flex-col rounded-2xl border border-border-subtle bg-bg-surface p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-heading text-lg font-bold text-txt-primary">{opcao.quantidade} sacos</p>
                      <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-forest-ink">
                        -{opcao.percentual}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-txt-secondary">
                      Até {opcao.quantidade * combo.m2PorSaco} m² em uma aplicação
                    </p>

                    <p className="mt-3 font-heading text-2xl font-bold leading-none text-forest">
                      {formatCurrency(opcao.precoComDesconto)}
                    </p>
                    <p className="mt-1 text-xs text-txt-muted">
                      <span className="line-through">{formatCurrency(opcao.precoCheio)}</span>
                      {' · '}
                      {formatCurrency(opcao.precoComDesconto / opcao.quantidade)} cada
                    </p>
                    {frasePix(opcao.precoComDesconto) && (
                      <p className="mt-0.5 text-xs font-semibold text-forest">{frasePix(opcao.precoComDesconto)}</p>
                    )}

                    <BotaoDoKit
                      itens={[{ variantId: combo.variantId, quantidade: opcao.quantidade }]}
                      texto="Adicionar"
                      className="mt-4 min-h-[46px] rounded-xl px-3 text-sm"
                    />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
