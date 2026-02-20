import { ButtonHTMLAttributes, forwardRef, ReactElement, cloneElement } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Terravik Design System — Button
 *
 * Variantes:
 *  primary   → bg forest, texto ivory, hover forest-ink
 *  secondary → outline forest, hover forest-soft
 *  accent    → bg gold, texto escuro, hover tom mais escuro
 *  ghost     → texto only, hover bg-surface-2
 *
 * Tamanhos: sm | md | lg | xl
 */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  loading?: boolean
  asChild?: boolean
}

const base = [
  'inline-flex items-center justify-center gap-2',
  'font-body font-semibold',
  'transition-all duration-200 ease-out',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'active:translate-y-[1px]',
].join(' ')

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: [
    'bg-forest text-bg-primary',
    'hover:bg-forest-ink hover:shadow-md',
    'focus-visible:ring-forest',
    'active:shadow-inner',
  ].join(' '),

  secondary: [
    'bg-transparent border border-forest text-forest',
    'hover:bg-forest-soft hover:text-forest-ink',
    'focus-visible:ring-forest',
  ].join(' '),

  accent: [
    'bg-gold text-txt-primary',
    'hover:brightness-[0.92] hover:shadow-md',
    'focus-visible:ring-gold',
  ].join(' '),

  ghost: [
    'bg-transparent text-txt-secondary',
    'hover:bg-bg-surface-2 hover:text-txt-primary',
    'focus-visible:ring-forest',
  ].join(' '),
}

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-9 px-4 text-sm rounded-[10px]',
  md: 'h-11 px-6 text-base rounded-[14px]',
  lg: 'h-14 px-8 text-lg rounded-[14px]',
  xl: 'h-16 px-10 text-xl rounded-[16px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      asChild = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      base,
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      loading && 'relative text-transparent',
      className
    )

    if (asChild) {
      const child = children as ReactElement
      return cloneElement(child, {
        ...child.props,
        className: cn(classes, child.props?.className),
      } as any)
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-5 w-5 animate-spin text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
