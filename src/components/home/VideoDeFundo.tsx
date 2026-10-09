'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { economizandoDados, preferemMenosMovimento } from '@/lib/utils/midia'
import type { FontesDeVideo } from './video-secao'

/**
 * Vídeo em loop sobre um pôster. Só a parte que precisa de navegador: a
 * seção e o pôster continuam no servidor, em VideoSection.
 *
 * Desenhado para nunca competir com a página:
 *
 * 1. Não baixa nada antes do `load` da janela e de o navegador ficar ocioso.
 *    Vídeo que começa junto com a página divide banda com o CSS e com as
 *    imagens do topo, justamente no celular.
 * 2. Não baixa nada com economia de dados ligada ou em conexão 2G.
 * 3. Não toca sozinho para quem pede menos movimento. Nesses dois casos fica
 *    o pôster, parado, com um botão de reproduzir à vista.
 * 4. Pausa fora da tela, e só retoma sozinho se a pausa não foi da pessoa.
 * 5. Tem controle de pausa sempre no HTML (ver o botão, no fim do arquivo).
 *
 * O vídeo aparece por cima do pôster com um fade, só depois do primeiro
 * quadro tocando. Se o arquivo faltar (404) ou o navegador recusar os
 * formatos, o pôster fica: nada de retângulo preto.
 *
 * Precisa de um pai com `relative` e `group`.
 */

/** Roda `tarefa` depois do load da janela, com o navegador ocioso. */
function depoisDoCarregamento(tarefa: () => void): () => void {
  let cancelado = false
  const rodar = () => {
    if (!cancelado) tarefa()
  }
  const agendar = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(rodar, { timeout: 2000 })
    } else {
      setTimeout(rodar, 200)
    }
  }

  if (document.readyState === 'complete') agendar()
  else window.addEventListener('load', agendar, { once: true })

  return () => {
    cancelado = true
    window.removeEventListener('load', agendar)
  }
}

export function VideoDeFundo({ fontes: disponivel }: { fontes: FontesDeVideo }) {
  const ref = useRef<HTMLVideoElement>(null)
  /** Fontes já entregues ao <video>. null = nada foi baixado ainda. */
  const [fontes, setFontes] = useState<FontesDeVideo | null>(null)
  const [tocando, setTocando] = useState(false)
  const [visivel, setVisivel] = useState(false)
  const [falhou, setFalhou] = useState(false)
  /**
   * O controle passou para a pessoa: pediu menos movimento, economiza dados,
   * o navegador recusou o autoplay ou ela mesma pausou. Daí em diante o botão
   * fica à vista, inclusive com o vídeo tocando: em tela de toque não há foco
   * nem mouse por cima para fazê-lo reaparecer.
   */
  const [esperaAPessoa, setEsperaAPessoa] = useState(false)
  /** Pausa pedida pela pessoa. A pausa automática fora da tela não conta. */
  const pausaManual = useRef(false)

  // Decide se o vídeo toca sozinho.
  useEffect(() => {
    if (preferemMenosMovimento() || economizandoDados()) {
      setEsperaAPessoa(true)
      return
    }
    return depoisDoCarregamento(() => setFontes(disponivel))
  }, [disponivel])

  // Com as fontes no DOM, carrega e toca.
  useEffect(() => {
    const el = ref.current
    if (!fontes || !el) return

    // Mudo pela propriedade, e não só pelo atributo: é a propriedade que a
    // política de autoplay consulta, e o React não garante o atributo.
    el.muted = true
    el.load()
    el.play().catch(() => {
      // Autoplay recusado (modo de economia do iOS, por exemplo). Não é erro:
      // o pôster continua e o botão oferece o play.
      setEsperaAPessoa(true)
    })

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) el.pause()
        else if (!pausaManual.current) el.play().catch(() => {})
      },
      { threshold: 0.2 }
    )
    observador.observe(el)
    return () => observador.disconnect()
  }, [fontes])

  if (falhou) return null

  const alternar = () => {
    const el = ref.current
    if (!el) return

    // Primeiro play pedido pela pessoa: nada foi baixado ainda.
    if (!fontes) {
      pausaManual.current = false
      setFontes(disponivel)
      return
    }
    if (el.paused) {
      pausaManual.current = false
      el.play().catch(() => {})
    } else {
      pausaManual.current = true
      setEsperaAPessoa(true)
      el.pause()
    }
  }

  return (
    <>
      <video
        ref={ref}
        aria-hidden="true"
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="none"
        onPlaying={() => {
          setTocando(true)
          setVisivel(true)
        }}
        onPause={() => setTocando(false)}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none',
          visivel ? 'opacity-100' : 'opacity-0'
        )}
      >
        {fontes?.webm && <source src={fontes.webm} type="video/webm" />}
        {/* O erro no ÚLTIMO <source> é o único que significa "nenhum formato
            serviu". Erro no WebM só faz o navegador tentar o MP4. */}
        {fontes && (
          <source src={fontes.mp4} type="video/mp4" onError={() => setFalhou(true)} />
        )}
      </video>

      {/*
        O botão está SEMPRE no HTML. A WCAG 2.2.2 (nível A, o mínimo) exige um
        jeito de parar movimento automático com mais de 5 s, e quem mais
        depende disso navega por teclado ou leitor de tela.

        Com o vídeo tocando sozinho ele fica invisível, para não mudar o visual
        da seção, e surge quando recebe foco pelo Tab ou quando o mouse passa
        sobre o vídeo. Quando o controle passa para a pessoa (menos movimento,
        economia de dados, autoplay recusado ou pausa manual) ele fica à vista:
        sem isso não haveria como dar o play.

        Enquanto invisível ele não recebe clique nem toque (`pointer-events`),
        só teclado: Enter e espaço não passam pelo teste de ponteiro.

        Verde da marca com ícone branco: o vídeo tem fundo branco, e botão
        translúcido claro sumiria nele.
      */}
      <button
        type="button"
        onClick={alternar}
        aria-label={tocando ? 'Pausar vídeo' : 'Reproduzir vídeo'}
        className={cn(
          'absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-forest text-white shadow-md transition-opacity duration-200 motion-reduce:transition-none sm:bottom-4 sm:right-4',
          'focus:outline-none focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          esperaAPessoa
            ? 'opacity-100'
            : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'
        )}
      >
        {tocando ? (
          <Pause className="h-4 w-4 fill-current" strokeWidth={0} aria-hidden="true" />
        ) : (
          <Play className="ml-0.5 h-4 w-4 fill-current" strokeWidth={0} aria-hidden="true" />
        )}
      </button>
    </>
  )
}
