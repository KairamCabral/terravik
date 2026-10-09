import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'
import { RedefinirSenhaForm } from './RedefinirSenhaForm'

// noIndex: a rota também está em NOINDEX_NA_PAGINA no next-sitemap.config.js.
export const metadata: Metadata = createMetadata({
  title: 'Definir nova senha',
  description: 'Defina uma nova senha para a sua conta Terravik.',
  path: '/redefinir-senha',
  noIndex: true,
})

export default function RedefinirSenhaPage() {
  return <RedefinirSenhaForm />
}
