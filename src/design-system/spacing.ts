/**
 * Terravik Design System — Espaçamento & Layout
 */

export const borderRadius = {
  none: '0px',
  sm: '8px',
  DEFAULT: '12px',
  md: '12px',
  lg: '16px',       // --radius-default
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
} as const

export const boxShadow = {
  // Sombras quentes / neutras — sem tom esverdeado
  none: 'none',
  xs: '0 1px 2px rgba(17, 19, 17, 0.04)',
  sm: '0 1px 3px rgba(17, 19, 17, 0.06), 0 1px 2px rgba(17, 19, 17, 0.04)',
  DEFAULT: '0 2px 6px rgba(17, 19, 17, 0.06), 0 1px 3px rgba(17, 19, 17, 0.04)',
  md: '0 4px 12px rgba(17, 19, 17, 0.07), 0 2px 4px rgba(17, 19, 17, 0.04)',
  lg: '0 8px 24px rgba(17, 19, 17, 0.08), 0 4px 8px rgba(17, 19, 17, 0.03)',
  xl: '0 16px 40px rgba(17, 19, 17, 0.1), 0 8px 16px rgba(17, 19, 17, 0.04)',
  inner: 'inset 0 2px 4px rgba(17, 19, 17, 0.06)',
  // Card hover — sutil e elegante
  card: '0 8px 30px rgba(17, 19, 17, 0.08)',
  // Compat
  hover: '0 16px 40px rgba(17, 19, 17, 0.1), 0 0 0 1px rgba(17, 19, 17, 0.04)',
  'glow-gold': '0 0 20px rgba(179, 139, 37, 0.25)',
} as const

export const container = {
  center: true,
  padding: {
    DEFAULT: '1.5rem',
    sm: '1.5rem',
    md: '2rem',
    lg: '2rem',
    xl: '2rem',
  },
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const
