/**
 * Mappers: Shopify raw types → Tipos normalizados internos
 *
 * Componentes NUNCA devem usar tipos raw do Shopify.
 * Sempre passar pelo mapper primeiro.
 */

import type {
  ShopifyProduct,
  ShopifyVariant,
  ShopifyImage,
  ShopifyMoney,
  ShopifyCart,
  ShopifyCartLine,
} from './types'
import type { Product, ProductVariant, ProductImage } from '@/types/product'
import type { Cart, CartItem } from '@/types/cart'

// ---- Helpers ----

function normalizeImage(image: ShopifyImage | null): ProductImage | null {
  if (!image) return null
  return {
    url: image.url,
    alt: image.altText || '',
    width: image.width,
    height: image.height,
  }
}

function normalizeMoney(money: ShopifyMoney): number {
  return parseFloat(money.amount)
}

function normalizeCurrency(money: ShopifyMoney): string {
  return money.currencyCode
}

// ---- Produto ----

function normalizeVariant(variant: ShopifyVariant): ProductVariant {
  return {
    id: variant.id,
    title: variant.title,
    available: variant.availableForSale,
    quantityAvailable: variant.quantityAvailable,
    price: normalizeMoney(variant.price),
    compareAtPrice: variant.compareAtPrice
      ? normalizeMoney(variant.compareAtPrice)
      : null,
    currency: normalizeCurrency(variant.price),
    options: variant.selectedOptions.reduce(
      (acc, opt) => {
        acc[opt.name.toLowerCase()] = opt.value
        return acc
      },
      {} as Record<string, string>
    ),
    image: normalizeImage(variant.image),
  }
}

export function normalizeProduct(product: ShopifyProduct): Product {
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    available: product.availableForSale,
    tags: product.tags,
    seo: {
      title: product.seo.title || product.title,
      description: product.seo.description || product.description,
    },
    featuredImage: normalizeImage(product.featuredImage),
    images: product.images.edges
      .map((edge) => normalizeImage(edge.node))
      .filter(Boolean) as ProductImage[],
    variants: product.variants.edges.map((edge) =>
      normalizeVariant(edge.node)
    ),
    price: normalizeMoney(product.priceRange.minVariantPrice),
    maxPrice: normalizeMoney(product.priceRange.maxVariantPrice),
    compareAtPrice: normalizeMoney(
      product.compareAtPriceRange.minVariantPrice
    ),
    currency: normalizeCurrency(product.priceRange.minVariantPrice),
  }
}

// ---- Carrinho ----

function normalizeCartLine(line: ShopifyCartLine): CartItem {
  return {
    id: line.id,
    quantity: line.quantity,
    variantId: line.merchandise.id,
    variantTitle: line.merchandise.title,
    productId: line.merchandise.product.id,
    productHandle: line.merchandise.product.handle,
    productTitle: line.merchandise.product.title,
    price: normalizeMoney(line.merchandise.price),
    totalPrice: normalizeMoney(line.cost.totalAmount),
    currency: normalizeCurrency(line.merchandise.price),
    image: normalizeImage(line.merchandise.product.featuredImage),
    options: line.merchandise.selectedOptions.reduce(
      (acc, opt) => {
        acc[opt.name.toLowerCase()] = opt.value
        return acc
      },
      {} as Record<string, string>
    ),
  }
}

export function normalizeCart(cart: ShopifyCart): Cart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: normalizeMoney(cart.cost.subtotalAmount),
    total: normalizeMoney(cart.cost.totalAmount),
    tax: cart.cost.totalTaxAmount
      ? normalizeMoney(cart.cost.totalTaxAmount)
      : 0,
    currency: normalizeCurrency(cart.cost.totalAmount),
    items: cart.lines.edges.map((edge) => normalizeCartLine(edge.node)),
  }
}

// ============================================
// NORMALIZAÇÃO PARA MOCK CART
// ============================================

import type { MockCart } from './mock-cart'

/**
 * Normaliza um MockCart para o formato esperado pelo CartProvider
 * Esta função NÃO usa normalizeCartLine pois a estrutura é diferente
 * ATUALIZADO: Inclui dados de assinatura
 */
export function normalizeMockCart(mockCart: MockCart): Cart {
  const items: CartItem[] = mockCart.items.map(item => ({
    id: item.id,
    quantity: item.quantity,
    variantId: item.variantId,
    variantTitle: item.variantTitle,
    productId: item.productId,
    productHandle: item.handle,
    productTitle: item.title,
    price: item.price,  // Preço base
    // IMPORTANTE: Usar effectivePrice para totalPrice
    totalPrice: item.effectivePrice * item.quantity,
    currency: 'BRL',
    image: item.image ? {
      url: item.image,
      alt: item.title,
      width: 800,
      height: 800,
    } : null,
    options: {
      tamanho: item.variantTitle,
    },
    
    // NOVOS CAMPOS DE ASSINATURA
    subscription: {
      isSubscription: item.isSubscription,
      purchaseMode: item.purchaseMode,
      frequency: item.frequency,
      subscriptionPrice: item.subscriptionPrice,
      discountPercent: item.discountPercent,
      nextDeliveryDate: item.isSubscription 
        ? calculateNextDeliveryDate().toISOString()
        : undefined,
    },
  }))

  // Calcular estatísticas de assinatura
  const subscriptionItems = items.filter(item => item.subscription?.isSubscription);
  const hasSubscription = subscriptionItems.length > 0;
  const subscriptionSubtotal = subscriptionItems.reduce(
    (sum, item) => sum + item.totalPrice, 0
  );

  return {
    id: mockCart.id,
    checkoutUrl: '/checkout',
    totalQuantity: mockCart.totalQuantity,
    subtotal: mockCart.subtotal,
    total: mockCart.subtotal,
    tax: 0,
    currency: 'BRL',
    items,
    
    // NOVOS CAMPOS
    hasSubscription,
    subscriptionCount: subscriptionItems.length,
    subscriptionSubtotal,
  }
}

/**
 * Função auxiliar para calcular próxima data de entrega
 */
function calculateNextDeliveryDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 7); // Primeira entrega em 7 dias
  return date;
}
