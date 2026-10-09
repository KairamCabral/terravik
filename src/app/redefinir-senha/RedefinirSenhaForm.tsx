'use client'

import { useState, useMemo, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Check,
  Circle,
  ArrowLeft,
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Container } from '@/components/ui'
import { forcaDaSenha, REQUISITOS_DE_SENHA } from '@/lib/auth/senha'
import { segundosDeEspera, mensagemDeEspera } from '@/lib/auth/erros'

/**
 * A última etapa da recuperação de senha.
 *
 * `auth/callback/route.ts` troca o código do e-mail por sessão e redireciona
 * para cá. Esta rota não existia (404) e `updatePassword` do AuthProvider não
 * tinha chamador: o e-mail saía, o link era válido, e a pessoa ficava sem tela
 * para salvar a senha nova.
 *
 * QUEM CHEGA AQUI JÁ ESTÁ AUTENTICADO. O callback abriu a sessão antes de
 * redirecionar, então `updateUser({ password })` tem a quem aplicar. Por isso
 * esta rota NÃO pode entrar em AUTH_ROUTES do middleware (que manda quem está
 * logado para /conta). Chegar sem sessão significa link expirado, já usado, ou
 * endereço digitado na mão: nesse caso a tela não mostra um formulário que iria
 * falhar, ela convida a pedir outro link.
 */

const CAMPO =
  'w-full h-12 pl-12 rounded-xl border text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 transition-all'
const CAMPO_NORMAL = 'border-neutral-200 focus:border-forest focus:ring-forest/20'
const CAMPO_ERRO = 'border-red-300 focus:border-red-400 focus:ring-red-400/20'

