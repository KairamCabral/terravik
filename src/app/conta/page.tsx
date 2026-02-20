import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'
import { AccountPageClient } from './AccountPageClient'

export const metadata: Metadata = createMetadata({
  title: 'Minha Conta',
  description: 'Gerencie sua conta Terravik, pedidos, endereços e preferências.',
  path: '/conta',
})

export default function ContaPage() {
  return <AccountPageClient />
}
