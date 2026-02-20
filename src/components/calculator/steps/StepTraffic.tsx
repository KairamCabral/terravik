'use client'

import { useCalculatorContext } from '@/contexts/CalculatorContext'
import { ImageRadioCard } from '@/components/ui'

/**
 * StepTraffic — Premium, compacto
 * Imagens provisórias (trocar depois)
 */

export function StepTraffic() {
  const { answers, setAnswer } = useCalculatorContext()

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">

      <div className="space-y-3 max-w-lg">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
          Quanto pisoteio o gramado recebe?
        </h2>
        <p className="text-neutral-500">
          Pense na rotina normal da casa
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        <ImageRadioCard
          label="Pouco uso"
          description="Mais decorativo"
          image="/images/grass/quiz/pouco-uso.png"
          checked={answers.pisoteio === 'baixo'}
          onChange={() => setAnswer('pisoteio', 'baixo')}
          name="traffic"
          value="baixo"
        />

        <ImageRadioCard
          label="Uso normal"
          description="Caminhadas eventuais"
          image="/images/grass/quiz/uso-normal.png"
          checked={answers.pisoteio === 'medio'}
          onChange={() => setAnswer('pisoteio', 'medio')}
          name="traffic"
          value="medio"
        />

        <ImageRadioCard
          label="Muito uso"
          description="Crianças, pets, churrascos"
          image="/images/grass/quiz/bastante-uso.png"
          checked={answers.pisoteio === 'alto'}
          onChange={() => setAnswer('pisoteio', 'alto')}
          name="traffic"
          value="alto"
        />
      </div>
    </div>
  )
}
