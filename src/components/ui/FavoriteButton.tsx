'use client'

import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useFavorites } from '@/contexts/FavoritesContext'

interface FavoriteButtonProps {
  productId: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'button'
  showLabel?: boolean
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export function FavoriteButton({
  productId,
  size = 'md',
  variant = 'icon',
  showLabel = false,
  className,
  onClick,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoading } = useFavorites()
  const isFav = isFavorite(productId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onClick) {
      onClick(e)
    }
    
    if (!isLoading) {
      await toggleFavorite(productId)
    }
  }

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }

  const iconSizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all',
          'bg-neutral-100 hover:bg-neutral-200 text-neutral-700',
          isFav && 'bg-red-50 hover:bg-red-100 text-red-600',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Heart
          className={cn(
            'transition-all',
            iconSizeClasses[size],
            isFav && 'fill-red-500 text-red-500'
          )}
        />
        {showLabel && (
          <span className="text-sm">
            {isFav ? 'Favoritado' : 'Favoritar'}
          </span>
        )}
      </button>
    )
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'flex items-center justify-center rounded-full transition-all',
        'bg-white/90 backdrop-blur-sm shadow-md',
        'hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        className
      )}
      aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={cn(
          'transition-colors',
          iconSizeClasses[size],
          isFav ? 'fill-red-500 text-red-500' : 'text-neutral-400'
        )}
      />
    </motion.button>
  )
}
