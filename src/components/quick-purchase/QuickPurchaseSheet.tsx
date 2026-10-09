'use client'

import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuickPurchase } from '@/contexts/QuickPurchaseContext'
import { useCart } from '@/components/cart'
import { QuickPurchaseProductRow } from './QuickPurchaseProductRow'
import { FreeShippingBar } from '@/components/cart/FreeShippingBar'
import { Button } from '@/components/ui'
import { formatPrice } from '@/lib/subscription/pricing'
import {
  CALCULATOR_RESULT_KEY,
  type QuickPurchaseProduct,
  type QuickPurchaseVariant,
} from '@/lib/quick-purchase/constants'
import { PRODUCT_HANDLE_MAP } from '@/lib/utils/constants'
import type { CalculatorResult } from '@/types/calculator'

export function QuickPurchaseSheet() {
  const { isOpen, closeQuickPurchase } = useQuickPurchase()
  const { addItem, openCart } = useCart()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [selectedVariants, setSelectedVariants] = useState<Record<string, QuickPurchaseVariant>>({})
  const [calculatorProduct, setCalculatorProduct] = useState<{
    productId: string
    variantId: string
    title: string
    image: string
    price: number
    area_m2: number
    need_display: string
  } | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // Produtos vindos do catálogo, pelo servidor. Antes eram ids escritos à mão,
  // e dois deles não existiam em catálogo nenhum.
  const [produtos, setProdutos] = useState<QuickPurchaseProduct[]>([])

  useEffect(() => {
    if (!isOpen || produtos.length > 0) return
    let ativo = true
    fetch('/api/compra-rapida')
      .then((r) => (r.ok ? r.json() : { itens: [] }))
      .then((dados) => {
        if (ativo) setProdutos(dados.itens ?? [])
      })
      .catch(() => {
        // Sem catálogo o painel abre vazio; nada é vendido às cegas.
      })
    return () => {
      ativo = false
    }
  }, [isOpen, produtos.length])

  // Inicializar variante selecionada por produto (primeira variante)
  const getSelectedVariant = useCallback(
    (productId: string): QuickPurchaseVariant => {
      const product = produtos.find((p) => p.id === productId)
      if (!product || product.variants.length === 0) {
        return { variantId: '', title: '', price: 0 }
      }
      return (
        selectedVariants[productId] ?? product.variants[0]
      )
    },
    [selectedVariants, produtos]
  )

  const setSelectedVariant = useCallback((productId: string, variant: QuickPurchaseVariant) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variant }))
  }, [])

  // Carregar resultado da calculadora
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(CALCULATOR_RESULT_KEY)
      if (stored) {
        const result = JSON.parse(stored) as CalculatorResult
        const plan = result?.plan?.[0]
        if (plan) {
          // O produto recomendado sai do catálogo, pela mesma lista do painel.
          const product = produtos.find((p) => p.id === PRODUCT_HANDLE_MAP[plan.product_id])
          const variant = product?.variants[0]
          if (product && variant) {
            const variantId = variant.variantId
            setCalculatorProduct({
              productId: plan.product_id,
              variantId,
              title: plan.name,
              image: product.image,
              price: variant.price,
              area_m2: result.area_m2,
              need_display: plan.need_display,
            })
          }
        }
      } else {
        setCalculatorProduct(null)
      }
    } catch {
      setCalculatorProduct(null)
    }
  }, [isOpen, produtos])

  // Reset quantities e variantes ao fechar
  useEffect(() => {
    if (!isOpen) {
      setQuantities({})
      setSelectedVariants({})
    }
  }, [isOpen])

  const updateQuantity = useCallback((id: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [id]: qty }))
  }, [])

  const getQuantity = useCallback(
    (id: string) => quantities[id] ?? 0,
    [quantities]
  )

  const itemsToAdd = [
    ...(calculatorProduct && getQuantity(`calc-${calculatorProduct.productId}`) > 0
      ? [
          {
            variantId: calculatorProduct.variantId,
            quantity: getQuantity(`calc-${calculatorProduct.productId}`),
          },
        ]
      : []),
    ...produtos.filter((p) => getQuantity(p.id) > 0).map(
      (p) => ({
        variantId: getSelectedVariant(p.id).variantId,
        quantity: getQuantity(p.id),
      })
    ),
  ]

  const subtotal = (() => {
    let total = 0
    if (calculatorProduct && getQuantity(`calc-${calculatorProduct.productId}`) > 0) {
      total += calculatorProduct.price * getQuantity(`calc-${calculatorProduct.productId}`)
    }
    produtos.forEach((p) => {
      const q = getQuantity(p.id)
      if (q > 0) {
        const v = getSelectedVariant(p.id)
        total += v.price * q
      }
    })
    return total
  })()

  const handleAddToCart = async () => {
    if (itemsToAdd.length === 0) return
    setIsAdding(true)
    try {
      for (const item of itemsToAdd) {
        await addItem(item.variantId, item.quantity, undefined, 'compra-rapida')
      }
      closeQuickPurchase()
      openCart()
    } catch (err) {
      console.error('Erro ao adicionar:', err)
    } finally {
      setIsAdding(false)
    }
  }

  const handleClose = () => {
    closeQuickPurchase()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[65] bg-bg-dark/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[66] max-h-[85vh] flex flex-col bg-bg-surface rounded-t-2xl shadow-2xl pb-safe"
            role="dialog"
            aria-modal="true"
            aria-label="Compra rápida"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
              <h2 className="font-heading text-lg font-semibold text-txt-primary">
                Compra Rápida
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-txt-muted hover:bg-bg-surface-2 hover:text-txt-primary transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo scrollável */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Para seu gramado (se veio da calculadora) */}
              {calculatorProduct && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-forest uppercase tracking-wider mb-3">
                    Para seu gramado ({calculatorProduct.area_m2} m²)
                  </p>
                  <QuickPurchaseProductRow
                    title={calculatorProduct.title}
                    image={calculatorProduct.image}
                    variants={[{ variantId: calculatorProduct.variantId, title: calculatorProduct.need_display, price: calculatorProduct.price }]}
                    selectedVariant={{ variantId: calculatorProduct.variantId, title: calculatorProduct.need_display, price: calculatorProduct.price }}
                    onVariantChange={() => {}}
                    quantity={getQuantity(`calc-${calculatorProduct.productId}`)}
                    onQuantityChange={(q) =>
                      updateQuantity(`calc-${calculatorProduct.productId}`, q)
                    }
                    showVariantSelector={false}
                  />
                </div>
              )}

              {/* Mais vendidos */}
              <div>
                <p className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-3">
                  Mais vendidos
                </p>
                <div className="space-y-2">
                  {produtos.map((product) => (
                    <QuickPurchaseProductRow
                      key={product.id}
                      title={product.title}
                      image={product.image}
                      badge={product.badge}
                      variants={product.variants}
                      selectedVariant={getSelectedVariant(product.id)}
                      onVariantChange={(v) => setSelectedVariant(product.id, v)}
                      quantity={getQuantity(product.id)}
                      onQuantityChange={(q) => updateQuantity(product.id, q)}
                    />
                  ))}
                </div>
              </div>

              {/* Barra frete grátis */}
              {subtotal > 0 && (
                <div className="mt-6">
                  <FreeShippingBar cartSubtotal={subtotal} />
                </div>
              )}
            </div>

            {/* Footer fixo */}
            <div className="border-t border-border-subtle px-4 py-4 bg-bg-surface">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-txt-muted">Total</span>
                <span className="font-heading text-xl font-bold text-txt-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Button
                fullWidth
                size="lg"
                onClick={handleAddToCart}
                disabled={itemsToAdd.length === 0 || isAdding}
                loading={isAdding}
              >
                Adicionar ao carrinho
              </Button>
              <button
                onClick={handleClose}
                className="w-full text-center text-xs text-txt-muted hover:text-txt-secondary py-2 transition-colors"
              >
                Fechar compra rápida
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
