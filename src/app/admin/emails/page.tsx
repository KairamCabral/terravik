'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Mail, RefreshCw, Search, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

/**
 * /admin/emails
 *
 * Histórico dos e-mails que o site enviou (ou tentou enviar) e diagnóstico da
 * configuração. Responde "o cliente recebeu?" sem abrir o painel do Resend.
 *
 * A lista vem direto de `email_log`, com a sessão do admin (a RLS só deixa
 * admin ler). O diagnóstico e o envio de teste passam pelo servidor.
 */

interface Envio {
  id: string
  tipo: string
  destinatario: string
  assunto: string
  status: string
  erro: string | null
  criado_em: string
  atualizado_em: string
}

interface ItemDoDiagnostico {
  chave: string
  ok: boolean
  detalhe: string
  critico: boolean
}

const ROTULO_DO_STATUS: Record<string, string> = {
  enviado: 'Enviado',
  entregue: 'Entregue',
  aberto: 'Aberto',
  clicado: 'Clicado',
  rejeitado: 'Rejeitado',
  reclamado: 'Marcado como spam',
  falhou: 'Falhou',
}

// Cor só para estado. Texto escuro sobre fundo claro, com contraste AA.
const COR_DO_STATUS: Record<string, string> = {
  enviado: 'bg-neutral-100 text-neutral-700',
  entregue: 'bg-emerald-50 text-emerald-800',
  aberto: 'bg-emerald-50 text-emerald-800',
  clicado: 'bg-emerald-50 text-emerald-800',
  rejeitado: 'bg-red-50 text-red-700',
  reclamado: 'bg-red-50 text-red-700',
  falhou: 'bg-red-50 text-red-700',
}

const ROTULO_DO_TIPO: Record<string, string> = {
  contato: 'Contato',
  teste: 'Teste',
  'auth-signup': 'Confirmação de cadastro',
  'auth-recovery': 'Recuperação de senha',
  'auth-magiclink': 'Link de acesso',
  'auth-email_change': 'Troca de e-mail',
  'auth-invite': 'Convite',
  'auth-reauthentication': 'Confirmação de identidade',
}

const FILTROS = ['todos', 'enviado', 'entregue', 'aberto', 'rejeitado', 'reclamado', 'falhou'] as const

