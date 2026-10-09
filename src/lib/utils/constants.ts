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

/**
 * Libera a indexação por buscadores. Fechado por padrão, de propósito:
 * preview da Vercel e a URL .vercel.app são públicas e seriam indexáveis.
 *
 * O ambiente Production da Vercel PRECISA ter NEXT_PUBLIC_ALLOW_INDEXING=true.
 * Sem ela, o site inteiro sai com noindex e robots.txt com Disallow: /.
 * Espelhado em next-sitemap.config.js.
 */
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'

/**
 * Cupom anunciado na barra do topo. Quem valida é a Shopify: o código PRECISA
 * estar cadastrado na loja com este mesmo nome, senão o anúncio promete um
 * desconto que o carrinho recusa.
 */
export const FIRST_PURCHASE_COUPON_CODE = 'PRIMEIRACOMPRA'

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
} as const

/**
 * Canais de atendimento que dependem de um dado REAL do dono da loja.
 *
 * Vazio por padrão, de propósito: enquanto o campo estiver vazio, o botão ou
 * link correspondente NÃO é renderizado em lugar nenhum do site. Número de
 * exemplo não entra aqui: um telefone inventado publicado manda o cliente
 * para um desconhecido (e a guarda de alegações do prebuild reprova os
 * marcadores de exemplo conhecidos).
 *
 * Formatos esperados:
 * - whatsapp: só dígitos, com código do país e DDD, sem "+", espaço ou traço.
 *   Forma: 55 + DDD (2 dígitos) + número (8 ou 9 dígitos).
 * - whatsappGrupo: o link de convite inteiro, começando por
 *   https://chat.whatsapp.com/
 * - telefoneSac: do jeito que deve aparecer na página, com DDD ou prefixo 0800.
 */
export const CONTATO: {
  whatsapp: string
  whatsappGrupo: string
  telefoneSac: string
} = {
  whatsapp: '',
  whatsappGrupo: '',
  telefoneSac: '',
}

/**
 * Link do WhatsApp de atendimento, ou null enquanto CONTATO.whatsapp estiver
 * vazio ou fora do formato. Quem chama só renderiza o botão se vier link.
 */
export function linkWhatsapp(mensagem?: string): string | null {
  const numero = CONTATO.whatsapp.replace(/\D/g, '')
  if (!/^55\d{10,11}$/.test(numero)) return null
  const base = `https://wa.me/${numero}`
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base
}

/** Link do grupo de ofertas, ou null enquanto não houver convite real. */
export function linkGrupoWhatsapp(): string | null {
  const link = CONTATO.whatsappGrupo.trim()
  return /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{10,}$/.test(link) ? link : null
}

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
