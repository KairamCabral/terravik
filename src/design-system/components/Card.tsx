import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Terravik Design System — Card
 *
 * Regras de design:
 *  - Fundo branco (bg-surface)
 *  - Border hairline 1px (border-subtle)
 *  - Radius 16px
 *  - Sem sombra pesada — shadow-sm opcional
 *  - Hover: elevação sutil + sombra card
 */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adiciona efeito de elevação no hover */
  hoverable?: boolean
  /** Padding interno */
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddings: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, padding = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base
          'bg-bg-surface border border-border-subtle rounded-lg',
          // Sombra mínima
          'shadow-xs',
          // Hover (condicional)
          hoverable && 'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card hover:border-border-medium',
          // Padding
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