function dataHora(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminEmailsPage() {
  const supabase = useMemo(() => createClient(), [])

  const [envios, setEnvios] = useState<Envio[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erroDaLista, setErroDaLista] = useState<string | null>(null)
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>('todos')
  const [busca, setBusca] = useState('')

  const [diagnostico, setDiagnostico] = useState<ItemDoDiagnostico[] | null>(null)
  const [pronto, setPronto] = useState(false)
  const [erroDoDiagnostico, setErroDoDiagnostico] = useState<string | null>(null)

  const [testando, setTestando] = useState(false)
  const [resultadoDoTeste, setResultadoDoTeste] = useState<{ ok: boolean; texto: string } | null>(null)

  const carregarEnvios = useCallback(async () => {
    setCarregando(true)
    setErroDaLista(null)

    let consulta = supabase
      .from('email_log')
      .select('id, tipo, destinatario, assunto, status, erro, criado_em, atualizado_em')
      .order('criado_em', { ascending: false })
      .limit(200)

    if (filtro !== 'todos') consulta = consulta.eq('status', filtro)

    const { data, error } = await consulta
    if (error) {
      setErroDaLista(error.message)
      setEnvios([])
    } else {
      setEnvios((data ?? []) as Envio[])
    }
    setCarregando(false)
  }, [supabase, filtro])

  const carregarDiagnostico = useCallback(async () => {
    setErroDoDiagnostico(null)
    try {
      const resposta = await fetch('/api/admin/emails/diagnostico', { cache: 'no-store' })
      const dados = await resposta.json()
      if (!resposta.ok) {
        setErroDoDiagnostico(dados.erro || `O servidor respondeu ${resposta.status}.`)
        return
      }
      setDiagnostico(dados.itens ?? [])
      setPronto(Boolean(dados.prontoParaOHook))
    } catch {
      setErroDoDiagnostico('Não foi possível consultar o diagnóstico.')
    }
  }, [])

  useEffect(() => {
    carregarEnvios()
  }, [carregarEnvios])

  useEffect(() => {
    carregarDiagnostico()
  }, [carregarDiagnostico])

  const enviarTeste = async () => {
    setTestando(true)
    setResultadoDoTeste(null)
    try {
      const resposta = await fetch('/api/admin/emails/diagnostico', { method: 'POST' })
      const dados = await resposta.json()
      setResultadoDoTeste(
        resposta.ok
          ? { ok: true, texto: `E-mail de teste enviado para ${dados.para}.` }
          : { ok: false, texto: dados.erro || 'O envio falhou.' }
      )
      carregarEnvios()
    } catch {
      setResultadoDoTeste({ ok: false, texto: 'Não foi possível falar com o servidor.' })
    } finally {
      setTestando(false)
    }
  }

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return envios
    return envios.filter(
      (e) => e.destinatario.toLowerCase().includes(termo) || e.assunto.toLowerCase().includes(termo)
    )
  }, [envios, busca])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">E-mails</h1>
          <p className="text-neutral-600">
            O que o site enviou, para quem, e o que aconteceu depois.
          </p>
        </div>
        <button
          onClick={enviarTeste}
          disabled={testando}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
        >
          {testando ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          Enviar e-mail de teste para mim
        </button>
      </div>

      {resultadoDoTeste && (
        <div
          role={resultadoDoTeste.ok ? 'status' : 'alert'}
          className={`rounded-xl border px-4 py-3 text-sm ${
            resultadoDoTeste.ok
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {resultadoDoTeste.texto}
        </div>
      )}

      {/* Diagnóstico */}
      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-semibold text-neutral-900">Configuração</h2>
          <button
            onClick={carregarDiagnostico}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Conferir de novo
          </button>
        </div>

        {erroDoDiagnostico && (
          <p role="alert" className="text-sm text-red-700">
            {erroDoDiagnostico}
          </p>
        )}

        {!diagnostico && !erroDoDiagnostico && (
          <p className="flex items-center gap-2 text-sm text-neutral-600">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Conferindo...
          </p>
        )}

        {diagnostico && (
          <>
            <ul className="divide-y divide-neutral-100">
              {diagnostico.map((item) => (
                <li key={item.chave} className="flex items-start gap-3 py-2.5">
                  {item.ok ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" aria-hidden="true" />
                  ) : (
                    <AlertCircle
                      className={`mt-0.5 h-5 w-5 flex-shrink-0 ${item.critico ? 'text-red-600' : 'text-amber-600'}`}
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900">
                      {item.chave}
                      <span className="sr-only">{item.ok ? ': certo' : ': com problema'}</span>
                    </p>
                    <p className="break-words text-sm text-neutral-600">{item.detalhe}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p
              className={`mt-4 rounded-lg px-3 py-2 text-sm ${
                pronto ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
              }`}
            >
              {pronto
                ? 'Tudo certo para os e-mails de conta. O hook de e-mail do Supabase pode ficar ligado.'
                : 'Há item crítico pendente. Não ligue o hook de e-mail do Supabase antes de resolver: cadastro e recuperação de senha parariam de enviar.'}
            </p>
          </>
        )}
      </section>

      {/* Histórico */}
      <section className="rounded-xl border border-neutral-200 bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 p-4">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
              aria-hidden="true"
            />
            <label htmlFor="busca-de-emails" className="sr-only">
              Buscar por destinatário ou assunto
            </label>
            <input
              id="busca-de-emails"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por destinatário ou assunto"
              className="h-10 w-full rounded-lg border border-neutral-200 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>
          <label htmlFor="filtro-de-status" className="sr-only">
            Filtrar por status
          </label>
          <select
            id="filtro-de-status"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as (typeof FILTROS)[number])}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            {FILTROS.map((f) => (
              <option key={f} value={f}>
                {f === 'todos' ? 'Todos os status' : ROTULO_DO_STATUS[f]}
              </option>
            ))}
          </select>
          <button
            onClick={carregarEnvios}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Atualizar
          </button>
        </div>

        {carregando ? (
          <p className="flex items-center justify-center gap-2 p-10 text-sm text-neutral-600">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Carregando...
          </p>
        ) : erroDaLista ? (
          <p role="alert" className="p-6 text-sm text-red-700">
            Não foi possível ler o histórico: {erroDaLista}
          </p>
        ) : visiveis.length === 0 ? (
          <div className="p-10 text-center">
            <Mail className="mx-auto mb-3 h-8 w-8 text-neutral-400" aria-hidden="true" />
            <p className="text-sm text-neutral-600">
              {envios.length === 0 ? 'Nenhum e-mail registrado ainda.' : 'Nada encontrado para esta busca.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Quando</th>
                  <th scope="col" className="px-4 py-3 font-medium">Tipo</th>
                  <th scope="col" className="px-4 py-3 font-medium">Destinatário</th>
                  <th scope="col" className="px-4 py-3 font-medium">Assunto</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {visiveis.map((envio) => (
                  <tr key={envio.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-700">{dataHora(envio.criado_em)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-700">
                      {ROTULO_DO_TIPO[envio.tipo] ?? envio.tipo}
                    </td>
                    <td className="px-4 py-3 text-neutral-900">{envio.destinatario}</td>
                    <td className="px-4 py-3 text-neutral-700">
                      {envio.assunto}
                      {envio.erro && <p className="mt-1 text-xs text-red-700">{envio.erro}</p>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          COR_DO_STATUS[envio.status] ?? 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {ROTULO_DO_STATUS[envio.status] ?? envio.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
