import type { Product } from '@/types/product'
import { ProductCard } from './ProductCard'

/**
 * ProductGrid — Design System 2026
 * Grid 2 colunas mobile / 3 desktop.
 */

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-body text-txt-muted">
          Nenhum produto encontrado.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
