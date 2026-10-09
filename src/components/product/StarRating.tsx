'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * StarRating
 *
 * Só leitura (padrão): um único role="img" com "Nota 4,5 de 5". Antes eram
 * cinco <button disabled>, que o leitor de tela lia como cinco botões
 * indisponíveis, sem dizer a nota.
 *
 * Interativo: um grupo de botões de verdade, um por estrela, com
 * aria-pressed na nota escolhida.
 */

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
}

const sizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

/** 4 vira "4", 4.5 vira "4,5" (vírgula decimal, como se lê em português). */
function notaPorExtenso(rating: number): string {
  const arredondada = Math.round(rating * 10) / 10
  return Number.isInteger(arredondada)
    ? String(arredondada)
    : arredondada.toFixed(1).replace('.', ',')
}

function Estrela({
  valor,
  rating,
  size,
}: {
  valor: number
  rating: number
  size: 'sm' | 'md' | 'lg'
}) {
  const isFilled = valor <= rating
  const isPartial = valor === Math.ceil(rating) && rating % 1 !== 0
  const fillPercentage = isPartial ? (rating % 1) * 100 : 0

  return (
    <>
      <Star
        className={cn(sizeClasses[size], 'text-border-medium', isFilled && 'text-gold')}
        fill={isFilled ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
      {isPartial && (
        <span
          className="absolute inset-0 block overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
          aria-hidden="true"
        >
          <Star className={cn(sizeClasses[size], 'text-gold')} fill="currentColor" />
        </span>
      )}
    </>
  )
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const estrelas = Array.from({ length: maxRating }, (_, i) => i + 1)

  if (interactive) {
    return (
      <div className="flex items-center gap-0.5" role="group" aria-label="Escolha a nota">
        {estrelas.map((valor) => (
          <button
            key={valor}
            type="button"
            onClick={() => onChange?.(valor)}
            className="relative cursor-pointer transition-transform hover:scale-110"
            aria-label={`${valor} ${valor > 1 ? 'estrelas' : 'estrela'}`}
            aria-pressed={valor === Math.round(rating)}
          >
            <Estrela valor={valor} rating={rating} size={size} />
          </button>
        ))}
        {showNumber && (
          <span className="ml-1 text-sm font-medium text-txt-primary" aria-hidden="true">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0.5">
      <span
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Nota ${notaPorExtenso(rating)} de ${maxRating}`}
      >
        {estrelas.map((valor) => (
          <span key={valor} className="relative block">
            <Estrela valor={valor} rating={rating} size={size} />
          </span>
        ))}
      </span>
      {showNumber && (
        // O número repete o que o aria-label já disse.
        <span className="ml-1 text-sm font-medium text-txt-primary" aria-hidden="true">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
