'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { pageview, GA_MEASUREMENT_ID } from '@/lib/analytics/gtag'

/**
 * No painel do GA4, desligar em Medição aprimorada "Alterações de página com
 * base em eventos do histórico do navegador". O App Router navega por
 * history.pushState: com o gatilho ligado, cada troca de rota conta duas vezes.
 */
export function GoogleAnalytics() {
  const pathname = usePathname()
  const primeiraRota = useRef(true)

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    // A primeira tela já foi contada pelo gtag('config') abaixo.
    if (primeiraRota.current) {
      primeiraRota.current = false
      return
    }

    pageview(pathname)
  }, [pathname])

  if (!GA_MEASUREMENT_ID) {
    return null
  }

  // afterInteractive: <script> cru no <head> competia por banda com o LCP.
  return (
    <>
      <Script
        id="gtag-js"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
