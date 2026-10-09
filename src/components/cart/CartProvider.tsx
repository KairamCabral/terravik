'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import type { Cart } from '@/types/cart'
import {
  getCart,
  createCart as createCartMutation,
  addToCart as addToCartMutation,
  updateCartLine as updateCartLineMutation,
  removeFromCart as removeFromCartMutation,
} from '@/lib/shopify/queries/cart'
import { shouldUseMock } from '@/lib/shopify/client'
import { normalizeCart, normalizeMockCart } from '@/lib/shopify/mappers'
import {
  getMockCart,
  addToMockCart,
  updateMockCartItem,
  removeFromMockCart,
  clearMockCart,
} from '@/lib/shopify/mock-cart'
import { useToast } from '@/components/ui'

const CART_COOKIE_NAME = 'terravik-cart-id'

/**
 * O carrinho mock vale SÓ quando a loja não está configurada.
 *
 * Antes, qualquer erro da Shopify ligava o modo mock e o carrinho mock ficava
 * salvo no localStorage para sempre: nas visitas seguintes, "Adicionar ao
 * carrinho" respondia "Adicionado!" sem que nada chegasse à Shopify.
 *
 * Agora a decisão é uma só, a mesma do catálogo: `shouldUseMock()`. Com a
 * loja configurada, erro da Shopify vira aviso na tela e o carrinho continua
 * real; carrinho mock que tenha ficado no navegador é descartado ao carregar.
 */
const MODO_MOCK = shouldUseMock()

interface SubscriptionData {
  purchaseMode: 'one-time' | 'subscription'
  frequency?: number
  subscriptionPrice?: number
  discountPercent?: number
}

