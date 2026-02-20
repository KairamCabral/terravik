'use client'

import { useCalculatorContext } from '@/contexts/CalculatorContext'
import { ImageRadioCard } from '@/components/ui'

/**
 * StepSunlight — Imagens reais
 */

export function StepSunlight() {
  const { answers, setAnswer } = useCalculatorContext()

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">

      <div className="space-y-3 max-w-lg">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
          Quanto sol o gramado pega?
        </h2>
        <p className="text-neutral-500">
          Pense num dia típico, das 10h às 16h
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        <ImageRadioCard
          label="Sol pleno"
          description="Sol direto 6h+"
          image="/images/grass/quiz/sol-pleno.png"
          checked={answers.sol === 'sol_pleno'}
          onChange={() => setAnswer('sol', 'sol_pleno')}
          name="sunlight"
          value="sol_pleno"
        />

        <ImageRadioCard
          label="Meia-sombra"
          description="Sol 3-6h por dia"
          image="/images/grass/quiz/meia-sombra.png"
          checked={answers.sol === 'meia_sombra'}
          onChange={() => setAnswer('sol', 'meia_sombra')}
          name="sunlight"
          value="meia_sombra"
        />

        <ImageRadioCard
          label="Bastante sombra"
          description="Menos de 3h de sol"
          image="/images/grass/quiz/bastante-sombra.png"
          checked={answers.sol === 'sombra'}
          onChange={() => setAnswer('sol', 'sombra')}
          name="sunlight"
          value="sombra"
        />
      </div>
    </div>
  )
}
