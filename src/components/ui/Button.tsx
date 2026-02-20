/**
 * Bridge: redireciona para o Design System centralizado.
 *
 * Variantes legadas são mapeadas:
 *   primary  → primary
 *   secondary → secondary
 *   premium  → accent   (gradiente dourado → bg gold sólido)
 *   ghost    → ghost
 *   danger   → primary  (fallback — usar com className customizado se necessário)
 */

import { forwardRef } from 'react'
import {
  Button as DSButton,
  type ButtonProps as DSButtonProps,
} from '@/design-system/components/Button'

// Mapa de variantes legadas → novas
const variantMap: Record<string, DSButtonProps['variant']> = {
  primary: 'primary',
  secondary: 'secondary',
  outline: 'secondary',   // alias: outline → secondary
  premium: 'accent',
  accent: 'accent',
  ghost: 'ghost',
  danger: 'primary',
}

export interface ButtonProps extends Omit<DSButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'premium' | 'accent' | 'ghost' | 'danger'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', ...props }, ref) => {
    const mapped = variantMap[variant] ?? (variant as DSButtonProps['variant'])
    return <DSButton ref={ref} variant={mapped} {...props} />
  }
)

Button.displayName = 'Button'
