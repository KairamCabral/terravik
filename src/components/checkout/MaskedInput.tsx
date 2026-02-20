'use client'

import { forwardRef, useCallback, useState, useMemo } from 'react'
import { cn } from '@/lib/utils/cn'
import { CheckCircle2, AlertCircle } from 'lucide-react'

type MaskType = 'cpf' | 'cnpj' | 'cpf-cnpj' | 'phone' | 'cep' | 'none'

export interface MaskedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  success?: boolean
  mask?: MaskType
  onChange?: (raw: string, masked: string) => void
}

function applyMask(value: string, mask: MaskType): string {
  const clean = value.replace(/\D/g, '')

  switch (mask) {
    case 'cpf': {
      const c = clean.slice(0, 11)
      if (c.length <= 3) return c
      if (c.length <= 6) return `${c.slice(0, 3)}.${c.slice(3)}`
      if (c.length <= 9) return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6)}`
      return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}`
    }
    case 'cnpj': {
      const c = clean.slice(0, 14)
      if (c.length <= 2) return c
      if (c.length <= 5) return `${c.slice(0, 2)}.${c.slice(2)}`
      if (c.length <= 8) return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5)}`
      if (c.length <= 12) return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8)}`
      return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}`
    }
    case 'cpf-cnpj': {
      // Máscara inteligente que muda automaticamente entre CPF e CNPJ
      const c = clean.slice(0, 14)
      
      // Se tem 12+ dígitos, formata como CNPJ
      if (c.length >= 12) {
        if (c.length <= 2) return c
        if (c.length <= 5) return `${c.slice(0, 2)}.${c.slice(2)}`
        if (c.length <= 8) return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5)}`
        if (c.length <= 12) return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8)}`
        return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}`
      }
      
      // Senão, formata como CPF
      if (c.length <= 3) return c
      if (c.length <= 6) return `${c.slice(0, 3)}.${c.slice(3)}`
      if (c.length <= 9) return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6)}`
      return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}`
    }
    case 'phone': {
      const c = clean.slice(0, 11)
      if (!c.length) return ''
      if (c.length <= 2) return `(${c}`
      if (c.length <= 7) return `(${c.slice(0, 2)}) ${c.slice(2)}`
      return `(${c.slice(0, 2)}) ${c.slice(2, 7)}-${c.slice(7)}`
    }
    case 'cep': {
      const c = clean.slice(0, 8)
      if (c.length <= 5) return c
      return `${c.slice(0, 5)}-${c.slice(5)}`
    }
    default:
      return value
  }
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ label, error, success, mask = 'none', onChange, className, id, ...props }, ref) => {
    const inputId = useMemo(() => id || `mi-${Math.random().toString(36).slice(2, 9)}`, [id])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (mask === 'none') {
          onChange?.(e.target.value, e.target.value)
        } else {
          const raw = e.target.value.replace(/\D/g, '')
          const masked = applyMask(e.target.value, mask)
          onChange?.(raw, masked)
        }
      },
      [mask, onChange]
    )

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-txt-primary">
            {label}
            {props.required && <span className="ml-0.5 text-functional-error">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-12 px-4 text-base text-txt-primary bg-bg-surface rounded-lg border',
              'placeholder:text-txt-muted/60 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-surface-2',
              error
                ? 'border-functional-error pr-10 focus:border-functional-error focus:ring-functional-error/20'
                : success
                  ? 'border-functional-success pr-10 focus:border-functional-success focus:ring-functional-success/20'
                  : 'border-border-subtle focus:border-forest focus:ring-forest/20',
              className
            )}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-err` : undefined}
            {...props}
          />
          {error && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-functional-error pointer-events-none" />
          )}
          {success && !error && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-functional-success pointer-events-none" />
          )}
        </div>
        {error && (
          <p id={`${inputId}-err`} className="text-xs text-functional-error" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

MaskedInput.displayName = 'MaskedInput'
