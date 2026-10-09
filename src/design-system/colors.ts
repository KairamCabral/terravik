/**
 * Terravik Design System — Tokens de Cor
 *
 * Manual de marca 2026.
 * Regras:
 *  - Dourado NUNCA é cor dominante de fundo.
 *  - Verde escuro transmite autoridade.
 *  - Neutros quentes dominam.
 *  - Branco puro apenas para cards / surfaces elevadas.
 */

// ── Brand ───────────────────────────────────────────────
export const brand = {
  forest: '#093E28',
  forestInk: '#052317',
  gold: '#B38B25',
  // Dourado para TEXTO pequeno. O gold sobre branco dá 3,16:1 e reprova AA;
  // este dá 5,84:1 sobre branco e 5,46:1 sobre o creme.
  goldInk: '#7D611A',
} as const

// ── Backgrounds ─────────────────────────────────────────
export const backgrounds = {
  primary: '#FBF7EF',
  surface: '#FFFFFF',
  surface2: '#F4EFE5',
  dark: '#07120D',
} as const

// ── Text ────────────────────────────────────────────────
export const text = {
  primary: '#111311',
  secondary: '#4C514C',
  muted: '#7A807A',
  onDark: '#F4EFE5',
  onDarkMuted: '#A3A89F',
} as const

// ── Borders ─────────────────────────────────────────────
export const borders = {
  subtle: '#E6DDCC',
  medium: '#D4CBBA',
} as const

// ── Support / Soft tones ────────────────────────────────
export const support = {
  forestSoft: '#DEE1D7',
  forestMuted: '#BCC7BB',
  goldSoft: '#F4ECDB',
  goldMuted: '#EADDBF',
} as const

// ── Functional ──────────────────────────────────────────
export const functional = {
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#3B82F6',
} as const

// Tinta: a cor funcional como TEXTO sobre fundo claro. success e warning são
// claros demais para texto (2,28:1 e 2,15:1 no branco). As tintas vêm da
// paleta da marca: verde 400 e dourado 600.
//   successInk #0A5535: 8,88:1 no branco, 8,43:1 no emerald-50
//   warningInk #685215: 7,48:1 no branco, 7,22:1 no amber-50
export const functionalInk = {
  success: '#0A5535',
  warning: '#685215',
} as const

// ── Full palette for Tailwind ───────────────────────────
export const palette = {
  forest: {
    DEFAULT: brand.forest,
    ink: brand.forestInk,
    soft: support.forestSoft,
    muted: support.forestMuted,
  },
  gold: {
    DEFAULT: brand.gold,
    ink: brand.goldInk,
    soft: support.goldSoft,
    muted: support.goldMuted,
  },
  bg: {
    primary: backgrounds.primary,
    surface: backgrounds.surface,
    'surface-2': backgrounds.surface2,
    dark: backgrounds.dark,
  },
  text: {
    primary: text.primary,
    secondary: text.secondary,
    muted: text.muted,
    'on-dark': text.onDark,
    'on-dark-muted': text.onDarkMuted,
  },
  border: {
    subtle: borders.subtle,
    medium: borders.medium,
  },
  functional,
  functionalInk,
} as const
