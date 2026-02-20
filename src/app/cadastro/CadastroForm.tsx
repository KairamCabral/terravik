'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User, CheckCircle2, Check } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Container } from '@/components/ui'

// Regras de validação de senha
function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  }
  const passed = Object.values(checks).filter(Boolean).length
  return { checks, passed, total: 3 }
}

export function CadastroForm() {
  const router = useRouter()
  const { signUp } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const isValid =
    name.trim().length >= 2 &&
    email.includes('@') &&
    strength.passed === strength.total &&
    passwordsMatch &&
    acceptTerms

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setError('')
    setIsLoading(true)

    const { error: signUpError } = await signUp(email, password, name.trim())

    if (signUpError) {
      setIsLoading(false)
      if (signUpError.message.includes('already registered')) {
        setError('Este e-mail já está cadastrado. Tente fazer login.')
      } else if (signUpError.message.includes('password')) {
        setError('A senha não atende os requisitos mínimos.')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
      return
    }

    setSuccess(true)
  }

  // Tela de sucesso — verificar e-mail
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
                Verifique seu e-mail
              </h1>
              <p className="text-neutral-600 mb-2">
                Enviamos um link de confirmação para:
              </p>
              <p className="font-semibold text-neutral-900 mb-6">
                {email}
              </p>
              <p className="text-sm text-neutral-500 mb-8">
                Clique no link do e-mail para ativar sua conta.
                Verifique a pasta de spam se não encontrar.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 transition-colors"
              >
                Ir para o Login
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    )
  }

  return (
    <Container spacing="lg">
      <div className="flex min-h-[60vh] items-center justify-center py-8">
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
                Criar sua conta
              </h1>
              <p className="text-neutral-600 text-sm">
                Cadastre-se para acessar todos os benefícios
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
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                    autoComplete="name"
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all"
                  />
                </div>
              </div>

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
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie uma senha forte"
                    required
                    autoComplete="new-password"
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

                {/* Indicador de força */}
                {password.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {/* Barra */}
                    <div className="flex gap-1">
                      {Array.from({ length: strength.total }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i < strength.passed
                              ? strength.passed === strength.total
                                ? 'bg-emerald-500'
                                : strength.passed >= 2
                                  ? 'bg-amber-500'
                                  : 'bg-red-400'
                              : 'bg-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    {/* Checklist */}
                    <ul className="space-y-1">
                      <li className={`flex items-center gap-2 text-xs ${strength.checks.length ? 'text-emerald-600' : 'text-neutral-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        Mínimo 8 caracteres
                      </li>
                      <li className={`flex items-center gap-2 text-xs ${strength.checks.uppercase ? 'text-emerald-600' : 'text-neutral-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        Uma letra maiúscula
                      </li>
                      <li className={`flex items-center gap-2 text-xs ${strength.checks.number ? 'text-emerald-600' : 'text-neutral-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        Um número
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    required
                    autoComplete="new-password"
                    className={`w-full h-12 pl-12 pr-12 rounded-xl border text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                      confirmPassword.length > 0
                        ? passwordsMatch
                          ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20'
                          : 'border-red-300 focus:border-red-400 focus:ring-red-400/20'
                        : 'border-neutral-200 focus:border-forest focus:ring-forest/20'
                    }`}
                  />
                  {confirmPassword.length > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {passwordsMatch ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>
                )}
              </div>

              {/* Termos */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-forest focus:ring-forest/20 cursor-pointer"
                />
                <span className="text-xs text-neutral-600 leading-relaxed">
                  Li e aceito os{' '}
                  <Link href="/termos" className="text-forest font-medium hover:underline">
                    Termos de Uso
                  </Link>{' '}
                  e a{' '}
                  <Link href="/privacidade" className="text-forest font-medium hover:underline">
                    Política de Privacidade
                  </Link>
                </span>
              </label>

              {/* Botão Criar Conta */}
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 focus:outline-none focus:ring-2 focus:ring-forest/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
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

            {/* Link para login */}
            <p className="text-center text-sm text-neutral-600">
              Já tem conta?{' '}
              <Link
                href="/login"
                className="font-semibold text-forest hover:text-forest/80 transition-colors"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Container>
  )
}
