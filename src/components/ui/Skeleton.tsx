import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Skeleton — Design System 2026
 *
 * Usa token bg-surface-2 para contraste sutil.
 */

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-bg-surface-2',
        variants[variant],
        className
      )}
      style={{
        width,
        height: height || (variant === 'text' ? '1em' : undefined),
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  )
}
