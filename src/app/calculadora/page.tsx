import type { Metadata } from 'next'
import { createMetadata, howToSchema, breadcrumbSchema } from '@/lib/seo/metadata'
import { CalculatorWizard } from '@/components/calculator/CalculatorWizard'
import { CalculatorProvider } from '@/contexts/CalculatorContext'
import { CatalogoProvider } from '@/contexts/CatalogoContext'
import { getCatalogo } from '@/lib/shopify/catalogo'
import { REVALIDATE } from '@/lib/utils/constants'

export const metadata: Metadata = createMetadata({
  title: 'Calculadora — Plano Terravik para o seu Gramado',
  description:
    'Responda 7 perguntas rápidas e receba a dose certa de fertilizante por m², sem tentativa e erro. Plano personalizado para o seu gramado.',
  path: '/calculadora',
})

export const revalidate = REVALIDATE.products

export default async function CalculadoraPage() {
  // O catálogo é resolvido aqui: o resultado da calculadora precisa das
  // variantes reais para o carrinho aceitar.
  const produtos = await getCatalogo('calculadora')

  return (
    <>
      {/* JSON-LD: HowTo + Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Calculadora', url: '/calculadora' },
            ])
          ),
        }}
      />

      <CatalogoProvider produtos={produtos}>
        <CalculatorProvider>
          <CalculatorWizard />
        </CalculatorProvider>
      </CatalogoProvider>
    </>
  )
}
