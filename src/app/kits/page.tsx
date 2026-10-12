import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createMetadata, breadcrumbSchema, jsonLd } from '@/lib/seo/metadata'
import { getCatalogo } from '@/lib/shopify/catalogo'
import { montarCombos, montarKits } from '@/lib/promocoes/kits'
import { FAIXAS_DE_QUANTIDADE } from '@/lib/promocoes/regras'
import { KitsExplorer } from '@/components/kits/KitsExplorer'
import { CombosSection } from '@/components/kits/CombosSection'

export const metadata: Metadata = createMetadata({
  title: 'Kits de Fertilizantes para Gramado',
  description:
    'Kits e combos Terravik com desconto: plantio, recuperação do gramado amarelado, manutenção por seis meses, kit completo e combos de 2 ou 3 sacos.',
  path: '/kits',
})

// Literal de propósito: o Next 15 só aceita valor escrito direto aqui.
// É o mesmo de REVALIDATE.products (src/lib/utils/constants.ts).
export const revalidate = 60

export default async function KitsPage() {
  const catalogo = await getCatalogo('kits')
  const kits = montarKits(catalogo)
  const combos = montarCombos(catalogo)
  const [faixaMaior, faixaMenor] = FAIXAS_DE_QUANTIDADE

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Kits', url: '/kits' },
            ])
          ),
        }}
      />

      {kits.length > 0 ? (
        <KitsExplorer kits={kits} titulo="h1" />
      ) : (
        <section className="container-main py-24 text-center">
          <h1 className="font-heading text-3xl font-bold text-txt-primary">Kits Terravik</h1>
          <p className="mt-3 text-txt-secondary">Os kits estão indisponíveis no momento.</p>
        </section>
      )}

      <CombosSection combos={combos} />

      <section aria-labelledby="titulo-como-funciona" className="bg-bg-primary">
        <div className="container-main py-14 md:py-20">
          <h2 id="titulo-como-funciona" className="text-center font-heading text-2xl font-bold text-txt-primary md:text-3xl">
            Como o desconto funciona
          </h2>
          <ul className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-3">
            {[
              {
                titulo: 'Entra sozinho no carrinho',
                texto: 'Adicione os produtos do kit e o desconto aparece como uma linha no carrinho. Não precisa de cupom.',
              },
              {
                titulo: 'Vale também por quantidade',
                texto: `${faixaMenor.minimo} sacos do mesmo produto têm ${faixaMenor.percentual}% de desconto. Com ${faixaMaior.minimo} ou mais, ${faixaMaior.percentual}%.`,
              },
              {
                titulo: 'Um produto de cada vez',
                texto: 'Aplique na ordem da linha do tempo da embalagem e não some as doses no mesmo dia. Regue logo depois.',
              },
            ].map((item) => (
              <li key={item.titulo} className="rounded-2xl border border-border-subtle bg-bg-surface p-5">
                <h3 className="font-heading text-lg font-bold text-txt-primary">{item.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-txt-secondary">{item.texto}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 text-center">
            <Link
              href="/produtos"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-forest px-7 text-sm font-semibold text-forest transition-colors hover:bg-forest/5"
            >
              Ver os produtos separados
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
