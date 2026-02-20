/**
 * Constantes globais do site
 */

export const SITE = {
  name: 'Terravik',
  tagline: 'Fertilizantes premium para gramados',
  description:
    'Dose certa, resultado visível. Fertilizantes granulados para implantação, crescimento e proteção do seu gramado.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://terravik.com.br',
  locale: 'pt-BR',
  currency: 'BRL',
} as const

export const NAV_LINKS = [
  { label: 'Produtos', href: '/produtos' },
  { label: 'Calculadora', href: '/calculadora' },
  { label: 'Cursos', href: '/academia' },
  { label: 'Onde Encontrar', href: '/onde-encontrar' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
] as const

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/terravik',
  facebook: 'https://facebook.com/terravik',
  whatsapp: 'https://wa.me/55XXXXXXXXXXX',
} as const

export const REVALIDATE = {
  products: 60,       // 1 minuto
  collections: 60,
  pages: 300,         // 5 minutos
  blog: 300,
  locations: 300,
} as const

// Mapeamento de product_id da calculadora para handles do Shopify
export const PRODUCT_HANDLE_MAP = {
  P1: 'gramado-novo',
  P2: 'verde-rapido',
  P3: 'resistencia-total',
} as const
