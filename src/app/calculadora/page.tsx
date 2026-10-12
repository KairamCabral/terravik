import type { Metadata } from 'next'
import { createMetadata, howToSchema, breadcrumbSchema, jsonLd } from '@/lib/seo/metadata'
import { CalculatorWizard } from '@/components/calculator/CalculatorWizard'
import { CalculatorProvider } from '@/contexts/CalculatorContext'
import { CatalogoProvider } from '@/contexts/CatalogoContext'
import { getCatalogo } from '@/lib/shopify/catalogo'
import { analiseConfigurada } from '@/lib/calculator/foto/analisar'
import { cotaConfigurada } from '@/lib/calculator/foto/cota'

export const metadata: Metadata = createMetadata({
  title: 'Calculadora: Plano Terravik para o seu Gramado',
  description:
    'Responda 8 perguntas rápidas e receba quantos sacos e dosadores o seu gramado pede, com a dose do rótulo. Plano personalizado para a sua área.',
  path: '/calculadora',
})

// Literal de propósito: o Next 15 só aceita valor escrito direto aqui.
// É o mesmo de REVALIDATE.products (src/lib/utils/constants.ts).
export const revalidate = 60

export default async function CalculadoraPage() {
  // O catálogo é resolvido aqui: o resultado da calculadora precisa das
  // variantes reais para o carrinho aceitar.
  const produtos = await getCatalogo('calculadora')
  // O caminho da foto só aparece com a chave da IA e a cota configuradas.
  const fotoDisponivel = analiseConfigurada() && cotaConfigurada()

  return (
    <>
      {/* JSON-LD: HowTo + Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(howToSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Calculadora', url: '/calculadora' },
            ])
          ),
        }}
      />

      <CatalogoProvider produtos={produtos}>
        <CalculatorProvider>
          <CalculatorWizard fotoDisponivel={fotoDisponivel} />
        </CalculatorProvider>
      </CatalogoProvider>
    </>
  )
}
