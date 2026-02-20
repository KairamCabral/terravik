import type { Metadata } from 'next'
import { createMetadata, howToSchema, breadcrumbSchema } from '@/lib/seo/metadata'
import { CalculatorWizard } from '@/components/calculator/CalculatorWizard'
import { CalculatorProvider } from '@/contexts/CalculatorContext'

export const metadata: Metadata = createMetadata({
  title: 'Calculadora — Plano Terravik para o seu Gramado',
  description:
    'Responda 7 perguntas rápidas e receba a dose certa de fertilizante por m², sem tentativa e erro. Plano personalizado para o seu gramado.',
  path: '/calculadora',
})

export default function CalculadoraPage() {
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

      <CalculatorProvider>
        <CalculatorWizard />
      </CalculatorProvider>
    </>
  )
}
