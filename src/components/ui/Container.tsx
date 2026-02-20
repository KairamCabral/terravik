import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'main'
  spacing?: 'none' | 'sm' | 'md' | 'lg'
}

export function Container({
  as: Component = 'div',
  spacing = 'none',
  className,
  children,
  ...props
}: ContainerProps) {
  const spacingStyles = {
    none: '',
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16 lg:py-20',
    lg: 'py-16 md:py-20 lg:py-24 xl:py-28',
  }

  return (
    <Component
      className={cn('container-main', spacingStyles[spacing], className)}
      {...props}
    >
      {children}
    </Component>
  )
}
