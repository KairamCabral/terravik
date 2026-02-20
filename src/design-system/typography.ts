/**
 * Terravik Design System — Tipografia
 *
 * Fontes:
 *  - Fraunces  → headings (optical-size, variable)
 *  - Inter     → body, UI
 *
 * Escala:
 *  H1   48 px  |  H2   32 px  |  H3   22 px
 *  Body 16–18  |  UI   13–14
 */

export const fontFamily = {
  // Novos nomes semânticos
  heading: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
  body: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
  // Aliases semânticos para Tailwind
  sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
  display: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
  // Compat: nomes legados → apontam para Fraunces
  playfair: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
  cormorant: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
  inter: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
} as const

export const fontSize = {
  // Semântico (usado pelas classes utilitárias)
  display: ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '600' }],
  h1: ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
  h2: ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '550' }],
  h3: ['1.375rem', { lineHeight: '1.35', fontWeight: '550' }],
  h4: ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
  'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }],
  body: ['1rem', { lineHeight: '1.65', fontWeight: '400' }],
  small: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
  ui: ['0.8125rem', { lineHeight: '1.4', fontWeight: '500' }],
  overline: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.08em', fontWeight: '600' }],

  // Compatibilidade com scale padrão Tailwind
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.375rem' }],
  base: ['1rem', { lineHeight: '1.625rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.875rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
  '5xl': ['3rem', { lineHeight: '3.5rem', letterSpacing: '-0.02em' }],
  '6xl': ['3.75rem', { lineHeight: '4.25rem', letterSpacing: '-0.03em' }],
} as const

export const letterSpacing = {
  tighter: '-0.03em',
  tight: '-0.02em',
  snug: '-0.01em',
  normal: '0',
  wide: '0.01em',
  wider: '0.08em',
  widest: '0.12em',
} as const
