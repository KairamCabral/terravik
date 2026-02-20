// src/app/admin/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GraduationCap,
  MapPin,
  Users,
  RefreshCw,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Menu,
  Palette,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

const ADMIN_MENU = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Customização', href: '/admin/customizacao', icon: Palette },
  { label: 'Cursos', href: '/admin/cursos', icon: GraduationCap },
  { label: 'Onde Encontrar', href: '/admin/lojas', icon: MapPin },
  { label: 'Clientes', href: '/admin/clientes', icon: Users },
  { label: 'Assinaturas', href: '/admin/assinaturas', icon: RefreshCw },
  { label: 'Métricas', href: '/admin/metricas', icon: BarChart3 },
  { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar — posicionado abaixo do header global */}
      <aside
        className={`
          fixed left-0 top-[64px] lg:top-[80px] z-30 h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] bg-white border-r border-neutral-200
          transition-all duration-300
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          hidden lg:block
        `}
      >
        {/* Sidebar header — colapsar/expandir */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-neutral-200">
          {!isSidebarCollapsed && (
            <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Painel Admin</span>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500"
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {ADMIN_MENU.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                  ${isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-neutral-600 hover:bg-neutral-100'
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info + Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200">
          {/* Quick links */}
          {!isSidebarCollapsed && (
            <div className="px-4 py-2 border-b border-neutral-100 bg-neutral-50">
              <a
                href="/conta"
                className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">Área do Cliente</span>
              </a>
            </div>
          )}
          <div className="p-4">
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 font-medium">
                  {profile?.full_name?.charAt(0) || 'A'}
                </span>
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 truncate">
                    {profile?.full_name || 'Admin'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {profile?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
              )}
              {!isSidebarCollapsed && (
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`
          transition-all duration-300
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        {/* Sub-header do admin: mobile menu + busca */}
        <div className="h-12 bg-white border-b border-neutral-200 flex items-center px-4 lg:px-8 gap-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar no painel..."
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-neutral-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-neutral-50"
              />
            </div>
          </div>

          {/* Quick actions */}
          <div className="hidden sm:flex items-center gap-2">
            <button className="relative p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500">
              <Bell className="w-4 h-4" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-[64px] z-50 h-[calc(100vh-64px)] w-64 bg-white lg:hidden"
            >
              {/* Mobile menu header */}
              <div className="h-12 flex items-center justify-between px-4 border-b border-neutral-200">
                <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Painel Admin</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-neutral-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-2">
                {ADMIN_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                      ${pathname === item.href
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-neutral-600 hover:bg-neutral-100'
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // AuthProvider já está no root layout — não duplicar
  return <AdminLayoutInner>{children}</AdminLayoutInner>;
}
