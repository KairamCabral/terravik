# ✅ CHECKLIST MASTER DE EXECUÇÃO - TERRAVIK

## 📋 COMO USAR ESTE CHECKLIST

1. **Execute sessão por sessão** (não pule etapas)
2. **Teste cada item** antes de marcar como concluído
3. **Commit após cada sessão** para ter pontos de restauração
4. **Peça ajuda** se travar em algum item

---

## 🎯 SESSÃO 0: PREPARAÇÃO (15 min)

**Objetivo**: Garantir que o ambiente está pronto

### Verificações Iniciais

- [ ] **Projeto abre sem erros** (`npm run dev`)
- [ ] **Git está funcionando** (`git status`)
- [ ] **Navegador atualizado** (Chrome/Edge/Firefox)
- [ ] **DevTools aberto** (F12) para ver erros

### Dependências

```bash
# Instalar dependências necessárias
npm install clsx tailwind-merge framer-motion lucide-react

# Verificar instalação
npm list clsx tailwind-merge framer-motion lucide-react
```

- [ ] **Dependências instaladas** sem erros
- [ ] **npm run dev** roda sem warnings críticos

### Backup

```bash
# Criar branch para o trabalho
git checkout -b feature/assinatura-calculadora-integration

# Commit estado atual
git add .
git commit -m "chore: preparação para integração assinatura"
```

- [ ] **Branch criada**
- [ ] **Commit inicial** feito

---

## 🏗️ SESSÃO 1: FUNDAÇÃO (30-45 min)

**Objetivo**: Configurar base do sistema

### 1.1 Configuração do Tailwind

Arquivo: `tailwind.config.ts`

```typescript
// Adicionar/verificar cores personalizadas
theme: {
  extend: {
    colors: {
      'brand-green': '#2D5A3D',
      'terravik-green': '#2D5A3D',
      'terravik-green-700': '#1e3d29',
      // ... outras cores
    },
  },
}
```

- [ ] **Cores configuradas** no Tailwind
- [ ] **Teste**: Classe `bg-brand-green` funciona

### 1.2 Função Utilitária cn()

Arquivo: `src/lib/utils/cn.ts` (se não existir)

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Arquivo criado**
- [ ] **Import funciona** em outro arquivo

### 1.3 Verificar Sistema de Assinatura

- [ ] **Arquivos existem**:
  - `src/lib/subscription/types.ts`
  - `src/lib/subscription/pricing.ts`
  - `src/lib/subscription/recommendations.ts`
  - `src/lib/subscription/mock-data.ts`
  - `src/contexts/SubscriptionContext.tsx`
  - `src/hooks/useSubscription.ts`

- [ ] **Context está no layout**:
  - Abrir `src/app/layout.tsx`
  - Verificar `<SubscriptionProvider>` envolvendo tudo

- [ ] **Teste**: Página `/assinatura` carrega sem erros

### 1.4 Commit Sessão 1

```bash
git add .
git commit -m "feat: fundação - configuração base e verificação sistema assinatura"
```

- [ ] **Commit feito**

---

## 🧩 SESSÃO 2: COMPONENTES BASE (Opcional - se não existirem)

**Objetivo**: Garantir componentes UI básicos

**Nota**: Pule se já tiver Button, Card, Input, Badge, Modal, etc.

### 2.1 Verificar Componentes Existentes

- [ ] `src/components/ui/Button.tsx` **existe e funciona**
- [ ] `src/components/ui/Badge.tsx` **existe e funciona**
- [ ] `src/components/ui/Modal.tsx` **existe e funciona**
- [ ] `src/components/ui/Container.tsx` **existe e funciona**

### 2.2 Se Precisar Criar

Consultar `prompt-terravik-redesign-ui-ux-premium.md` para specs completas.

- [ ] **Componentes criados**
- [ ] **Exportados** em `src/components/ui/index.ts`
- [ ] **Testados** visualmente

### 2.3 Commit Sessão 2

```bash
git add .
git commit -m "feat: componentes UI base verificados/criados"
```

- [ ] **Commit feito** (se houve mudanças)

---

## 🔗 SESSÃO 3: INTEGRAÇÃO CALCULADORA (1-1.5h)

**Objetivo**: Integrar sistema de assinatura na calculadora

### 3.1 Criar Componente de Integração

- [ ] **Arquivo criado**: `src/components/calculator/CalculatorResultSubscription.tsx`
- [ ] **550+ linhas** de código do documento copiadas
- [ ] **Imports corrigidos** (sem erros no IDE)

### 3.2 Atualizar CalculatorWizard

Arquivo: `src/components/calculator/CalculatorWizard.tsx`

```typescript
// Adicionar import
import { CalculatorResultSubscription } from './CalculatorResultSubscription'

// Atualizar renderStep
case 'result':
  return <CalculatorResultSubscription calculator={calculator} />
```

