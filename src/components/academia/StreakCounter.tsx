'use client'

import { Flame } from 'lucide-react'
import { useAcademia } from '@/contexts/AcademiaContext'
import { cn } from '@/lib/utils/cn'

export function StreakCounter() {
  const { progress } = useAcademia()

  if (progress.currentStreak === 0) return null

  const isHot = progress.currentStreak >= 7

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold',
        isHot
          ? 'bg-orange-500/20 text-orange-300'
          : 'bg-white/10 text-white/60'
      )}
    >
      <Flame className={cn('w-3.5 h-3.5', isHot && 'text-orange-400')} />
      <span>{progress.currentStreak}</span>
      <span className="font-normal">
        {progress.currentStreak === 1 ? 'dia' : 'dias'}
      </span>
    </div>
  )
}
