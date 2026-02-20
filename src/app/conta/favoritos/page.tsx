'use client'

import { useFavorites } from '@/hooks/useFavorites'
import { Button } from '@/components/ui'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Página de Favoritos - Área do Cliente
 * DONO: Supabase (localStorage com sync futuro)
 */

const PRODUCTS_MAP: Record<string, {
  name: string
  image: string
  price: number
  description: string
}> = {
  'gramado-novo': {
    name: 'Gramado Novo',
    image: '/images/Gramado-novo.png',
    price: 89.90,
    description: 'Rico em fósforo para enraizamento forte',
  },
  'verde-rapido': {
    name: 'Verde Rápido',
    image: '/images/Verde-Rápido.png',
    price: 64.90,
    description: 'Alta carga de nitrogênio para verde visível',
  },
  'resistencia-total': {
    name: 'Resistência Total',
    image: '/images/Resistencia-total.png',
    price: 71.20,
    description: 'NPK balanceado para proteção completa',
  },
}

export default function ContaFavoritosPage() {
  const { favorites, removeFavorite, isLoading } = useFavorites()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-forest animate-spin" />
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Meus Favoritos</h1>
          <p className="text-neutral-500">Seus produtos favoritos em um só lugar</p>
        </div>

        {/* Empty State */}
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-100">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-neutral-400" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">
            Nenhum favorito ainda
          </h2>
          <p className="text-neutral-600 mb-6">
            Adicione produtos aos seus favoritos para acessá-los rapidamente depois
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/produtos" className="inline-flex items-center gap-2">
              Explorar Produtos
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Meus Favoritos</h1>
          <p className="text-neutral-500">
            {favorites.length} {favorites.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
          </p>
        </div>
      </div>

      {/* Grid de Favoritos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((productId, index) => {
          const product = PRODUCTS_MAP[productId]
          
          if (!product) return null

          return (
            <motion.div
              key={productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-neutral-100"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeFavorite(productId)}
                className="absolute right-4 top-4 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform group"
                aria-label="Remover dos favoritos"
              >
                <Heart className="w-4 h-4 fill-red-500 text-red-500 group-hover:fill-transparent transition-all" />
              </button>

              {/* Imagem */}
              <Link 
                href={`/produtos/${productId}`}
                className="relative h-[240px] bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center p-6 cursor-pointer group/image"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-contain transition-transform duration-500 group-hover/image:scale-110"
                />
              </Link>

              {/* Info */}
              <div className="p-5">
                <Link href={`/produtos/${productId}`}>
                  <h3 className="font-heading text-lg font-bold text-forest mb-2 hover:text-forest/80 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-forest">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-neutral-500">
                    ou 6x
                  </span>
                </div>

                {/* Botão Ver Produto */}
                <Button
                  asChild
                  className="w-full bg-forest hover:bg-forest/90 text-white rounded-xl font-semibold h-11 text-sm"
                >
                  <Link href={`/produtos/${productId}`} className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Ver Produto
                  </Link>
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-forest/5 to-emerald-50 rounded-xl border border-forest/20 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1">
              Encontrou o que procurava?
            </h3>
            <p className="text-sm text-neutral-600">
              Explore nossa linha completa de fertilizantes profissionais
            </p>
          </div>
          <Button variant="primary" size="lg" asChild className="whitespace-nowrap">
            <Link href="/produtos">
              Ver Todos os Produtos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
