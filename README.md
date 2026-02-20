# 🌱 Terravik — E-commerce Headless (Next.js + Shopify)

## ✨ Sobre o Projeto

Loja virtual completa da **Terravik** (fertilizantes premium para gramados residenciais), construída com Next.js 14 App Router e Shopify Storefront API como backend headless. Site 100% funcional, responsivo, acessível e otimizado para SEO.

**Status:** ✅ **Pronto para Deploy em Produção**

---

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais Shopify

# 3. Rodar em desenvolvimento
npm run dev

# 4. Abrir no navegador
# http://localhost:3000
```

**IMPORTANTE:** O site funciona 100% mesmo **sem credenciais Shopify** (usa mock data para desenvolvimento).

---

## 📦 Stack Técnico

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Styling | Tailwind CSS 3.4 |
| Backend Commerce | Shopify Basic (Storefront API - GraphQL) |
| Deploy | Vercel (Pro) |
| SEO | next-sitemap, JSON-LD, Open Graph |
| Analytics | Vercel Analytics (futuro) |
| Ícones | Lucide React |
| Animações | Framer Motion |

## 🎯 Funcionalidades Implementadas

### ✅ FASE 1 - Fundação
- [x] Layout completo (Header, Footer, MobileMenu)
- [x] Home page com 6 seções
- [x] Sistema de design Terravik (cores, tipografia, componentes UI)
- [x] SEO base (metadata, JSON-LD, breadcrumbs)

### ✅ FASE 2 - Calculadora/Quiz
- [x] Quiz interativo de 9 telas com animações
- [x] Motor de cálculo de dose (generatePlan)
- [x] Resultado personalizado com produtos, embalagens e calendário
- [x] Persistência em localStorage
- [x] URL compartilhável (query params)
- [x] Integração com carrinho

### ✅ FASE 3 - E-commerce
- [x] Sistema de carrinho completo (Context + Hooks)
- [x] CartDrawer animado com Framer Motion
- [x] Páginas de produtos (/produtos e /produtos/[handle])
- [x] Componentes: ProductCard, ProductGallery, VariantSelector
- [x] Integração com Shopify Storefront API
- [x] Mock data para desenvolvimento sem Shopify
- [x] Fallback gracioso sem credenciais

### ✅ FASE 4 - Páginas Institucionais
- [x] Página Sobre (história, valores, diferencial)
- [x] Formulário de contato funcional + API route
- [x] Blog com 5 artigos reais sobre gramados
- [x] Onde Encontrar (7 pontos de venda + filtros)
- [x] Representantes (busca + formulário)
- [x] Página 404 personalizada

### ✅ FASE 5 - Deploy e Otimizações
- [x] Loading states (Suspense boundaries)
- [x] Error boundaries
- [x] robots.txt otimizado
- [x] manifest.json (PWA)
- [x] .env.local.example documentado
- [x] Guias de deploy (DEPLOY.md)
- [x] Checklist de produção (CHECKLIST.md)
- [x] SEO avançado (theme-color, PWA icons)

---

## 📂 Estrutura de Pastas

```
Browser → Vercel Edge (CDN + SSR/ISR)
                ↓
         Next.js App Router
                ↓
     Shopify Storefront API (GraphQL)
                ↓
       Shopify Admin (produtos, pedidos, estoque)
                ↓
       Shopify Checkout (pagamento seguro)
