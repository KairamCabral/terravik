'use client'

import { CheckCircle2 } from 'lucide-react'
import { StarRating } from './StarRating'
import type { Review } from '@/types/product'

interface ProductReviewsProps {
  reviews: Review[]
  averageRating: number
  totalCount: number
}

export function ProductReviews({
  reviews,
  averageRating,
  totalCount,
}: ProductReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-bg-surface p-8 text-center">
        <p className="text-txt-muted">
          Este produto ainda não possui avaliações.
        </p>
        <p className="mt-2 text-sm text-txt-muted">
          Seja o primeiro a avaliar!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border-subtle bg-bg-surface p-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="font-heading text-4xl font-bold text-txt-primary">
              {averageRating.toFixed(1)}
            </span>
            <StarRating rating={averageRating} size="lg" />
          </div>
          <p className="mt-2 text-sm text-txt-muted">
            Baseado em {totalCount} {totalCount !== 1 ? 'avaliações' : 'avaliação'}
          </p>
        </div>

        {/* Distribuição */}
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length
            const percentage = (count / totalCount) * 100

            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-12 text-txt-muted">{star} ★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-border-subtle">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-txt-muted">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lista de reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-border-subtle bg-white p-6 transition-shadow hover:shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} size="sm" />
                  {review.verified && (
                    <span className="flex items-center gap-1 text-xs font-medium text-forest">
                      <CheckCircle2 className="h-3 w-3" />
                      Compra verificada
                    </span>
                  )}
                </div>
                <h4 className="mt-2 font-semibold text-txt-primary">
                  {review.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-txt-secondary">
                  {review.comment}
                </p>
              </div>

              <div className="text-sm text-txt-muted sm:text-right">
                <div className="flex items-center gap-2 sm:justify-end">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/10 text-xs font-bold text-forest">
                    {review.author.charAt(0)}
                  </div>
                  <p className="font-medium text-txt-secondary">{review.author}</p>
                </div>
                <p className="mt-1 text-xs">
                  {new Date(review.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
