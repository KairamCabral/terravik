import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Terravik Design System — Section
 *
 * Variantes:
 *  default  → bg-primary (creme quente)
 *  surface  → bg-surface-2 (creme mais escuro)
 *  dark     → bg-dark + texto claro
 *  white    → bg-surface (branco puro)
 */

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'surface' | 'dark' | 'white'
  /** Desativa espaçamento vertical padrão */
  noPadding?: boolean
  /** Limita largura do conteúdo interno */
  contained?: boolean
}

const variantStyles: Record<NonNullable<SectionProps['variant']>, string> = {
  default: 'bg-bg-primary text-txt-primary',
  surface: 'bg-bg-surface-2 text-txt-primary',
  dark: 'bg-bg-dark text-txt-on-dark',
  white: 'bg-bg-surface text-txt-primary',
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      variant = 'default',
      noPadding = false,
      contained = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          variantStyles[variant],
          !noPadding && 'section-spacing',
          className
        )}
        {...props}
      >
        {contained ? (
          <div className="container-main">{children}</div>
        ) : (
          children
        )}
      </section>
    )
  }
)

Section.displayName = 'Section'
