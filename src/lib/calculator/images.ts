// Criar placeholders para imagens de grama (opcional, mas melhora UX)
export const GRASS_IMAGES = {
  // Condição do gramado
  perfect: '/images/grass/perfect.jpg',
  good: '/images/grass/good.jpg',
  weak: '/images/grass/weak.jpg',
  bad: '/images/grass/bad.jpg',
  
  // Sol
  fullSun: '/images/grass/full-sun.jpg',
  partialShade: '/images/grass/partial-shade.jpg',
  shade: '/images/grass/shade.jpg',
  
  // Clima
  hotRainy: '/images/grass/hot-rainy.jpg',
  hotDry: '/images/grass/hot-dry.jpg',
  mild: '/images/grass/mild.jpg',
  cold: '/images/grass/cold.jpg',
  
  // Tráfego
  lowTraffic: '/images/grass/low-traffic.jpg',
  mediumTraffic: '/images/grass/medium-traffic.jpg',
  highTraffic: '/images/grass/high-traffic.jpg',
} as const

// Por enquanto, usaremos emojis. Quando tiver imagens reais, substitua nos components
export const GRASS_EMOJIS = {
  perfect: '🌿',
  good: '🍃',
  weak: '🌾',
  bad: '🏜️',
  
  fullSun: '☀️',
  partialShade: '⛅',
  shade: '🌳',
  
  hotRainy: '🌧️',
  hotDry: '🔥',
  mild: '🍃',
  cold: '❄️',
  
  lowTraffic: '👀',
  mediumTraffic: '🚶',
  highTraffic: '👨‍👩‍👧‍👦',
  
  newGrass: '🌱',
  existingGrass: '🏡',
  
  planting: '🌱',
  growth: '💚',
  protection: '💪',
  complete: '🎯',
  
  irrigation3x: '💧',
  irrigation1_2x: '💦',
  irrigationRare: '🌵',
} as const