- [ ] **Import adicionado**
- [ ] **Componente trocado** no renderStep
- [ ] **Sem erros** de TypeScript

### 3.3 Exportar em Index

Arquivo: `src/components/calculator/index.ts`

```typescript
export { CalculatorResultSubscription } from './CalculatorResultSubscription';
```

- [ ] **Exportação adicionada**

### 3.4 Testar Fluxo Completo

```bash
# Rodar dev server
npm run dev

# Navegar para:
http://localhost:3000/calculadora
```

**Preencher calculadora com dados de teste**:
- Área: 250m²
- Condição: Estabelecido
- Objetivo: Nutrição
- Completar todas as perguntas

**Verificar no resultado**:

- [ ] **Página carrega** sem erros no console
- [ ] **Toggle aparece** (Compra Única | Assinatura)
- [ ] **Assinatura pré-selecionada** (fundo verde)
- [ ] **Seletor de frequência aparece** (30/45/60/90 dias)
- [ ] **Economia é calculada** e exibida
- [ ] **Benefícios aparecem** (4 items)
- [ ] **CTA "Assinar e economizar"** está visível

### 3.5 Testar Interações

- [ ] **Trocar para 60 dias**: economia aumenta?
- [ ] **Trocar para compra única**: aviso vermelho aparece?
- [ ] **Voltar para assinatura**: aviso desaparece?
- [ ] **Click em "Assinar"**: console.log mostra dados?

### 3.6 Testar Responsividade

- [ ] **Desktop** (>1024px): Layout em 2 colunas?
- [ ] **Tablet** (768-1024px): Layout se adapta?
- [ ] **Mobile** (< 768px): Tudo empilhado verticalmente?

### 3.7 Corrigir Erros (se houver)

Erros comuns:

**Erro: "useSubscription is not defined"**
```typescript
// Verificar import
import { useSubscription } from '@/hooks/useSubscription'
```

**Erro: "calculations is undefined"**
```typescript
// Verificar se há produtos selecionados
// O calculations só existe se selectedProducts.length > 0
```

**Erro: Componente não renderiza**
```typescript
// Verificar se SubscriptionProvider está no layout
// Abrir src/app/layout.tsx
```

- [ ] **Todos os erros corrigidos**

### 3.8 Commit Sessão 3

```bash
git add .
git commit -m "feat: integração calculadora + assinatura completa"
```

- [ ] **Commit feito**

---

## 🎨 SESSÃO 4: HOME PAGE (2-3h)

**Objetivo**: Redesenhar home com novo design system

**Nota**: Esta sessão é extensa. Pode ser dividida em sub-sessões.

### 4.1 Criar Componentes de Seção

Pasta: `src/components/home/`

**Ordem de criação**:

1. [ ] **HeroSection.tsx** (Hero principal)
2. [ ] **SocialProofBar.tsx** (Barra de stats)
3. [ ] **HowItWorks.tsx** (3 passos)
4. [ ] **BenefitsSection.tsx** (4 benefícios da marca)
5. [ ] **ProductsShowcase.tsx** (Grid de produtos)
6. [ ] **CalculatorCTA.tsx** (CTA para calculadora)
7. [ ] **SubscriptionSection.tsx** (Apresentação assinatura)
8. [ ] **TestimonialsSection.tsx** (Depoimentos)
9. [ ] **FAQSection.tsx** (Perguntas frequentes)

**Para cada componente**:
- [ ] **Criado** com estrutura básica
- [ ] **Exportado** em `src/components/home/index.ts`
- [ ] **Testado isoladamente** (criar página /test se necessário)

### 4.2 Montar Página Home

Arquivo: `src/app/page.tsx`

```typescript
import {
  HeroSection,
  SocialProofBar,
  HowItWorks,
  BenefitsSection,
  ProductsShowcase,
  CalculatorCTA,
  SubscriptionSection,
  TestimonialsSection,
  FAQSection,
} from '@/components/home'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofBar />
      <HowItWorks />
      <BenefitsSection />
      <ProductsShowcase />
      <CalculatorCTA />
      <SubscriptionSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  )
}
```

- [ ] **Todas as seções renderizam**
- [ ] **Sem erros** no console
- [ ] **Scroll suave** entre seções

### 4.3 Testar Home Completa

- [ ] **Hero**: CTAs funcionam?
- [ ] **Social Proof**: Números aparecem?
- [ ] **How It Works**: Ícones corretos?
- [ ] **Benefits**: Cards responsivos?
- [ ] **Products**: Grid se adapta?
- [ ] **Calculator CTA**: Redireciona?
- [ ] **Subscription**: Links corretos?
- [ ] **Testimonials**: Avatares carregam?
- [ ] **FAQ**: Accordion funciona?

### 4.4 Commit Sessão 4

