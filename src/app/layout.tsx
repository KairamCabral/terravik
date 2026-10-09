import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Inter, Fraunces } from 'next/font/google'
import '@/styles/globals.css'
import { organizationSchema, websiteSchema, jsonLd } from '@/lib/seo/metadata'
import { SITE, ALLOW_INDEXING } from '@/lib/utils/constants'
import { CartProvider } from '@/components/cart'
import { ToastProvider } from '@/components/ui'
import { ServiceWorkerRegister } from '@/components/pwa'
import { GoogleAnalytics } from '@/components/analytics'
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import { QuickPurchaseProvider } from '@/contexts/QuickPurchaseContext'
import { getLinksDeProdutoDoRodape } from '@/lib/shopify/footer-links'

// ── Fonts Premium (Design System 2026) ───────────────────

// Inter — Body & UI (sans-serif moderna e legível)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
})

// Fraunces — Headings (serifada ótica, premium)
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['500', '600'],
})

// Compat: alias (Tailwind fontFamily em typography.ts cuida do mapeamento
// playfair → fraunces e cormorant → fraunces nos class names)

// ---- Global Metadata ----

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'fertilizante para gramado',
    'adubo para grama',
    'como adubar gramado',
    'fertilizante NPK gramado',
    'gramado bonito',
    'gramado residencial',
    'Terravik',
    'gramado novo',
    'verde rápido',
    'resistência total',
    'dose certa fertilizante',
    'calcular fertilizante gramado',
  ],
  authors: [{ name: 'Terravik' }],
  creator: 'Terravik',
  publisher: 'Terravik',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: '/images/og/default.jpg',
        width: 1200,
        height: 630,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ['/images/og/default.jpg'],
  },
  robots: ALLOW_INDEXING
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      }
    : { index: false, follow: false, nocache: true },
  verification: {
    // google: 'seu-codigo-aqui',
  },
}

// ---- Layout ----

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const produtosNoRodape = await getLinksDeProdutoDoRodape()

  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(organizationSchema()),
          }}
        />

        {/* JSON-LD: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(websiteSchema()),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <GoogleAnalytics />
        <AuthProvider>
          <FavoritesProvider>
            <SubscriptionProvider>
              {/* ToastProvider por fora: o CartProvider avisa falha por toast. */}
              <ToastProvider>
                <CartProvider>
                  <QuickPurchaseProvider>
                    <ServiceWorkerRegister />
                    <Suspense fallback={<div className="min-h-screen" />}>
                      <ConditionalLayout produtosNoRodape={produtosNoRodape}>
                        {children}
                      </ConditionalLayout>
                    </Suspense>
                  </QuickPurchaseProvider>
                </CartProvider>
              </ToastProvider>
            </SubscriptionProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
