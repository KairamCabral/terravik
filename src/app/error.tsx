'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Container, Button } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro para monitoramento (Sentry, LogRocket, etc)
    console.error('Erro capturado:', error)
  }, [error])

  return (
    <Container spacing="lg">
      <div className="mx-auto max-w-2xl text-center">
        {/* Ícone */}
        <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-16 w-16 text-red-600" />
        </div>

        {/* Título */}
        <h1 className="mb-4 font-display text-3xl font-bold text-terravik-brown md:text-4xl">
          Ops! Algo deu errado
        </h1>

        {/* Descrição */}
        <p className="mb-8 text-lg text-terravik-brown/70">
          Encontramos um problema inesperado. Tente novamente ou volte para a
          página inicial.
        </p>

        {/* Ações */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Tentar novamente
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Voltar para a Home</Link>
          </Button>
        </div>

        {/* Mensagem de erro (dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
            <summary className="cursor-pointer font-medium text-red-900">
              Detalhes do erro (visível apenas em desenvolvimento)
            </summary>
            <pre className="mt-4 overflow-auto text-sm text-red-800">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </Container>
  )
}
