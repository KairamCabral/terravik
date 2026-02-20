import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createMetadata } from '@/lib/seo/metadata'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = createMetadata({
  title: 'Entrar',
  description: 'Faça login na sua conta Terravik para acessar pedidos, favoritos e muito mais.',
  path: '/login',
})

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
