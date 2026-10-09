'use client'

import { useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Calculator, Heart, User, LogOut } from 'lucide-react'
import { NAV_LINKS } from '@/lib/utils/constants'
import { Button } from '@/components/ui'
import { useFavorites } from '@/hooks/useFavorites'
import { useAuth } from '@/components/auth/AuthProvider'
import { cn } from '@/lib/utils/cn'
import { prenderFoco } from '@/lib/utils/prender-foco'

/**
 * MobileMenu — Design System 2026
 *
 * Slide-in panel, design limpo.
 * CTA "Calcular Dose" como primary (forest), não dourado.
 *
 * Acessibilidade: fechado, o painel só saía da tela por translate e
 * continuava lá, focável e lido pelo leitor de tela, então o Tab passava por
 * cada link invisível do menu. Agora ele fica `invisible` quando fechado e,
 * aberto, é um diálogo modal: foco no botão de fechar, Tab preso dentro e
 * foco devolvido ao botão que abriu.
 */

/** Id do painel, para o aria-controls do botão de menu no header. */
export const ID_MENU_MOBILE = 'menu-mobile'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { getFavoritesCount } = useFavorites()
  const { user, profile, signOut } = useAuth()
  const favoritesCount = getFavoritesCount()
  const painelRef = useRef<HTMLDivElement>(null)
  const fecharRef = useRef<HTMLButtonElement>(null)
  const quemAbriuRef = useRef<HTMLElement | null>(null)

  // Fecha devolvendo o foco ANTES. Se o painel ganhasse aria-hidden com o
  // foco ainda dentro dele, o navegador bloquearia o atributo e o leitor de
  // tela ficaria por um instante num elemento escondido.
  const fechar = useCallback(() => {
    const quemAbriu = quemAbriuRef.current
    if (quemAbriu && document.contains(quemAbriu)) quemAbriu.focus()
    onClose()
  }, [onClose])

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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) fechar()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, fechar])

  // Aberto: foco no botão de fechar. O atraso espera o painel sair de
  // `invisible`, porque elemento com visibility:hidden não recebe foco.
  // Fechado por link interno (onClose direto): se o foco ficou dentro do
  // painel, volta para quem abriu em vez de ficar num elemento escondido.
  useEffect(() => {
    if (open) {
      quemAbriuRef.current = document.activeElement as HTMLElement | null
      const t = window.setTimeout(() => fecharRef.current?.focus(), 50)
      return () => window.clearTimeout(t)
    }
    const quemAbriu = quemAbriuRef.current
    quemAbriuRef.current = null
    if (
      quemAbriu &&
      document.contains(quemAbriu) &&
      painelRef.current?.contains(document.activeElement)
    ) {
      quemAbriu.focus()
    }
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-bg-dark/60 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={fechar}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={painelRef}
        id={ID_MENU_MOBILE}
        className={cn(
          'fixed right-0 top-0 z-[60] h-full w-full max-w-sm bg-bg-surface shadow-xl lg:hidden',
          // visibility entra na transição para o painel continuar visível
          // enquanto desliza para fora, e só sumir no fim.
          'transition-[transform,visibility] duration-300',
          open ? 'visible translate-x-0' : 'invisible translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!open}
        onKeyDown={(e) => prenderFoco(e, painelRef.current)}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-subtle p-4">
            <Link href="/" onClick={onClose} className="flex items-center">
              <Image
                src="/logo/Logo-terravik-horizontal-png.png"
                alt="Terravik"
                width={130}
                height={30}
                className="h-7 w-auto"
              />
            </Link>
            <button
              ref={fecharRef}
              type="button"
              onClick={fechar}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-bg-surface-2 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5 text-txt-primary" aria-hidden="true" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Menu principal">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-txt-primary transition-colors hover:bg-forest-soft/40 hover:text-forest active:bg-forest-soft/60"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Seção Minha Conta */}
            <div className="mt-6 pt-6 border-t border-border-subtle">
              <p className="px-4 mb-3 text-xs font-semibold text-txt-secondary uppercase tracking-wide">
                Minha Conta
              </p>

              {/* User info (se logado) */}
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="relative w-9 h-9 rounded-full bg-forest flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {(profile?.full_name || user.email || '?').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-txt-primary truncate">
                      {profile?.full_name || 'Usuário'}
                    </p>
                    <p className="text-xs text-txt-secondary truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <ul className="space-y-1">
                <li>
                  <Link
                    href={user ? '/conta/favoritos' : '/favoritos'}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-txt-primary transition-colors hover:bg-forest-soft/40 hover:text-forest active:bg-forest-soft/60"
                  >
                    <Heart className="w-5 h-5" aria-hidden="true" />
                    <span>Favoritos</span>
                    {favoritesCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-error px-1.5 text-xs font-bold text-white">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/conta"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-txt-primary transition-colors hover:bg-forest-soft/40 hover:text-forest active:bg-forest-soft/60"
                  >
                    <User className="w-5 h-5" aria-hidden="true" />
                    <span>{user ? 'Área do Cliente' : 'Entrar / Criar Conta'}</span>
                  </Link>
                </li>
                {user && (
                  <li>
                    <button
                      onClick={async () => {
                        await signOut()
                        onClose()
                      }}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-txt-primary transition-colors hover:bg-red-50 hover:text-red-600 active:bg-red-100 w-full"
                    >
                      <LogOut className="w-5 h-5" aria-hidden="true" />
                      <span>Sair</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </nav>

          {/* Footer CTA */}
          <div className="border-t border-border-subtle p-4 space-y-3">
            <Button fullWidth variant="primary" size="lg" asChild>
              <Link
                href="/calculadora"
                onClick={onClose}
                className="flex items-center justify-center gap-2"
              >
                <Calculator className="h-5 w-5" aria-hidden="true" />
                Calcular Dose Ideal
              </Link>
            </Button>
            <p className="text-center text-xs text-txt-secondary">
              Gratuito · Resultado em 30 segundos
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
