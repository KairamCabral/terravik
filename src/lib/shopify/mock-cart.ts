/**
 * Sistema de carrinho mock para desenvolvimento
 * Persiste no localStorage para manter estado entre reloads
 */

import { MOCK_PRODUCTS } from './mock-data';

// ============================================
// TIPOS
// ============================================

export interface MockCartItem {
  id: string
  variantId: string
  productId: string
  title: string
  variantTitle: string
  quantity: number
  price: number                // Preço base
  effectivePrice: number       // NOVO: Preço efetivo (com desconto se assinatura)
  compareAtPrice: number | null
  image: string | null
  handle: string
  
  // NOVOS CAMPOS DE ASSINATURA
  isSubscription: boolean
  purchaseMode: 'one-time' | 'subscription'
  frequency?: number
  subscriptionPrice?: number
  discountPercent?: number
}

export interface MockCart {
  id: string
  items: MockCartItem[]
  totalQuantity: number
  subtotal: number
  createdAt: string
  updatedAt: string
}

// NOVO TIPO para dados de assinatura
export interface SubscriptionParams {
  purchaseMode: 'one-time' | 'subscription'
  frequency?: number
  subscriptionPrice?: number
  discountPercent?: number
}

// ============================================
// STORAGE
// ============================================

const CART_STORAGE_KEY = 'terravik_mock_cart';

function getStoredCart(): MockCart | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveCart(cart: MockCart): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Erro ao salvar carrinho:', error);
  }
}

function createEmptyCart(): MockCart {
  return {
    id: `mock-cart-${Date.now()}`,
    items: [],
    totalQuantity: 0,
    subtotal: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function calculateTotals(cart: MockCart): MockCart {
  const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // ATUALIZADO: Usar effectivePrice ao invés de price
  const subtotal = cart.items.reduce((sum, item) => 
    sum + (item.effectivePrice * item.quantity), 0
  );
  
  return {
    ...cart,
    totalQuantity,
    subtotal,
    updatedAt: new Date().toISOString(),
  };
}

// ============================================
// FUNÇÕES PÚBLICAS
// ============================================

/**
 * Obtém o carrinho atual (cria um novo se não existir)
 */
export function getMockCart(): MockCart {
  const stored = getStoredCart();
  if (stored) return stored;
  
  const newCart = createEmptyCart();
  saveCart(newCart);
  return newCart;
}

/**
 * Adiciona item ao carrinho
 * ATUALIZADO: Aceita dados de assinatura
 */
export function addToMockCart(
  variantId: string, 
  quantity: number = 1,
  subscriptionData?: SubscriptionParams  // NOVO PARÂMETRO
): MockCart {
  const cart = getMockCart();
  
  // Encontrar o produto e variante nos mock data
  let foundProduct = null;
  let foundVariant = null;
  
  for (const product of MOCK_PRODUCTS) {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
      foundProduct = product;
      foundVariant = variant;
      break;
    }
  }
  
  if (!foundProduct || !foundVariant) {
    console.error('Produto/variante não encontrado:', variantId);
    return cart;
  }

  // Determinar se é assinatura
  const isSubscription = subscriptionData?.purchaseMode === 'subscription';
  
  // Calcular preço efetivo
  const basePrice = typeof foundVariant.price === 'number' 
    ? foundVariant.price 
    : parseFloat(foundVariant.price);
  const effectivePrice = isSubscription && subscriptionData?.subscriptionPrice
    ? subscriptionData.subscriptionPrice
    : basePrice;

  // IMPORTANTE: Para assinaturas, criar item separado mesmo se já existe produto
  // Isso permite ter o mesmo produto como compra única E assinatura
  const existingIndex = cart.items.findIndex(item => 
    item.variantId === variantId &&
    item.purchaseMode === (subscriptionData?.purchaseMode || 'one-time') &&
    item.frequency === subscriptionData?.frequency
  );
  
  if (existingIndex >= 0) {
    // Item idêntico existe: incrementar quantidade
    cart.items[existingIndex].quantity += quantity;
  } else {
    // Criar novo item
    const newItem: MockCartItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      variantId: foundVariant.id,
      productId: foundProduct.id,
      title: foundProduct.title,
      variantTitle: foundVariant.title,
      quantity,
      price: basePrice,
      effectivePrice,  // NOVO: Preço efetivo
      compareAtPrice: foundVariant.compareAtPrice && typeof foundVariant.compareAtPrice === 'number'
        ? foundVariant.compareAtPrice 
        : null,
      image: foundProduct.featuredImage?.url || null,
      handle: foundProduct.handle,
      
      // NOVOS CAMPOS DE ASSINATURA
      isSubscription,
      purchaseMode: subscriptionData?.purchaseMode || 'one-time',
      frequency: subscriptionData?.frequency,
      subscriptionPrice: subscriptionData?.subscriptionPrice,
      discountPercent: subscriptionData?.discountPercent,
    };
    
    cart.items.push(newItem);
  }
  
  const updatedCart = calculateTotals(cart);
  saveCart(updatedCart);
  
  return updatedCart;
}

/**
 * Atualiza quantidade de um item
 */
export function updateMockCartItem(itemId: string, quantity: number): MockCart {
  const cart = getMockCart();
  
  const itemIndex = cart.items.findIndex(item => item.id === itemId);
  
  if (itemIndex < 0) {
    console.error('Item não encontrado:', itemId);
    return cart;
  }
  
  if (quantity <= 0) {
    // Remover item
    cart.items.splice(itemIndex, 1);
  } else {
    // Atualizar quantidade
    cart.items[itemIndex].quantity = quantity;
  }
  
  const updatedCart = calculateTotals(cart);
  saveCart(updatedCart);
  
  return updatedCart;
}

/**
 * Remove item do carrinho
 */
export function removeFromMockCart(itemId: string): MockCart {
  return updateMockCartItem(itemId, 0);
}

/**
 * Limpa o carrinho
 */
export function clearMockCart(): MockCart {
  const newCart = createEmptyCart();
  saveCart(newCart);
  return newCart;
}

/**
 * NOTA: A conversão para formato final é feita em mappers.ts via normalizeMockCart()
 * Esta separação mantém as responsabilidades claras:
 * - mock-cart.ts: Gerencia estado do carrinho mock
 * - mappers.ts: Normaliza formatos (Shopify → interno, Mock → interno)
 */
