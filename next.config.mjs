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
      "connect-src 'self' https://www.google-analytics.com https://*.supabase.co https://*.shopify.com wss://*.supabase.co",
      "frame-src 'self' https://*.shopify.com",
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
