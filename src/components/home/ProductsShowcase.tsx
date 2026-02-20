'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, FavoriteButton } from '@/components/ui'
import { cn } from '@/lib/utils/cn'
import { useCart } from '@/components/cart'

/**
 * Products Showcase - Ultra Minimalista
 * 
 * Features:
 * - Cards com altura fixa otimizada
 * - Overlay compacto sem necessidade de scroll
 * - Design ultra clean e eficiente
 * - Integração completa com carrinho
 */

type ProductSize = '1kg' | '5kg' | '10kg'

interface Product {
  id: string
  name: string
  function: string
  description: string
  image: string
  badge: string | null
  discount: number
  prices: {
    '1kg': { original: number; final: number }
    '5kg': { original: number; final: number }
    '10kg': { original: number; final: number }
  }
  variantIds: {
    '1kg': string
    '5kg': string
    '10kg': string
  }
}

const products: Product[] = [
  {
    id: 'gramado-novo',
    name: 'Gramado Novo',
    function: 'Implantação',
    description: 'Rico em fósforo para enraizamento forte desde o início.',
    image: '/images/Gramado-novo.png',
    badge: null,
    discount: 0,
    prices: {
      '1kg': { original: 89.90, final: 89.90 },
      '5kg': { original: 399.90, final: 379.90 },
      '10kg': { original: 749.90, final: 699.90 },
    },
    variantIds: {
      '1kg': 'gid://shopify/ProductVariant/gramado-novo-1kg',
      '5kg': 'gid://shopify/ProductVariant/gramado-novo-5kg',
      '10kg': 'gid://shopify/ProductVariant/gramado-novo-10kg',
    },
  },
  {
    id: 'verde-rapido',
    name: 'Verde Rápido',
    function: 'Crescimento',
    description: 'Alta carga de nitrogênio para verde visível em dias.',
    image: '/images/Verde-Rápido.png',
    badge: 'Mais vendido',
    discount: 35,
    prices: {
      '1kg': { original: 99.90, final: 64.90 },
      '5kg': { original: 449.90, final: 292.40 },
      '10kg': { original: 849.90, final: 552.40 },
    },
    variantIds: {
      '1kg': 'gid://shopify/ProductVariant/verde-rapido-1kg',
      '5kg': 'gid://shopify/ProductVariant/verde-rapido-5kg',
      '10kg': 'gid://shopify/ProductVariant/verde-rapido-10kg',
    },
  },
  {
    id: 'resistencia-total',
    name: 'Resistência Total',
    function: 'Proteção',
    description: 'NPK balanceado para gramados sob estresse e pisoteio.',
    image: '/images/Resistencia-total.png',
    badge: null,
    discount: 25,
    prices: {
      '1kg': { original: 94.90, final: 71.20 },
      '5kg': { original: 429.90, final: 322.40 },
      '10kg': { original: 799.90, final: 599.90 },
    },
    variantIds: {
      '1kg': 'gid://shopify/ProductVariant/resistencia-total-1kg',
      '5kg': 'gid://shopify/ProductVariant/resistencia-total-5kg',
      '10kg': 'gid://shopify/ProductVariant/resistencia-total-10kg',
    },
  },
]

