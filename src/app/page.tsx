import type { Metadata } from 'next'
import { createMetadata, faqSchema, jsonLd } from '@/lib/seo/metadata'
import { FAQ_HOME } from '@/lib/faq/home'
import { BannerSection } from '@/components/home/BannerSection'
import { VideoSection } from '@/components/home/VideoSection'
import { ProductsShowcase } from '@/components/home/ProductsShowcase'
import { ObjetivosSection } from '@/components/home/ObjetivosSection'
import { KitsExplorer } from '@/components/kits/KitsExplorer'
import { montarKits } from '@/lib/promocoes/kits'
import { ComparativoSection } from '@/components/home/ComparativoSection'
import { CalculatorCTA } from '@/components/home/CalculatorCTA'
import { InfluencersSection } from '@/components/home/InfluencersSection'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { StoreLocationsSection } from '@/components/home/StoreLocationsSection'
import { FAQSection } from '@/components/home/FAQSection'
import { getCatalogo } from '@/lib/shopify/catalogo'
import { analiseConfigurada } from '@/lib/calculator/foto/analisar'
import { cotaConfigurada } from '@/lib/calculator/foto/cota'

export const metadata: Metadata = createMetadata({
  title: 'Terravik: Fertilizantes Premium para Gramados',
  description:
    'Dose certa, resultado visível. Conheça os fertilizantes Terravik para firmar a raiz, devolver a cor e manter forte o seu gramado residencial.',
  path: '',
})

// Literal de propósito: o Next 15 só aceita valor escrito direto aqui.
// É o mesmo de REVALIDATE.products (src/lib/utils/constants.ts).
export const revalidate = 60

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

      {/* A home abre num banner de imagem: o título da página fica para leitor
          de tela e buscador. */}
      <h1 className="sr-only">Terravik: fertilizantes para gramado residencial</h1>
      <BannerSection />
      <ObjetivosSection />
      <VideoSection />
      <ProductsShowcase produtos={produtos} />
      <KitsExplorer kits={montarKits(produtos)} />
      <ComparativoSection />
      <CalculatorCTA fotoDisponivel={fotoDisponivel} />
      <InfluencersSection />
      <BenefitsSection />
      <TestimonialsSection />
      <StoreLocationsSection />
      <FAQSection />
    </>
  )
}
