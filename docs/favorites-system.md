# Sistema de Favoritos Terravik

## 📋 Visão Geral

Sistema completo de favoritos (wishlist) com persistência em localStorage e preparado para integração futura com Shopify Customer Metafields.

## 🏗️ Arquitetura

### Componentes Principais

```
src/
├── contexts/
│   └── FavoritesContext.tsx          # Provider + Context
├── hooks/
│   └── useFavorites.ts               # Hook customizado
├── components/
│   └── ui/
│       └── FavoriteButton.tsx        # Componente de UI
└── lib/
    └── shopify/
        └── queries/
            └── favorites.ts          # Queries Shopify (futuro)
```

## 🚀 Uso

### 1. Provider (já configurado no layout)

```tsx
<FavoritesProvider>
  <App />
</FavoritesProvider>
```

### 2. Hook useFavorites

```tsx
import { useFavorites } from '@/hooks/useFavorites'

function MyComponent() {
  const {
    favorites,           // string[] - IDs dos produtos favoritos
    isLoading,          // boolean - carregando do localStorage
    isSyncing,          // boolean - sincronizando (futuro Shopify)
    addFavorite,        // (id: string) => Promise<void>
    removeFavorite,     // (id: string) => Promise<void>
    toggleFavorite,     // (id: string) => Promise<void>
    isFavorite,         // (id: string) => boolean
    clearFavorites,     // () => Promise<void>
    getFavoritesCount,  // () => number
  } = useFavorites()

  return (
    <div>
      <button onClick={() => toggleFavorite('product-123')}>
        {isFavorite('product-123') ? '❤️' : '🤍'}
      </button>
      <p>Total: {getFavoritesCount()}</p>
    </div>
  )
}
```

### 3. Componente FavoriteButton

```tsx
import { FavoriteButton } from '@/components/ui'

// Variante ícone (padrão)
<FavoriteButton productId="gramado-novo" />

// Variante botão com label
<FavoriteButton 
  productId="verde-rapido"
  variant="button"
  showLabel
  size="lg"
/>

// Tamanhos: 'sm' | 'md' | 'lg'
// Variantes: 'icon' | 'button'
```

## 💾 Persistência

### Atual: localStorage

```typescript
// Key: terravik-favorites
{
  productIds: ["gramado-novo", "verde-rapido"],
  timestamp: 1708029600000
}
```

**Características:**
- ✅ Funciona sem autenticação
- ✅ Rápido e offline-first
- ✅ Persiste entre sessões
- ❌ Não sincroniza entre dispositivos

### Futuro: Shopify Customer Metafields

```typescript
// customer.metafields.custom.favorites
{
  productIds: ["gid://shopify/Product/123", ...],
  updatedAt: "2026-02-14T20:00:00Z"
}
```

**Funções preparadas:**
- `getShopifyFavorites(token)` - buscar do Shopify
- `saveShopifyFavorites(token, ids)` - salvar no Shopify
- `mergeFavorites(local, token)` - mesclar após login

## 🔄 Fluxos

### Adicionar Favorito

```
User clica no coração
  ↓
useFavorites.toggleFavorite(id)
  ↓
Context atualiza estado (instantâneo)
  ↓
localStorage.setItem() (background)
  ↓
UI atualiza (otimistic)
```

### Remover Favorito

```
User clica novamente
  ↓
toggleFavorite(id) remove do array
  ↓
localStorage atualiza
  ↓
UI atualiza
```

### Carregar ao Iniciar

```
App inicia
  ↓
FavoritesProvider monta
  ↓
useEffect lê localStorage
  ↓
setFavorites(data)
  ↓
isLoading = false
```

## 🎨 Componentes de UI

### FavoriteButton - Variante Icon

- Círculo branco com sombra
- Ícone de coração
- Animação scale ao hover
- Estados: vazio (cinza) / preenchido (vermelho)

### FavoriteButton - Variante Button

- Botão pill com label
- Background neutro / vermelho se favorito
- Texto "Favoritar" / "Favoritado"
- Pode incluir ícone + texto

