'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  function handleClick(value: number) {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= rating
        const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0
        const fillPercentage = isPartial ? (rating % 1) * 100 : 0

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={cn(
              'relative',
              interactive && 'cursor-pointer transition-transform hover:scale-110',
              !interactive && 'cursor-default'
            )}
            aria-label={`${starValue} estrela${starValue > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'text-border-medium',
                isFilled && 'text-gold'
              )}
              fill={isFilled ? 'currentColor' : 'none'}
            />

            {isPartial && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star
                  className={cn(sizeClasses[size], 'text-gold')}
                  fill="currentColor"
                />
              </div>
            )}
          </button>
        )
      })}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-txt-primary">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
