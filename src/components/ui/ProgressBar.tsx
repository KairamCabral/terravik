import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number // 0 a 1
  showLabel?: boolean
}

export function ProgressBar({
  value,
  showLabel = false,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.round(Math.max(0, Math.min(1, value)) * 100)

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm text-terravik-brown/70">
          <span>Progresso</span>
          <span className="font-medium">{percentage}%</span>
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-terravik-brown/5"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-terravik-green via-terravik-green-400 to-terravik-green transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
