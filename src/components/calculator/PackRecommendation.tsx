import type { ProductPlan } from '@/types/calculator'
import { Package } from 'lucide-react'

interface PackRecommendationProps {
  plan: ProductPlan[]
}

export function PackRecommendation({ plan }: PackRecommendationProps) {
  return (
    <div className="rounded-2xl border-2 border-terravik-brown/10 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-terravik-gold/10">
          <Package className="h-5 w-5 text-terravik-gold" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-terravik-brown">
            Embalagens ideais para sua área
          </h3>
          <p className="text-sm text-terravik-brown/60">
            Calculado para evitar sobra ou falta
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {plan.map((product) => (
          <div
            key={product.product_id}
            className="rounded-xl border border-terravik-brown/10 bg-terravik-cream-50 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium text-terravik-brown">
                {product.name}
              </h4>
              <span className="text-sm text-terravik-brown/60">
                {product.need_display}
              </span>
            </div>
            <p className="font-display text-lg font-bold text-terravik-green">
              {product.packs_display}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-terravik-brown/60">
        💡 Se você tem mais área ou quer fazer 2 aplicações, aumente 1 unidade.
      </p>
    </div>
  )
}
