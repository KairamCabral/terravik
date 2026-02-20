'use client'

import { useCalculatorContext } from '@/contexts/CalculatorContext'
import { ImageRadioCard } from '@/components/ui'
import { Droplets, Droplet, CloudOff, AlertTriangle } from 'lucide-react'

/**
 * StepIrrigation — Ícones line art premium
 */

export function StepIrrigation() {
  const { answers, setAnswer } = useCalculatorContext()

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">

      <div className="space-y-3 max-w-lg">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
          Com que frequência você rega?
        </h2>
        <p className="text-neutral-500">
          Pense na média semanal, sem contar chuvas
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        <ImageRadioCard
          label="3× ou mais"
          description="Irrigação regular"
          icon={Droplets}
          checked={answers.irrigacao === '3x_semana'}
          onChange={() => setAnswer('irrigacao', '3x_semana')}
          name="irrigation"
          value="3x_semana"
        />

        <ImageRadioCard
          label="1-2× por semana"
          description="Rego quando precisa"
          icon={Droplet}
          checked={answers.irrigacao === '1_2x_semana'}
          onChange={() => setAnswer('irrigacao', '1_2x_semana')}
          name="irrigation"
          value="1_2x_semana"
        />

        <ImageRadioCard
          label="Quase não rego"
          description="Depende da chuva"
          icon={CloudOff}
          checked={answers.irrigacao === 'quase_nao'}
          onChange={() => setAnswer('irrigacao', 'quase_nao')}
          name="irrigation"
          value="quase_nao"
        />
      </div>

      {/* Alert */}
      {answers.irrigacao === 'quase_nao' && (
        <div className="flex items-center gap-3 max-w-lg p-4 rounded-xl bg-amber-50 border border-amber-200 text-left">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <p className="text-sm text-amber-800">
            Sem irrigação regular, vamos ajustar a dose para uma aplicação mais leve e segura.
          </p>
        </div>
      )}
    </div>
  )
}
