'use client'

import { ReactNode, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/cn'
import { focaveisDentro, prenderFoco } from '@/lib/utils/prender-foco'
import { X } from 'lucide-react'
import { Button } from './Button'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  const painelRef = useRef<HTMLDivElement>(null)
  // useId no lugar do 'modal-title' fixo: com dois modais montados, os dois
  // apontavam o aria-labelledby para o mesmo id.
  const idBase = useId()
  const tituloId = `${idBase}-titulo`
  const descricaoId = `${idBase}-descricao`

  // Bloquear scroll do body quando modal aberto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  // Foco: entra no diálogo ao abrir e volta para quem abriu ao fechar. Antes
  // ele ficava no botão da página de trás, e o Tab seguinte continuava por
  // baixo do overlay.
  useEffect(() => {
    if (!open) return
    const quemAbriu = document.activeElement as HTMLElement | null
    const painel = painelRef.current
    if (painel && !painel.contains(document.activeElement)) {
      // Primeiro campo ou botão do conteúdo; o painel em si é a reserva
      // (tabIndex -1) quando o modal só tem texto.
      const alvo = focaveisDentro(painel)[0] ?? painel
      alvo.focus()
    }
    return () => {
      if (quemAbriu && document.contains(quemAbriu)) quemAbriu.focus()
    }
  }, [open])

  if (!open) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? tituloId : undefined}
      aria-describedby={description ? descricaoId : undefined}
      onKeyDown={(e) => prenderFoco(e, painelRef.current)}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={painelRef}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full rounded-2xl bg-white p-6 shadow-2xl',
          'animate-fade-in focus:outline-none',
          sizes[size]
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              {title && (
                <h2
                  id={tituloId}
                  className="font-display text-2xl font-bold text-terravik-brown"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descricaoId}
                  className="mt-1 text-sm text-terravik-brown/60"
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full p-2"
                aria-label="Fechar modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="text-terravik-brown">{children}</div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
