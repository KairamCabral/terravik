import type { Metadata } from 'next'
import { createMetadata, faqSchema, jsonLd } from '@/lib/seo/metadata'
import { FAQ_HOME } from '@/lib/faq/home'
import { BannerSection } from '@/components/home/BannerSection'
import { VideoSection } from '@/components/home/VideoSection'
import { ProductsShowcase } from '@/components/home/ProductsShowcase'
import { CalculatorCTA } from '@/components/home/CalculatorCTA'
import { InfluencersSection } from '@/components/home/InfluencersSection'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { AcademiaCTA } from '@/components/home/AcademiaCTA'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { StoreLocationsSection } from '@/components/home/StoreLocationsSection'
import { FAQSection } from '@/components/home/FAQSection'
import { getCatalogo } from '@/lib/shopify/catalogo'
import { REVALIDATE } from '@/lib/utils/constants'

export const metadata: Metadata = createMetadata({
  title: 'Terravik — Fertilizantes Premium para Gramados',
  description:
    'Dose certa, resultado visível. Conheça os fertilizantes Terravik para implantação, crescimento e proteção do seu gramado residencial.',
  path: '',
})

export const revalidate = REVALIDATE.products

export default async function HomePage() {
  const produtos = await getCatalogo('home')

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
      <VideoSection />
      <ProductsShowcase produtos={produtos} />
      <CalculatorCTA />
      <InfluencersSection />
      <BenefitsSection />
      <AcademiaCTA />
      <TestimonialsSection />
      <StoreLocationsSection />
      <FAQSection />
    </>
  )
}