interface CartContextValue {
  cart: Cart | null
  isOpen: boolean
  isLoading: boolean
  addItem: (
    variantId: string,
    quantity?: number,
    subscriptionData?: SubscriptionData
  ) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  openCart: () => void
  closeCart: () => void
  goToCheckout: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

/**
 * O id de carrinho da Shopify termina em `?key=...`: tem um '=' DENTRO do
 * valor. `split('=')[1]` cortava ali e devolvia um id sem a chave, o getCart
 * da montagem falhava e o "adicionar" seguinte abria um carrinho novo.
 *
 * Grava codificado e decodifica na leitura. Cookie antigo, gravado sem
 * codificar, continua valendo: decodeURIComponent devolve igual sem %XX.
 */
function lerCookie(): string | null {
  if (typeof document === 'undefined') return null
  const cookie = document.cookie
    .split(';')
    .find((c) => c.trim().startsWith(`${CART_COOKIE_NAME}=`))
  if (!cookie) return null
  const bruto = cookie.trim().slice(CART_COOKIE_NAME.length + 1)
  if (!bruto) return null
  try {
    return decodeURIComponent(bruto)
  } catch {
    return bruto
  }
}

function gravarCookie(cartId: string) {
  if (typeof document === 'undefined') return
  // Cookie válido por 30 dias
  const expira = new Date()
  expira.setDate(expira.getDate() + 30)
  document.cookie = `${CART_COOKIE_NAME}=${encodeURIComponent(cartId)}; expires=${expira.toUTCString()}; path=/`
}

function apagarCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${CART_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [cart, setCart] = useState<Cart | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // O id do carrinho vive também numa ref. Quem adiciona vários itens em
  // sequência (calculadora, Compra Rápida) chama addItem num laço com a mesma
  // closure, em que `cart` ainda é null: cada chamada criava um carrinho novo.
  const cartIdRef = useRef<string | null>(null)

  // O carrinho mais recente, fora do ciclo de render. Quem faz
  // `await addItem(...)` e em seguida `goToCheckout()` no mesmo handler chama
  // a função capturada ANTES do add; a ref tem o carrinho que acabou de entrar.
  const cartRef = useRef<Cart | null>(null)

  const atualizarCarrinho = useCallback((novo: Cart | null) => {
    cartIdRef.current = novo?.id ?? null
    cartRef.current = novo
    setCart(novo)
  }, [])

  const avisarFalha = useCallback(
    (mensagem: string, erro: unknown) => {
      console.error('[carrinho]', mensagem, erro)
      showToast('error', mensagem)
    },
    [showToast]
  )

  // Load cart on mount
  useEffect(() => {
    const carregar = async () => {
      try {
        if (MODO_MOCK) {
          const mock = getMockCart()
          if (mock.items.length > 0) atualizarCarrinho(normalizeMockCart(mock))
          return
        }

        // Carrinho mock que ficou no navegador pelo defeito antigo: descartado,
        // senão o carrinho real nunca apareceria.
        try {
          if (getMockCart().items.length > 0) clearMockCart()
        } catch {
          // localStorage indisponível: nada a limpar.
        }

        const cartId = lerCookie()
        if (!cartId) return

        const raw = await getCart(cartId)
        if (raw && raw.lines?.edges?.length > 0) {
          atualizarCarrinho(normalizeCart(raw))
        } else {
          // Carrinho vazio, expirado ou já finalizado no checkout.
          apagarCookie()
          atualizarCarrinho(null)
        }
      } catch (erro) {
        console.error('[carrinho] não foi possível carregar o carrinho salvo', erro)
        apagarCookie()
        atualizarCarrinho(null)
      }
    }

    carregar()
  }, [atualizarCarrinho])

  const addItem = useCallback(
    async (variantId: string, quantity = 1, subscriptionData?: SubscriptionData) => {
      setIsLoading(true)
      try {
        if (MODO_MOCK) {
          atualizarCarrinho(
            normalizeMockCart(addToMockCart(variantId, quantity, subscriptionData))
          )
          return
        }

        // Restaurar o carrinho salvo é assíncrono. Quem clicava em "adicionar"
        // antes de a consulta voltar encontrava a ref nula e começava um
        // carrinho novo. O cookie é síncrono e já existe no primeiro render.
        const id = cartIdRef.current ?? lerCookie()
        let raw = null
        if (id) {
          try {
            raw = await addToCartMutation(id, variantId, quantity)
          } catch {
            // Carrinho expirado ou já convertido em pedido: a Shopify recusa
            // adicionar. Começa um carrinho novo abaixo.
            raw = null
          }
        }
        if (!raw) {
          raw = await createCartMutation(variantId, quantity)
          gravarCookie(raw.id)
        }
        // Guarda o id antes do render: a próxima chamada do mesmo laço já o vê.
        cartIdRef.current = raw.id

        atualizarCarrinho(normalizeCart(raw))
      } catch (erro) {
        avisarFalha('Não foi possível adicionar ao carrinho. Tente de novo em instantes.', erro)
        // Relança para quem chamou não mostrar "Adicionado!".
        throw erro
      } finally {
        setIsLoading(false)
      }
    },
    [atualizarCarrinho, avisarFalha]
  )

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      const id = cartIdRef.current
      if (!id) return

      setIsLoading(true)
      try {
        if (MODO_MOCK) {
          atualizarCarrinho(normalizeMockCart(updateMockCartItem(lineId, quantity)))
          return
        }

        const raw =
          quantity === 0
            ? await removeFromCartMutation(id, [lineId])
            : await updateCartLineMutation(id, lineId, quantity)
        const normalizado = normalizeCart(raw)

        if (normalizado.items.length === 0) {
          apagarCookie()
          atualizarCarrinho(null)
        } else {
          atualizarCarrinho(normalizado)
        }
      } catch (erro) {
        avisarFalha('Não foi possível atualizar o carrinho. Tente de novo.', erro)
      } finally {
        setIsLoading(false)
      }
    },
    [atualizarCarrinho, avisarFalha]
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      const id = cartIdRef.current
      if (!id) return

      setIsLoading(true)
      try {
        if (MODO_MOCK) {
          const mock = removeFromMockCart(lineId)
          atualizarCarrinho(mock.items.length === 0 ? null : normalizeMockCart(mock))
          return
        }

        const normalizado = normalizeCart(await removeFromCartMutation(id, [lineId]))
        if (normalizado.items.length === 0) {
          apagarCookie()
          atualizarCarrinho(null)
        } else {
          atualizarCarrinho(normalizado)
        }
      } catch (erro) {
        avisarFalha('Não foi possível remover o item. Tente de novo.', erro)
      } finally {
        setIsLoading(false)
      }
    },
    [atualizarCarrinho, avisarFalha]
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
