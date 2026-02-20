/**
 * GraphQL mutations para o Carrinho (Shopify Cart API)
 *
 * Todas as mutations usam shopifyMutate (sem cache do Next.js)
 * porque são operações client-side.
 */

import { shopifyMutate } from '../client'
import type {
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesUpdateResponse,
  CartLinesRemoveResponse,
  CartResponse,
} from '../types'

// ---- Fragments ----

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                id
                handle
                title
                featuredImage {
                  url
                  altText
                  width
                  height
                }
              }
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`

// ---- Mutations ----

const CREATE_CART = `
  ${CART_FRAGMENT}
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

const ADD_CART_LINES = `
  ${CART_FRAGMENT}
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

const UPDATE_CART_LINES = `
  ${CART_FRAGMENT}
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

const REMOVE_CART_LINES = `
  ${CART_FRAGMENT}
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`

const GET_CART = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`

// ---- Funções exportadas ----

export async function createCart(variantId: string, quantity = 1) {
  const data = await shopifyMutate<CartCreateResponse>({
    query: CREATE_CART,
    variables: {
      input: {
        lines: [{ merchandiseId: variantId, quantity }],
      },
    },
  })

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message)
  }

  return data.cartCreate.cart
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
) {
  const data = await shopifyMutate<CartLinesAddResponse>({
    query: ADD_CART_LINES,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  })

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message)
  }

  return data.cartLinesAdd.cart
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
) {
  const data = await shopifyMutate<CartLinesUpdateResponse>({
    query: UPDATE_CART_LINES,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  })

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message)
  }

  return data.cartLinesUpdate.cart
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const data = await shopifyMutate<CartLinesRemoveResponse>({
    query: REMOVE_CART_LINES,
    variables: { cartId, lineIds },
  })

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message)
  }

  return data.cartLinesRemove.cart
}

export async function getCart(cartId: string) {
  const data = await shopifyMutate<CartResponse>({
    query: GET_CART,
    variables: { cartId },
  })

  return data.cart
}

// ─── Cupom de desconto ───────────────────────────────────────
//
// PRONTO PARA SHOPIFY: Quando a Shopify estiver conectada,
// descomentar a mutation abaixo e usar `applyDiscountCode`.
// O cart fragment já precisa incluir `discountCodes { applicable code }`
// e `discountAllocations { discountedAmount { amount currencyCode } }`.
//
// const UPDATE_DISCOUNT_CODES = `
//   ${CART_FRAGMENT}
//   mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
//     cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
//       cart {
//         ...CartFields
//       }
//       userErrors {
//         field
//         message
//       }
//     }
//   }
// `
//
// interface CartDiscountCodesUpdateResponse {
//   cartDiscountCodesUpdate: {
//     cart: ShopifyCart
//     userErrors: Array<{ field: string[]; message: string }>
//   }
// }
//
// export async function applyDiscountCode(cartId: string, codes: string[]) {
//   const data = await shopifyMutate<CartDiscountCodesUpdateResponse>({
//     query: UPDATE_DISCOUNT_CODES,
//     variables: { cartId, discountCodes: codes },
//   })
//
//   if (data.cartDiscountCodesUpdate.userErrors.length > 0) {
//     throw new Error(data.cartDiscountCodesUpdate.userErrors[0].message)
//   }
//
//   return data.cartDiscountCodesUpdate.cart
// }
//
// export async function removeDiscountCode(cartId: string) {
//   return applyDiscountCode(cartId, [])
// }
