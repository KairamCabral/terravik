'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product, ProductVariant, Review } from '@/types/product'
import {
  ProductGallery,
  ProductReviews,
  PurchaseSection,
  QualityBar,
} from '@/components/product'
import {
  Check,
  Calculator,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Truck,
  Award,
  Sparkles,
  Users,
  Leaf,
  Target,
  Eye,
  Droplets,
  Timer,
  Package,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency } from '@/lib/utils/formatters'
import { StarRating } from '@/components/product/StarRating'

interface ProductPageClientProps {
  product: Product
  reviews: Review[]
  rating: { average: number; count: number }
}

const TAG_LABELS: Record<string, string> = {
  implantacao: 'Implantação',
  crescimento: 'Crescimento',
  resistencia: 'Proteção',
  protecao: 'Resistência',
  novo: 'Lançamento',
  verde: 'Verde Intenso',
}

/** URLs de vídeo por produto (YouTube, Vimeo ou MP4). Substitua pelos vídeos reais. */
const PRODUCT_VIDEOS: Record<string, string> = {
  'verde-rapido': 'https://www.youtube.com/watch?v=bjSMskOK6zg',
  'gramado-novo': 'https://www.youtube.com/watch?v=bjSMskOK6zg',
  'resistencia-total': 'https://www.youtube.com/watch?v=bjSMskOK6zg',
}

