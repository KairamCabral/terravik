// Service Worker básico para PWA
// Estratégia: Cache-first para assets estáticos, Network-first para dados dinâmicos

// v2: o v1 guardava vídeo sem teto. Trocar o nome faz o `activate` apagar o
// cache antigo de quem já visitou.
const CACHE_NAME = 'terravik-v2'

// Só rota e arquivo que existem de fato. cache.addAll() é atômico: um único
// 404 rejeita a promise inteira e o service worker não instala, sem erro
// visível. Ao remover uma rota do site, tire-a daqui.
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

  // Vídeo, áudio e qualquer pedido com Range saem pelo caminho do navegador,
  // antes de qualquer respondWith.
  //
  // Sem isto caíam no branch de HTML lá embaixo, que responde com
  // fetch(request) e guarda a resposta. Isso tira o streaming por faixa de
  // bytes do caminho nativo, enche um cache sem teto nem expiração, e uma
  // resposta 206 faz o cache.put rejeitar (resposta parcial não é cacheável).
  // O cache de HTTP de /video, definido no next.config.mjs, é o certo aqui.
  if (
    request.destination === 'video' ||
    request.destination === 'audio' ||
    request.headers.has('range') ||
    /\.(mp4|webm|mov|m4v)$/i.test(url.pathname)
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
