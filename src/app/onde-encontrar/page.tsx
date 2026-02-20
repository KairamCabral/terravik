import type { Metadata } from 'next'
import { createMetadata, breadcrumbSchema } from '@/lib/seo/metadata'
import { OndeEncontrarContent } from '@/components/onde-encontrar'

export const metadata: Metadata = createMetadata({
  title: 'Onde Encontrar',
  description:
    'Encontre os produtos Terravik nas melhores lojas do Brasil.',
  path: '/onde-encontrar',
})

export default function OndeEncontrarPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Onde Encontrar', url: '/onde-encontrar' },
            ])
          ),
        }}
      />
      <OndeEncontrarContent />
    </>
  )
}
