import type { Metadata } from 'next'
import { createMetadata, breadcrumbSchema, organizationSchema } from '@/lib/seo/metadata'
import { SobrePageClient } from './SobrePageClient'

export const metadata: Metadata = createMetadata({
  title: 'Sobre a Terravik',
  description:
    'Conheça a história da Terravik, nossos valores e o que nos torna diferentes no mercado de fertilizantes para gramados.',
  path: '/sobre',
})

export default function SobrePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Sobre', url: '/sobre' },
            ])
          ),
        }}
      />
      <SobrePageClient />
    </>
  )
}