export function ProductsShowcase() {
  const { addItem, openCart, isLoading } = useCart()
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, ProductSize>>({})
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [subscriptions, setSubscriptions] = useState<Record<string, boolean>>({})
  const [addingToCart, setAddingToCart] = useState(false)
  const [justAdded, setJustAdded] = useState<string | null>(null)

  const getSelectedSize = (productId: string): ProductSize => 
    selectedSizes[productId] || '1kg'
  
  const getQuantity = (productId: string): number => 
    quantities[productId] || 1

  const isSubscription = (productId: string): boolean => 
    subscriptions[productId] || false

  const handleBuyClick = (productId: string) => {
    setExpandedProduct(productId)
    if (!selectedSizes[productId]) {
      setSelectedSizes({ ...selectedSizes, [productId]: '1kg' })
    }
    if (!quantities[productId]) {
      setQuantities({ ...quantities, [productId]: 1 })
    }
  }

  const updateSize = (productId: string, size: ProductSize) => {
    setSelectedSizes({ ...selectedSizes, [productId]: size })
  }

  const updateQuantity = (productId: string, delta: number) => {
    const current = getQuantity(productId)
    const newQuantity = Math.max(1, current + delta)
    setQuantities({ ...quantities, [productId]: newQuantity })
  }

  const toggleSubscription = (productId: string) => {
    setSubscriptions({ ...subscriptions, [productId]: !isSubscription(productId) })
  }

  const getCurrentPrice = (product: Product) => {
    const size = getSelectedSize(product.id)
    const quantity = getQuantity(product.id)
    const subscription = isSubscription(product.id)
    return product.prices[size].final * quantity * (subscription ? 0.9 : 1)
  }

  const handleAddToCart = async (product: Product) => {
    const size = getSelectedSize(product.id)
    const quantity = getQuantity(product.id)
    const subscription = isSubscription(product.id)
    const variantId = product.variantIds[size]

    setAddingToCart(true)
    
    try {
      await addItem(variantId, quantity, subscription ? {
        purchaseMode: 'subscription',
        frequency: 30,
        subscriptionPrice: product.prices[size].final * 0.9,
        discountPercent: 10,
      } : {
        purchaseMode: 'one-time',
      })

      setJustAdded(product.id)
      setTimeout(() => setJustAdded(null), 2000)

      setExpandedProduct(null)
      setTimeout(() => openCart(), 300)
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      alert('Erro ao adicionar produto ao carrinho. Tente novamente.')
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <section className="bg-gradient-to-b from-white via-neutral-50 to-white py-20">
      <div className="container-main">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-gold">
            Nossos Produtos
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-forest">
            Três Soluções Estratégicas
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Cada fórmula desenvolvida para uma fase específica do seu gramado
          </p>
        </div>

        {/* Grid de Produtos */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {products.map((product) => {
            const isExpanded = expandedProduct === product.id
            const selectedSize = getSelectedSize(product.id)
            const quantity = getQuantity(product.id)
            const subscription = isSubscription(product.id)
            const currentPrice = getCurrentPrice(product)

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={cn(
                  'relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-neutral-100 h-[580px] flex flex-col',
                  justAdded === product.id && 'ring-2 ring-grass'
                )}
              >
                {/* Success Badge - Aparece quando adiciona ao carrinho */}
                <AnimatePresence>
                  {justAdded === product.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 z-40 bg-grass/10 backdrop-blur-sm flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="bg-white rounded-full p-4 shadow-2xl"
                      >
                        <Check className="w-8 h-8 text-grass" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute left-4 top-4 z-30 bg-grass text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    -{product.discount}%
                  </div>
                )}

                {/* Favorite Button */}
                <FavoriteButton
                  productId={product.id}
                  size="md"
                  className="absolute right-4 top-4 z-30"
                />

                {/* Imagem do Produto - Clicável */}
                <Link 
                  href={`/produtos/${product.id}`}
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

                {/* Info do Produto */}
                <div className="flex-1 p-5 flex flex-col">
                  {/* Badge */}
                  {product.badge && (
                    <span className="inline-block bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-semibold mb-2 w-fit">
                      {product.badge}
                    </span>
                  )}

                  <h3 className="font-heading text-lg font-bold text-forest mb-2 min-h-[3.5rem] line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-sm text-neutral-600 line-clamp-2 mb-3 min-h-[2.5rem]">
                    {product.description}
                  </p>

                  {/* Preço */}
                  <div className="mt-auto">
                    {product.discount > 0 && (
                      <span className="text-xs text-neutral-400 line-through block">
                        De: R$ {product.prices['1kg'].original.toFixed(2)}
                      </span>
                    )}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xl font-bold text-forest">
                        R$ {product.prices['1kg'].final.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 block mt-1 mb-3">
                      ou 6x de R$ {(product.prices['1kg'].final / 6).toFixed(2)}
                    </span>

                    {/* Botão Comprar */}
                    <Button
                      onClick={() => handleBuyClick(product.id)}
                      className="w-full bg-forest hover:bg-forest/90 text-white rounded-full font-semibold h-11 text-sm shadow-md hover:shadow-lg transition-all"
                    >
                      Comprar
                    </Button>
                  </div>
                </div>

                {/* Overlay de Opções - Ultra Compacto */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-white rounded-3xl z-20 flex flex-col"
                    >
                      {/* Header Compacto */}
                      <div className="relative bg-gradient-to-br from-neutral-50 to-white px-5 py-4 border-b border-neutral-100">
                        <div className="flex items-center justify-between gap-3">
                          {/* Imagem Mini */}
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="object-contain"
                            />
                          </div>
                          
                          {/* Título */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-heading text-base font-bold text-forest truncate">
                              {product.name}
                            </h3>
                            <p className="text-[10px] text-neutral-600 line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                          
                          {/* Close */}
                          <button
                            onClick={() => setExpandedProduct(null)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors flex-shrink-0"
                            aria-label="Fechar"
                          >
                            <X className="w-4 h-4 text-neutral-500" />
                          </button>
                        </div>
                      </div>

                      {/* Conteúdo Compacto */}
                      <div className="flex-1 px-5 py-4 space-y-4">
                        {/* Tamanho */}
                        <div>
                          <label className="block text-[10px] font-semibold text-neutral-700 mb-1.5">
                            Tamanho:
                          </label>
                          <div className="flex gap-1.5">
                            {(['1kg', '5kg', '10kg'] as ProductSize[]).map((size) => (
                              <button
                                key={size}
                                onClick={() => updateSize(product.id, size)}
                                className={cn(
                                  'flex-1 py-2 px-2 rounded-full text-xs font-medium transition-all',
                                  selectedSize === size
                                    ? 'bg-forest text-white'
                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                )}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quantidade */}
                        <div>
                          <label className="block text-[10px] font-semibold text-neutral-700 mb-1.5">
                            Quantidade:
                          </label>
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                              aria-label="Diminuir"
                            >
                              <Minus className="w-3.5 h-3.5 text-neutral-600" />
                            </button>
                            <span className="text-lg font-semibold text-forest min-w-[2ch] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors"
                              aria-label="Aumentar"
                            >
                              <Plus className="w-3.5 h-3.5 text-neutral-600" />
                            </button>
                          </div>
                        </div>

                        {/* Assinatura Compacta */}
                        <div className="bg-gold/5 border border-gold/20 rounded-xl p-2.5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={subscription}
                              onChange={() => toggleSubscription(product.id)}
                              className="w-3.5 h-3.5 accent-gold rounded"
                            />
                            <div className="flex-1 flex items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-forest">
                                Assinatura mensal
                              </span>
                              <span className="text-[9px] font-bold text-gold bg-gold/15 px-1.5 py-0.5 rounded-full">
                                -10%
                              </span>
                            </div>
                          </label>
                        </div>

                        {/* Total Compacto */}
                        <div className="bg-neutral-50 rounded-xl p-3 text-center">
                          <span className="text-[10px] text-neutral-600 block">Total:</span>
                          <span className="text-2xl font-bold text-forest block mt-0.5">
                            R$ {currentPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Botões Footer */}
                      <div className="px-5 pb-5 flex gap-2">
                        <Button
                          onClick={() => setExpandedProduct(null)}
                          disabled={addingToCart}
                          className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full font-semibold h-11 text-sm disabled:opacity-50"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={addingToCart || isLoading}
                          className="flex-1 bg-forest hover:bg-forest/90 text-white rounded-full font-semibold h-11 text-sm gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingToCart ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                              />
                              Adicionando...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Adicionar
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
