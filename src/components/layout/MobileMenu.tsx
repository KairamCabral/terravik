'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Calculator, Heart, User, LogOut } from 'lucide-react'
import { NAV_LINKS } from '@/lib/utils/constants'
import { Button } from '@/components/ui'
import { useFavorites } from '@/hooks/useFavorites'
import { useAuth } from '@/components/auth/AuthProvider'
import { cn } from '@/lib/utils/cn'

/**
 * MobileMenu — Design System 2026
 *
 * Slide-in panel, design limpo.
 * CTA "Calcular Dose" como primary (forest), não dourado.
 */

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { getFavoritesCount } = useFavorites()
  const { user, profile, signOut } = useAuth()
  const favoritesCount = getFavoritesCount()

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
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-bg-dark/60 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 z-[60] h-full w-full max-w-sm bg-bg-surface shadow-xl transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-label="Menu de navegação mobile"
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
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-bg-surface-2 transition-colors"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5 text-txt-primary" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Menu mobile">
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
              <p className="px-4 mb-3 text-xs font-semibold text-txt-muted uppercase tracking-wide">
                Minha Conta
              </p>

              {/* User info (se logado) */}
              {user && (
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="relative w-9 h-9 rounded-full bg-forest flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt="Avatar"
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
                    <p className="text-xs text-txt-muted truncate">{user.email}</p>
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
                    <Heart className="w-5 h-5" />
                    <span>Favoritos</span>
                    {favoritesCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
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
                    <User className="w-5 h-5" />
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
                      <LogOut className="w-5 h-5" />
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
                <Calculator className="h-5 w-5" />
                Calcular Dose Ideal
              </Link>
            </Button>
            <p className="text-center text-xs text-txt-muted">
              Gratuito · Resultado em 30 segundos
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
