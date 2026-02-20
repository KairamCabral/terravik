import type { Metadata } from 'next'
import { createMetadata } from '@/lib/seo/metadata'
import { CadastroForm } from './CadastroForm'

export const metadata: Metadata = createMetadata({
  title: 'Criar Conta',
  description: 'Crie sua conta Terravik e tenha acesso a pedidos, favoritos, academia e muito mais.',
  path: '/cadastro',
})

export default function CadastroPage() {
  return <CadastroForm />
}