```bash
git add .
git commit -m "feat: redesign home page completo"
```

- [ ] **Commit feito**

---

## 🎭 SESSÃO 5: HEADER & FOOTER (1-1.5h)

**Objetivo**: Atualizar layout global

### 5.1 Header

Arquivo: `src/components/layout/Header.tsx`

**Melhorias**:
- [ ] **Scroll behavior**: Muda cor ao rolar?
- [ ] **Mobile menu**: Funciona suavemente?
- [ ] **CTA de assinatura**: Destacado?
- [ ] **Links ativos**: Visual correto?

### 5.2 Footer

Arquivo: `src/components/layout/Footer.tsx`

**Melhorias**:
- [ ] **Design premium**: Gradiente sutil?
- [ ] **Links organizados**: 4 colunas?
- [ ] **Social media**: Ícones corretos?
- [ ] **Newsletter**: Formulário funciona?

### 5.3 Commit Sessão 5

```bash
git add .
git commit -m "feat: header e footer atualizados"
```

- [ ] **Commit feito**

---

## 🛍️ SESSÃO 6: PÁGINAS ADICIONAIS (2-3h)

**Objetivo**: Atualizar demais páginas

### 6.1 Página de Produto

Arquivo: `src/app/produtos/[handle]/page.tsx`

- [ ] **Toggle assinatura**: Integrado?
- [ ] **Preço dinâmico**: Muda com frequência?
- [ ] **Benefícios**: Visíveis?
- [ ] **Add to cart**: Funciona?

### 6.2 Landing de Assinatura

Arquivo: `src/app/assinatura/page.tsx`

- [ ] **Já existe**: Implementado na fase anterior
- [ ] **Testar**: Todas as 12 seções carregam?
- [ ] **Links**: Funcionam corretamente?

### 6.3 Páginas Institucionais

- [ ] **/sobre**: Design atualizado
- [ ] **/contato**: Formulário funciona
- [ ] **/blog**: Layout premium
- [ ] **/onde-encontrar**: Mapa/lista

### 6.4 Commit Sessão 6

```bash
git add .
git commit -m "feat: páginas adicionais atualizadas"
```

- [ ] **Commit feito**

---

## ✨ SESSÃO 7: POLISH & TESTES (2-3h)

**Objetivo**: Refinar detalhes e garantir qualidade

### 7.1 Animações

- [ ] **Framer Motion**: Todas as animações suaves?
- [ ] **Hover states**: Botões têm feedback?
- [ ] **Loading states**: Skeleton implementado?
- [ ] **Transitions**: Duração apropriada (300ms)?

### 7.2 Responsividade

**Testar em 3 tamanhos**:

**Mobile (375px)**:
- [ ] Home carrega corretamente
- [ ] Calculadora é usável
- [ ] Resultado é legível
- [ ] Menu mobile funciona

**Tablet (768px)**:
- [ ] Grid se adapta (2 colunas)
- [ ] Imagens dimensionadas
- [ ] Espaçamentos corretos

**Desktop (1440px)**:
- [ ] Layout aproveita espaço
- [ ] Max-width respeitado
- [ ] Imagens de alta qualidade

### 7.3 Acessibilidade

- [ ] **Keyboard navigation**: Tab funciona?
- [ ] **Focus visible**: Outline em elementos?
- [ ] **ARIA labels**: Botões têm labels?
- [ ] **Alt text**: Imagens têm alt?
- [ ] **Color contrast**: Ratio adequado (AA)?

### 7.4 Performance

```bash
# Lighthouse audit
npm run build
npm start

# Abrir DevTools > Lighthouse
# Rodar audit em:
# - / (home)
# - /calculadora
# - /assinatura
```

**Métricas alvo**:
- [ ] **Performance**: > 80
- [ ] **Accessibility**: > 90
- [ ] **Best Practices**: > 90
- [ ] **SEO**: > 90

### 7.5 Testes Manuais

**Fluxo 1: Calculadora → Assinatura**
1. [ ] Preencher calculadora
2. [ ] Ver resultado com assinatura
3. [ ] Escolher frequência
4. [ ] Adicionar ao carrinho
5. [ ] Verificar carrinho

**Fluxo 2: Landing → Produto → Checkout**
1. [ ] Entrar em /assinatura
2. [ ] Click em produto
3. [ ] Escolher assinatura
4. [ ] Adicionar ao carrinho
5. [ ] Iniciar checkout

**Fluxo 3: Mobile**
1. [ ] Repetir fluxos acima em mobile
2. [ ] Verificar scroll
3. [ ] Testar menu
4. [ ] Testar formulários

### 7.6 Correções Finais

**Fazer lista de bugs encontrados**:
- [ ] Bug 1: [descrição]
- [ ] Bug 2: [descrição]
- [ ] Bug 3: [descrição]

