'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Container } from '@/components/ui'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()

  const redirectTo = searchParams.get('redirect') || '/conta'
  const callbackError = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(
    callbackError === 'callback' ? 'Houve um erro ao processar sua solicitação. Tente novamente.' : ''
  )
  const [isLoading, setIsLoading] = useState(false)

  const isValid = email.includes('@') && password.length >= 6

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setError('')
    setIsLoading(true)

    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setIsLoading(false)
      if (signInError.message.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos.')
      } else if (signInError.message.includes('Email not confirmed')) {
        setError('Confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada.')
      } else {
        setError('Erro ao fazer login. Tente novamente.')
      }
      return
    }

    router.push(redirectTo)
    router.refresh()
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
                />
              </Link>
            </div>

            {/* Título */}
            <div className="text-center mb-8">
              <h1 className="font-heading text-2xl font-bold text-forest mb-2">
                Bem-vindo de volta
              </h1>
              <p className="text-neutral-600 text-sm">
                Entre com sua conta para continuar
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

              {/* Senha */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                    Senha
                  </label>
                  <Link
                    href="/recuperar-senha"
                    className="text-xs text-forest hover:text-forest/80 font-medium transition-colors"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    required
                    minLength={6}
                    autoComplete="current-password"
                    className="w-full h-12 pl-12 pr-12 rounded-xl border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 focus:outline-none focus:ring-2 focus:ring-forest/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-neutral-400">ou</span>
              </div>
            </div>

            {/* Link para cadastro */}
            <p className="text-center text-sm text-neutral-600">
              Não tem conta?{' '}
              <Link
                href="/cadastro"
                className="font-semibold text-forest hover:text-forest/80 transition-colors"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Container>
  )
}
