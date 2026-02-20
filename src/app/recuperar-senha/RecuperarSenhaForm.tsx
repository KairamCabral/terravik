'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Container } from '@/components/ui'

export function RecuperarSenhaForm() {
  const { resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const isValid = email.includes('@')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setError('')
    setIsLoading(true)

    const { error: resetError } = await resetPassword(email)

    setIsLoading(false)

    if (resetError) {
      setError('Erro ao enviar e-mail de recuperação. Tente novamente.')
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <Container spacing="lg">
        <div className="flex items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md text-center"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 sm:p-10">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-forest mb-3">
                E-mail enviado
              </h1>
              <p className="text-neutral-600 mb-2">
                Se o e-mail estiver cadastrado, enviamos um link de recuperação para:
              </p>
              <p className="font-semibold text-neutral-900 mb-6">
                {email}
              </p>
              <p className="text-sm text-neutral-500 mb-8">
                Verifique sua caixa de entrada e a pasta de spam.
                O link expira em 1 hora.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 transition-colors"
              >
                Voltar para o Login
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    )
  }

  return (
    <Container spacing="lg">
      <div className="flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 sm:p-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Link href="/">
                <Image
                  src="/logo/Logo-terravik-horizontal-png.png"
                  alt="Terravik"
                  width={160}
                  height={36}
                  className="h-9 w-auto"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </Link>
            </div>

            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="font-heading text-2xl font-bold text-forest mb-2">
                Recuperar senha
              </h1>
              <p className="text-neutral-600 text-sm">
                Informe seu e-mail e enviaremos um link para redefinir sua senha
              </p>
            </div>

            {/* Erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-50 border border-red-200"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* E-mail */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    autoComplete="email"
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all"
                  />
                </div>
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 focus:outline-none focus:ring-2 focus:ring-forest/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar link de recuperação'
                )}
              </button>
            </form>

            {/* Voltar */}
            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-forest font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  )
}
