import type { Metadata } from 'next'
import { createMetadata, faqSchema, jsonLd } from '@/lib/seo/metadata'
import { FAQ_HOME } from '@/lib/faq/home'
import { BannerSection } from '@/components/home/BannerSection'
import { VideoSection } from '@/components/home/VideoSection'
import { ProductsShowcase } from '@/components/home/ProductsShowcase'
import { ObjetivosSection } from '@/components/home/ObjetivosSection'
import { KitSection } from '@/components/home/KitSection'
import { ComparativoSection } from '@/components/home/ComparativoSection'
import { CalculatorCTA } from '@/components/home/CalculatorCTA'
import { InfluencersSection } from '@/components/home/InfluencersSection'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { AcademiaCTA } from '@/components/home/AcademiaCTA'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { StoreLocationsSection } from '@/components/home/StoreLocationsSection'
import { FAQSection } from '@/components/home/FAQSection'
import { getCatalogo } from '@/lib/shopify/catalogo'
import { REVALIDATE } from '@/lib/utils/constants'
import { analiseConfigurada } from '@/lib/calculator/foto/analisar'
import { cotaConfigurada } from '@/lib/calculator/foto/cota'

export const metadata: Metadata = createMetadata({
  title: 'Terravik: Fertilizantes Premium para Gramados',
  description:
    'Dose certa, resultado visível. Conheça os fertilizantes Terravik para firmar a raiz, devolver a cor e manter forte o seu gramado residencial.',
  path: '',
})

export const revalidate = REVALIDATE.products

export default async function HomePage() {
  const produtos = await getCatalogo('home')
  // A chamada da calculadora só fala em foto quando a análise está ligada.
  const fotoDisponivel = analiseConfigurada() && cotaConfigurada()

  return (
    <>
      {/* FAQPage das perguntas da home. Sai daqui, do servidor, porque a
          FAQSection é client component e o rastreador precisa do bloco no HTML
          inicial. As duas leem a MESMA lista (src/lib/faq/home.ts). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            faqSchema(FAQ_HOME.map((f) => ({ question: f.pergunta, answer: f.resposta })))
          ),
        }}
      />

      <BannerSection />
      <ObjetivosSection />
      <VideoSection />
      <ProductsShowcase produtos={produtos} />
      <KitSection produtos={produtos} />
      <ComparativoSection />
      <CalculatorCTA fotoDisponivel={fotoDisponivel} />
      <InfluencersSection />
      <BenefitsSection />
      <AcademiaCTA />
      <TestimonialsSection />
      <StoreLocationsSection />
      <FAQSection />
    </>
  )
}
