// Espelha ALLOW_INDEXING de src/lib/utils/constants.ts. Fechado por padrão.
// Produção precisa de NEXT_PUBLIC_ALLOW_INDEXING=true na Vercel.
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://terravik.com.br',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: !allowIndexing ? [{ userAgent: '*', disallow: '/' }] : [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'CCBot',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
    ],
  },
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/produtos': 0.9,
      '/calculadora': 0.9,
      '/onde-encontrar': 0.8,
      '/representantes': 0.7,
      '/sobre': 0.6,
      '/contato': 0.6,
      '/blog': 0.8,
    }

    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : config.changefreq,
      priority: priorities[path] || config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}
