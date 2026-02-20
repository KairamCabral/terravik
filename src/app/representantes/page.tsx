import type { Metadata } from 'next'
import { createMetadata, breadcrumbSchema } from '@/lib/seo/metadata'
import { Container } from '@/components/ui'
import { FindRepresentative, RepresentativeForm } from '@/components/representatives'
import { TrendingUp, Award, Handshake } from 'lucide-react'

export const metadata: Metadata = createMetadata({
  title: 'Representantes',
  description:
    'Encontre um representante comercial Terravik na sua região ou cadastre-se para representar a marca.',
  path: '/representantes',
})

export default function RepresentantesPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Produto com demanda crescente',
      description: 'Mercado de gramados residenciais em expansão.',
    },
    {
      icon: Award,
      title: 'Marca premium com margem saudável',
      description: 'Produto diferenciado com valor agregado.',
    },
    {
      icon: Handshake,
      title: 'Suporte de marketing',
      description: 'Material de venda e apoio da equipe Terravik.',
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Representantes', url: '/representantes' },
            ])
          ),
        }}
      />

      {/* Hero */}
      <section className="bg-terravik-cream py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-terravik-brown md:text-5xl">
              Representantes Terravik
            </h1>
            <p className="mt-4 text-lg text-terravik-brown/70">
              Encontre um representante na sua região ou torne-se um
              representante Terravik.
            </p>
          </div>
        </Container>
      </section>

      {/* 2 Colunas */}
      <Container spacing="lg">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border-2 border-terravik-brown/10 bg-white p-8">
            <FindRepresentative />
          </div>

          <div className="rounded-2xl border-2 border-terravik-gold/20 bg-white p-8">
            <RepresentativeForm />
          </div>
        </div>
      </Container>

      {/* Por que representar */}
      <section className="bg-terravik-cream-50 py-16">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-terravik-brown md:text-4xl">
              Por que representar a Terravik?
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border-2 border-terravik-brown/10 bg-white p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terravik-green/10">
                    <Icon className="h-6 w-6 text-terravik-green" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-bold text-terravik-brown">
                    {benefit.title}
                  </h3>
                  <p className="text-terravik-brown/70">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>
    </>
  )
}
