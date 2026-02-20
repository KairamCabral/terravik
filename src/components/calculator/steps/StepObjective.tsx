'use client'

import { useCalculatorContext } from '@/contexts/CalculatorContext'
import { ImageRadioCard } from '@/components/ui'

/**
 * StepObjective — Premium, compacto
 * Imagens provisórias (trocar depois)
 */

export function StepObjective() {
  const { answers, setAnswer } = useCalculatorContext()

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">

      <div className="space-y-3 max-w-lg">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
          Qual é o seu objetivo?
        </h2>
        <p className="text-neutral-500">
          Vamos recomendar o produto ideal para você
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl lg:grid-cols-4">
        <ImageRadioCard
          label="Plantar grama nova"
          description="Começando do zero"
          image="/images/grass/quiz/plantar-grama-nova.png"
          checked={answers.objetivo === 'implantacao'}
          onChange={() => setAnswer('objetivo', 'implantacao')}
          name="objective"
          value="implantacao"
        />

        <ImageRadioCard
          label="Verde e vigoroso"
          description="Cor e crescimento"
          image="/images/grass/quiz/verde-e-vigoroso.png"
          checked={answers.objetivo === 'verde_vigor'}
          onChange={() => setAnswer('objetivo', 'verde_vigor')}
          name="objective"
          value="verde_vigor"
        />

        <ImageRadioCard
          label="Fortalecer"
          description="Calor, pisoteio ou seca"
          image="/images/grass/quiz/fortalecer.png"
          checked={answers.objetivo === 'resistencia'}
          onChange={() => setAnswer('objetivo', 'resistencia')}
          name="objective"
          value="resistencia"
        />

        <ImageRadioCard
          label="Plano completo"
          description="Tudo: plantio + manutenção"
          image="/images/grass/quiz/plano-completo.png"
          checked={answers.objetivo === 'plano_completo'}
          onChange={() => setAnswer('objetivo', 'plano_completo')}
          name="objective"
          value="plano_completo"
        />
      </div>
    </div>
  )
}
