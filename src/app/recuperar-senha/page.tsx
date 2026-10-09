import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'
import { RecuperarSenhaForm } from './RecuperarSenhaForm'

export const metadata: Metadata = createMetadata({
  title: 'Recuperar Senha',
  description: 'Recupere o acesso à sua conta Terravik.',
  path: '/recuperar-senha',
  noIndex: true,
})

export default function RecuperarSenhaPage() {
  return <RecuperarSenhaForm />
}
