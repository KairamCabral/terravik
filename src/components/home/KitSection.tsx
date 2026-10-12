import Image from 'next/image'
import { Check } from 'lucide-react'
import type { Product } from '@/types/product'
import { KIT, FAIXAS_DE_QUANTIDADE, precoDoKit } from '@/lib/promocoes/regras'
import { frasePix } from '@/lib/pagamento/pix'
import { fraseParcelamento } from '@/lib/pagamento/parcelas'
import { formatCurrency } from '@/lib/utils/formatters'
import { BotaoDoKit } from './BotaoDoKit'

interface KitSectionProps {
  /** Catálogo resolvido no servidor. */
  produtos: Product[]
}

/**
 * Kit com os três produtos da linha do tempo, com desconto.
 *
 * O preço "de" é a soma real dos três produtos vendidos separados, não um
 * preço inventado. Sem os três disponíveis no catálogo, a seção não aparece.
 */
export function KitSection({ produtos }: KitSectionProps) {
  const itens = KIT.handles.map((handle) => {
    const produto = produtos.find((p) => p.handle === handle)
    const variante = produto?.variants.find((v) => v.available && v.price > 0)
    return produto && variante ? { produto, variante } : null
  })
  if (itens.some((i) => i === null)) return null
  const completos = itens as NonNullable<(typeof itens)[number]>[]

  const preco = precoDoKit(completos.map((i) => i.variante.price))
  const pix = frasePix(preco.comDesconto)
  const parcelas = fraseParcelamento(preco.comDesconto)
  const [faixaMaior, faixaMenor] = FAIXAS_DE_QUANTIDADE

  return (
    <section aria-labelledby="titulo-kit" className="bg-gradient-forest text-white">
      <div className="container-main py-12 md:py-20">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
          <div className="relative flex items-end justify-center gap-1 sm:gap-3">
            {completos.map(({ produto }, indice) => (
              <div key={produto.handle} className={indice === 1 ? 'relative z-10 w-[38%] max-w-[210px]' : 'w-[31%] max-w-[170px]'}>
                {produto.featuredImage && (
                  <Image
                    src={produto.featuredImage.url}
                    alt={`Saco de ${produto.title}`}
                    width={produto.featuredImage.width}
                    height={produto.featuredImage.height}
                    sizes="(max-width: 1024px) 34vw, 210px"
                    className="h-auto w-full drop-shadow-2xl"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="pt-8 lg:pt-0">
            <p className="inline-flex rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest-ink">
              {KIT.percentual}% de desconto
            </p>
            <h2 id="titulo-kit" className="mt-4 font-heading text-3xl font-bold leading-tight md:text-4xl">
              {KIT.nome}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/85">
              Os três produtos da linha do tempo do gramado: firmar a raiz, devolver a cor e manter forte o ano inteiro.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-white/90">
              {completos.map(({ produto }, indice) => (
                <li key={produto.handle} className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold">
                    {indice + 1}
                  </span>
                  1 saco de {produto.title}, 1,6 kg
                </li>
              ))}
              <li className="flex items-center gap-2.5">
                <Check className="ml-1 h-4 w-4 flex-shrink-0 text-gold-soft" aria-hidden="true" />
                <span className="ml-0.5">Dosador dentro de cada saco</span>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1">
              <p className="font-heading text-4xl font-bold leading-none">{formatCurrency(preco.comDesconto)}</p>
              <p className="text-sm text-white/70">
                <span className="sr-only">Os três separados custam </span>
                <span className="line-through">{formatCurrency(preco.cheio)}</span> separados
              </p>
            </div>
            <p className="mt-2 text-sm text-white/85">
              {pix && <strong className="font-semibold text-gold-soft">{pix}</strong>}
              {pix && parcelas && ' ou '}
              {parcelas}
            </p>
            <p className="mt-1 text-sm font-semibold text-gold-soft">Você economiza {formatCurrency(preco.economia)}</p>

            <BotaoDoKit
              itens={completos.map(({ variante }) => ({ variantId: variante.id }))}
              className="mt-6"
            />

            <p className="mt-4 text-xs leading-relaxed text-white/70">
              Precisa de mais de um saco do mesmo produto? {faixaMenor.minimo} sacos têm {faixaMenor.percentual}% de
              desconto e {faixaMaior.minimo} ou mais têm {faixaMaior.percentual}%, direto no carrinho.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
