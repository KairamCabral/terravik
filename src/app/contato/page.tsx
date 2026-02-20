import type { Metadata } from 'next'
import { createMetadata, breadcrumbSchema } from '@/lib/seo/metadata'
import { ContactPageClient } from './ContactPageClient'

export const metadata: Metadata = createMetadata({
  title: 'Contato',
  description:
    'Entre em contato com a Terravik. Dúvidas, sugestões ou interesse em representar? Estamos aqui para ajudar.',
  path: '/contato',
})

export default function ContatoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Contato', url: '/contato' },
            ])
          ),
        }}
      />
      <ContactPageClient />
    </>
  )
}