export function RedefinirSenhaForm() {
  const router = useRouter()
  const { user, isLoading: carregandoSessao, updatePassword } = useAuth()

  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [pronto, setPronto] = useState(false)

  const forca = useMemo(() => forcaDaSenha(senha), [senha])
  const conferem = senha === confirmacao && confirmacao.length > 0
  const diferentes = confirmacao.length > 0 && !conferem
  const valido = forca.passed === forca.total && conferem

  const aoEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valido || enviando) return

    setErro('')
    setEnviando(true)

    const { error } = await updatePassword(senha)

    setEnviando(false)

    if (error) {
      // Limite de taxa primeiro: a mensagem genérica mandaria repetir, que é
      // o que garante o erro seguinte. Ver lib/auth/erros.ts.
      const espera = segundosDeEspera(error)
      if (espera !== null) {
        setErro(mensagemDeEspera(espera, 'outra troca de senha'))
        return
      }
      // Sessão vencida no meio do caminho: o link de recuperação tem validade
      // curta, e quem deixa a aba aberta cai aqui.
      if (/session|jwt|expired|not authenticated/i.test(error.message)) {
        setErro(
          'O link de recuperação expirou enquanto esta página estava aberta. Peça um novo link para continuar.'
        )
        return
      }
      // O Supabase recusa repetir a senha atual.
      if (/different from the old password|same_password/i.test(error.message)) {
        setErro('A nova senha precisa ser diferente da senha atual.')
        return
      }
      setErro('Não conseguimos salvar a nova senha. Peça um novo link de recuperação.')
      return
    }

    setPronto(true)
    // Já está logado: o callback abriu a sessão e a senha nova acabou de ser
    // gravada nela. Mandar para o login pediria para digitar o que a pessoa
    // acabou de criar, sem motivo.
    setTimeout(() => {
      router.push('/conta')
      router.refresh()
    }, 1600)
  }

  if (carregandoSessao) {
    return (
      <Container spacing="lg">
        <div className="flex items-center justify-center py-20" role="status">
          <Loader2 className="w-8 h-8 animate-spin text-forest" aria-hidden="true" />
          <span className="sr-only">Carregando</span>
        </div>
      </Container>
    )
  }

  // `pronto` vem antes de `!user`: depois de salvar, a sessão continua valendo.
  if (pronto) {
    return (
      <Moldura>
        <div className="text-center" role="status">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-forest mb-3">Senha definida</h1>
          <p className="text-neutral-600 text-sm">
            Você já está conectado. Levando para a sua conta.
          </p>
        </div>
      </Moldura>
    )
  }

  if (!user) {
    return (
      <Moldura>
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-amber-600" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-forest mb-3">
            Link expirado ou já usado
          </h1>
          <p className="text-neutral-600 text-sm mb-8">
            O link de recuperação vale por pouco tempo e só pode ser usado uma vez. Peça um novo
            para definir sua senha.
          </p>
          <Link
            href="/recuperar-senha"
            className="w-full h-12 flex items-center justify-center rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 focus:outline-none focus:ring-2 focus:ring-forest/50 focus:ring-offset-2 transition-all"
          >
            Pedir um novo link
          </Link>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-forest font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Voltar para o login
          </Link>
        </div>
      </Moldura>
    )
  }

  return (
    <Moldura>
      <div className="text-center mb-8">
        <h1 className="font-heading text-2xl font-bold text-forest mb-2">Definir nova senha</h1>
        <p className="text-neutral-600 text-sm">
          Escolha a senha que você vai usar para entrar com{' '}
          <span className="font-medium text-neutral-900 break-all">{user.email}</span>
        </p>
      </div>

      {erro && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-50 border border-red-200"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-red-700">{erro}</p>
        </motion.div>
      )}

      <form onSubmit={aoEnviar} className="space-y-5">
        {/* Nova senha */}
        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Nova senha
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="senha"
              type={mostrarSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Crie uma senha forte"
              required
              autoComplete="new-password"
              aria-describedby="requisitos-da-senha"
              className={`${CAMPO} ${CAMPO_NORMAL} pr-12`}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? (
                <EyeOff className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Eye className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {senha.length > 0 && (
            <div className="mt-3 flex gap-1" aria-hidden="true">
              {Array.from({ length: forca.total }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < forca.passed
                      ? forca.passed === forca.total
                        ? 'bg-emerald-500'
                        : forca.passed >= 2
                          ? 'bg-amber-500'
                          : 'bg-red-400'
                      : 'bg-neutral-200'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Sempre visíveis e ligados ao campo: requisito que só aparece
              depois da primeira tecla nunca é anunciado pelo leitor de tela. */}
          <ul id="requisitos-da-senha" className="mt-3 space-y-1">
            {REQUISITOS_DE_SENHA.map(({ chave, rotulo }) => {
              const atendido = forca.checks[chave]
              const Icone = atendido ? Check : Circle
              return (
                <li
                  key={chave}
                  className={`flex items-center gap-2 text-xs ${
                    atendido ? 'text-emerald-700' : 'text-neutral-600'
                  }`}
                >
                  <Icone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="sr-only">{atendido ? 'Atendido: ' : 'Pendente: '}</span>
                  {rotulo}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Confirmar */}
        <div>
          <label
            htmlFor="confirmacao"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            Confirmar nova senha
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="confirmacao"
              type={mostrarSenha ? 'text' : 'password'}
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="Repita a senha"
              required
              autoComplete="new-password"
              aria-invalid={diferentes || undefined}
              aria-describedby={diferentes ? 'senhas-diferentes' : undefined}
              className={`${CAMPO} ${diferentes ? CAMPO_ERRO : CAMPO_NORMAL} pr-4`}
            />
          </div>
          {diferentes && (
            <p id="senhas-diferentes" className="text-xs text-red-700 mt-1">
              As senhas não coincidem
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!valido || enviando}
          className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-forest text-white font-semibold text-sm hover:bg-forest/90 focus:outline-none focus:ring-2 focus:ring-forest/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {enviando ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              Salvando...
            </>
          ) : (
            'Salvar nova senha'
          )}
        </button>
      </form>
    </Moldura>
  )
}

/** O cartão centralizado com o logo, igual ao das outras telas de auth. */
function Moldura({ children }: { children: ReactNode }) {
  return (
    <Container spacing="lg">
      <div className="flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 sm:p-10">
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
            {children}
          </div>
        </motion.div>
      </div>
    </Container>
  )
}
