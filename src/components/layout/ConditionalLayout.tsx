// src/components/layout/ConditionalLayout.tsx
'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Header, Footer, RotatingAnnouncementBar, MobileBottomNav } from '@/components/layout';

const CartDrawer = dynamic(
  () => import('@/components/cart').then((m) => ({ default: m.CartDrawer })),
  { ssr: false }
);
const QuickPurchaseSheet = dynamic(
  () => import('@/components/quick-purchase').then((m) => ({ default: m.QuickPurchaseSheet })),
  { ssr: false }
);

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rotas de áreas logadas (admin e conta do cliente)
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAccountRoute = pathname?.startsWith('/conta');
  const isAuthRoute = pathname?.startsWith('/login') || 
                      pathname?.startsWith('/cadastro') || 
                      pathname?.startsWith('/recuperar-senha') ||
                      pathname?.startsWith('/redefinir-senha');
  const isCheckoutRoute = pathname?.startsWith('/checkout') ||
                          pathname?.startsWith('/pedido-confirmado');
  const isCalculatorRoute = pathname === '/calculadora';

  // Fullscreen routes: layout próprio (sem header, footer, cart drawer)
  if (isCheckoutRoute || isCalculatorRoute) {
    return <>{children}</>;
  }

  const isAuthenticatedArea = isAdminRoute || isAccountRoute || isAuthRoute;

  if (isAuthenticatedArea) {
    // Layout para áreas autenticadas: Header colado no topo + conteúdo (sem footer/announcement/carrinho)
    return (
      <>
        <Header />
        <main className="min-h-screen pt-[64px] lg:pt-[80px]">
          {children}
        </main>
      </>
    );
  }

  // Layout público completo (com bottom nav mobile)
  return (
    <>
      <RotatingAnnouncementBar />
      <Header />
      <main id="main-content" className="min-h-screen pt-[104px] lg:pt-[120px] pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <QuickPurchaseSheet />
      <MobileBottomNav />
    </>
  );
}
