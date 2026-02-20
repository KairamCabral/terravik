# Instruções para o Cursor AI — Projeto Terravik

## Contexto do Projeto

Terravik é uma marca brasileira premium de fertilizantes para gramados residenciais.
Este é um e-commerce headless: Next.js 14 (App Router) + Shopify Storefront API.
O público-alvo são donos de casa que querem um gramado bonito, sem linguagem técnica.

## Regras de Desenvolvimento

### Linguagem e Tom
- Todo texto voltado ao usuário deve ser em **português brasileiro**
- Tom: amigável, direto, sem tecnicismo (exceto dados técnicos de produto)
- Comentários de código podem ser em inglês ou português

### Next.js
- Usar **App Router** (não Pages Router)
- Server Components por padrão; usar `"use client"` apenas quando necessário
- Usar `generateMetadata()` para SEO dinâmico em todas as páginas
- ISR com `revalidate` para páginas que puxam dados do Shopify
- Imagens via `next/image` com `sizes` e `priority` quando acima do fold

### Shopify Integration
- Todas as chamadas ao Shopify vão via `src/lib/shopify/client.ts`
- Usar Storefront API (GraphQL), NUNCA a REST API
- Carrinho gerenciado via Cart API (createCart, addCartLines, updateCartLines)
- Checkout: SEMPRE redirecionar para `checkoutUrl` do Shopify (não criar checkout custom)
- Moeda: BRL (Real brasileiro)
- Token do Storefront é público (`NEXT_PUBLIC_`), token Admin é privado (server-only)

### Calculadora/Quiz
- O motor de cálculo (`src/lib/calculator/engine.ts`) é **puro TypeScript**, sem side effects
- Roda 100% no cliente (não precisa de server)
- State machine controlada pelo hook `useCalculator`
- Resultado deve gerar JSON compatível com a spec do arquivo `Calculadora_Quiz.md`
- Resultado salvo em localStorage + URL compartilhável via query params

### Styling
- Tailwind CSS como sistema principal
- CSS custom properties para cores da marca em `globals.css`
- Paleta Terravik:
  - Verde principal: `#093e28` (terra/natureza)
  - Verde claro: `#a9ac32` (crescimento)
  - Dourado: `#b38c26` (premium)
  - Creme: `#F5F0E8` (backgrounds)
  - Marrom: `#3E2C1C` (terra)
  - Texto: `#1A1A1A`
- Usar `cn()` utility (clsx + tailwind-merge) para class merging
- Mobile-first, breakpoints: sm(640) md(768) lg(1024) xl(1280)

### SEO Obrigatório
- TODAS as páginas devem ter `generateMetadata()` com title, description, openGraph
- JSON-LD em todas as páginas relevantes (Product, Organization, FAQ, BreadcrumbList)
- Breadcrumbs visuais + Schema.org em todas as páginas internas
- Sitemap gerado automaticamente via `next-sitemap`
- URLs amigáveis em português (`/produtos`, `/calculadora`, `/onde-encontrar`)
- Alt text descritivo em todas as imagens
- Heading hierarchy (h1 > h2 > h3) respeitada em todas as páginas
- Conteúdo semântico com <article>, <section>, <nav>, <main>

### Performance
- Lighthouse score alvo: 90+ em todas as categorias
- Lazy load para imagens abaixo do fold
- Dynamic imports para componentes pesados (mapa, animações)
- Prefetch de rotas prováveis
- Fontes com `next/font` (display: swap)

### Acessibilidade
- Labels em todos os inputs
- Aria attributes em componentes interativos
- Contraste de cor WCAG AA
- Navegação por teclado no quiz
- Focus visible em todos os interativos

## Produtos Terravik (Referência)

### P1 — Gramado Novo (MAP 11-52-00)
- SKUs: 400g, 900g
- Uso: implantação (antes/junto do tapete ou semente)
- Dose: 8-12 g/m² (padrão: 10)
- Frequência: aplicação única

### P2 — Verde Rápido (Sulfato de Amônio 21-0-0 + 24S)
- SKU: 2.7kg
- Uso: crescimento/vigor/cor
- Dose: 15-20 g/m² (padrão: 18)
- Frequência: cada 4-6 semanas

### P3 — Resistência Total (NPK 19-4-19)
- SKUs: 400g, 900g
- Uso: calor, pisoteio, estresse
- Dose: 15-25 g/m² (padrão: 20)
- Frequência: cada 6-8 semanas

## Estrutura de Tipos Importante

Sempre manter consistência com os tipos em `src/types/`:
- `Product` → produto normalizado (não usar tipos raw do Shopify nos componentes)
- `CartItem` → item do carrinho normalizado
- `CalculatorInput` → respostas do quiz
- `CalculatorResult` → saída do motor de cálculo
- `Location` → ponto de venda

## Padrões de Arquivo

```typescript
// Server Component (default)
import { getProducts } from '@/lib/shopify/queries/products'

export default async function ProdutosPage() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}

// Client Component (quando necessário)
'use client'
import { useState } from 'react'

export function AddToCartButton({ variantId }: { variantId: string }) {
  // ...
}
```

## Fluxo de Dados

```
Shopify Admin (cadastro de produtos)
    ↓
Storefront API (GraphQL queries)
    ↓
src/lib/shopify/client.ts (fetch wrapper)
    ↓
src/lib/shopify/mappers.ts (normaliza dados)
    ↓
Server Components (páginas)
    ↓
Client Components (interatividade: carrinho, quiz)
    ↓
Shopify Checkout (redirect para pagamento)
```
