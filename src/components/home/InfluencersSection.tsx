'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { createClient } from '@/lib/supabase/client'

/**
 * Depoimentos em vídeo de quem usa Terravik.
 *
 * Uma faixa só, com rolagem nativa (que é o que funciona bem em toque e
 * trackpad) somada a arrastar com o mouse e setas. Antes eram duas listas,
 * uma `hidden lg:grid` e outra `flex lg:hidden`: cada depoimento existia duas
 * vezes no DOM (dois <video>, duas capas), e no computador o quinto vídeo
 * caía numa segunda fileira, sem carrossel.
 *
 * UM VÍDEO POR VEZ. Quem manda no play é o estado da seção: tocar um pausa o
 * anterior. Sem isso, quem clica em três cartões fica com três áudios juntos.
 *
 * SEM DADO, SEM SEÇÃO. Os vídeos vêm da tabela `video_testimonials`
 * (cadastro em /admin/customizacao). Não há lista de reserva: depoimento
 * inventado não é placeholder, é prova social falsa.
 *
 * O vídeo fica no storage do Supabase, e por isso depende do `media-src` da
 * CSP em next.config.mjs.
 */

interface Depoimento {
  id: string
  handle: string
  thumbnail: string
  videoUrl?: string
  produto: string
}

interface LinhaDeDepoimento {
  id: string
  handle: string
  thumbnail_url: string | null
  video_url: string | null
  product_name: string | null
}

/** Quantos cartões cabem por tela cheia, no computador. */
const POR_TELA = 4
/** Acima disto, em px, o gesto do mouse é arrasto e não clique. */
const LIMITE_DE_CLIQUE = 4

function CartaoVideo({
  item,
  tocando,
  onAlternar,
  onParou,
}: {
  item: Depoimento
  tocando: boolean
  onAlternar: (id: string) => void
  onParou: (id: string) => void
}) {
  const [semSom, setSemSom] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const temVideo = Boolean(item.videoUrl)

  // Quem manda no play é o estado da seção, para garantir um vídeo por vez.
  useEffect(() => {
    const v = videoRef.current
    if (!v || !temVideo) return
    if (tocando) {
      // Recusado ou interrompido: devolve o cartão ao estado parado.
      v.play().catch(() => onParou(item.id))
    } else {
      if (!v.paused) v.pause()
      if (v.currentTime > 0) v.currentTime = 0
    }
  }, [tocando, temVideo, item.id, onParou])

  const alternarSom = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !semSom
    setSemSom(!semSom)
  }

  return (
    <div className="w-[200px] flex-none snap-start sm:w-[240px] lg:w-[calc((100%-3.75rem)/4)]">
      <div
        className={cn(
          'group relative aspect-[9/16] overflow-hidden rounded-2xl bg-neutral-900 shadow-md transition-shadow duration-300',
          temVideo && 'hover:shadow-xl'
        )}
      >
        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={`Depoimento de ${item.handle}`}
            fill
            className={cn(
              'object-cover transition-opacity duration-300',
              tocando && 'opacity-0'
            )}
            sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 25vw"
            draggable={false}
          />
        )}

        {temVideo && (
          <video
            ref={videoRef}
            src={item.videoUrl}
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              !tocando && 'invisible'
            )}
            loop
            muted={semSom}
            playsInline
            preload="none"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        />

        {/* O cartão inteiro é o botão de play: alvo grande é o que faz este
            formato funcionar no celular. */}
        {temVideo && (
          <button
            type="button"
            onClick={() => onAlternar(item.id)}
            aria-label={`${tocando ? 'Pausar o' : 'Assistir ao'} depoimento de ${item.handle}`}
            aria-pressed={tocando}
            className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
          >
            <span
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/35 backdrop-blur-sm transition-all duration-300 motion-reduce:transition-none',
                tocando
                  ? 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                  : 'group-hover:bg-black/50'
              )}
            >
              {tocando ? (
                <Pause className="h-5 w-5 fill-white text-white" aria-hidden="true" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-white text-white" aria-hidden="true" />
              )}
            </span>
          </button>
        )}

        {tocando && temVideo && (
          <button
            type="button"
            onClick={alternarSom}
            aria-label={semSom ? 'Ativar som' : 'Desativar som'}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {semSom ? (
              <VolumeX className="h-4 w-4 text-white" aria-hidden="true" />
            ) : (
              <Volume2 className="h-4 w-4 text-white" aria-hidden="true" />
            )}
          </button>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4">
          <p className="text-sm font-semibold text-white">{item.handle}</p>
          {item.produto && <p className="mt-0.5 text-xs text-white/70">{item.produto}</p>}
        </div>
      </div>
    </div>
  )
}

const CLASSE_DA_SETA =
  'flex h-10 w-10 items-center justify-center rounded-full border border-border-medium bg-bg-surface-2 text-forest transition-colors hover:border-forest hover:bg-forest hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border-medium disabled:hover:bg-bg-surface-2 disabled:hover:text-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary'

