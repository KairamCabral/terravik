// Google Analytics helper functions

// Dois nomes de variável, de propósito: este arquivo lia só
// NEXT_PUBLIC_GA_MEASUREMENT_ID e o .env.example documentava NEXT_PUBLIC_GA_ID.
// Quem configurou pelo exemplo definiu uma variável que ninguém lia.
// NEXT_PUBLIC_* é substituída em build por texto: precisa ser lida literal.
const idDeclarado = (
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  process.env.NEXT_PUBLIC_GA_ID ||
  ''
).trim()

// Só vale com a forma de um ID de fluxo do GA4 e sem ser o marcador do exemplo
// (G-XXXXXXXXXX), que carregaria o gtag e mandaria evento para um ID inexistente.
export const GA_MEASUREMENT_ID =
  /^G-[A-Z0-9]{4,}$/i.test(idDeclarado) && !/X{4,}/i.test(idDeclarado)
    ? idDeclarado
    : undefined

// Page view de troca de rota: evento explícito, não um segundo gtag('config').
// Sem page_location o GA4 usa a URL da primeira tela em toda navegação.
export const pageview = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) return

  window.gtag('event', 'page_view', {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  })
}

// Event
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

/**
 * De onde veio uma adição ao carrinho. Vira `item_list_name` no GA4, e é o
 * que permite saber qual bloco do site vende.
 */
export type OrigemDaAdicao =
  | 'pdp'
  | 'vitrine'
  | 'calculadora'
  | 'compra-rapida'
  | 'sugestao-carrinho'

// E-commerce events. Disparados SÓ pelo CartProvider: toda adição, remoção e
// ida ao checkout passa por lá, então nenhum botão novo esquece o evento.
export const ecommerce = {
  // Ver produto
  viewProduct: (product: {
    id: string
    name: string
    price: number
    category?: string
  }) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          item_category: product.category,
        }],
      })
    }
  },

  // Adicionar ao carrinho. `origem` diz de qual bloco veio (ver OrigemDaAdicao).
  addToCart: (
    product: {
      id: string
      name: string
      price: number
      quantity: number
    },
    origem?: OrigemDaAdicao
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'BRL',
        value: product.price * product.quantity,
        ...(origem ? { item_list_name: origem } : {}),
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
          ...(origem ? { item_list_name: origem } : {}),
        }],
      })
    }
  },

  // Remover do carrinho
  removeFromCart: (product: {
    id: string
    name: string
    price: number
    quantity: number
  }) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'remove_from_cart', {
        currency: 'BRL',
        value: product.price * product.quantity,
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
        }],
      })
    }
  },

  // Iniciar checkout
  beginCheckout: (cart: {
    items: Array<{
      id: string
      name: string
      price: number
      quantity: number
    }>
    value: number
  }) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'BRL',
        items: cart.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        value: cart.value,
      })
    }
  },

  // Compra (conversão)
  purchase: (transaction: {
    transactionId: string
    value: number
    items: Array<{
      id: string
      name: string
      price: number
      quantity: number
    }>
  }) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transaction.transactionId,
        value: transaction.value,
        items: transaction.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      })
    }
  },
}

// Custom events específicos da Terravik
export const terravikEvents = {
  // Calculadora iniciada
  calculatorStart: () => {
    event({
      action: 'calculator_start',
      category: 'engagement',
      label: 'User started calculator',
    })
  },

  // Calculadora completa
  calculatorComplete: (result: {
    products: string[]
    area: number
  }) => {
    event({
      action: 'calculator_complete',
      category: 'conversion',
      label: `Products: ${result.products.join(', ')}`,
      value: result.area,
    })
  },

  // Newsletter inscrito
  newsletterSubscribe: () => {
    event({
      action: 'newsletter_subscribe',
      category: 'engagement',
      label: 'Newsletter subscription',
    })
  },

  // Formulário de contato enviado
  contactFormSubmit: (subject: string) => {
    event({
      action: 'contact_form_submit',
      category: 'engagement',
      label: subject,
    })
  },

  // Busca realizada
  search: (query: string, resultsCount: number) => {
    event({
      action: 'search',
      category: 'engagement',
      label: query,
      value: resultsCount,
    })
  },

  // Review visualizado
  reviewView: (productId: string) => {
    event({
      action: 'review_view',
      category: 'engagement',
      label: productId,
    })
  },
}
