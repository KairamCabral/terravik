'use client'

/**
 * StepWelcome — Premium, minimalista, sofisticado
 */

export function StepWelcome() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8">
      
      {/* Badge minimalista */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-forest/5 to-forest/10 border border-forest/10">
        <div className="h-1.5 w-1.5 rounded-full bg-forest animate-pulse" />
        <span className="text-sm font-medium text-forest/80">Menos de 1 minuto</span>
      </div>

      {/* Title */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
          Descubra a dose exata
          <span className="block text-forest">para o seu gramado</span>
        </h1>
        <p className="text-lg text-neutral-500 max-w-lg mx-auto">
          Responda algumas perguntas e receba um plano personalizado com produtos, doses e calendário.
        </p>
      </div>

      {/* Steps minimalistas */}
      <div className="flex items-center gap-8 lg:gap-12">
        {[
          { num: '1', text: 'Responda', sub: '8 perguntas simples' },
          { num: '2', text: 'Receba', sub: 'seu plano personalizado' },
          { num: '3', text: 'Compre', sub: 'e receba em casa' },
        ].map((step, i) => (
          <div key={step.num} className="flex flex-col items-center gap-3">
            {/* Círculo numerado minimalista */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-neutral-100 to-neutral-50 border-2 border-neutral-200 shadow-sm">
              <span className="text-lg font-bold text-neutral-700">{step.num}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">{step.text}</p>
              <p className="text-xs text-neutral-400">{step.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust */}
      <p className="text-xs text-neutral-400">
        Suas respostas são salvas automaticamente
      </p>
    </div>
  )
}