**Corrigir todos os bugs**:
- [ ] Todos os bugs resolvidos

### 7.7 Commit Final Sessão 7

```bash
git add .
git commit -m "feat: polish final - animações, responsividade e testes"
```

- [ ] **Commit feito**

---

## 🚀 SESSÃO 8: DEPLOY & VALIDAÇÃO (30-45 min)

**Objetivo**: Preparar para produção

### 8.1 Build Production

```bash
# Build do projeto
npm run build

# Verificar erros
# Corrigir todos os erros de build
```

- [ ] **Build completa** sem erros
- [ ] **Sem warnings** críticos

### 8.2 Teste Production Local

```bash
npm start
```

- [ ] **Servidor inicia** sem erros
- [ ] **Páginas carregam** rapidamente
- [ ] **Funcionalidades** operam corretamente

### 8.3 Variáveis de Ambiente

Arquivo: `.env.local`

```bash
# Shopify
SHOPIFY_STORE_DOMAIN=terravik.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu_token

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Outras variáveis necessárias
```

- [ ] **Todas as variáveis** configuradas
- [ ] **.env.example** atualizado
- [ ] **Secrets seguros** (não commitados)

### 8.4 Documentação Final

- [ ] **README.md**: Atualizado com instruções
- [ ] **CHANGELOG.md**: Criado com mudanças
- [ ] **TODO.md**: Lista de próximas melhorias

### 8.5 Merge para Main

```bash
# Voltar para main
git checkout main

# Merge da feature branch
git merge feature/assinatura-calculadora-integration

# Push (se tudo OK)
git push origin main
```

- [ ] **Merge completo**
- [ ] **Push feito** (se aplicável)

---

## 📊 SESSÃO 9: MÉTRICAS & MONITORAMENTO (Opcional)

**Objetivo**: Configurar tracking

### 9.1 Google Analytics

- [ ] **GA4 configurado**
- [ ] **Eventos customizados**: Implementados
- [ ] **Conversões**: Rastreadas

### 9.2 Hotjar / Clarity

- [ ] **Heatmaps**: Configurados
- [ ] **Session recordings**: Ativos
- [ ] **Surveys**: Criados (opcional)

### 9.3 A/B Testing (Futuro)

- [ ] **Ferramenta escolhida** (Google Optimize / VWO)
- [ ] **Experimentos planejados**
- [ ] **Hipóteses documentadas**

---

## ✅ CHECKLIST FINAL DE VALIDAÇÃO

### Funcionalidades Core

- [ ] **Calculadora funciona** completamente
- [ ] **Resultado mostra assinatura** corretamente
- [ ] **Toggle funciona** (compra única ↔ assinatura)
- [ ] **Economia calcula** corretamente
- [ ] **Add to cart** funciona
- [ ] **Carrinho persiste** itens

### Páginas Principais

- [ ] **Home** (/): Carrega e funciona
- [ ] **Calculadora** (/calculadora): Fluxo completo
- [ ] **Assinatura** (/assinatura): Landing completa
- [ ] **Produtos** (/produtos): Listagem e detalhe
- [ ] **Checkout**: Integração Shopify

### Qualidade

- [ ] **Sem erros** no console (em nenhuma página)
- [ ] **Performance**: Lighthouse > 80
- [ ] **Mobile-friendly**: 100% responsivo
- [ ] **Acessibilidade**: Básica implementada
- [ ] **SEO**: Meta tags em todas as páginas

### Integração

- [ ] **Shopify**: Produtos sincronizados
- [ ] **Selling Plans**: Configurados (se produção)
- [ ] **Analytics**: Rastreando eventos
- [ ] **Email**: Transacionais configurados (se aplicável)

---

## 🎉 CONCLUSÃO

**Se chegou até aqui**: PARABÉNS! 🎊

Você implementou:
- ✅ Sistema completo de assinaturas
- ✅ Integração calculadora → assinatura
- ✅ Redesign da home page
- ✅ Landing page otimizada
- ✅ 10+ componentes React reutilizáveis
- ✅ Sistema de precificação inteligente
- ✅ Recomendações personalizadas

### Próximos Passos

1. **Monitorar métricas** nos primeiros dias
2. **Coletar feedback** dos usuários
3. **Iterar baseado em dados**
4. **Implementar melhorias** conforme necessário

### Recursos

- **Documentação completa**: `SUBSCRIPTION_SYSTEM.md`
- **Integração Shopify**: `SHOPIFY_INTEGRATION.md`
- **Integração Calculadora**: `INTEGRATION_CALCULATOR_SUBSCRIPTION.md`
- **Resumo**: `IMPLEMENTATION_SUMMARY.md`

---

**Data de criação**: 02/02/2026  
**Versão**: 1.0  
**Última atualização**: 02/02/2026  
**Status**: ✅ Pronto para execução

**Boa sorte! 🚀🌱**
