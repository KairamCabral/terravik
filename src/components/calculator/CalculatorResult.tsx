'use client'

import { useState } from 'react'
import type { useCalculator } from '@/hooks/useCalculator'
import { Button, Badge } from '@/components/ui'
import { ProductPlanCard } from './ProductPlanCard'
import { PackRecommendation } from './PackRecommendation'
import { CalendarBlock } from './CalendarBlock'
import {
  CheckCircle2,
  Share2,
  RotateCcw,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react'
import { OBJECTIVE_LABELS, CLIMATE_LABELS } from '@/lib/calculator/constants'

interface CalculatorResultProps {
  calculator: ReturnType<typeof useCalculator>
}

export function CalculatorResult({ calculator }: CalculatorResultProps) {
  const { result, reset, getShareableUrl } = calculator
  const [copied, setCopied] = useState(false)

  if (!result) {
    return (
      <div className="text-center">
        <p className="text-terravik-brown/70">
          Erro ao gerar resultado. Tente novamente.
        </p>
        <Button onClick={reset} className="mt-4">
          Recomeçar
        </Button>
      </div>
    )
  }

  const handleCopyLink = async () => {
    try {
      const url = getShareableUrl()
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <div className="space-y-10 md:space-y-12">
      {/* Header do resultado */}
      <div className="text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-terravik-green/10 md:h-24 md:w-24">
          <CheckCircle2 className="h-10 w-10 text-terravik-green md:h-12 md:w-12" />
        </div>
        <h1 className="font-display text-3xl font-bold text-terravik-brown md:text-4xl lg:text-5xl">
          Seu Plano Terravik está pronto ✅
        </h1>
        <p className="mt-3 text-base text-terravik-brown/70 md:text-lg lg:text-xl">
          Dose por m² + quantidade exata para sua área.
        </p>
      </div>

      {/* Resumo do contexto */}
      <div className="rounded-2xl border border-terravik-brown/10 bg-terravik-cream-50 p-6 md:p-8">
        <h3 className="mb-4 font-display text-lg font-bold text-terravik-brown md:text-xl">
          Resumo do seu gramado
        </h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default" size="lg">
            📏 {result.area_m2} m²
          </Badge>
          <Badge variant="default" size="lg">
            🎯 {OBJECTIVE_LABELS[result.context.objetivo].title}
          </Badge>
          <Badge variant="default" size="lg">
            🌤️ {CLIMATE_LABELS[result.context.clima_hoje]}
          </Badge>
        </div>
      </div>

      {/* Alertas condicionais */}
      {result.alerts.length > 0 && (
        <div className="space-y-3">
          {result.alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 p-4 md:p-5"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-700" />
              <p className="text-sm text-yellow-900 md:text-base">{alert}</p>
            </div>
          ))}
        </div>
      )}

      {/* Cards de produtos */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-terravik-brown md:text-3xl">
          Produtos recomendados
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {result.plan.map((productPlan) => (
            <ProductPlanCard key={productPlan.product_id} plan={productPlan} />
          ))}
        </div>
      </div>

      {/* Embalagens */}
      <PackRecommendation plan={result.plan} />

      {/* Calendário */}
      <CalendarBlock plan={result.plan} />

      {/* Ações finais */}
      <div className="space-y-4 rounded-2xl border border-terravik-brown/10 bg-white p-6 md:p-8">
        <h3 className="font-display text-lg font-bold text-terravik-brown md:text-xl">
          Próximos passos
        </h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copiar link do plano
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={reset} className="flex-1">
            <RotateCcw className="h-4 w-4" />
            Refazer quiz
          </Button>
        </div>
        <p className="text-sm text-terravik-brown/60 md:text-base">
          💡 Salve este link para consultar depois ou compartilhar com alguém.
        </p>
      </div>

      {/* CTA Final */}
      <div className="rounded-2xl bg-gradient-to-br from-terravik-green to-terravik-green-700 p-8 text-center text-white md:p-10">
        <h3 className="mb-3 font-display text-2xl font-bold md:text-3xl">
          Pronto para começar?
        </h3>
        <p className="mb-6 text-base text-white/90 md:text-lg">
          Em breve você poderá comprar os produtos diretamente aqui.
        </p>
        <Button
          variant="secondary"
          size="lg"
          className="bg-white text-terravik-green hover:bg-white/90"
          disabled
        >
          <Share2 className="h-5 w-5" />
          Comprar produtos (em breve)
        </Button>
      </div>
    </div>
  )
}
