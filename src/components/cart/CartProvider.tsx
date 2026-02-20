'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import type { Cart } from '@/types/cart'
import { getCart } from '@/lib/shopify/queries/cart'
import {
  createCart as createCartMutation,
  addToCart as addToCartMutation,
  updateCartLine as updateCartLineMutation,
  removeFromCart as removeFromCartMutation,
} from '@/lib/shopify/queries/cart'
import { normalizeCart, normalizeMockCart } from '@/lib/shopify/mappers'
import {
  getMockCart,
  addToMockCart,
  updateMockCartItem,
  removeFromMockCart,
  clearMockCart,
} from '@/lib/shopify/mock-cart'

const CART_COOKIE_NAME = 'terravik-cart-id'

interface CartContextValue {
  cart: Cart | null
  isOpen: boolean
  isLoading: boolean
  addItem: (
    variantId: string, 
    quantity?: number,
    subscriptionData?: {
      purchaseMode: 'one-time' | 'subscription'
      frequency?: number
      subscriptionPrice?: number
      discountPercent?: number
    }
  ) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  openCart: () => void
  closeCart: () => void
  goToCheckout: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [useMockMode, setUseMockMode] = useState(false)

  // Helper: Get cart ID from cookie
  const getCartIdFromCookie = useCallback((): string | null => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    const cartCookie = cookies.find((c) =>
      c.trim().startsWith(`${CART_COOKIE_NAME}=`)
    )
    return cartCookie ? cartCookie.split('=')[1] : null
  }, [])

  // Helper: Set cart ID in cookie
  const setCartIdInCookie = useCallback((cartId: string) => {
    if (typeof document === 'undefined') return
    // Cookie válido por 30 dias
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)
    document.cookie = `${CART_COOKIE_NAME}=${cartId}; expires=${expires.toUTCString()}; path=/`
  }, [])

  // Helper: Clear cart ID from cookie
  const clearCartIdFromCookie = useCallback(() => {
    if (typeof document === 'undefined') return
    document.cookie = `${CART_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
  }, [])

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      // Tentar carregar mock cart primeiro se existir
      try {
        const existingMockCart = getMockCart()
        if (existingMockCart && existingMockCart.items.length > 0) {
          console.log('[CartProvider] Carrinho mock encontrado, usando mock mode')
          setUseMockMode(true)
          setCart(normalizeMockCart(existingMockCart))
          return
        }
      } catch (error) {
        console.log('[CartProvider] Erro ao verificar mock cart:', error)
      }

      // Tentar Shopify
      const cartId = getCartIdFromCookie()
      if (!cartId) return

      try {
        const rawCart = await getCart(cartId)
        if (rawCart && rawCart.lines?.edges?.length > 0) {
          setCart(normalizeCart(rawCart))
        } else {
          // Cart vazio ou inválido
          clearCartIdFromCookie()
          setCart(null)
        }
      } catch (error) {
        console.warn('[CartProvider] Shopify indisponível, modo mock ativado')
        setUseMockMode(true)
        clearCartIdFromCookie()
        setCart(null)
      }
    }

    loadCart()
  }, [getCartIdFromCookie, clearCartIdFromCookie])

  const addItem = useCallback(
    async (
      variantId: string, 
      quantity = 1,
      subscriptionData?: {
        purchaseMode: 'one-time' | 'subscription'
        frequency?: number
        subscriptionPrice?: number
        discountPercent?: number
      }
    ) => {
      setIsLoading(true)
      try {
        // Tentar Shopify real primeiro se não estiver em mock mode
        if (!useMockMode) {
          try {
            let rawCart

            if (!cart?.id) {
              // Criar novo carrinho
              rawCart = await createCartMutation(variantId, quantity)
              setCartIdInCookie(rawCart.id)
            } else {
              // Adicionar ao carrinho existente
              rawCart = await addToCartMutation(cart.id, variantId, quantity)
            }

            setCart(normalizeCart(rawCart))
            return
          } catch (error) {
            console.warn('[CartProvider] Shopify falhou, usando mock cart:', error)
            setUseMockMode(true)
          }
        }

        // Fallback para mock
        console.log('[CartProvider] Adicionando ao mock cart:', variantId, subscriptionData)
        const mockCart = addToMockCart(variantId, quantity, subscriptionData)
        setCart(normalizeMockCart(mockCart))
      } catch (error) {
        console.error('Erro ao adicionar item:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [cart, useMockMode, setCartIdInCookie]
  )

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return

      setIsLoading(true)
      try {
        if (useMockMode) {
          // Usar mock
          console.log('[CartProvider] Atualizando mock cart:', lineId, quantity)
          const mockCart = updateMockCartItem(lineId, quantity)
          setCart(normalizeMockCart(mockCart))
        } else {
          // Tentar Shopify
          try {
            if (quantity === 0) {
              // Remove se quantidade for 0
              const rawCart = await removeFromCartMutation(cart.id, [lineId])
              const normalized = normalizeCart(rawCart)

              if (normalized.items.length === 0) {
                clearCartIdFromCookie()
                setCart(null)
              } else {
                setCart(normalized)
              }
              return
            }

            const rawCart = await updateCartLineMutation(cart.id, lineId, quantity)
            setCart(normalizeCart(rawCart))
          } catch (error) {
            console.warn('[CartProvider] Shopify falhou, usando mock cart')
            setUseMockMode(true)
            const mockCart = updateMockCartItem(lineId, quantity)
            setCart(normalizeMockCart(mockCart))
          }
        }
      } catch (error) {
        console.error('Erro ao atualizar item:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [cart, useMockMode, clearCartIdFromCookie]
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart) return

      setIsLoading(true)
      try {
        if (useMockMode) {
          console.log('[CartProvider] Removendo do mock cart:', lineId)
          const mockCart = removeFromMockCart(lineId)
          
          if (mockCart.items.length === 0) {
            setCart(null)
          } else {
            setCart(normalizeMockCart(mockCart))
          }
        } else {
          try {
            const rawCart = await removeFromCartMutation(cart.id, [lineId])
            const normalized = normalizeCart(rawCart)

            if (normalized.items.length === 0) {
              // Se carrinho ficou vazio, limpar
              clearCartIdFromCookie()
              setCart(null)
            } else {
              setCart(normalized)
            }
          } catch (error) {
            console.warn('[CartProvider] Shopify falhou, usando mock cart')
            setUseMockMode(true)
            const mockCart = removeFromMockCart(lineId)
            
            if (mockCart.items.length === 0) {
              setCart(null)
            } else {
              setCart(normalizeMockCart(mockCart))
            }
          }
        }
      } catch (error) {
        console.error('Erro ao remover item:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [cart, useMockMode, clearCartIdFromCookie]
  )

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const goToCheckout = useCallback(() => {
    setIsOpen(false)
    router.push('/checkout')
  }, [router])

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        openCart,
        closeCart,
        goToCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
