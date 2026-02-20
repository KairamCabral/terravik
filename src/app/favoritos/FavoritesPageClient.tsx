'use client'

import { useFavorites } from '@/hooks/useFavorites'
import { Container, Button } from '@/components/ui'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Página de Favoritos
 * 
 * Exibe produtos favoritados pelo usuário
 * Design minimalista e clean
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

export function FavoritesPageClient() {
  const { favorites, removeFavorite, isLoading } = useFavorites()

  if (isLoading) {
    return (
      <Container spacing="lg">
        <div className="text-center py-20">
          <div className="animate-pulse">Carregando favoritos...</div>
        </div>
      </Container>
    )
  }

  if (favorites.length === 0) {
    return (
      <Container spacing="lg">
        <div className="text-center py-20 max-w-xl mx-auto">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-neutral-400" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-forest mb-4">
            Nenhum favorito ainda
          </h1>
          <p className="text-neutral-600 mb-8">
            Adicione produtos aos seus favoritos para acessá-los rapidamente depois
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link href="/produtos">
              Explorar Produtos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container spacing="lg">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-forest mb-3">
          Meus Favoritos
        </h1>
        <p className="text-neutral-600">
          {favorites.length} {favorites.length === 1 ? 'produto favoritado' : 'produtos favoritados'}
        </p>
      </div>

      {/* Grid de Favoritos */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
        {favorites.map((productId, index) => {
          const product = PRODUCTS_MAP[productId]
          
          if (!product) return null

          return (
            <motion.div
              key={productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-neutral-100"
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
                className="relative h-[260px] bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center p-6 cursor-pointer group/image"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={220}
                  height={220}
                  className="object-contain transition-transform duration-500 group-hover/image:scale-110"
                />
              </Link>

              {/* Info */}
              <div className="p-6">
                <Link href={`/produtos/${productId}`}>
                  <h3 className="font-heading text-xl font-bold text-forest mb-2 hover:text-forest/80 transition-colors">
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
                    ou 6x de R$ {(product.price / 6).toFixed(2)}
                  </span>
                </div>

                {/* Botão Ver Produto */}
                <Button
                  asChild
                  className="w-full bg-forest hover:bg-forest/90 text-white rounded-full font-semibold h-11 text-sm"
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
    </Container>
  )
}