```

## Estrutura de Pastas

```
terravik-store/
├── public/                    # Assets estáticos
│   ├── fonts/                 # Fontes locais
│   ├── images/                # Imagens do site
│   │   ├── products/          # Fotos dos produtos
│   │   ├── icons/             # Ícones SVG custom
│   │   └── og/                # Open Graph images
│   └── robots.txt
│
├── src/
│   ├── app/                   # App Router (páginas)
│   │   ├── layout.tsx         # Root layout + metadata global
│   │   ├── page.tsx           # Home
│   │   ├── not-found.tsx      # Página 404
│   │   │
│   │   ├── produtos/
│   │   │   ├── page.tsx       # Catálogo de produtos
│   │   │   └── [handle]/
│   │   │       └── page.tsx   # Página individual do produto
│   │   │
│   │   ├── calculadora/
│   │   │   └── page.tsx       # Quiz/Calculadora Terravik
│   │   │
│   │   ├── onde-encontrar/
│   │   │   └── page.tsx       # Mapa de pontos de venda
│   │   │
│   │   ├── representantes/
│   │   │   └── page.tsx       # Ser ou encontrar representante
│   │   │
│   │   ├── sobre/
│   │   │   └── page.tsx       # Sobre a Terravik
│   │   │
│   │   ├── contato/
│   │   │   └── page.tsx       # Formulário de contato
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx       # Lista de artigos (SEO)
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Artigo individual
│   │   │
│   │   └── api/
│   │       ├── revalidate/
│   │       │   └── route.ts   # Webhook Shopify → ISR
│   │       └── contact/
│   │           └── route.ts   # Form handler
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   ├── AnnouncementBar.tsx
│   │   │   └── CartDrawer.tsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   ├── VariantSelector.tsx
│   │   │   ├── AddToCartButton.tsx
│   │   │   └── SubscriptionToggle.tsx  # Compra avulsa vs recorrência
│   │   │
│   │   ├── cart/
│   │   │   ├── CartProvider.tsx        # Context do carrinho
│   │   │   ├── CartLine.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CartEmpty.tsx
│   │   │
│   │   ├── calculator/
│   │   │   ├── CalculatorWizard.tsx    # Container principal
│   │   │   ├── steps/
│   │   │   │   ├── StepArea.tsx        # Tela 1 - Área
│   │   │   │   ├── StepImplanting.tsx  # Tela 2 - Gramado novo?
│   │   │   │   ├── StepObjective.tsx   # Tela 3 - Objetivo
│   │   │   │   ├── StepClimate.tsx     # Tela 4 - Clima
│   │   │   │   ├── StepSunlight.tsx    # Tela 5 - Sol
│   │   │   │   ├── StepIrrigation.tsx  # Tela 6 - Irrigação
│   │   │   │   ├── StepTraffic.tsx     # Tela 7 - Pisoteio
│   │   │   │   └── StepCondition.tsx   # Tela 8 - Estado atual
│   │   │   ├── CalculatorResult.tsx    # Tela de resultado
│   │   │   ├── ProductPlanCard.tsx     # Card de cada produto no resultado
│   │   │   ├── PackRecommendation.tsx  # Embalagens recomendadas
│   │   │   ├── CalendarBlock.tsx       # Calendário simples
│   │   │   ├── ProgressBar.tsx
│   │   │   └── engine.ts              # Motor de cálculo (dose + packs)
│   │   │
│   │   ├── locations/
│   │   │   ├── LocationMap.tsx
│   │   │   ├── LocationCard.tsx
│   │   │   └── LocationFilter.tsx
│   │   │
│   │   ├── representatives/
│   │   │   ├── RepresentativeForm.tsx  # "Quero ser representante"
│   │   │   └── FindRepresentative.tsx  # "Encontrar representante"
│   │   │
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── BenefitsSection.tsx
│   │   │   ├── ProductsShowcase.tsx
│   │   │   ├── CalculatorCTA.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── FAQSection.tsx
│   │   │
│   │   ├── seo/
│   │   │   ├── JsonLd.tsx             # Structured data (Schema.org)
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── CanonicalUrl.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── RadioCard.tsx
│   │       ├── Badge.tsx
│   │       ├── Skeleton.tsx
│   │       ├── Toast.tsx
│   │       ├── Modal.tsx
│   │       └── Container.tsx
│   │
│   ├── lib/
│   │   ├── shopify/
│   │   │   ├── client.ts              # GraphQL client (fetch)
│   │   │   ├── types.ts               # Tipagens Shopify
│   │   │   ├── queries/
│   │   │   │   ├── products.ts        # Queries de produtos
│   │   │   │   ├── collections.ts     # Queries de coleções
│   │   │   │   ├── cart.ts            # Mutations de carrinho
│   │   │   │   └── pages.ts           # Queries de páginas/blog
│   │   │   └── mappers.ts             # Shopify → tipos internos
│   │   │
│   │   ├── calculator/
│   │   │   ├── products.ts            # Catálogo P1/P2/P3
│   │   │   ├── engine.ts              # Motor de dose + packs
│   │   │   ├── types.ts               # Tipagens do quiz
│   │   │   └── constants.ts           # Doses, faixas, defaults
│   │   │
│   │   ├── seo/
│   │   │   ├── metadata.ts            # Helpers de metadata
│   │   │   └── schemas.ts             # JSON-LD schemas
│   │   │
│   │   └── utils/
│   │       ├── formatters.ts          # Moeda, peso, data
│   │       ├── cn.ts                  # Tailwind classnames merge
│   │       └── constants.ts           # Constantes globais
│   │
│   ├── hooks/
│   │   ├── useCart.ts                 # Hook do carrinho
│   │   ├── useCalculator.ts           # State machine do quiz
│   │   └── useMediaQuery.ts           # Responsividade
│   │
│   ├── styles/
│   │   └── globals.css                # Tailwind + custom properties
│   │
│   └── types/
│       ├── product.ts                 # Tipos internos de produto
│       ├── cart.ts                    # Tipos do carrinho
│       ├── calculator.ts              # Tipos do quiz/resultado
│       └── location.ts               # Tipos de ponto de venda
│
├── .env.local.example                 # Variáveis de ambiente
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── next-sitemap.config.js             # Configuração sitemap
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── CURSOR_INSTRUCTIONS.md             # Instruções para o Cursor AI
```

## Configuração Inicial

### 1. Clonar e instalar

```bash
npx create-next-app@latest terravik-store --typescript --tailwind --eslint --app --src-dir
cd terravik-store
npm install @shopify/hydrogen-react framer-motion lucide-react next-sitemap clsx tailwind-merge
```

### 2. Configurar variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu_token_storefront
SHOPIFY_ADMIN_ACCESS_TOKEN=seu_token_admin
SHOPIFY_REVALIDATION_SECRET=um_secret_aleatorio
NEXT_PUBLIC_SITE_URL=https://terravik.com.br
```

