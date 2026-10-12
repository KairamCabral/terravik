'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Camera, Check, ImageIcon, Loader2, RotateCcw, ShieldCheck } from 'lucide-react'
import { useCalculatorContext } from '@/contexts/CalculatorContext'
import { cn } from '@/lib/utils/cn'
import { prepararFoto } from '@/lib/calculator/foto/prepararFoto'
import {
  DICA_DA_QUALIDADE,
  ESTADOS_DO_GRAMADO,
  TEXTO_DA_RECUSA,
  TEXTO_DO_ESTADO,
  avisosDaFoto,
  ehDiagnostico,
  respostasDaFoto,
  type DiagnosticoDaFoto,
  type EstadoDoGramado,
  type RespostaDaAnalise,
} from '@/lib/calculator/foto/diagnostico'

/**
 * Caminho da foto na calculadora: tirar ou escolher a foto, ver o que foi
 * identificado, corrigir se preciso, informar a área e chegar ao plano.
 *
 * A foto só existe na memória do navegador durante a análise. Ao sair desta
 * tela ela é descartada.
 */

type Etapa = 'captura' | 'analisando' | 'confirmar' | 'area'

interface FluxoDaFotoProps {
  /** Volta para o quiz de perguntas. */
  onResponderPerguntas: () => void
}

const AREA_MAXIMA = 5000

