'use client'

import { useState } from 'react'
import { Mail, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'

type NewsletterStatus = 'idle' | 'loading' | 'success' | 'error'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<NewsletterStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Por favor, insira um e-mail válido')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMessage(data.message || 'Erro ao se inscrever')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Erro de conexão. Tente novamente.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-terravik-green/10 px-4 py-3 text-terravik-green">
        <Check className="h-5 w-5" />
        <span className="text-sm font-medium">
          Inscrito com sucesso! Verifique seu e-mail.
        </span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-terravik-brown/40" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor e-mail"
            disabled={status === 'loading'}
            className="w-full rounded-lg border-2 border-terravik-brown/20 bg-white py-2.5 pl-10 pr-4 text-terravik-brown placeholder:text-terravik-brown/40 focus:border-terravik-green focus:outline-none disabled:opacity-50"
          />
        </div>
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="gap-2 sm:w-auto"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Inscrevendo...
            </>
          ) : (
            'Inscrever-se'
          )}
        </Button>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <p className="text-xs text-terravik-brown/50">
        Ao se inscrever, você concorda em receber e-mails da Terravik. Você pode
        cancelar a qualquer momento.
      </p>
    </form>
  )
}
