// Hostname do storage do Supabase derivado do env. Fixo, o next/image
// devolvia 400 para imagens do storage quando o projeto mudava.
// O hostname antigo continua aceito para imagens já cadastradas com ele.
const supabaseHostnames = [
  ...new Set([
    process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : 'placeholder.supabase.co',
    'lfydrrbmiticiusjznil.supabase.co',
  ]),
]

// Origem da loja Shopify para a CSP, derivada do domínio configurado.
const shopifyDomain = (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '')
  .replace(/^https?:\/\//, '')
  .replace(/\/.*$/, '')
const shopifyOrigin = shopifyDomain ? `https://${shopifyDomain}` : 'https://*.myshopify.com'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
      ...supabaseHostnames.map((hostname) => ({
        protocol: 'https',
        hostname,
        pathname: '/storage/v1/object/public/**',
      })),
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' https://fonts.gstatic.com",
      // shopifyOrigin: https://*.shopify.com não casa loja.myshopify.com, e a
      // Storefront API era bloqueada no navegador. viacep preenche o CEP.
      // GA4 usa coletores regionais fora de www.google-analytics.com.
      `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.supabase.co wss://*.supabase.co https://*.shopify.com ${shopifyOrigin} https://viacep.com.br`,
      `frame-src 'self' https://*.shopify.com ${shopifyOrigin}`,
      // Sem media-src, <video> do storage do Supabase cai em default-src e é bloqueado.
      `media-src 'self' blob: data: https://*.supabase.co https://cdn.shopify.com ${shopifyOrigin}`,
      // canvas-confetti cria worker a partir de blob.
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), payment=(self)' },
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
      // Área logada, painel e checkout são client components e não emitem
      // metadata: o noindex vai pelo header.
      ...[
        '/checkout/:path*',
        '/conta/:path*',
        '/admin/:path*',
        '/pedido-confirmado',
        '/assinatura/minha-assinatura',
        '/academia/perfil',
        '/academia/conquistas',
      ].map((source) => ({
        source,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      })),
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/lojas/:slug.png',
        destination: '/lojas/placeholder.svg',
      },
      {
        source: '/favicon.ico',
        destination: '/favicon.svg',
      },
      {
        source: '/apple-touch-icon.png',
        destination: '/favicon.svg',
      },
    ]
  },
}

export default nextConfig
