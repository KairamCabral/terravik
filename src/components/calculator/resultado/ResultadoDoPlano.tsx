'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Camera, Check, Link2, RotateCcw, ShoppingBag } from 'lucide-react'
import type { useCalculator } from '@/hooks/useCalculator'
import { AVISO_DA_FOTO, AVISO_DE_MANCHAS } from '@/lib/calculator/foto/diagnostico'
import { linkDoPlano, linkDoWhatsApp, mensagemDoPlano } from '@/lib/calculator/compartilhar'
import { formatCurrency } from '@/lib/utils/formatters'
import { CartaoDeCompra } from './CartaoDeCompra'
import { Calendario, ComoAplicar, QuantoUsar } from './GuiaDeAplicacao'
import { useCompraDoPlano } from './useCompraDoPlano'

interface ResultadoDoPlanoProps {
  calculator: ReturnType<typeof useCalculator>
}

/**
 * Tela de resultado da calculadora.
 *
 * Ordem pensada para o celular: a resposta (o que levar e quanto custa) vem
 * primeiro, com um botão só; o modo de usar vem depois, para quem quer conferir
 * antes de comprar ou voltar aqui com o saco na mão.
 */
export function ResultadoDoPlano({ calculator }: ResultadoDoPlanoProps) {
  const { result, reset } = calculator
  const compra = useCompraDoPlano(result?.plan ?? [])
  const botaoRef = useRef<HTMLDivElement>(null)
  const [botaoForaDaTela, setBotaoForaDaTela] = useState(false)
  const [montado, setMontado] = useState(false)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => setMontado(true), [])

  // A barra fixa aparece quando o botão principal sai da tela.
  useEffect(() => {
    const alvo = botaoRef.current
    if (!alvo) return
    // Só conta quando o botão ficou para CIMA da tela. Antes de a pessoa
    // chegar nele a barra não aparece: ela cobriria o topo logo na entrada.
    const observador = new IntersectionObserver(
      ([entrada]) => setBotaoForaDaTela(!entrada.isIntersecting && entrada.boundingClientRect.top < 0),
      { threshold: 0 }
    )
    observador.observe(alvo)
    return () => observador.disconnect()
  }, [result])

  if (!result || result.plan.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <p className="text-txt-secondary">Não consegui montar o plano. Tente de novo.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 min-h-[48px] rounded-xl bg-forest px-6 text-sm font-semibold text-white"
        >
          Recomeçar
        </button>
      </div>
    )
  }

  const veioDaFoto = result.alerts.includes(AVISO_DA_FOTO)
  const manchas = result.alerts.includes(AVISO_DE_MANCHAS)
  const avisos = result.alerts.filter((a) => a !== AVISO_DA_FOTO && a !== AVISO_DE_MANCHAS)
  const umProduto = result.plan.length === 1

  const link = () => linkDoPlano(result.context, window.location.origin)

  const compartilhar = () => {
    window.open(linkDoWhatsApp(mensagemDoPlano(result, link())), '_blank', 'noopener,noreferrer')
  }

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(link())
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // Sem permissão de área de transferência: o WhatsApp continua disponível.
    }
  }

  return (
    <div className="bg-bg-primary pb-28 lg:pb-16">
      {/* Abertura */}
      <header className="bg-gradient-forest px-5 pb-[4.5rem] pt-6 text-center text-white sm:pt-12">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-soft">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Plano pronto
        </p>
        <h1 className="mx-auto mt-3 max-w-md font-heading text-[1.7rem] font-bold leading-tight sm:text-4xl">
          O que o seu gramado de {result.area_m2} m² pede
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/80">
          {umProduto
            ? `${result.plan[0].name}, na dose do rótulo e na quantidade certa para a sua área.`
            : `${result.plan.length} produtos, na dose do rótulo e na ordem da linha do tempo da embalagem.`}
        </p>
        {veioDaFoto && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/70">
            <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            Feito a partir da sua foto
          </p>
        )}
      </header>

      <div className="mx-auto -mt-14 max-w-5xl px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-10">
        {/* Compra: primeira no celular, coluna fixa à direita no computador */}
        <div className="lg:sticky lg:top-6 lg:order-2">
          {manchas && (
            <p
              role="note"
              className="mb-3 flex items-start gap-3 rounded-2xl border border-gold/50 bg-gold-soft p-4 text-sm leading-relaxed text-txt-primary"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-ink" aria-hidden="true" />
              {AVISO_DE_MANCHAS}
            </p>
          )}

          <CartaoDeCompra ref={botaoRef} compra={compra} areaM2={result.area_m2} />

          {veioDaFoto && <p className="mt-3 px-2 text-center text-xs leading-relaxed text-txt-muted">{AVISO_DA_FOTO}</p>}
        </div>

        {/* Modo de usar */}
        <div className="mt-10 space-y-10 lg:order-1 lg:mt-20">
          {avisos.length > 0 && (
            <section aria-labelledby="titulo-avisos" className="rounded-2xl border border-gold/40 bg-gold-soft/60 p-5">
              <h2 id="titulo-avisos" className="flex items-center gap-2 text-sm font-semibold text-txt-primary">
                <AlertTriangle className="h-4 w-4 text-gold-ink" aria-hidden="true" />
                Para o seu caso
              </h2>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-txt-primary">
                {avisos.map((aviso) => (
                  <li key={aviso} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-ink" aria-hidden="true" />
                    {aviso}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <QuantoUsar plano={result.plan} areaM2={result.area_m2} />
          <ComoAplicar plano={result.plan} />
          <Calendario plano={result.plan} />

          {/* Compartilhar */}
          <section aria-labelledby="titulo-compartilhar" className="rounded-2xl border border-border-subtle bg-bg-surface p-5">
            <h2 id="titulo-compartilhar" className="font-heading text-lg font-bold text-txt-primary">
              Guarde ou envie o plano
            </h2>
            <p className="mt-1 text-sm text-txt-secondary">
              Para consultar na hora de aplicar, ou mandar para quem cuida do gramado.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={compartilhar}
                className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl bg-whatsapp px-4 text-sm font-semibold text-white transition-colors hover:bg-whatsapp-ink active:scale-[0.98]"
              >
                <IconeDoWhatsApp />
                Enviar pelo WhatsApp
              </button>
              <button
                type="button"
                onClick={copiar}
                className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-xl border-2 border-border-medium bg-bg-surface px-4 text-sm font-semibold text-txt-primary transition-colors hover:border-forest/40 active:scale-[0.98]"
              >
                {copiado ? <Check className="h-4 w-4 text-forest" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
                <span aria-live="polite">{copiado ? 'Link copiado' : 'Copiar link'}</span>
              </button>
            </div>
          </section>

          <div className="text-center">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-semibold text-txt-secondary underline-offset-4 hover:text-forest hover:underline"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Refazer o cálculo
            </button>
          </div>
        </div>
      </div>

      {/* Barra fixa no topo do celular: o preço e o botão seguem a rolagem.
          No topo, e não embaixo, porque embaixo fica o menu de navegação.
          Em portal: o contêiner animado da calculadora tem transform, e
          position:fixed dentro de transform deixa de ser fixo na tela. */}
      {montado &&
        createPortal(
          <div
            aria-hidden={!botaoForaDaTela}
            className={`fixed inset-x-0 top-0 z-40 border-b border-border-subtle bg-bg-surface/95 backdrop-blur-lg transition-transform duration-300 motion-reduce:transition-none lg:hidden ${botaoForaDaTela ? 'translate-y-0' : '-translate-y-full'}`}
          >
            <div className="flex items-center gap-3 px-4 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top))]">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-txt-secondary">
                  {umProduto ? `${result.plan[0].name}, ${result.plan[0].packs_display}` : `Plano com ${result.plan.length} produtos`}
                </p>
                <p className="font-heading text-lg font-bold leading-tight text-forest">{formatCurrency(compra.total)}</p>
              </div>
              <button
                type="button"
                onClick={compra.comprar}
                disabled={compra.estado === 'adicionando'}
                tabIndex={botaoForaDaTela ? 0 : -1}
                className="flex min-h-[44px] flex-shrink-0 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-60"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {compra.estado === 'adicionado' ? 'Ver carrinho' : compra.estado === 'adicionando' ? 'Adicionando' : 'Adicionar'}
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

function IconeDoWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24ZM8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01Z" />
    </svg>
  )
}
