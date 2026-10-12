import Image from 'next/image'
import { Plus } from 'lucide-react'
import type { Product } from '@/types/product'
import { kitsDoProduto, montarKits, sacosDoKit, type KitMontado } from '@/lib/promocoes/kits'
import { frasePix } from '@/lib/pagamento/pix'
import { formatCurrency } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'
import { BotaoDoKit } from './BotaoDoKit'

interface KitsDoProdutoProps {
  /** O produto da página. */
  produto: Product
  /** Catálogo inteiro, para montar os kits. */
  catalogo: Product[]
}

/**
 * Kits que levam o produto da página.
 *
 * O argumento é o custo de completar: "por mais R$ X você leva também Y".
 * A conta é o preço do kit menos o preço deste produto sozinho, sem enfeite.
 */
export function KitsDoProduto({ produto, catalogo }: KitsDoProdutoProps) {
  const kits = kitsDoProduto(montarKits(catalogo), produto.handle)
  const precoDeste = produto.variants.find((v) => v.available && v.price > 0)?.price
  if (kits.length === 0 || !precoDeste) return null

  // O de maior desconto ganha o destaque.
  const maior = kits.reduce((a, b) => (b.percentual > a.percentual ? b : a))

  return (
    <section aria-labelledby="titulo-kits-do-produto" className="border-y border-border-subtle bg-bg-surface">
      <div className="container-main py-12 md:py-16">
        <div className="mb-6 md:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-ink">Leve em kit</p>
          <h2 id="titulo-kits-do-produto" className="mt-2 font-heading text-2xl font-bold text-txt-primary md:text-4xl">
            {produto.title} rende mais acompanhado
          </h2>
          <p className="mt-2 max-w-2xl text-base text-txt-secondary">
            Cada produto cuida de um momento do gramado. Juntos, saem mais em conta.
          </p>
        </div>

        <ul className="scrollbar-hide -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
          {kits.map((kit) => (
            <li key={kit.id} className="w-[84%] flex-shrink-0 snap-start sm:w-[58%] lg:w-auto">
              <CartaoDoKit kit={kit} handleDaPagina={produto.handle} precoDeste={precoDeste} destaque={kit === maior && kits.length > 1} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CartaoDoKit({
  kit,
  handleDaPagina,
  precoDeste,
  destaque,
}: {
  kit: KitMontado
  handleDaPagina: string
  precoDeste: number
  destaque: boolean
}) {
  const outros = kit.itens.filter((i) => i.handle !== handleDaPagina)
  const mesmoProduto = outros.length === 0
  const total = kit.itens.reduce((s, i) => s + i.quantidade, 0)
  // Quanto custa completar o kit, em cima do que a pessoa já ia pagar.
  const aMais = Math.round((kit.precoComDesconto - precoDeste) * 100) / 100
  const pix = frasePix(kit.precoComDesconto)
  const nomes = outros.map((i) => i.nome)
  const lista = nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}` : nomes[0]

  return (
    <article
      className={cn(
        'relative flex h-full flex-col rounded-3xl border bg-bg-primary p-5 sm:p-6',
        destaque ? 'border-gold shadow-[0_18px_50px_-28px_rgba(179,139,37,0.7)]' : 'border-border-subtle'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading text-lg font-bold text-txt-primary">{kit.nome}</h3>
        <span
          className={cn(
            'flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-bold',
            destaque ? 'bg-gold text-forest-ink' : 'bg-forest/10 text-forest'
          )}
        >
          {kit.percentual}% OFF{destaque ? ' · maior desconto' : ''}
        </span>
      </div>

      {/* Este produto + o que entra junto */}
      <div className="mt-4 flex items-end justify-center gap-1.5 rounded-2xl bg-bg-surface-2 px-3 pb-3 pt-5">
        {sacosDoKit(kit).map((item, indice, sacos) => (
          <div key={`${item.handle}-${indice}`} className="flex items-center gap-1.5">
            {indice > 0 && <Plus className="h-4 w-4 flex-shrink-0 text-gold-ink" aria-hidden="true" />}
            <div className="relative flex flex-col items-center">
              {item.imagem && (
                <Image
                  src={item.imagem.url}
                  alt=""
                  width={item.imagem.width}
                  height={item.imagem.height}
                  sizes="96px"
                  className={cn('h-auto drop-shadow-lg', sacos.length === 3 ? 'w-[68px]' : 'w-20')}
                />
              )}
              <span
                className={cn(
                  'mt-2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  item.handle === handleDaPagina ? 'bg-forest text-white' : 'bg-bg-surface text-txt-secondary',
                  // Sacos repetidos do mesmo produto: a etiqueta aparece só no primeiro.
                  sacos.findIndex((s) => s.handle === item.handle) !== indice && 'invisible'
                )}
                aria-hidden={sacos.findIndex((s) => s.handle === item.handle) !== indice}
              >
                {item.handle === handleDaPagina ? 'Este produto' : item.papel}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-txt-secondary">{kit.titulo}.</p>

      <p className="mt-3 rounded-xl bg-gold-soft px-3 py-2.5 text-sm font-medium leading-snug text-txt-primary">
        {mesmoProduto ? (
          <>
            {total} sacos por <strong>{formatCurrency(kit.precoComDesconto / total)}</strong> cada, em vez de{' '}
            {formatCurrency(precoDeste)}.
          </>
        ) : (
          <>
            Por mais <strong>{formatCurrency(aMais)}</strong> você leva também {lista}.
          </>
        )}
      </p>

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <p className="font-heading text-2xl font-bold text-forest">{formatCurrency(kit.precoComDesconto)}</p>
          <p className="text-sm text-txt-muted line-through">
            <span className="sr-only">Separados custam </span>
            {formatCurrency(kit.precoCheio)}
          </p>
        </div>
        <p className="text-xs text-txt-secondary">
          {pix && <span className="font-semibold text-forest">{pix}</span>}
          {pix && ' · '}economia de {formatCurrency(kit.economia)}
        </p>
        <BotaoDoKit
          itens={kit.itens.map((i) => ({ variantId: i.variantId, quantidade: i.quantidade }))}
          texto="Adicionar o kit"
          className="mt-4"
        />
      </div>
    </article>
  )
}
