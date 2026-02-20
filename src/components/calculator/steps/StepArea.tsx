'use client'

import { useState } from 'react'
import { useCalculatorContext } from '@/contexts/CalculatorContext'
import { HelpCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

/**
 * StepArea — Premium, compacto, tudo visível sem scroll
 */

export function StepArea() {
  const { answers, setAnswer } = useCalculatorContext()
  const [error, setError] = useState('')
  const [showExample, setShowExample] = useState(false)

  const handleChange = (value: string) => {
    const num = parseFloat(value.replace(',', '.'))

    if (!value) {
      setError('Informe a área em m².')
      setAnswer('area_m2', 0)
      return
    }

    if (isNaN(num) || num <= 0) {
      setError('A área precisa ser maior que zero.')
      setAnswer('area_m2', 0)
      return
    }

    setError('')
    setAnswer('area_m2', num)
  }

  const fillExample = () => {
    setAnswer('area_m2', 60)
    setError('')
    setShowExample(false)
  }

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">

      {/* Header */}
      <div className="space-y-3 max-w-lg">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
          Qual é a área do seu gramado?
        </h2>
        <p className="text-neutral-500">
          Não sabe? Multiplique largura × comprimento
        </p>
      </div>

      {/* Input */}
      <div className="w-full max-w-sm space-y-3">
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            placeholder="60"
            value={answers.area_m2 || ''}
            onChange={(e) => handleChange(e.target.value)}
            autoFocus
            className={cn(
              'w-full rounded-2xl border-2 bg-white px-6 py-5 text-center text-4xl font-bold text-neutral-900 placeholder:text-neutral-200 transition-all focus:outline-none focus:ring-4',
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-neutral-200 focus:border-forest focus:ring-forest/10'
            )}
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-medium text-neutral-300">
            m²
          </span>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}

        {/* Quick values */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-neutral-400">Rápido:</span>
          {[30, 60, 100, 200].map((val) => (
            <button
              key={val}
              onClick={() => { setAnswer('area_m2', val); setError('') }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                answers.area_m2 === val
                  ? 'bg-forest text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-forest/10 hover:text-forest'
              )}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Help toggle */}
      <button
        onClick={() => setShowExample(!showExample)}
        className="flex items-center gap-2 text-sm font-medium text-forest hover:text-forest/80 transition-colors"
      >
        {showExample ? <X className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
        {showExample ? 'Fechar' : 'Como calcular a área?'}
      </button>

      {/* Example */}
      {showExample && (
        <div className="w-full max-w-md p-5 rounded-2xl bg-forest/5 border border-forest/10 space-y-3">
          <p className="text-sm text-neutral-600">
            Se seu gramado tem <strong>6m de largura</strong> e <strong>10m de comprimento</strong>:
          </p>
          <div className="py-3 rounded-xl bg-white">
            <p className="text-2xl font-bold text-forest">6 × 10 = 60 m²</p>
          </div>
          <button
            onClick={fillExample}
            className="w-full py-2.5 rounded-xl bg-forest text-white text-sm font-semibold hover:bg-forest/90 transition-colors"
          >
            Usar 60 m²
          </button>
        </div>
      )}
    </div>
  )
}
