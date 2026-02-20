# 🏗️ Arquitetura do Projeto - Terravik Store

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO (Browser)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│              VERCEL EDGE NETWORK (CDN)                   │
│  - Cache global                                          │
│  - SSL/HTTPS automático                                  │
│  - Compressão (gzip/brotli)                             │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│               NEXT.JS 14 APP ROUTER                      │
│  - SSG (Static Site Generation)                          │
│  - ISR (Incremental Static Regeneration)                │
│  - Server Components (RSC)                               │
│  - API Routes                                            │
└──────────┬───────────────────────┬──────────────────────┘
           │                       │
           ↓                       ↓
┌─────────────────────┐  ┌─────────────────────────────┐
│  SHOPIFY STOREFRONT │  │    MOTOR DE CÁLCULO         │
│  API (GraphQL)      │  │    (Cliente - Pure TS)      │
│  - Produtos         │  │    - generatePlan()         │
│  - Carrinho         │  │    - Doses + Embalagens     │
│  - Checkout         │  │    - localStorage           │
└─────────────────────┘  └─────────────────────────────┘
```

---

## 🧩 Camadas da Aplicação

### 1. **Apresentação (UI Layer)**

```
src/app/                          → Páginas (App Router)
src/components/                   → Componentes React
  ├── ui/                         → Primitivos (Button, Input, etc)
  ├── layout/                     → Header, Footer, etc
  ├── product/                    → Componentes de produto
  ├── cart/                       → Sistema de carrinho
  ├── calculator/                 → Quiz/Calculadora
  ├── blog/                       → Blog
  ├── locations/                  → Pontos de venda
  └── representatives/            → Representantes
```

### 2. **Lógica de Negócio (Business Logic)**

```
src/lib/
  ├── shopify/                    → Cliente Shopify + Queries
  ├── calculator/                 → Motor de cálculo de doses
  ├── seo/                        → Helpers de metadata
  └── utils/                      → Utilitários gerais
```

### 3. **Estado (State Management)**

```
src/hooks/
  ├── useCart.ts                  → Estado do carrinho (Context API)
  └── useCalculator.ts            → Estado do quiz (useState)

src/components/cart/CartProvider.tsx  → Context do carrinho
```

### 4. **Tipos (TypeScript)**

```
src/types/
  ├── product.ts                  → Produto normalizado
  ├── cart.ts                     → Carrinho normalizado
  ├── calculator.ts               → Quiz e resultado
  └── location.ts                 → Locais e representantes
```

---

## 🔄 Fluxo de Dados

### Produtos (Shopify → UI)

```typescript
// 1. Página solicita produtos
src/app/produtos/page.tsx
  ↓
// 2. Query no Shopify
src/lib/shopify/queries/products.ts → getProducts()
  ↓
// 3. Client faz fetch
src/lib/shopify/client.ts → shopifyFetch()
  ↓
// 4. Normaliza dados
src/lib/shopify/mappers.ts → normalizeProduct()
  ↓
// 5. Renderiza UI
src/components/product/ProductGrid.tsx
```

### Carrinho (Cliente → Shopify)

```typescript
// 1. Usuário clica "Adicionar ao Carrinho"
src/components/product/AddToCartButton.tsx
  ↓
// 2. Chama hook
src/hooks/useCart.ts → addItem(variantId)
  ↓
// 3. Context atualiza estado
src/components/cart/CartProvider.tsx
  ↓
// 4. Mutation no Shopify
src/lib/shopify/queries/cart.ts → createCart() ou addToCart()
  ↓
// 5. Atualiza UI
src/components/cart/CartDrawer.tsx (abre automaticamente)
```

### Calculadora (Pure Client-Side)

```typescript
// 1. Usuário responde quiz
src/components/calculator/steps/*.tsx
  ↓
// 2. Hook atualiza respostas
src/hooks/useCalculator.ts → setAnswer()
  ↓
// 3. Ao finalizar, chama engine
src/lib/calculator/engine.ts → generatePlan(answers)
  ↓
// 4. Renderiza resultado
src/components/calculator/CalculatorResult.tsx
  ↓
// 5. Persiste em localStorage + URL params
```

---

## 🎨 Padrões de Código

### Server Component (Padrão)

```typescript
// src/app/produtos/page.tsx
import { getProducts } from '@/lib/shopify/queries/products'

export default async function ProdutosPage() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}
```

### Client Component (Quando Necessário)

```typescript
// src/components/product/AddToCartButton.tsx
'use client'

import { useCart } from '@/components/cart'

export function AddToCartButton({ variantId }: Props) {
  const { addItem } = useCart()
  // ...
}
```

### API Route

```typescript
// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const data = await request.json()
  // Processar...
  return NextResponse.json({ success: true })
}
```

---

## 🧪 Testing (Futuro)

### Testes Unitários (Jest + React Testing Library)

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

**Testar:**
- Componentes UI (Button, Input, etc)
- Motor de cálculo (generatePlan)
- Helpers (formatters, validators)

### Testes E2E (Playwright)

```bash
npm install -D @playwright/test
```

**Fluxos críticos:**
- Quiz completo → resultado
- Adicionar ao carrinho → checkout
- Formulário de contato

---

## 📈 Monitoramento (Produção)

### Vercel Analytics

Habilitado automaticamente no deploy:
- Web Vitals (LCP, FID, CLS)
- Page views
- Devices e navegadores

### Error Tracking (Futuro - Sentry)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🔐 Segurança

### Headers HTTP

Configurados em `next.config.mjs`:
- `X-Frame-Options: SAMEORIGIN` (proteção contra clickjacking)
- `X-Content-Type-Options: nosniff` (proteção XSS)
- `Referrer-Policy: origin-when-cross-origin`

### Variáveis de Ambiente

- `NEXT_PUBLIC_*` → Públicas (vão para o bundle)
- Sem prefixo → Privadas (só no servidor)

**NUNCA commitar** `.env.local` no git!

### Validação

- Client-side: UX rápida
- Server-side: Segurança (sempre valida novamente)

---

## 🎯 Performance Budget

### Core Web Vitals (Targets)

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Bundle Size

- First Load JS: < 150 kB (✅ 87 kB atual)
- Página individual: < 50 kB (✅ maioria < 12 kB)

### ISR (Incremental Static Regeneration)

- Produtos: revalidate 60s
- Blog: revalidate 300s (5 min)
- Páginas estáticas: cache infinito

---

## 🔄 CI/CD

### Vercel (Automático)

Quando push para:
- `main` → Deploy em produção
- Outras branches → Preview deploys

### GitHub Actions (Futuro)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
```

---

## 📚 Recursos Adicionais

- **Documentação Next.js**: https://nextjs.org/docs
- **Shopify Storefront API**: https://shopify.dev/docs/api/storefront
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

---

**Arquitetura sólida, escalável e production-ready! 🏗️**