export function ProductPageClient({ product, reviews, rating }: ProductPageClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  )
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)

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

  const topReview = reviews.find((r) => r.verified && r.rating >= 4)

  return (
    <div className="bg-bg-primary">
      {/* ═══ ABOVE THE FOLD — Galeria + Info ═══ */}
      <section className="container-main py-6 md:py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14 lg:items-start">
          {/* ── Coluna Esquerda: Galeria (sticky — acompanha a nav até o fim da seção) ── */}
          <div className="min-h-0 lg:sticky lg:top-[120px] lg:self-start">
            <ProductGallery
              images={product.images}
              badge={product.tags.includes('novo') ? 'Lançamento' : undefined}
              videoUrl={PRODUCT_VIDEOS[product.handle]}
            />
          </div>

          {/* ── Coluna Direita: Info + Purchase (sticky, acompanha nav até fim da seção) ── */}
          <div className="lg:sticky lg:top-[120px] lg:self-start">
            <div className="space-y-5">
              {/* Tags humanizadas */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-forest/15 bg-forest/5 px-3 py-1 text-xs font-medium text-forest"
                    >
                      {TAG_LABELS[tag] || tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Título */}
              <h1 className="font-heading text-3xl font-bold tracking-tight text-txt-primary md:text-4xl">
                {product.title}
              </h1>

              {/* Rating + Social Proof inline */}
              {rating.count > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={rating.average} size="sm" />
                    <span className="text-sm font-semibold text-txt-primary">
                      {rating.average.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-txt-muted">
                    ({rating.count} {rating.count !== 1 ? 'avaliações' : 'avaliação'})
                  </span>
                  <span className="hidden items-center gap-1 text-xs text-forest sm:flex">
                    <Users className="h-3 w-3" />
                    2.847 famílias confiam
                  </span>
                </div>
              )}

              {/* Disponibilidade (compacto) */}
              <div className="flex flex-wrap items-center gap-4">
                {product.available ? (
                  <p className="flex items-center gap-2 text-sm font-medium text-forest">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-forest" />
                    </span>
                    Em estoque — pronta entrega
                  </p>
                ) : (
                  <p className="flex items-center gap-2 text-sm font-medium text-error">
                    <span className="h-2 w-2 rounded-full bg-error" />
                    Esgotado
                  </p>
                )}
                <p className="flex items-center gap-1.5 text-xs text-txt-muted">
                  <Truck className="h-3.5 w-3.5" />
                  Frete grátis acima de R$ 149
                </p>
              </div>

              {/* ── Seção de Compra (prioridade, acima da dobra) ── */}
              <div ref={ctaRef} className="border-t border-border-subtle pt-5">
                <PurchaseSection
                  product={product}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />
              </div>

              {/* Descrição (abaixo da compra) */}
              {product.descriptionHtml && (
                <div
                  className="prose prose-sm max-w-none text-txt-secondary prose-strong:text-txt-primary prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              )}

              {/* Quality Bar premium */}
              <QualityBar />

              {/* Micro-review */}
              {topReview && (
                <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-sm font-bold text-forest">
                      {topReview.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-txt-primary">{topReview.author}</span>
                        {topReview.verified && (
                          <span className="flex items-center gap-0.5 text-[10px] font-medium text-forest">
                            <Check className="h-3 w-3" />
                            Verificado
                          </span>
                        )}
                      </div>
                      <StarRating rating={topReview.rating} size="sm" />
                      <p className="mt-1 text-sm leading-relaxed text-txt-secondary line-clamp-2">
                        &ldquo;{topReview.comment}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Secundário: Calculadora */}
              <div className="rounded-xl border border-border-subtle bg-forest/3 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest/10">
                    <Calculator className="h-5 w-5 text-forest" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-txt-primary">Não sabe a dose certa?</p>
                    <p className="text-xs text-txt-muted">Calcule em 2 minutos</p>
                  </div>
                  <Link
                    href="/calculadora"
                    className="flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
                  >
                    Calcular
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEÇÕES EDITORIAIS BELOW THE FOLD ═══ */}
      <div className="border-t border-border-subtle bg-bg-surface">
        <div className="container-main space-y-0">
          {/* ── O que resolve ── */}
          <EditorialSection
            title="Problemas que resolve"
            subtitle="Resultados comprovados por milhares de clientes"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {getProductBenefits(product.handle).map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 rounded-xl border border-border-subtle bg-white p-5 transition-all hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest/8">
                    <item.icon className="h-5 w-5 text-forest" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-txt-primary">{item.text}</h4>
                    <p className="mt-1 text-xs text-txt-muted">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </EditorialSection>

          {/* ── Como usar (3 passos) ── */}
          <EditorialSection
            title="Como usar"
            subtitle="Simples, rápido e sem complicação"
          >
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  step: '1',
                  icon: Target,
                  title: 'Meça a área',
                  desc: 'Use a calculadora para saber o tamanho do gramado em m².',
                },
                {
                  step: '2',
                  icon: Package,
                  title: 'Aplique a dose',
                  desc: 'Distribua uniformemente com espalhador ou a lanço.',
                },
                {
                  step: '3',
                  icon: Droplets,
                  title: 'Regue e acompanhe',
                  desc: 'Regue bem após aplicação. Resultado visível em dias.',
                },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative rounded-xl border border-border-subtle bg-white p-6 text-center"
                >
                  {/* Step number */}
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest text-white">
                    <s.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-heading text-base font-semibold text-txt-primary">
                    {s.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-txt-secondary">{s.desc}</p>

                  {/* Connector line */}
                  {i < 2 && (
                    <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-border-medium sm:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </EditorialSection>

          {/* ── Para quem é ── */}
          <EditorialSection
            title="Perfeito para você se..."
            subtitle="Identifique se este é o produto ideal"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {getProductAudience(product.handle).map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 rounded-lg border border-forest/10 bg-forest/3 p-4"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest">
                    <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm font-medium text-txt-primary">{item}</span>
                </motion.div>
              ))}
            </div>
          </EditorialSection>

          {/* ── Garantia ── */}
          <div className="border-t border-border-subtle py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl rounded-2xl border border-forest/15 bg-gradient-to-br from-forest/5 via-transparent to-gold/5 p-8 text-center md:p-10"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest/10">
                <ShieldCheck className="h-8 w-8 text-forest" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-xl font-bold text-txt-primary md:text-2xl">
                Garantia de Satisfação
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-txt-secondary">
                Se não ficar satisfeito com os resultados, devolvemos seu dinheiro.
                Sem burocracia, sem perguntas. Seu gramado merece o melhor.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
                {[
                  { icon: ShieldCheck, text: 'Garantia total' },
                  { icon: Timer, text: 'Resposta em 24h' },
                  { icon: Award, text: 'Qualidade premium' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-xs font-medium text-forest">
                    <item.icon className="h-4 w-4" strokeWidth={1.5} />
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── FAQ ── */}
          <ProductFAQ handle={product.handle} />

          {/* ── Reviews ── */}
          <div className="border-t border-border-subtle py-12 md:py-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-txt-primary md:text-3xl">
                  O que dizem nossos clientes
                </h2>
                {rating.count > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating rating={rating.average} size="md" />
                    <span className="text-sm font-semibold text-txt-primary">
                      {rating.average.toFixed(1)} de 5
                    </span>
                    <span className="text-sm text-txt-muted">
                      · {rating.count} {rating.count !== 1 ? 'avaliações' : 'avaliação'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <ProductReviews
              reviews={reviews}
              averageRating={rating.average}
              totalCount={rating.count}
            />
          </div>

          {/* ── CTA Final ── */}
          <div className="border-t border-border-subtle py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-lg text-center"
            >
              <h3 className="font-heading text-xl font-bold text-txt-primary md:text-2xl">
                Pronto para transformar seu gramado?
              </h3>
              <p className="mt-3 text-sm text-txt-secondary">
                Comece agora e veja os resultados em poucos dias.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-forest-ink hover:shadow-lg"
              >
                <Sparkles className="h-4 w-4" />
                Comprar agora
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══ STICKY CTA MOBILE ═══ */}
      <AnimatePresence>
        {showStickyCTA && product.available && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border-subtle bg-white/95 backdrop-blur-lg lg:hidden"
          >
            <div className="flex items-center gap-4 px-4 py-3">
              <div className="flex-1">
                <p className="text-xs text-txt-muted line-clamp-1">{product.title}</p>
                <p className="font-heading text-lg font-bold text-forest">
                  {formatCurrency(selectedVariant.price, product.currency)}
                </p>
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="shrink-0 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] hover:bg-forest-ink"
              >
                Comprar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════
   COMPONENTES AUXILIARES
   ═══════════════════════════════════════ */

function EditorialSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border-subtle py-12 md:py-16">
      <div className="mb-8">
        <h3 className="font-heading text-2xl font-bold text-txt-primary md:text-3xl">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-2 text-sm text-txt-muted">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  )
}

function ProductFAQ({ handle }: { handle: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = getProductFAQs(handle)

  return (
    <EditorialSection
      title="Perguntas frequentes"
      subtitle="Tire suas dúvidas antes de comprar"
    >
      <div className="mx-auto max-w-2xl space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border-subtle bg-white transition-shadow hover:shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-start justify-between gap-4 p-5 text-left"
              aria-expanded={openIndex === i}
            >
              <span className="text-sm font-semibold text-txt-primary">{faq.q}</span>
              <ChevronDown
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0 text-txt-muted transition-transform duration-200',
                  openIndex === i && 'rotate-180'
                )}
              />
            </button>
            <div
              className={cn(
                'grid transition-all duration-200',
                openIndex === i
                  ? 'grid-rows-[1fr] opacity-100'
                  : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-txt-secondary">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </EditorialSection>
  )
}

/* ═══════════════════════════════════════
   DADOS POR PRODUTO
   ═══════════════════════════════════════ */

function getProductBenefits(handle: string) {
  const benefits: Record<string, { icon: typeof Check; text: string; desc: string }[]> = {
    'gramado-novo': [
      { icon: Leaf, text: 'Enraizamento forte', desc: 'Fósforo alto para raízes profundas e firmes desde o início.' },
      { icon: Droplets, text: 'Pega mais rápido', desc: 'Tapetes e mudas se fixam com vigor, sem falhas.' },
      { icon: Target, text: 'Dose calculada', desc: 'Fórmula precisa para não desperdiçar produto.' },
      { icon: Eye, text: 'Verde desde o início', desc: 'Resultado visível nas primeiras semanas.' },
    ],
    'verde-rapido': [
      { icon: Leaf, text: 'Verde intenso em dias', desc: 'Alta carga de nitrogênio para resultado rápido e visível.' },
      { icon: Eye, text: 'Recupera gramado amarelado', desc: 'Devolve a cor intensa que você espera ver.' },
      { icon: Target, text: 'Crescimento acelerado', desc: 'Estimula crescimento para cobrir falhas rápido.' },
      { icon: Droplets, text: 'Enxofre incluso', desc: '24% de enxofre para saúde completa do gramado.' },
    ],
    'resistencia-total': [
      { icon: Leaf, text: 'Resiste ao calor intenso', desc: 'Potássio balanceado protege contra estresse térmico.' },
      { icon: Target, text: 'Suporta pisoteio', desc: 'Fortalece fibras para uso frequente do gramado.' },
      { icon: Eye, text: 'Proteção prolongada', desc: 'Grânulo único libera nutrientes de forma gradual.' },
      { icon: Droplets, text: 'Equilíbrio NPK', desc: 'Fórmula 19-4-19 balanceada para resistência.' },
    ],
  }
  return benefits[handle] || benefits['gramado-novo']
}

function getProductAudience(handle: string) {
  const audiences: Record<string, string[]> = {
    'gramado-novo': [
      'Está plantando gramado pela primeira vez',
      'Quer que o tapete pegue rápido e sem falhas',
      'Precisa de enraizamento forte desde o início',
      'Valoriza resultado confiável sem desperdício',
    ],
    'verde-rapido': [
      'Seu gramado está amarelado ou sem cor',
      'Quer resultado rápido e visível',
      'Precisa recuperar a beleza do gramado',
      'Busca crescimento acelerado para cobrir falhas',
    ],
    'resistencia-total': [
      'Gramado recebe sol e calor intenso',
      'Área com pisoteio frequente (crianças, pets)',
      'Quer proteção contra estresse climático',
      'Busca manutenção para gramado já estabelecido',
    ],
  }
  return audiences[handle] || audiences['gramado-novo']
}

function getProductFAQs(handle: string) {
  const common = [
    {
      q: 'Quanto rende cada embalagem?',
      a: 'O rendimento depende do tamanho da sua área. Use a calculadora para saber a dose exata e quantas embalagens você precisa.',
    },
    {
      q: 'Posso aplicar com pets no gramado?',
      a: 'Sim. Após aplicar, regue bem e aguarde 1–2 horas para absorção. Depois disso é seguro para pets e crianças.',
    },
    {
      q: 'Qual intervalo entre aplicações?',
      a: 'A calculadora gera um calendário personalizado com as datas ideais. Em geral, a cada 30–90 dias dependendo da necessidade.',
    },
  ]

  const specific: Record<string, { q: string; a: string }[]> = {
    'gramado-novo': [
      {
        q: 'Quando devo aplicar no gramado novo?',
        a: 'Aplique no momento do plantio dos tapetes ou mudas. Quanto antes aplicar, mais rápido o enraizamento.',
      },
    ],
    'verde-rapido': [
      {
        q: 'Em quanto tempo vejo o resultado?',
        a: 'Os primeiros sinais de verde aparecem em 7–14 dias. Resultado completo em 3–4 semanas.',
      },
    ],
    'resistencia-total': [
      {
        q: 'Funciona mesmo no calor intenso?',
        a: 'Sim. A fórmula 19-4-19 com potássio alto foi desenvolvida para proteger contra estresse térmico e seca.',
      },
    ],
  }

  return [...(specific[handle] || []), ...common]
}
