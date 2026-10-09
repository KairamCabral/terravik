import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'
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