export function InfluencersSection() {
  const [itens, setItens] = useState<Depoimento[]>([])
  const [tocandoId, setTocandoId] = useState<string | null>(null)
  const [podeVoltar, setPodeVoltar] = useState(false)
  const [podeAvancar, setPodeAvancar] = useState(false)
  const reduzirMovimento = useReducedMotion()

  const faixaRef = useRef<HTMLDivElement>(null)
  /** Estado do arrastar com mouse. Toque usa a rolagem nativa. */
  const arrasto = useRef({ ativo: false, xInicial: 0, scrollInicial: 0, moveu: false })

  useEffect(() => {
    let vivo = true
    async function buscar() {
      try {
        const supabase = createClient()
        const { data } = await (supabase as any)
          .from('video_testimonials')
          .select('*')
          .eq('is_active', true)
          .order('"order"', { ascending: true })

        if (vivo && Array.isArray(data) && data.length > 0) {
          setItens(
            (data as LinhaDeDepoimento[]).map((d) => ({
              id: d.id,
              handle: d.handle,
              thumbnail: d.thumbnail_url ?? '',
              videoUrl: d.video_url || undefined,
              produto: d.product_name ?? '',
            }))
          )
        }
      } catch {
        // Sem dado a seção não renderiza, e isso já é tratado abaixo.
      }
    }
    buscar()
    return () => {
      vivo = false
    }
  }, [])

  const alternar = useCallback((id: string) => {
    setTocandoId((atual) => (atual === id ? null : id))
  }, [])

  const parou = useCallback((id: string) => {
    setTocandoId((atual) => (atual === id ? null : atual))
  }, [])

  const medirBordas = useCallback(() => {
    const el = faixaRef.current
    if (!el) return
    setPodeVoltar(el.scrollLeft > 8)
    setPodeAvancar(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    medirBordas()
    window.addEventListener('resize', medirBordas)
    return () => window.removeEventListener('resize', medirBordas)
  }, [medirBordas, itens])

  const rolar = (direcao: 1 | -1) => {
    const el = faixaRef.current
    if (!el) return
    // Um cartão por clique: largura do primeiro cartão mais o espaço entre eles.
    const primeiro = el.firstElementChild as HTMLElement | null
    const espaco = parseFloat(getComputedStyle(el).columnGap) || 0
    const passo = primeiro ? primeiro.offsetWidth + espaco : el.clientWidth / POR_TELA
    el.scrollBy({ left: passo * direcao, behavior: reduzirMovimento ? 'auto' : 'smooth' })
  }

  // ── Arrastar com o mouse ────────────────────────────────────────────────
  // Só para ponteiro de mouse: em toque, interceptar o gesto estraga a
  // rolagem nativa, que já é melhor do que qualquer reimplementação.
  const aoPressionar = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = faixaRef.current
    if (!el) return
    arrasto.current = {
      ativo: true,
      xInicial: e.clientX,
      scrollInicial: el.scrollLeft,
      moveu: false,
    }
  }

  const aoMover = (e: React.PointerEvent) => {
    const el = faixaRef.current
    if (!arrasto.current.ativo || !el) return
    const delta = e.clientX - arrasto.current.xInicial
    if (!arrasto.current.moveu) {
      if (Math.abs(delta) <= LIMITE_DE_CLIQUE) return
      arrasto.current.moveu = true
      // Desliga o encaixe enquanto o mouse segura. `scroll-snap-type:
      // mandatory` reage a cada mudança de `scrollLeft`, e como o arrasto
      // muda esse valor a cada quadro, o encaixe competiria com o gesto.
      // Soltando, o snap volta e a faixa para alinhada no cartão mais próximo.
      el.style.scrollSnapType = 'none'
    }
    el.scrollLeft = arrasto.current.scrollInicial - delta
  }

  const aoSoltar = () => {
    if (!arrasto.current.ativo) return
    arrasto.current.ativo = false
    const el = faixaRef.current
    if (el) el.style.scrollSnapType = ''
  }

  /** O ponteiro saiu da faixa: o clique que viria não cai mais num cartão. */
  const aoSair = () => {
    aoSoltar()
    arrasto.current.moveu = false
  }

  /** Arrastar não pode virar clique no cartão, senão o vídeo abre sem querer. */
  const aoClicarNaFaixa = (e: React.MouseEvent) => {
    if (!arrasto.current.moveu) return
    arrasto.current.moveu = false
    e.preventDefault()
    e.stopPropagation()
  }

  // Sem vídeo cadastrado, a seção inteira não aparece.
  if (itens.length === 0) return null

  const transborda = podeVoltar || podeAvancar

  return (
    <section className="bg-bg-primary section-spacing" aria-labelledby="titulo-depoimentos-video">
      <div className="container-main">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <motion.div
            initial={reduzirMovimento ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* text-gold sobre o creme dá 2,96:1 e reprova AA; gold-ink dá 7,00:1. */}
            <span className="text-overline text-gold-ink tracking-widest uppercase block mb-3">
              Quem usa, aprova
            </span>
            <h2 id="titulo-depoimentos-video" className="font-heading text-h2 text-txt-primary">
              Resultados reais
            </h2>
          </motion.div>

          {transborda && (
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => rolar(-1)}
                disabled={!podeVoltar}
                aria-label="Ver depoimentos anteriores"
                className={CLASSE_DA_SETA}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => rolar(1)}
                disabled={!podeAvancar}
                aria-label="Ver mais depoimentos"
                className={CLASSE_DA_SETA}
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <motion.div
          initial={reduzirMovimento ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div
            ref={faixaRef}
            onScroll={medirBordas}
            onPointerDown={aoPressionar}
            onPointerMove={aoMover}
            onPointerUp={aoSoltar}
            onPointerCancel={aoSair}
            onPointerLeave={aoSair}
            onClickCapture={aoClicarNaFaixa}
            /* `-mx-4 px-4` deixa o cartão encostar na borda da tela no
               celular, em vez de parar no respiro do container: é o que
               mostra que a faixa continua. */
            className={cn(
              'scrollbar-hide -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2',
              'lg:mx-0 lg:scroll-px-0 lg:gap-5 lg:px-0',
              transborda && 'lg:cursor-grab lg:select-none lg:active:cursor-grabbing'
            )}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {itens.map((item) => (
              <CartaoVideo
                key={item.id}
                item={item}
                tocando={tocandoId === item.id}
                onAlternar={alternar}
                onParou={parou}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
