'use client'

import { useCalculatorContext } from '@/contexts/CalculatorContext'
import { ImageRadioCard } from '@/components/ui'
import { CloudRain, Sun, Wind, Snowflake } from 'lucide-react'

/**
 * StepClimate — Ícones line art premium
 */

export function StepClimate() {
  const { answers, setAnswer } = useCalculatorContext()

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">

      <div className="space-y-3 max-w-lg">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
          Como está o clima agora?
        </h2>
        <p className="text-neutral-500">
          Pense nas últimas 2 semanas
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl lg:grid-cols-4">
        <ImageRadioCard
          label="Quente e chovendo"
          description="Temperatura alta + chuvas"
          icon={CloudRain}
          checked={answers.clima_hoje === 'quente_chovendo'}
          onChange={() => setAnswer('clima_hoje', 'quente_chovendo')}
          name="climate"
          value="quente_chovendo"
        />

        <ImageRadioCard
          label="Quente e seco"
          description="Calor forte, sem chuva"
          icon={Sun}
          checked={answers.clima_hoje === 'quente_seco'}
          onChange={() => setAnswer('clima_hoje', 'quente_seco')}
          name="climate"
          value="quente_seco"
        />

        <ImageRadioCard
          label="Ameno"
          description="Temperatura agradável"
          icon={Wind}
          checked={answers.clima_hoje === 'ameno'}
          onChange={() => setAnswer('clima_hoje', 'ameno')}
          name="climate"
          value="ameno"
        />

        <ImageRadioCard
          label="Frio"
          description="Gramado cresce devagar"
          icon={Snowflake}
          checked={answers.clima_hoje === 'frio'}
          onChange={() => setAnswer('clima_hoje', 'frio')}
          name="climate"
          value="frio"
        />
      </div>
    </div>
  )
}
