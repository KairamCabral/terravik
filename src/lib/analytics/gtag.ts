// Google Analytics helper functions

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Pageview
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID as string, {
      page_path: url,
    })
  }
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

// E-commerce events
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

  // Adicionar ao carrinho
  addToCart: (product: {
    id: string
    name: string
    price: number
    quantity: number
  }) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
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