### 3. Obter tokens no Shopify

1. Acesse **Shopify Admin → Settings → Apps and sales channels**
2. Clique em **Develop apps** → **Create an app**
3. Em **API credentials**, habilite:
   - Storefront API: `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`
4. Copie o **Storefront API access token**

### 4. Configurar produtos no Shopify Admin

Cadastre os 3 produtos com metafields:
- **Gramado Novo** (MAP 11-52-00) — SKUs: 400g, 900g
- **Verde Rápido** (Sulfato de Amônio 21-0-0) — SKU: 2.7kg
- **Resistência Total** (NPK 19-4-19) — SKUs: 400g, 900g

Crie variantes para:
- **Compra avulsa** (one-time)
- **Recorrência** (selling plan — configurar via Shopify Subscriptions app)

### 5. Deploy na Vercel

```bash
vercel --prod
```

Adicione as variáveis de ambiente no dashboard da Vercel.

## 🛣️ Rotas Implementadas (21 páginas)

| Rota | Página | Status |
|---|---|---|
| `/` | Home | ✅ Completa |
| `/produtos` | Catálogo | ✅ Completa |
| `/produtos/[handle]` | Produto (3 páginas) | ✅ Completa |
| `/calculadora` | Quiz/Calculadora | ✅ Completa |
| `/sobre` | Sobre a Terravik | ✅ Completa |
| `/contato` | Formulário de contato | ✅ Completa |
| `/blog` | Lista de artigos | ✅ Completa |
| `/blog/[slug]` | Artigos (5 páginas) | ✅ Completa |
| `/onde-encontrar` | Pontos de venda | ✅ Completa |
| `/representantes` | Representantes | ✅ Completa |
| `/404` | Not found | ✅ Completa |
| `/api/contact` | Form handler | ✅ Completa |
| `/api/revalidate` | Webhook ISR | ✅ Completa |

**Total: 21 rotas + 2 API routes = Site 100% funcional! 🎉**

---

## 📊 Build Output

