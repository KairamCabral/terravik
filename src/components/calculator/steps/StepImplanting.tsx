'use client'

import { useCalculatorContext } from '@/contexts/CalculatorContext'
import { ImageRadioCard } from '@/components/ui'

/**
 * StepImplanting — Premium, compacto
 * Imagens provisórias (trocar depois)
 */

export function StepImplanting() {
  const { answers, setAnswer } = useCalculatorContext()

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">

      <div className="space-y-3 max-w-lg">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
          Está plantando grama agora?
        </h2>
        <p className="text-neutral-500">
          Selecione a situação do seu gramado hoje
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
        <ImageRadioCard
          label="Sim, estou plantando"
          description="Tapete, mudas ou sementes"
          image="/images/grass/quiz/estou-plantando.png"
          checked={answers.implantando === true}
          onChange={() => setAnswer('implantando', true)}
          name="implanting"
          value="true"
        />

        <ImageRadioCard
          label="Não, já tenho grama"
          description="Só preciso cuidar e melhorar"
          image="/images/grass/quiz/Já-tenho-grama.png"
          checked={answers.implantando === false}
          onChange={() => setAnswer('implantando', false)}
          name="implanting"
          value="false"
        />
      </div>
    </div>
  )
}
