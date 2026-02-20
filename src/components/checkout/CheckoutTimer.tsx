'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const INITIAL_SECONDS = 15 * 60 // 15 minutos

interface CheckoutTimerProps {
  className?: string
  onExpire?: () => void
}

export function CheckoutTimer({ className, onExpire }: CheckoutTimerProps) {
  const [seconds, setSeconds] = useState(INITIAL_SECONDS)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (seconds <= 0) {
      setIsExpired(true)
      onExpire?.()
      return
    }

    const timer = setInterval(() => {
      setSeconds((s) => s - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [seconds, onExpire])

  const format = useCallback((s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }, [])

  const isUrgent = seconds <= 120 && seconds > 0

  if (isExpired) {
    return (
      <div className={cn('flex items-center gap-2 text-xs text-txt-muted', className)}>
        <Clock className="w-3.5 h-3.5" />
        <span>Seu carrinho ainda está aqui</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs transition-colors',
        isUrgent ? 'text-functional-warning font-medium' : 'text-txt-muted',
        className
      )}
    >
      <Clock className={cn('w-3.5 h-3.5', isUrgent && 'animate-pulse')} />
      <span>
        Carrinho reservado por{' '}
        <span className={cn('font-mono tabular-nums', isUrgent && 'text-functional-warning')}>
          {format(seconds)}
        </span>
      </span>
    </div>
  )
}
