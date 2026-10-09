'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProductImage } from '@/types/product'
import { cn } from '@/lib/utils/cn'

interface GaleriaEmTelaCheiaProps {
  images: ProductImage[]
  selectedIndex: number
  onClose: () => void
  onSelect: (index: number) => void
  /** Nome do produto, para o texto alternativo e o rótulo do diálogo. */
  title?: string
}

/**
 * Foto do produto em tela cheia.
 *
 * A caixa da foto tem o tamanho da tela (`absolute inset-0`), e não um
 * `max-h/max-w` sem largura própria: com filho `w-full`, aquela caixa podia
 * medir 0x0 e a foto carregava invisível.
 *
 * Teclado: Esc fecha, setas trocam de foto, Tab fica preso no diálogo e o foco
 * volta para quem abriu. Toque: arrastar para o lado troca de foto. Clique na
 * foto amplia no ponto clicado; outro clique volta.
 */
export function GaleriaEmTelaCheia({
  images,
  selectedIndex,
  onClose,
  onSelect,
  title,
}: GaleriaEmTelaCheiaProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const fecharRef = useRef<HTMLButtonElement>(null)
  const inicioDoToque = useRef<number | null>(null)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)

  const total = images.length
  const imagem = images[selectedIndex]

  const ir = useCallback(
    (index: number) => {
      if (index < 0 || index > total - 1) return
      setZoom(null)
      onSelect(index)
    },
    [onSelect, total]
  )

  // Foco entra ao abrir e volta para quem abriu ao fechar.
  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    fecharRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      anterior?.focus?.()
    }
  }, [])

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        ir(selectedIndex - 1)
      } else if (e.key === 'ArrowRight') {
        ir(selectedIndex + 1)
      } else if (e.key === 'Tab') {
        // Foco preso: só os controles do diálogo.
        const focaveis = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled])'
        )
        if (!focaveis || focaveis.length === 0) return
        const primeiro = focaveis[0]
        const ultimo = focaveis[focaveis.length - 1]
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault()
          ultimo.focus()
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault()
          primeiro.focus()
        }
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onClose, ir, selectedIndex])

  if (!imagem) return null

  const alternarZoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (zoom) {
      setZoom(null)
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  const descricao = imagem.alt || (title ? `${title}, foto ${selectedIndex + 1} de ${total}` : `Foto ${selectedIndex + 1} de ${total}`)

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title ? `Fotos de ${title}` : 'Fotos do produto'}
      className="fixed inset-0 z-[100] bg-black/95"
      onPointerDown={(e) => {
        if (e.pointerType === 'touch') inicioDoToque.current = e.clientX
      }}
      onPointerUp={(e) => {
        if (e.pointerType !== 'touch' || inicioDoToque.current === null || zoom) return
        const distancia = e.clientX - inicioDoToque.current
        inicioDoToque.current = null
        if (distancia > 50) ir(selectedIndex - 1)
        else if (distancia < -50) ir(selectedIndex + 1)
      }}
    >
      {/* Caixa da foto: do tamanho da tela, com respiro para os controles. */}
      <button
        type="button"
        onClick={alternarZoom}
        className={cn(
          'absolute inset-0 overflow-hidden px-4 py-16 sm:px-20',
          zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
        )}
        aria-label={zoom ? 'Reduzir a foto' : 'Ampliar a foto'}
      >
        <span className="relative block h-full w-full">
          <Image
            key={imagem.url}
            src={imagem.url}
            alt={descricao}
            fill
            sizes="100vw"
            className="object-contain transition-transform duration-200 ease-out motion-reduce:transition-none"
            style={
              zoom
                ? { transform: 'scale(2.5)', transformOrigin: `${zoom.x}% ${zoom.y}%` }
                : undefined
            }
          />
        </span>
      </button>

      <button
        ref={fecharRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Fechar fotos"
      >
        <X className="h-8 w-8" aria-hidden="true" />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => ir(selectedIndex - 1)}
            disabled={selectedIndex === 0}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 disabled:opacity-30"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="h-8 w-8" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => ir(selectedIndex + 1)}
            disabled={selectedIndex === total - 1}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 disabled:opacity-30"
            aria-label="Próxima foto"
          >
            <ChevronRight className="h-8 w-8" aria-hidden="true" />
          </button>
          <p
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/80"
            aria-live="polite"
          >
            {selectedIndex + 1} / {total}
          </p>
        </>
      )}
    </div>
  )
}
