'use client'

import { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface RadioCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
  icon?: ReactNode
}

export function RadioCard({
  label,
  description,
  icon,
  className,
  checked,
  ...props
}: RadioCardProps) {
  return (
    <label
      className={cn(
        'relative flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all',
        'hover:border-terravik-green/50 hover:bg-terravik-green/5',
        checked
          ? 'border-terravik-green bg-terravik-green/10 ring-2 ring-terravik-green/20'
          : 'border-terravik-brown/20 bg-white',
        props.disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <input
        type="radio"
        className="peer sr-only"
        checked={checked}
        {...props}
      />

      {icon && (
        <div
          className={cn(
            'flex-shrink-0 transition-colors',
            checked ? 'text-terravik-green' : 'text-terravik-brown/60'
          )}
        >
          {icon}
        </div>
      )}

      <div className="flex-1">
        <div
          className={cn(
            'font-medium transition-colors',
            checked ? 'text-terravik-green-700' : 'text-terravik-brown'
          )}
        >
          {label}
        </div>
        {description && (
          <div className="mt-1 text-sm text-terravik-brown/60">
            {description}
          </div>
        )}
      </div>

      {/* Check indicator */}
      <div
        className={cn(
          'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all',
          checked
            ? 'border-terravik-green bg-terravik-green'
            : 'border-terravik-brown/30 bg-white'
        )}
      >
        {checked && (
          <svg
            className="h-3 w-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </label>
  )
}