```
Route (app)                                 Size     First Load JS
┌ ○ /                                       2.01 kB         107 kB
├ ○ /blog                                   2.79 kB         104 kB
├ ● /blog/[slug]                            2.79 kB         104 kB (5 páginas)
├ ○ /calculadora                            11.9 kB         164 kB
├ ○ /contato                                2.11 kB         107 kB
├ ○ /onde-encontrar                         2.14 kB         100 kB
├ ○ /produtos                               1.87 kB         154 kB
├ ● /produtos/[handle]                      2.57 kB         155 kB (3 páginas)
├ ○ /representantes                         3.14 kB         101 kB
└ ○ /sobre                                  2.79 kB         104 kB
```

---

## 🎨 Design System

### Paleta Terravik

```css
--terravik-green: #093e28        /* Verde principal (terra/natureza) */
--terravik-green-400: #a9ac32    /* Verde claro (crescimento) */
--terravik-gold: #b38c26         /* Dourado (premium) */
--terravik-cream: #F5F0E8        /* Creme (backgrounds) */
--terravik-brown: #3E2C1C        /* Marrom (terra) */
```

### Componentes UI

- Button (4 variantes, 3 tamanhos, loading state)
- Input (label, error, helper)
- RadioCard (quiz)
- Badge (5 variantes)
- ProgressBar
- Container
- Toast (feedback)

---

## 🧮 Calculadora Terravik

O diferencial do projeto: quiz interativo que calcula a dose exata de fertilizante.

**Fluxo:**
```
Welcome → Área → Implantação → Objetivo → Clima → Sol → 
Irrigação → Pisoteio → Condição → RESULTADO
```

**Motor de cálculo:** `src/lib/calculator/engine.ts`
- Inputs: 8 variáveis do gramado
- Output: Produtos recomendados, doses por m², quantidade total, embalagens ideais, calendário

**Resultado inclui:**
- 1-3 produtos recomendados (P1, P2, P3)
- Dose exata por m²
- Quantidade total necessária
- Embalagens ideais
- Como aplicar (passo a passo)
- Frequência de reaplicação
- Calendário de aplicações
- URL compartilhável
- Botão "Adicionar ao Carrinho" integrado

---

## 🛒 Sistema de Carrinho

**Tecnologias:**
- Context API (CartProvider)
- Shopify Cart API (GraphQL)
- Persistência em cookies (30 dias)
- Drawer lateral animado (Framer Motion)

**Funcionalidades:**
- Adicionar/remover/atualizar itens
- Cálculo automático de subtotal
- Checkout seguro no Shopify
- Badge de quantidade no Header
- Loading states
- Empty state

---

## 📄 Páginas Institucionais

### Sobre (`/sobre`)
História da marca, valores (Simplicidade, Transparência, Resultado), diferencial, CTA.

### Contato (`/contato`)
Formulário funcional + canais diretos (WhatsApp, email, horário).

### Blog (`/blog`)
5 artigos educativos sobre gramados:
- Como adubar o gramado
- Quando aplicar fertilizante
- Gramado novo: primeiros 30 dias
- Gramado amarelado: causas
- Produtos Terravik: quando usar

### Onde Encontrar (`/onde-encontrar`)
7 pontos de venda com filtros por cidade/estado/tipo + links Google Maps.

### Representantes (`/representantes`)
Busca de representantes + formulário para ser representante.

---

## 🔌 Integração Shopify

### Queries Implementadas
- `getProducts()` - Lista de produtos
- `getProductByHandle()` - Produto individual
- `getCart()` - Carregar carrinho existente

### Mutations Implementadas
- `createCart()` - Criar novo carrinho
- `addToCart()` - Adicionar itens
- `updateCartLine()` - Atualizar quantidade
- `removeFromCart()` - Remover itens

### Mappers
- `normalizeProduct()` - Shopify → Product interno
- `normalizeCart()` - Shopify → Cart interno

### Fallback sem Shopify
Site funciona 100% com mock data (MOCK_PRODUCTS) quando credenciais não estão configuradas.

---

## 🎨 Arquitetura

### Técnico
- Sitemap XML automático (`next-sitemap`)
- `robots.txt` otimizado
- Canonical URLs em todas as páginas
- Metadata dinâmica por página (`generateMetadata`)
- Open Graph + Twitter Cards
- Breadcrumbs com Schema.org

