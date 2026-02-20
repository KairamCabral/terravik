'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  User,
  Package,
  Heart,
  Settings,
  GraduationCap,
  LogOut,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { Container } from '@/components/ui'

/**
 * Layout da Área do Cliente
 * 
 * Navegação lateral (desktop) / horizontal (mobile)
 * Design consistente com o site principal
 */

const CONTA_MENU = [
  { label: 'Visão Geral', href: '/conta', icon: LayoutDashboard, exact: true },
  { label: 'Meus Dados', href: '/conta/dados', icon: User },
  { label: 'Meus Pedidos', href: '/conta/pedidos', icon: Package },
  { label: 'Favoritos', href: '/conta/favoritos', icon: Heart },
  { label: 'Cursos', href: '/conta/academia', icon: GraduationCap },
  { label: 'Preferências', href: '/conta/preferencias', icon: Settings },
]

export default function ContaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, isAdmin, signOut } = useAuth()

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Usuário'

  const handleLogout = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <Container spacing="lg">
      <div className="flex flex-col lg:flex-row gap-8 pb-12">
        {/* Sidebar Desktop */}
        <aside className="lg:w-64 flex-shrink-0">
          {/* User card */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={userName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-forest">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-neutral-900 truncate">{userName}</p>
                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Nav — scrollable horizontally on mobile, vertical on desktop */}
          <nav className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
            {/* Mobile: horizontal scroll */}
            <div className="flex lg:hidden overflow-x-auto gap-1 p-2">
              {CONTA_MENU.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-forest/10 text-forest'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Desktop: vertical list */}
            <div className="hidden lg:block p-2">
              {CONTA_MENU.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-forest/10 text-forest'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 opacity-40" />}
                  </Link>
                )
              })}

              {/* Admin link (se for admin) */}
              {isAdmin && (
                <>
                  <div className="my-2 border-t border-neutral-100" />
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Painel Admin</span>
                  </Link>
                </>
              )}

              {/* Logout */}
              <div className="my-2 border-t border-neutral-100" />
              
              {/* Links úteis (sutil) */}
              <div className="px-4 py-3 space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                    Ajuda
                  </p>
                  <div className="space-y-1.5">
                    <Link
                      href="/trocas-devolucoes"
                      className="block text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                    >
                      Trocas e devoluções
                    </Link>
                    <Link
                      href="/contato"
                      className="block text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                    >
                      Falar com a equipe
                    </Link>
                  </div>
                </div>
                
                {/* Horário de atendimento */}
                <div className="pt-2 border-t border-neutral-50">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold mb-1.5">
                    Atendimento
                  </p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Seg a Sex<br />
                    <span className="text-neutral-400">8h30-12h / 13h30-17h</span>
                  </p>
                </div>
              </div>
              
              <div className="my-2 border-t border-neutral-100" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair da conta</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </Container>
  )
}
