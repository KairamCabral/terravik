// Service Worker básico para PWA
// Estratégia: Cache-first para assets estáticos, Network-first para dados dinâmicos

const CACHE_NAME = 'terravik-v1'
const STATIC_ASSETS = [
  '/',
  '/produtos',
  '/calculadora',
  '/sobre',
  '/contato',
  '/manifest.json',
]

// Instalar e cachear assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Ativar e limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorar requests de API e externos
  if (
    url.origin !== location.origin ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/webpack')
  ) {
    return
  }

  // Cache-first para assets estáticos
  if (
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone())
              return response
            })
          })
        )
      })
    )
    return
  }

  // Network-first para páginas HTML
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cachear response bem-sucedida
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Fallback para cache offline
        return caches.match(request)
      })
  )
})
