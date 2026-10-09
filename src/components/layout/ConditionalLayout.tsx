// src/components/layout/ConditionalLayout.tsx
'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Header, Footer, RotatingAnnouncementBar, MobileBottomNav } from '@/components/layout';
import { AREAS_AUTENTICADAS, dentroDe, dentroDeAlguma } from '@/lib/utils/routes';

const CartDrawer = dynamic(
  () => import('@/components/cart').then((m) => ({ default: m.CartDrawer })),
  { ssr: false }
);
const QuickPurchaseSheet = dynamic(
  () => import('@/components/quick-purchase').then((m) => ({ default: m.QuickPurchaseSheet })),
  { ssr: false }
);

interface ConditionalLayoutProps {
  children: React.ReactNode
  /** Links de produto do rodapé, resolvidos no servidor pelo RootLayout. */
  produtosNoRodape?: Array<{ label: string; href: string }>
}

export function ConditionalLayout({ children, produtosNoRodape }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // dentroDe respeita a fronteira de segmento: com startsWith puro,
  // '/contato' casava com '/conta' e a página pública de contato saía sem
  // rodapé, sem barra de anúncio e sem gaveta de carrinho.
  const isCheckoutRoute = dentroDe(pathname, '/checkout') ||
                          dentroDe(pathname, '/pedido-confirmado');
  const isCalculatorRoute = pathname === '/calculadora';

  // Fullscreen routes: layout próprio (sem header, footer, cart drawer)
  if (isCheckoutRoute || isCalculatorRoute) {
    return <>{children}</>;
  }

  // Áreas logadas (admin e conta do cliente) e telas de autenticação
  const isAuthenticatedArea = dentroDeAlguma(pathname, AREAS_AUTENTICADAS);

  if (isAuthenticatedArea) {
    // Layout para áreas autenticadas: Header colado no topo + conteúdo (sem footer/announcement/carrinho)
    return (
      <>
        <Header />
        <main id="main-content" className="min-h-screen pt-[64px] lg:pt-[80px]">
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
      <Footer produtos={produtosNoRodape} />
      <CartDrawer />
      <QuickPurchaseSheet />
      <MobileBottomNav />
    </>
  );
}
