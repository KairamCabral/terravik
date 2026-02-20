import type { Config } from 'tailwindcss'
import { palette } from './src/design-system/colors'
import { fontFamily, fontSize, letterSpacing } from './src/design-system/typography'
import { borderRadius, boxShadow, container } from './src/design-system/spacing'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/design-system/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Cores ─────────────────────────────────────────────
      colors: {
        // Brand
        forest: palette.forest,
        gold: palette.gold,

        // Backgrounds (via classe bg-bg-primary, bg-bg-surface, etc.)
        bg: palette.bg,

        // Texto semântico
        txt: palette.text,

        // Bordas
        border: palette.border,

        // Funcionais
        success: palette.functional.success,
        warning: palette.functional.warning,
        error: palette.functional.error,
        info: palette.functional.info,

        // ── Compat: nomes antigos mapeados p/ novos ─────────
        // Evita quebrar classes existentes durante migração
        leaf: {
          DEFAULT: '#093E28',
          light: '#0A5535',
        },
        grass: '#22C55E',
        cream: '#FBF7EF',
        neutral: {
          100: '#F4EFE5',
          200: '#E6DDCC',
          300: '#E6DDCC',
          700: '#4C514C',
          900: '#111311',
        },
        'accent-red': '#DC2626',

        // Compat: terravik.* (legado — migrar progressivamente)
        terravik: {
          green: {
            DEFAULT: '#093E28',
            50: '#DEE1D7',
            100: '#BCC7BB',
            200: '#6BB35E',
            300: '#4A8B3F',
            400: '#0A5535',
            500: '#093E28',
            600: '#072E1E',
            700: '#052317',
            800: '#031810',
            900: '#020E09',
          },
          gold: {
            DEFAULT: '#B38B25',
            50: '#F4ECDB',
            100: '#EADDBF',
            200: '#D9C474',
            300: '#C9AD4A',
            400: '#B38B25',
            500: '#8C6E1D',
            600: '#685215',
            700: '#44370E',
          },
          cream: {
            DEFAULT: '#FBF7EF',
            50: '#FFFFFF',
            100: '#FBF7EF',
            200: '#F4EFE5',
            300: '#E6DDCC',
          },
          brown: {
            DEFAULT: '#111311',
            50: '#F4EFE5',
            100: '#E6DDCC',
            200: '#7A807A',
            300: '#4C514C',
            400: '#111311',
            500: '#07120D',
          },
        },
      },

      // ── Tipografia ────────────────────────────────────────
      fontFamily: fontFamily as any,
      fontSize: fontSize as any,
      letterSpacing,

      // ── Bordas & Sombras ──────────────────────────────────
      borderRadius,
      boxShadow,

      // ── Container ─────────────────────────────────────────
      container,

      // ── Gradientes ────────────────────────────────────────
      backgroundImage: {
        'gradient-forest': 'linear-gradient(135deg, #093E28 0%, #052317 100%)',
        'gradient-gold': 'linear-gradient(135deg, #B38B25 0%, #C9AD4A 100%)',
        'gradient-hero': 'linear-gradient(180deg, #FBF7EF 0%, #FFFFFF 50%, #FBF7EF 100%)',
        'gradient-overlay': 'linear-gradient(180deg, rgba(7, 18, 13, 0) 0%, rgba(7, 18, 13, 0.7) 100%)',
        // Compat: gradientes legados
        'gradient-brand': 'linear-gradient(135deg, #093E28 0%, #0A5535 50%, #B38B25 100%)',
        'gradient-card-hover': 'linear-gradient(180deg, rgba(9, 62, 40, 0.03) 0%, rgba(9, 62, 40, 0) 100%)',
      },

      // ── Animações ─────────────────────────────────────────
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
