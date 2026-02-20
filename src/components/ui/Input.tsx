import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { CheckCircle2, AlertCircle } from 'lucide-react'

/**
 * Input Premium - Campo de entrada com design sofisticado
 * 
 * Features:
 * - Altura touch-friendly (48px)
 * - Estados visuais claros (default, focus, error, success, disabled)
 * - Ícones de feedback
 * - Labels e helper text integrados
 * - Transições suaves
 */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  success?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      success = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-inter text-sm font-medium text-neutral-900"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-accent-red" aria-label="obrigatório">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-12 px-4 font-inter text-base text-neutral-900',
              'bg-white border rounded-md',
              'placeholder:text-neutral-700/60',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-300/50',
              error
                ? 'border-accent-red pr-10 focus:border-accent-red focus:ring-accent-red/20'
                : success
                  ? 'border-success pr-10 focus:border-success focus:ring-success/20'
                  : 'border-neutral-300 focus:border-leaf focus:ring-leaf/20',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {/* Ícone de erro */}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <AlertCircle className="w-5 h-5 text-accent-red" />
            </div>
          )}

          {/* Ícone de sucesso */}
          {success && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="flex items-center gap-1 font-inter text-sm text-accent-red"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="font-inter text-sm text-neutral-700"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