export function FluxoDaFoto({ onResponderPerguntas }: FluxoDaFotoProps) {
  const { concluirComRespostas } = useCalculatorContext()
  const [etapa, setEtapa] = useState<Etapa>('captura')
  const [previa, setPrevia] = useState<string | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoDaFoto | null>(null)
  const [corrigindo, setCorrigindo] = useState(false)
  const [erro, setErro] = useState<{ texto: string; podeTentar: boolean } | null>(null)
  const [area, setArea] = useState('')
  const cameraRef = useRef<HTMLInputElement>(null)
  const galeriaRef = useRef<HTMLInputElement>(null)
  const pedidoRef = useRef<AbortController | null>(null)
  const tituloRef = useRef<HTMLHeadingElement>(null)

  // A prévia é um endereço temporário do navegador: liberado ao trocar e ao sair.
  useEffect(() => {
    return () => {
      if (previa) URL.revokeObjectURL(previa)
    }
  }, [previa])

  useEffect(() => () => pedidoRef.current?.abort(), [])

  // A cada etapa o foco vai para o título: leitor de tela anuncia a mudança.
  useEffect(() => {
    tituloRef.current?.focus()
  }, [etapa])

  const analisar = async (arquivo: File | undefined) => {
    if (!arquivo) return
    setErro(null)
    setEtapa('analisando')

    let foto: Blob
    try {
      foto = await prepararFoto(arquivo)
    } catch {
      setErro({ texto: TEXTO_DA_RECUSA.arquivo_invalido, podeTentar: true })
      setEtapa('captura')
      return
    }
    setPrevia(URL.createObjectURL(foto))

    pedidoRef.current?.abort()
    const pedido = new AbortController()
    pedidoRef.current = pedido
    const limite = setTimeout(() => pedido.abort(), 45_000)

    try {
      const resposta = await fetch('/api/calculadora/foto', {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg' },
        body: foto,
        signal: pedido.signal,
      })
      const dados = (await resposta.json().catch(() => null)) as RespostaDaAnalise | null

      if (dados?.ok && ehDiagnostico(dados.diagnostico)) {
        setDiagnostico(dados.diagnostico)
        setCorrigindo(false)
        setEtapa('confirmar')
        return
      }

      // O limite por minuto responde pelo middleware, fora do formato da rota.
      if (!dados || dados.ok || !(dados.motivo in TEXTO_DA_RECUSA)) {
        setErro(
          resposta.status === 429
            ? { texto: 'Muitas tentativas seguidas. Espere um minuto e tente de novo.', podeTentar: true }
            : { texto: TEXTO_DA_RECUSA.indisponivel, podeTentar: false }
        )
        setEtapa('captura')
        return
      }

      const motivo = dados.motivo
      const dica =
        !dados.ok && dados.motivo === 'foto_ruim' && dados.qualidade && dados.qualidade !== 'boa'
          ? DICA_DA_QUALIDADE[dados.qualidade]
          : TEXTO_DA_RECUSA[motivo]
      setErro({
        texto: dica,
        podeTentar: motivo === 'foto_ruim' || motivo === 'nao_e_gramado' || motivo === 'arquivo_invalido',
      })
      setEtapa('captura')
    } catch {
      if (pedido !== pedidoRef.current) return
      setErro({ texto: 'Não consegui enviar a foto. Confira a internet e tente de novo.', podeTentar: true })
      setEtapa('captura')
    } finally {
      clearTimeout(limite)
    }
  }

  const aoEscolher = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0]
    // Limpa o campo: escolher a mesma foto de novo precisa disparar o evento.
    evento.target.value = ''
    void analisar(arquivo)
  }

  const trocarEstado = (estado: EstadoDoGramado) => {
    if (!diagnostico) return
    setDiagnostico({
      ...diagnostico,
      estado,
      padrao: estado === 'bonito' || estado === 'solo_exposto' ? 'nao_se_aplica' : diagnostico.padrao,
    })
    setCorrigindo(false)
  }

  const areaM2 = Math.min(AREA_MAXIMA, parseInt(area, 10))
  const areaValida = Number.isFinite(areaM2) && areaM2 > 0

  const verPlano = () => {
    if (!diagnostico || !areaValida) return
    concluirComRespostas(respostasDaFoto(diagnostico, areaM2), avisosDaFoto(diagnostico))
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-1 py-6 text-center">
      {/* Os dois campos de arquivo. O primeiro abre a câmera traseira no celular. */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={aoEscolher}
      />
      <input
        ref={galeriaRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={aoEscolher}
      />

      {etapa === 'captura' && (
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <h2
              ref={tituloRef}
              tabIndex={-1}
              className="font-heading text-3xl font-bold leading-tight text-neutral-900 outline-none"
            >
              Mostre o seu gramado
            </h2>
            <p className="text-neutral-500">
              Uma foto basta para saber qual produto ele pede.
            </p>
          </div>

          {erro && (
            <div
              role="alert"
              className="rounded-2xl border border-gold/40 bg-gold/10 p-4 text-left text-sm text-neutral-800"
            >
              {erro.texto}
            </div>
          )}

          {(!erro || erro.podeTentar) && (
            <>
              <ul className="space-y-2 rounded-2xl bg-forest/5 p-4 text-left text-sm text-neutral-700">
                {[
                  'De dia, com luz natural',
                  'De pé, pegando uns 2 metros de gramado',
                  'A parte que mais preocupa você',
                ].map((dica) => (
                  <li key={dica} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest" aria-hidden="true" />
                    {dica}
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-forest px-6 text-lg font-semibold text-white shadow-lg shadow-forest/20 transition-all hover:bg-forest/90 active:scale-[0.98]"
                >
                  <Camera className="h-6 w-6" aria-hidden="true" />
                  {erro ? 'Tirar outra foto' : 'Tirar foto'}
                </button>
                <button
                  type="button"
                  onClick={() => galeriaRef.current?.click()}
                  className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl border-2 border-neutral-200 bg-white px-6 text-base font-semibold text-neutral-800 transition-all hover:border-forest/40 active:scale-[0.98]"
                >
                  <ImageIcon className="h-5 w-5" aria-hidden="true" />
                  Escolher da galeria
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={onResponderPerguntas}
            className={cn(
              'min-h-[44px] w-full rounded-xl px-4 text-sm font-semibold transition-colors',
              erro && !erro.podeTentar
                ? 'bg-forest text-white hover:bg-forest/90'
                : 'text-forest underline underline-offset-4 hover:text-forest/80'
            )}
          >
            Prefiro responder as perguntas
          </button>

          <p className="flex items-start gap-2 text-left text-xs leading-relaxed text-neutral-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest" aria-hidden="true" />
            <span>
              A Terravik não guarda a sua foto. Ela é enviada a um serviço de análise de imagem só
              para identificar o estado do gramado. Evite mostrar pessoas, placas ou documentos.{' '}
              <a href="/privacidade#dados-coletados" className="underline underline-offset-2">
                Saiba mais
              </a>
              .
            </span>
          </p>
        </div>
      )}

      {etapa === 'analisando' && (
        <div className="w-full space-y-6" aria-live="polite">
          <Previa src={previa} analisando />
          <div className="space-y-2">
            <h2
              ref={tituloRef}
              tabIndex={-1}
              className="flex items-center justify-center gap-2 font-heading text-2xl font-bold text-neutral-900 outline-none"
            >
              <Loader2 className="h-6 w-6 animate-spin text-forest motion-reduce:animate-none" aria-hidden="true" />
              Olhando o seu gramado
            </h2>
            <p className="text-sm text-neutral-500">Leva alguns segundos.</p>
          </div>
        </div>
      )}

      {etapa === 'confirmar' && diagnostico && (
        <div className="w-full space-y-5">
          <Previa src={previa} />
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-forest">
              Pelo que a foto mostra
            </p>
            <h2
              ref={tituloRef}
              tabIndex={-1}
              className="font-heading text-2xl font-bold leading-tight text-neutral-900 outline-none"
            >
              {TEXTO_DO_ESTADO[diagnostico.estado].titulo}
            </h2>
            <p className="text-neutral-600">{TEXTO_DO_ESTADO[diagnostico.estado].texto}</p>
          </div>

          {corrigindo ? (
            <fieldset className="space-y-2 text-left">
              <legend className="mb-2 text-sm font-semibold text-neutral-800">
                Como está o seu gramado?
              </legend>
              {ESTADOS_DO_GRAMADO.map((estado) => (
                <button
                  key={estado}
                  type="button"
                  onClick={() => trocarEstado(estado)}
                  aria-pressed={diagnostico.estado === estado}
                  className={cn(
                    'flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border-2 px-4 text-left text-sm font-semibold transition-colors',
                    diagnostico.estado === estado
                      ? 'border-forest bg-forest/5 text-forest'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-forest/40'
                  )}
                >
                  {TEXTO_DO_ESTADO[estado].titulo}
                  {diagnostico.estado === estado && <Check className="h-4 w-4" aria-hidden="true" />}
                </button>
              ))}
            </fieldset>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setEtapa('area')}
                className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-forest px-6 text-lg font-semibold text-white shadow-lg shadow-forest/20 transition-all hover:bg-forest/90 active:scale-[0.98]"
              >
                É isso mesmo
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCorrigindo(true)}
                  className="min-h-[48px] rounded-xl border-2 border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-800 transition-colors hover:border-forest/40"
                >
                  Não é isso
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErro(null)
                    setEtapa('captura')
                  }}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-800 transition-colors hover:border-forest/40"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Outra foto
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {etapa === 'area' && diagnostico && (
        <form
          className="w-full space-y-6"
          onSubmit={(evento) => {
            evento.preventDefault()
            verPlano()
          }}
        >
          <div className="space-y-2">
            <h2
              ref={tituloRef}
              tabIndex={-1}
              className="font-heading text-3xl font-bold leading-tight text-neutral-900 outline-none"
            >
              Qual é a área do gramado?
            </h2>
            <p className="text-neutral-500">
              A foto não mede o tamanho. Multiplique largura × comprimento, em metros.
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <label htmlFor="area-da-foto" className="sr-only">
                Área do gramado em metros quadrados
              </label>
              <input
                id="area-da-foto"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                placeholder="60"
                value={area}
                onChange={(evento) => setArea(evento.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full rounded-2xl border-2 border-neutral-200 bg-white px-6 py-5 text-center text-4xl font-bold text-neutral-900 transition-all placeholder:text-neutral-200 focus:border-forest focus:outline-none focus:ring-4 focus:ring-forest/10"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-medium text-neutral-300">
                m²
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              {[30, 60, 100, 200].map((valor) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setArea(String(valor))}
                  className={cn(
                    'min-h-[44px] min-w-[52px] rounded-lg px-3 text-sm font-medium transition-all',
                    areaM2 === valor
                      ? 'bg-forest text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-forest/10 hover:text-forest'
                  )}
                >
                  {valor}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!areaValida}
            className={cn(
              'flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl px-6 text-lg font-semibold transition-all',
              areaValida
                ? 'bg-forest text-white shadow-lg shadow-forest/20 hover:bg-forest/90 active:scale-[0.98]'
                : 'cursor-not-allowed bg-neutral-100 text-neutral-400'
            )}
          >
            Ver meu plano
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setEtapa('confirmar')}
            className="min-h-[44px] text-sm font-semibold text-neutral-500 underline underline-offset-4"
          >
            Voltar
          </button>
        </form>
      )}
    </div>
  )
}

function Previa({ src, analisando = false }: { src: string | null; analisando?: boolean }) {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100">
      {src && (
        // Prévia local (blob:): não passa pelo otimizador de imagens.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="Foto do seu gramado" className="h-full w-full object-cover" />
      )}
      {analisando && (
        <div className="absolute inset-0 animate-pulse bg-forest/20 motion-reduce:animate-none" aria-hidden="true" />
      )}
    </div>
  )
}