## 📊 Integrações Atuais

### ProductsShowcase (Home)

```tsx
<FavoriteButton 
  productId={product.id}
  size="md"
  className="absolute right-4 top-4 z-30"
/>
```

### Onde adicionar:

- ✅ ProductsShowcase (Home) - implementado
- ⏳ ProductPageClient (PDP) - adicionar
- ⏳ Header (contador) - adicionar
- ⏳ Página /favoritos - criar (opcional)

## 🔧 Configuração

### Adicionar no Header (contador)

```tsx
import { useFavorites } from '@/hooks/useFavorites'

const { getFavoritesCount } = useFavorites()

<Link href="/favoritos">
  <Heart />
  {getFavoritesCount() > 0 && (
    <Badge>{getFavoritesCount()}</Badge>
  )}
</Link>
```

### Criar página de Favoritos

```tsx
// app/favoritos/page.tsx
import { FavoritesList } from '@/components/favorites'

export default function FavoritosPage() {
  return <FavoritesList />
}
```

## 🚀 Próximos Passos

### Fase 1: Base ✅
- [x] FavoritesContext
- [x] useFavorites hook
- [x] localStorage persistence
- [x] FavoriteButton component
- [x] Integração no ProductsShowcase

### Fase 2: UI Extensions ⏳
- [ ] Contador no Header
- [ ] FavoriteButton no ProductPageClient
- [ ] Página /favoritos (opcional)
- [ ] Feedback visual (toasts)

### Fase 3: Shopify Integration ⏳
- [ ] Detectar customer token
- [ ] Sincronização automática
- [ ] Merge após login
- [ ] Debounce de 500ms

### Fase 4: Polish ⏳
- [ ] Loading states
- [ ] Error handling
- [ ] Animações avançadas
- [ ] Analytics/tracking

## 🧪 Testes

### Manual

```bash
# 1. Adicionar favorito
# Clicar no coração → deve ficar vermelho

# 2. Verificar localStorage
localStorage.getItem('terravik-favorites')

# 3. Recarregar página
# Favoritos devem persistir

# 4. Remover favorito
# Clicar novamente → deve ficar cinza

# 5. Limpar
clearFavorites()
```

### Automáticos (futuro)

```typescript
describe('Favorites System', () => {
  it('should add favorite', async () => {
    const { result } = renderHook(() => useFavorites())
    await act(() => result.current.addFavorite('test-id'))
    expect(result.current.favorites).toContain('test-id')
  })
})
```

## 📝 Notas Técnicas

### Performance

- **Optimistic Updates**: UI atualiza instantaneamente
- **Debounce**: Shopify sync com 500ms (futuro)
- **Memoization**: useMemo para value do context
- **LocalStorage**: Apenas salva quando necessário

### Segurança

- **XSS**: Sanitiza IDs antes de salvar
- **Storage Quota**: ~5MB limite (seguro para milhares de favoritos)
- **Error Handling**: Try/catch em todas operações

### Acessibilidade

- **ARIA labels**: "Adicionar aos favoritos"
- **Keyboard**: Totalmente navegável
- **Screen readers**: Texto descritivo
- **Focus states**: Visíveis e claros

## 🐛 Troubleshooting

### Favoritos não persistem

```typescript
// Verificar se localStorage está disponível
if (typeof window !== 'undefined') {
  console.log(localStorage.getItem('terravik-favorites'))
}
```

### Context não encontrado

```typescript
// Verificar se FavoritesProvider está no layout
// src/app/layout.tsx deve incluir <FavoritesProvider>
```

### Ícone não muda

```typescript
// Verificar se productId está correto
const isFav = isFavorite(product.id) // deve ser string
```

## 📚 Referências

- [Shopify Customer API](https://shopify.dev/docs/api/storefront/customer)
- [Shopify Metafields](https://shopify.dev/docs/apps/custom-data/metafields)
- [LocalStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Status**: ✅ Sistema base implementado e funcional
**Última atualização**: 14/02/2026
