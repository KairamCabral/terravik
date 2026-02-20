'use client'

import { useCalculatorContext } from '@/contexts/CalculatorContext'
import { ImageRadioCard } from '@/components/ui'

/**
 * StepCondition — Premium, compacto
 * Imagens provisórias (trocar depois) — esse step é ideal para fotos reais de gramados
 */

export function StepCondition() {
  const { answers, setAnswer } = useCalculatorContext()

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">

      <div className="space-y-3 max-w-lg">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
          Como está o gramado hoje?
        </h2>
        <p className="text-neutral-500">
          Seja sincero — isso ajuda a calcular a dose certa
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        <ImageRadioCard
          label="Bonito"
          description="Verde, denso, sem falhas"
          image="/images/grass/quiz/bonito.png"
          checked={answers.nivel === 'bonito'}
          onChange={() => setAnswer('nivel', 'bonito')}
          name="condition"
          value="bonito"
        />

        <ImageRadioCard
          label="Fraco ou amarelado"
          description="Cor pálida, crescimento lento"
          image="/images/grass/quiz/fraco-ou-amarelado.png"
          checked={answers.nivel === 'fraco_amarelado'}
          onChange={() => setAnswer('nivel', 'fraco_amarelado')}
          name="condition"
          value="fraco_amarelado"
        />

        <ImageRadioCard
          label="Ralo com falhas"
          description="Pontos secos, sem grama"
          image="/images/grass/quiz/ralo-com-falhas.png"
          checked={answers.nivel === 'ralo_falhas'}
          onChange={() => setAnswer('nivel', 'ralo_falhas')}
          name="condition"
          value="ralo_falhas"
        />
      </div>
    </div>
  )
}
