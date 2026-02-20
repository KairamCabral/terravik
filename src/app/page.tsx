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

export const metadata: Metadata = createMetadata({
  title: 'Terravik — Fertilizantes Premium para Gramados',
  description:
    'Dose certa, resultado visível. Conheça os fertilizantes Terravik para implantação, crescimento e proteção do seu gramado residencial.',
  path: '',
})

export default function HomePage() {
  return (
    <>
      <BannerSection />
      <VideoSection />
      <ProductsShowcase />
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
