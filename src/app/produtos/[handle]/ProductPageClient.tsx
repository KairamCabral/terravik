'use client'

import { useState, useEffect, useRef } from 'react'
import type { Product, ProductVariant } from '@/types/product'
import { ProductGallery, PurchaseSection } from '@/components/product'
import { Check, Truck } from 'lucide-react'
import { rotuloDaTag } from '@/lib/produtos/tags'
import { fraseDoFreteGratis } from '@/lib/shipping/config'

/**
 * Primeira dobra da página de produto: galeria, identificação e compra.
 *
 * O resto da página (promessa, vídeo, rendimento, como usar, ficha técnica,
 * perguntas) é o ProductLp, componente de servidor renderizado pelo page.tsx
 * logo abaixo. Aqui fica só o que precisa de estado: variante escolhida,
 * quantidade, modo de compra e a barra fixa do celular.
 */

interface ProductPageClientProps {
  product: Product
  /** Frase de identificação ("Vai plantar ou reformar o gramado? ..."). */
  paraQuem?: string
  /** Fatos curtos do rótulo, em selos ("Rende até 32 m²", "Dosador incluso"). */
  fatos?: string[]
}

export function ProductPageClient({ product, paraQuem, fatos = [] }: ProductPageClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  )
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)

  // ?variant= na URL: lido depois do mount (a página é estática e não conhece
  // a query no servidor) e regravado a cada troca, para o link ser compartilhável.
  useEffect(() => {
    const pedido = new URLSearchParams(window.location.search).get('variant')
    if (!pedido) return
    const variante = product.variants.find(
      (v) => v.id === pedido || v.id.split('/').pop() === pedido
    )
    if (variante) setSelectedVariant(variante)
  }, [product.variants])

  const trocarVariante = (variante: ProductVariant) => {
    setSelectedVariant(variante)
    const url = new URL(window.location.href)
    url.searchParams.set('variant', variante.id.split('/').pop() || variante.id)
    window.history.replaceState(window.history.state, '', url)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCTA(!entry.isIntersecting)
      },
      { threshold: 0 }
    )
    if (ctaRef.current) observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [])

  const freteGratis = fraseDoFreteGratis()

  return (
    <div className="bg-bg-primary">
      <section className="container-main py-6 md:py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14 lg:items-start">
          {/* Galeria (acompanha a rolagem no desktop) */}
          <div className="min-h-0 lg:sticky lg:top-[120px] lg:self-start">
            <ProductGallery
              title={product.title}
              images={product.images}
              imagemDaVariante={selectedVariant.image?.url}
              badge={product.tags.includes('novo') ? rotuloDaTag('novo') : undefined}
            />
          </div>

          {/* Identificação e compra */}
          <div className="lg:sticky lg:top-[120px] lg:self-start">
            <div className="space-y-5">
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-forest/15 bg-forest/5 px-3 py-1 text-xs font-medium text-forest"
                    >
                      {rotuloDaTag(tag)}
                    </span>
                  ))}
                </div>
              )}

              <div>
                <h1 className="font-heading text-3xl font-bold tracking-tight text-txt-primary md:text-5xl">
                  {product.title}
                </h1>
                <p className="mt-1 text-sm font-medium uppercase tracking-wider text-gold-ink">
                  Fertilizante para gramado residencial
                </p>
              </div>

              {paraQuem && (
                <p className="text-lg leading-relaxed text-txt-primary">{paraQuem}</p>
              )}

              {product.description && (
                <p className="text-base leading-relaxed text-txt-secondary">{product.description}</p>
              )}

              {fatos.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {fatos.map((fato) => (
                    <li
                      key={fato}
                      className="flex items-center gap-1.5 rounded-full bg-bg-surface-2 px-3 py-1.5 text-xs font-semibold text-txt-primary"
                    >
                      <Check className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
                      {fato}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap items-center gap-4">
                {selectedVariant.available ? (
                  <p className="flex items-center gap-2 text-sm font-medium text-forest">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest opacity-75 motion-reduce:animate-none" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-forest" />
                    </span>
                    Em estoque
                  </p>
                ) : (
                  <p className="flex items-center gap-2 text-sm font-medium text-error">
                    <span className="h-2 w-2 rounded-full bg-error" aria-hidden="true" />
                    Esgotado
                  </p>
                )}
                {freteGratis && (
                  <p className="flex items-center gap-1.5 text-xs text-txt-secondary">
                    <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                    {freteGratis}
                  </p>
                )}
              </div>

              {/* Compra. O id é o destino dos botões "Comprar" do resto da página. */}
              <div
                id="comprar"
                ref={ctaRef}
                className="scroll-mt-32 border-t border-border-subtle pt-5"
              >
                <PurchaseSection
                  product={product}
                  selectedVariant={selectedVariant}
                  onVariantChange={trocarVariante}
                  barraFixaVisivel={showStickyCTA}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
