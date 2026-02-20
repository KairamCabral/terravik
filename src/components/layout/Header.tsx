'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Menu, ShoppingCart, Calculator, User, Heart } from 'lucide-react'
import { NAV_LINKS } from '@/lib/utils/constants'
import { Button } from '@/components/ui'
import { MobileMenu } from './MobileMenu'
import { useCart } from '@/components/cart'
import { useFavorites } from '@/hooks/useFavorites'
import { useAuth } from '@/components/auth/AuthProvider'
import { SearchBar } from '@/components/search'
import { cn } from '@/lib/utils/cn'

/**
 * Header Premium - UI/UX Avançado
 * 
 * Técnicas aplicadas:
 * - Optical alignment com padding assimétrico
 * - Icon consistency (todos 20x20px)
 * - Spacing rhythm (4px base, 8px items, 12px sections)
 * - Visual hierarchy clara
 * - Hover states suaves e consistentes
 * - Badge positioning com z-index correto
 * - Flexbox gap para espaçamento perfeito
 * - Mobile-first com progressive enhancement
 */

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { cart, openCart } = useCart()
  const { getFavoritesCount } = useFavorites()
  const { user, profile, isLoading: authLoading } = useAuth()

  const totalQuantity = cart?.totalQuantity || 0
  const favoritesCount = getFavoritesCount()

  // Detectar se está em área autenticada (admin, conta, auth pages)
  const isAuthenticatedArea = pathname?.startsWith('/admin') ||
    pathname?.startsWith('/conta') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/cadastro') ||
    pathname?.startsWith('/recuperar-senha') ||
    pathname?.startsWith('/redefinir-senha')

  // Avatar ou iniciais do usuário
  const userInitial = profile?.full_name
    ? profile.full_name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || ''

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-300',
          isAuthenticatedArea
            ? // Área logada: colado no topo, versão verde escura
              'top-0 bg-[#1a3a2a] border-b border-[#2a5a3a]'
            : // Site público: abaixo da announcement bar
              cn(
                'top-[40px]',
                'bg-white lg:bg-white/95 lg:backdrop-blur-md',
                'border-b border-neutral-200',
                scrolled && 'shadow-md lg:bg-white'
              )
        )}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          {/* Container com alinhamento perfeito */}
          <div className="flex h-16 lg:h-20 items-center justify-between">
            
            {/* ═══ Logo ═══ */}
            <Link
              href="/"
              className="flex items-center flex-shrink-0 transition-opacity hover:opacity-80"
            >
              <Image
                src="/logo/Logo-terravik-horizontal-png.png"
                alt="Terravik"
                width={160}
                height={36}
                className={cn(
                  'h-8 lg:h-10 w-auto',
                  isAuthenticatedArea && 'brightness-0 invert'
                )}
                priority
              />
            </Link>

            {/* ═══ Desktop Navigation ═══ */}
            <nav 
              className="hidden lg:flex flex-1 justify-center px-8" 
              aria-label="Navegação principal"
            >
              <ul className="flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'relative px-4 py-2 text-sm font-medium transition-colors',
                        isAuthenticatedArea
                          ? 'text-white/80 hover:text-white'
                          : 'text-neutral-700 hover:text-forest',
                        // Underline sutil no hover
                        'after:content-[\'\'] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2',
                        'after:w-0 after:h-[2px] after:rounded-full',
                        'after:transition-all after:duration-300 hover:after:w-3/4',
                        isAuthenticatedArea ? 'after:bg-white' : 'after:bg-forest'
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ═══ Desktop Actions ═══ */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {/* Search */}
              <SearchBar />
              
              {/* Icon Actions Group - Alinhamento perfeito */}
              <div className="flex items-center gap-1">
                {/* Favoritos */}
                <Link
                  href={user ? '/conta/favoritos' : '/favoritos'}
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors group',
                    isAuthenticatedArea ? 'hover:bg-white/10' : 'hover:bg-neutral-100'
                  )}
                  aria-label={`Favoritos (${favoritesCount})`}
                  title="Meus Favoritos"
                >
                  <Heart className={cn(
                    'w-5 h-5 transition-colors',
                    isAuthenticatedArea
                      ? 'text-white/80 group-hover:text-white'
                      : 'text-neutral-700 group-hover:text-forest'
                  )} />
                  {favoritesCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {favoritesCount}
                    </span>
                  )}
                </Link>

                {/* Área do Cliente */}
                <Link
                  href="/conta"
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-lg transition-colors group',
                    isAuthenticatedArea ? 'hover:bg-white/10' : 'hover:bg-neutral-100'
                  )}
                  aria-label="Minha Conta"
                  title={user ? (profile?.full_name || 'Minha Conta') : 'Entrar'}
                >
                  {!authLoading && user ? (
                    profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt="Avatar"
                        width={28}
                        height={28}
                        className={cn(
                          'rounded-full object-cover ring-2 transition-all',
                          isAuthenticatedArea
                            ? 'ring-white/30 group-hover:ring-white/60'
                            : 'ring-forest/20 group-hover:ring-forest/40'
                        )}
                      />
                    ) : (
                      <div className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center ring-2 transition-all',
                        isAuthenticatedArea
                          ? 'bg-white/20 ring-white/30 group-hover:ring-white/60'
                          : 'bg-forest ring-forest/20 group-hover:ring-forest/40'
                      )}>
                        <span className="text-xs font-bold text-white">{userInitial}</span>
                      </div>
                    )
                  ) : (
                    <User className={cn(
                      'w-5 h-5 transition-colors',
                      isAuthenticatedArea
                        ? 'text-white/80 group-hover:text-white'
                        : 'text-neutral-700 group-hover:text-forest'
                    )} />
                  )}
                </Link>

                {/* Carrinho */}
                <button
                  onClick={openCart}
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors group',
                    isAuthenticatedArea ? 'hover:bg-white/10' : 'hover:bg-neutral-100'
                  )}
                  aria-label={`Carrinho (${totalQuantity} ${totalQuantity === 1 ? 'item' : 'itens'})`}
                  title="Carrinho de Compras"
                >
                  <ShoppingCart className={cn(
                    'w-5 h-5 transition-colors',
                    isAuthenticatedArea
                      ? 'text-white/80 group-hover:text-white'
                      : 'text-neutral-700 group-hover:text-forest'
                  )} />
                  {totalQuantity > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-400 px-1 text-[9px] font-bold text-white">
                      {totalQuantity}
                    </span>
                  )}
                </button>
              </div>

              {/* Separator sutil */}
              <div className={cn('w-px h-6 mx-1', isAuthenticatedArea ? 'bg-white/20' : 'bg-neutral-200')} />
              
              {/* CTA Calculadora */}
              {isAuthenticatedArea ? (
                <Link
                  href="/calculadora"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-amber-400 text-[#1a3a2a] hover:bg-amber-300 shadow-sm hover:shadow-md transition-all"
                >
                  <Calculator className="w-4 h-4" />
                  <span className="whitespace-nowrap">Calcular Dose</span>
                </Link>
              ) : (
                <Button 
                  size="md" 
                  variant="primary" 
                  asChild 
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href="/calculadora" className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    <span className="whitespace-nowrap">Calcular Dose</span>
                  </Link>
                </Button>
              )}
            </div>

            {/* ═══ Mobile Actions ═══ */}
            <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
              {/* Search Mobile */}
              <SearchBar />
              
              {/* Icon Group Mobile */}
              <div className="flex items-center gap-1">
                {/* Favoritos Mobile */}
                <Link
                  href={user ? '/conta/favoritos' : '/favoritos'}
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
                    isAuthenticatedArea ? 'hover:bg-white/10' : 'hover:bg-neutral-100'
                  )}
                  aria-label={`Favoritos (${favoritesCount})`}
                >
                  <Heart className={cn('w-5 h-5', isAuthenticatedArea ? 'text-white/80' : 'text-neutral-700')} />
                  {favoritesCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {favoritesCount}
                    </span>
                  )}
                </Link>

                {/* Cart Mobile */}
                <button
                  onClick={openCart}
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
                    isAuthenticatedArea ? 'hover:bg-white/10' : 'hover:bg-neutral-100'
                  )}
                  aria-label={`Carrinho (${totalQuantity})`}
                >
                  <ShoppingCart className={cn('w-5 h-5', isAuthenticatedArea ? 'text-white/80' : 'text-neutral-700')} />
                  {totalQuantity > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-400 px-1 text-[9px] font-bold text-white">
                      {totalQuantity}
                    </span>
                  )}
                </button>

                {/* Menu Mobile */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
                    isAuthenticatedArea ? 'hover:bg-white/10' : 'hover:bg-neutral-100'
                  )}
                  aria-label="Abrir menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <Menu className={cn('w-5 h-5', isAuthenticatedArea ? 'text-white/80' : 'text-neutral-700')} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  )
}
