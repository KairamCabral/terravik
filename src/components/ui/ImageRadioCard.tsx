'use client'

import { Check, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface ImageRadioCardProps {
  label: string
  description?: string
  image?: string
  icon?: LucideIcon
  checked: boolean
  onChange: () => void
  name: string
  value: string
  badge?: string
  disabled?: boolean
}

/**
 * ImageRadioCard — Premium
 *
 * Suporte a:
 * - Imagens circulares (para steps com fotos reais)
 * - Ícones Lucide em círculo tracejado (estilo line art premium)
 */

export function ImageRadioCard({
  label,
  description,
  image,
  icon: Icon,
  checked,
  onChange,
  name,
  value,
  badge,
  disabled = false,
}: ImageRadioCardProps) {
  return (
    <label
      className={cn(
        'group relative block cursor-pointer rounded-2xl border-2 transition-all duration-300',
        checked
          ? 'border-forest bg-forest/5 shadow-md shadow-forest/10 ring-1 ring-forest/20'
          : 'border-neutral-200 bg-white hover:border-forest/30 hover:shadow-sm',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />

      <div className="flex flex-col items-center gap-3 p-4 lg:p-5">
        {/* Visual */}
        <div className={cn(
          'relative flex-shrink-0 overflow-hidden rounded-full transition-all duration-300',
          image
            ? 'h-20 w-20 lg:h-24 lg:w-24 ring-4'
            : 'h-16 w-16 lg:h-20 lg:w-20',
          checked
            ? image ? 'ring-forest/30' : ''
            : image ? 'ring-neutral-100 group-hover:ring-forest/20' : '',
        )}>
          {image ? (
            <Image
              src={image}
              alt={label}
              fill
              sizes="96px"
              className="object-cover transition-transform duration-400 group-hover:scale-110"
            />
          ) : Icon ? (
            /* Ícone estilo line art com círculo tracejado */
            <div className="relative flex h-full w-full items-center justify-center">
              {/* Círculo tracejado externo */}
              <div className={cn(
                'absolute inset-1 rounded-full border-[1.5px] border-dashed transition-colors duration-300',
                checked ? 'border-forest' : 'border-forest/40 group-hover:border-forest/60'
              )} />
              {/* Círculo sólido interno */}
              <div className={cn(
                'absolute inset-3 rounded-full border-[1.5px] transition-colors duration-300',
                checked ? 'border-forest bg-forest/5' : 'border-forest/30 group-hover:border-forest/50'
              )} />
              {/* Ícone */}
              <Icon className={cn(
                'relative z-10 h-6 w-6 lg:h-7 lg:w-7 transition-colors duration-300',
                checked ? 'text-forest' : 'text-forest/60 group-hover:text-forest/80'
              )} strokeWidth={1.5} />
            </div>
          ) : null}

          {/* Checkmark (só para imagens) */}
          {checked && image && (
            <div className="absolute inset-0 flex items-center justify-center bg-forest/20 backdrop-blur-[1px]">
              <div className="rounded-full bg-forest p-1.5 shadow-lg">
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              </div>
            </div>
          )}
        </div>

        {/* Texto */}
        <div className="flex flex-col items-center gap-1.5 text-center min-h-[60px] justify-start">
          <h3 className={cn(
            'text-sm lg:text-base font-semibold transition-colors leading-tight',
            checked ? 'text-forest' : 'text-neutral-900'
          )}>
            {label}
          </h3>

          {badge && (
            <span className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
              checked
                ? 'bg-forest/20 text-forest'
                : 'bg-neutral-100 text-neutral-500'
            )}>
              {badge}
            </span>
          )}

          {description && (
            <p className="text-xs text-neutral-400 leading-snug">
              {description}
            </p>
          )}
        </div>
      </div>
    </label>
  )
}
