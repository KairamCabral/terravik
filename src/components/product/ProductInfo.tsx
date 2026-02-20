import type { Product } from '@/types/product'
import { formatCurrency } from '@/lib/utils/formatters'

/**
 * ProductInfo — Design System 2026
 *
 * - Nome (Fraunces)
 * - Tags chips discretas
 * - Preço alto contraste
 * - Disponibilidade
 */

interface ProductInfoProps {
  product: Product
  selectedPrice?: number
  selectedCompareAtPrice?: number
}

export function ProductInfo({
  product,
  selectedPrice,
  selectedCompareAtPrice,
}: ProductInfoProps) {
  const price = selectedPrice ?? product.price
  const compareAtPrice = selectedCompareAtPrice ?? product.compareAtPrice
  const hasDiscount = compareAtPrice > price

  return (
    <div className="space-y-5">
      {/* Título */}
      <div>
        <h1 className="font-heading text-h1 text-txt-primary">
          {product.title}
        </h1>
        {product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-forest/15 px-3 py-0.5 text-xs font-medium text-forest"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Preço */}
      <div className="space-y-1">
        {hasDiscount && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-txt-muted">De:</span>
            <span className="text-lg text-txt-muted line-through">
              {formatCurrency(compareAtPrice, product.currency)}
            </span>
            <span className="rounded-full border border-gold px-2 py-0.5 text-xs font-semibold text-gold">
              {Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}% OFF
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          {hasDiscount && (
            <span className="text-sm text-txt-muted">Por:</span>
          )}
          <span className="font-heading text-4xl font-semibold text-forest">
            {formatCurrency(price, product.currency)}
          </span>
        </div>
      </div>

      {/* Descrição */}
      {product.descriptionHtml && (
        <div
          className="prose prose-sm max-w-none text-txt-secondary prose-strong:text-txt-primary"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      )}

      {/* Disponibilidade */}
      <div>
        {product.available ? (
          <p className="flex items-center gap-2 text-sm text-forest">
            <span className="h-2 w-2 rounded-full bg-forest" />
            Em estoque — pronta entrega
          </p>
        ) : (
          <p className="flex items-center gap-2 text-sm text-error">
            <span className="h-2 w-2 rounded-full bg-error" />
            Esgotado
          </p>
        )}
      </div>
    </div>
  )
}