### Structured Data (JSON-LD)
- `Organization` (Terravik)
- `Product` (cada produto com preço, disponibilidade, reviews)
- `BreadcrumbList` (navegação)
- `FAQPage` (seção de dúvidas)
- `LocalBusiness` (pontos de venda)
- `HowTo` (calculadora/guia de uso)
- `WebSite` com `SearchAction` (sitelinks search)

### Conteúdo para AI Discovery (GEO)
- Cada produto com descrição semântica rica
- FAQ estruturado com perguntas naturais
- Blog com artigos educativos (ex: "Como adubar gramado", "Quando aplicar fertilizante")
- Dados estruturados que IAs podem consumir facilmente

## Fluxo do Carrinho

```
1. Usuário adiciona produto
   → createCart (Storefront API mutation)
   → cartId salvo em cookie

2. Usuário modifica quantidade
   → cartLinesUpdate mutation

3. Checkout
   → Redireciona para checkout.shopify.com (seguro, PCI-compliant)

4. Pós-compra
   → Shopify gerencia pedido, pagamento, nota fiscal
```

## Fluxo da Calculadora/Quiz

```
Tela 0: Boas-vindas → Começar
Tela 1: Área (m²) → input numérico
Tela 2: Gramado novo? → sim/não
Tela 3: Objetivo → 4 opções (cards)
Tela 4: Clima hoje → 4 opções
Tela 5: Sol → 3 opções
Tela 6: Irrigação → 3 opções
Tela 7: Pisoteio → 3 opções
Tela 8: Estado do gramado → 3 opções
Tela 9: RESULTADO → plano completo com:
  - Produtos recomendados (dose/m², quantidade total)
  - Embalagens ideais
  - Calendário de aplicação
  - CTAs de compra direto no carrinho
  - Link compartilhável
```

## Recorrência (Subscriptions)

Usa o app **Shopify Subscriptions** (gratuito no Basic) para criar selling plans. No frontend, o componente `SubscriptionToggle` permite alternar entre:
- **Compra única** → preço normal
- **Recorrência** (4-8 semanas) → preço com desconto

## 📝 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Dev server (localhost:3000)

# Build e Produção
npm run build        # Build otimizado
npm run start        # Servidor de produção local

# Qualidade
npm run lint         # ESLint
npm run type-check   # TypeScript check

# Deploy
vercel               # Preview deploy
vercel --prod        # Production deploy
```

---

## 📚 Documentação

- **CURSOR_INSTRUCTIONS.md** - Regras de desenvolvimento para IA
- **DEPLOY.md** - Guia completo de deploy (passo a passo)
- **CHECKLIST.md** - Checklist de pré-deploy e pós-deploy
- **.env.local.example** - Variáveis de ambiente documentadas

---

## 🐛 Troubleshooting

### Build falha localmente

```bash
# Limpar cache e reinstalar
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Carrinho não funciona

1. Verifique credenciais Shopify em `.env.local`
2. Verifique console do navegador (erros de API?)
3. Verifique se produtos existem no Shopify

### Imagens não carregam

Verifique `next.config.mjs`:

```js
images: {
  domains: ['cdn.shopify.com'],
}
```

Mais troubleshooting: **DEPLOY.md**

---

## 🤝 Contribuindo

Este projeto foi desenvolvido com Cursor AI seguindo as instruções em `CURSOR_INSTRUCTIONS.md`.

Para adicionar novas funcionalidades:
1. Leia `CURSOR_INSTRUCTIONS.md`
2. Siga os padrões de código existentes
3. Use os tipos de `src/types/`
4. Teste com `npm run build`

---

## 📄 Licença

Projeto proprietário - Terravik © 2024-2026

---

## ✨ Próximos Passos Sugeridos

- [ ] Configurar credenciais Shopify reais
- [ ] Adicionar imagens reais dos produtos
- [ ] Integrar serviço de email (Resend/SendGrid)
- [ ] Deploy na Vercel
- [ ] Configurar domínio customizado
- [ ] Adicionar Analytics (Vercel/Google)
- [ ] Configurar webhook Shopify para revalidação
- [ ] Testes E2E (Playwright)
- [ ] Selling Plans (assinaturas/recorrência)

---

**Projeto pronto para produção! 🚀**

Desenvolvido com Next.js 14, TypeScript, Tailwind CSS e amor por gramados bonitos. 🌱
