'use client'

/**
 * Global Error Boundary — captura erros no root layout
 *
 * O erro "Cannot read properties of undefined (reading 'call')" costuma
 * ocorrer por cache/chunk desatualizado. Recarregar a página geralmente resolve.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isWebpackCallError =
    error?.message?.includes("reading 'call'") ||
    error?.message?.includes('undefined')

  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Ops! Algo deu errado
        </h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          {isWebpackCallError
            ? 'Parece que a página precisa ser recarregada. Isso pode acontecer após atualizações.'
            : 'Encontramos um problema inesperado.'}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              background: '#093E28',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Recarregar página
          </button>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              color: '#093E28',
              border: '1px solid #093E28',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
