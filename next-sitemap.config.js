// Espelha ALLOW_INDEXING de src/lib/utils/constants.ts. Fechado por padrão.
// Produção precisa de NEXT_PUBLIC_ALLOW_INDEXING=true na Vercel.
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'

/**
 * Rotas que carregam `noIndex: true` no próprio createMetadata.
 *
 * Ficam fora do sitemap, mas NÃO entram no disallow do robots.txt, de
 * propósito: o Google precisa rastrear a página para enxergar a meta tag.
 * URL bloqueada por robots e apontada por link interno entra no índice assim
 * mesmo, sem título e sem descrição. /conta é linkada de toda página do site.
 *
 * Entrar aqui exige `noIndex: true` em src/app/<rota>/page.tsx, senão a rota
 * fica sem proteção nenhuma. Rota nova com noIndex precisa entrar aqui.
 */
const NOINDEX_NA_PAGINA = [
  '/login',
  '/cadastro',
  '/recuperar-senha',
  '/redefinir-senha',
  '/favoritos',
  '/conta',
]

// Rotas que nunca pertencem a um sitemap. O next-sitemap descobre toda rota
// estática do build, inclusive as que exigem login.
const PRIVADAS = [
  ...NOINDEX_NA_PAGINA,
  // Área autenticada e painel (saem com X-Robots-Tag noindex no next.config.mjs)
  '/admin',
  '/admin/*',
  '/conta/*',
  '/assinatura/minha-assinatura',
  // A Academia é pública; só as telas pessoais ficam de fora.
  '/academia/perfil',
  '/academia/conquistas',
  // Fluxo de compra: sem valor de busca
  '/checkout',
  '/pedido-confirmado',
  // Página interna de demonstração
  '/demo-announcement',
]

const EXCLUDE = ['/api/*', ...PRIVADAS]

/**
 * Disallow de TODO grupo do robots.txt, o '*' e cada robô de IA.
 * Sem barra final o robô trata como prefixo: '/admin' cobre '/admin/lojas'.
 * As rotas de NOINDEX_NA_PAGINA ficam de fora de propósito.
 */
const DISALLOW_COMUM = [
  '/api/',
  '/admin',
  '/checkout',
  '/pedido-confirmado',
  '/demo-announcement',
]

const CRAWLERS_IA_PERMITIDOS = [
  'GPTBot',
  'Google-Extended',
  'CCBot',
  'anthropic-ai',
  'ClaudeBot',
]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://terravik.com.br',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: EXCLUDE,
  // Sem lastmod. A hora do build carimbada em toda URL diz ao Google que o
  // site inteiro mudou a cada deploy, e ele passa a ignorar o campo.
  autoLastmod: false,
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: !allowIndexing
      ? [{ userAgent: '*', disallow: '/' }]
      : [
          { userAgent: '*', allow: '/', disallow: DISALLOW_COMUM },
          // O disallow vai repetido em cada robô: pela RFC 9309 o robô obedece
          // SÓ ao grupo mais específico que o nomeia, sem herdar nada do '*'.
          ...CRAWLERS_IA_PERMITIDOS.map((userAgent) => ({
            userAgent,
            allow: '/',
            disallow: DISALLOW_COMUM,
          })),
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
      // Sem lastmod: ver `autoLastmod` na configuração.
    }
  },
}
