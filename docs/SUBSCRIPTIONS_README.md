# 📦 Sistema de Assinaturas Terravik - README

## 🎯 Visão Geral

Sistema completo de **Subscribe & Save** integrado com a calculadora de gramado e Shopify Storefront API.

**Conversão otimizada** através de:
- ✅ Princípios psicológicos aplicados
- ✅ UX premium com animações
- ✅ Personalização baseada em dados do gramado
- ✅ Fluxos de retenção éticos

---

## 📁 Estrutura de Arquivos

```
src/
├── lib/subscription/
│   ├── types.ts                    # Interfaces TypeScript
│   ├── mock-data.ts                # Dados de desenvolvimento
│   ├── pricing.ts                  # Lógica de preços e economia
│   ├── recommendations.ts          # Sistema de recomendação inteligente
│   └── index.ts                    # Barrel export
│
├── contexts/
│   └── SubscriptionContext.tsx     # Estado global (React Context)
│
├── hooks/
│   └── useSubscription.ts          # Custom hooks
│
├── components/subscription/
│   ├── PurchaseToggle.tsx          # Toggle one-time vs subscription
│   ├── FrequencySelector.tsx       # Seletor de frequência (30/45/60/90)
│   ├── SavingsCalculator.tsx       # Visualização de economia
│   ├── SubscriptionBadge.tsx       # Badge de desconto
│   ├── TrustIndicators.tsx         # Prova social
│   ├── SubscriptionCard.tsx        # Card de produto com assinatura
│   ├── SubscriptionBenefits.tsx    # Lista de benefícios
│   ├── SubscriptionTimeline.tsx    # Timeline de entregas
│   ├── SmartRecommendation.tsx     # Recomendação personalizada
│   ├── SubscriptionCompare.tsx     # Comparação one-time vs subscription
│   ├── SubscriptionDashboard.tsx   # Dashboard principal
│   ├── DeliveryCalendar.tsx        # Calendário de entregas
│   ├── PauseModal.tsx              # Modal para pausar (1/2/3 meses)
│   ├── CancellationFlow.tsx        # Fluxo de retenção
│   └── index.ts                    # Barrel export
│
├── app/
│   ├── assinatura/
│   │   ├── page.tsx                # Landing page
│   │   └── minha-assinatura/
│   │       └── page.tsx            # Dashboard do assinante
│   │
│   ├── api/subscription/
│   │   ├── calculate/route.ts      # Calcular economia
│   │   ├── create/route.ts         # Criar assinatura
│   │   ├── update/route.ts         # Atualizar assinatura
│   │   └── webhook/route.ts        # Webhooks Shopify
│   │
│   └── calculadora/
│       └── page.tsx                # Integração com calculadora
```

---

## 🧠 Princípios Psicológicos Implementados

### 1. **Price Anchoring** (Ancoragem de Preço)
- Preço original sempre visível
- Preço com desconto destacado
- Economia anual em R$

**Componentes:** `SavingsCalculator`, `FrequencySelector`, `SubscriptionCompare`

### 2. **Default Effect** (Efeito Padrão)
- Assinatura PRÉ-SELECIONADA (não compra única)
- 45 dias como frequência padrão
- Opção recomendada visualmente maior

**Componentes:** `PurchaseToggle`, `FrequencySelector`, `SubscriptionContext`

### 3. **Loss Aversion** (Aversão à Perda)
- Aviso ao trocar de assinatura para compra única
- "Você vai perder R$ XXX por ano"
- Confirmação antes de cancelar

**Componentes:** `PurchaseToggle`, `CancellationFlow`

### 4. **Social Proof** (Prova Social)
- "X mil assinantes ativos"
- Avaliações 4.8/5
- Depoimentos com economia real

**Componentes:** `TrustIndicators`, Landing page

### 5. **Scarcity & Urgency** (Escassez Ética)
- "Desconto especial para novos assinantes"
- "Economize até 18% - por tempo limitado"
- Não usa escassez falsa

**Componentes:** `SubscriptionBadge`, `FrequencyOptions`

### 6. **Commitment & Consistency** (Compromisso)
- Timeline de entregas futuras
- Gamificação (tiers: bronze → platinum)
- Benefícios acumulados (fidelidade)

**Componentes:** `SubscriptionTimeline`, `SubscriptionDashboard`

### 7. **Reciprocity** (Reciprocidade)
- Frete grátis em TODAS entregas
- Lembretes de aplicação
- Suporte prioritário

**Componentes:** `SubscriptionBenefits`

### 8. **Simplicity** (Simplicidade)
- Processo em 3 passos
- Cancele quando quiser (1 clique)
- Sem pegadinhas ou letras miúdas

**Componentes:** Landing page, `CancellationFlow`

### 9. **Positive Framing** (Enquadramento Positivo)
- "Economize" ao invés de "desconto"
- "Gramado perfeito no piloto automático"
- Emojis e analogias tangíveis

**Componentes:** `SavingsCalculator` (analogias), todos textos

### 10. **Friction Reduction** (Redução de Fricção)
- Checkout em 1 página
- Informações pré-preenchidas (da calculadora)
- Pause ao invés de cancelar

**Componentes:** `PauseModal`, `SmartRecommendation`

---

## 🎨 Componentes Principais

### `PurchaseToggle`

Toggle entre compra única e assinatura.

**Props:**
```typescript
{
  basePrice: number;
  className?: string;
  showWarning?: boolean; // Aviso ao escolher compra única
}
```

**Psicologia:** Default Effect, Loss Aversion

---

### `FrequencySelector`

Seletor de frequência de entrega com 4 opções.

**Props:**
```typescript
{
  basePrice: number;
  className?: string;
}
```

**Features:**
- Recomendação visual (45 dias)
- Preço por entrega calculado
- Badge de desconto
- Data estimada da próxima entrega

**Psicologia:** Price Anchoring, Default Effect, Simplicity

---

### `SavingsCalculator`

Visualizador dinâmico de economia com animação.

**Props:**
```typescript
{
  basePrice: number;
  showAnnualProjection?: boolean;
  className?: string;
}
```

**Features:**
- Economia por entrega
- Projeção anual
- Analogia tangível ("Equivale a 2 meses grátis!")
- Emoji contextual

**Psicologia:** Price Anchoring, Positive Framing

---

### `SmartRecommendation`

Recomendação personalizada baseada em dados do gramado.

**Props:**
```typescript
{
  lawnData: LawnData;
  onAccept: (recommendation: SmartRecommendation) => void;
  onCustomize?: () => void;
  className?: string;
}
```

**Algoritmo:**
1. Analisa área, condição, clima, uso
2. Sugere frequência ideal
3. Recomenda produtos específicos
4. Calcula economia anual

**Psicologia:** Commitment & Consistency, Simplicity

---

### `SubscriptionDashboard`

Dashboard completo do assinante com gamificação.

**Props:**
```typescript
{
  subscription: CustomerSubscription;
  onPause: () => void;
  onModify: () => void;
  onCancel: () => void;
}
```

**Features:**
- Tier de fidelidade (bronze → platinum)
- Economia acumulada
- Próxima entrega
- 4 tabs: Overview, Entregas, Pagamentos, Configurações

**Psicologia:** Commitment & Consistency, Social Proof

---

### `CancellationFlow`

Fluxo de retenção ético em 3 etapas.

**Props:**
```typescript
{
  isOpen: boolean;
  onClose: () => void;
  subscription: CustomerSubscription;
  onCancel: (reason?: string) => void;
  onPause: () => void;
  onRetained: (action: 'pause' | 'frequency') => void;
}
```

**Fluxo:**
1. **Etapa 1:** Mostra o que perde (Loss Aversion)
2. **Etapa 2:** Oferece alternativas (pause, mudar frequência)
3. **Etapa 3:** Pede motivo + oferta contextual

**Psicologia:** Loss Aversion, Reciprocity, Friction Reduction

---

## 🔌 API Routes

### `POST /api/subscription/calculate`

Calcula preços e economia de assinatura.

**Request:**
```json
{
  "products": [
    { "basePrice": 89.90, "quantity": 1 }
  ],
  "frequency": 45
}
```

**Response:**
```json
{
  "success": true,
  "calculation": {
    "pricing": {
      "totalBasePrice": 89.90,
      "totalSubscriptionPrice": 79.11,
      "savingsPerDelivery": 10.79,
      "annualSavings": 86.32
    },
    "schedule": {
      "deliveriesPerYear": 8,
      "nextDeliveries": ["2026-03-21", "2026-05-05", ...]
    },
    "comparison": {...},
    "insights": {
      "savingsAnalogy": "Equivale a 1 mês grátis por ano!",
      "paybackDeliveries": 1,
      "recommendation": "Frequência ideal! Equilibra cuidado e economia."
    }
  }
}
```

---

### `POST /api/subscription/create`

Cria nova assinatura (TODO: integrar com Shopify).

**Request:**
```json
{
  "customerId": "gid://shopify/Customer/123",
  "products": [
    {
      "productId": "gid://shopify/Product/456",
      "variantId": "gid://shopify/ProductVariant/789",
      "quantity": 2
    }
  ],
  "frequency": 45,
  "shippingAddress": {...},
  "paymentMethodId": "pm_xxx"
}
```

---

### `POST /api/subscription/update`

Atualiza assinatura existente.

**Actions disponíveis:**
- `pause` - Pausar por 1/2/3 meses
- `cancel` - Cancelar (com código de retorno)
- `update_frequency` - Alterar frequência
- `update_products` - Modificar produtos
- `update_payment` - Atualizar pagamento
- `update_address` - Atualizar endereço

**Request (pause):**
```json
{
  "subscriptionId": "sub_123",
  "action": "pause",
  "pauseMonths": 2
}
```

---

### `POST /api/subscription/webhook`

Recebe webhooks do Shopify.

**Eventos tratados:**
- `SUBSCRIPTION_CONTRACTS_CREATE`
- `SUBSCRIPTION_CONTRACTS_UPDATE`
- `SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS`
- `SUBSCRIPTION_BILLING_ATTEMPTS_FAILURE`
- `SUBSCRIPTION_BILLING_ATTEMPTS_CHALLENGED`

**Validação:** HMAC SHA256 automática

---

## 🚀 Como Usar

### 1. Integrar na Página de Produto

```tsx
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { PurchaseToggle, FrequencySelector, SavingsCalculator } from '@/components/subscription';

export default function ProductPage() {
  const productPrice = 89.90;

  return (
    <SubscriptionProvider>
      <PurchaseToggle basePrice={productPrice} />
      <FrequencySelector basePrice={productPrice} />
      <SavingsCalculator basePrice={productPrice} showAnnualProjection />
    </SubscriptionProvider>
  );
}
```

### 2. Integrar na Calculadora

Já integrado em `CalculatorResultSubscription.tsx`:
- Toggle automático
- Seletor de frequência
- Recomendação inteligente baseada em `lawnData`

### 3. Landing Page de Assinaturas

Acesse: `/assinatura`

Features:
- Hero com proposta de valor
- Como funciona (3 passos)
- Benefícios detalhados
- Comparativo
- Produtos disponíveis
- Depoimentos (Social Proof)
- FAQ
- CTAs estratégicos

### 4. Dashboard do Assinante

Acesse: `/assinatura/minha-assinatura`

Features:
- Status da assinatura
- Tier de fidelidade
- Próxima entrega
- Histórico completo
- Gerenciamento (pause/cancel/modify)

---

## 📊 Métricas de Sucesso

Acompanhar via Analytics:

1. **Taxa de Conversão**
   - % visitantes que assinam vs compra única
   - Meta: >60% escolhem assinatura

2. **Frequência Preferida**
   - Distribuição 30/45/60/90 dias
   - Meta: 45 dias = 50%+

3. **Taxa de Retenção**
   - % de assinantes que permanecem após 3/6/12 meses
   - Meta: >85% após 3 meses

4. **Taxa de Cancelamento**
   - % que cancelam vs pausam
   - Meta: Pause > Cancel (70/30)

5. **Lifetime Value (LTV)**
   - Receita média por assinante
   - Meta: 5x maior que compra única

6. **Efetividade do Fluxo de Retenção**
   - % retido no `CancellationFlow`
   - Meta: >30% retenção

---

## 🎨 Design System

### Cores

```css
/* Assinatura */
--subscription-gold: #F59E0B;
--subscription-green: #10B981;
--subscription-premium: linear-gradient(135deg, #F59E0B, #FBBF24);

/* Fidelidade */
--tier-bronze: #CD7F32;
--tier-silver: #C0C0C0;
--tier-gold: #FFD700;
--tier-platinum: #E5E4E2;
```

### Tipografia

```css
/* Headings */
font-family: var(--font-playfair);

/* Corpo */
font-family: var(--font-inter);

/* Números grandes (economia) */
font-size: 2.5rem;
font-weight: 800;
```

### Animações

```tsx
// Economia crescente
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", duration: 0.6 }}
>
```

---

## ✅ Checklist de Implementação

### Fase 1: Fundação ✅
- [x] Tipos TypeScript
- [x] Mock data
- [x] Lógica de preços
- [x] Sistema de recomendações
- [x] Context e Hooks

### Fase 2: Componentes Core ✅
- [x] PurchaseToggle
- [x] FrequencySelector
- [x] SavingsCalculator
- [x] SubscriptionBadge
- [x] TrustIndicators

### Fase 3: Componentes Avançados ✅
- [x] SubscriptionCard
- [x] SubscriptionBenefits
- [x] SubscriptionTimeline
- [x] SmartRecommendation
- [x] SubscriptionCompare

### Fase 4: Dashboard ✅
- [x] SubscriptionDashboard
- [x] DeliveryCalendar
- [x] PauseModal
- [x] CancellationFlow

### Fase 5: Páginas ✅
- [x] Landing page `/assinatura`
- [x] Dashboard `/assinatura/minha-assinatura`
- [x] Integração com calculadora

### Fase 6: API ✅
- [x] Route: calculate
- [x] Route: create
- [x] Route: update
- [x] Route: webhook

### Fase 7: Integração Shopify ✅ (Documentado)
- [x] Documentação completa
- [ ] Configurar Selling Plans (manual no Shopify)
- [ ] Configurar Webhooks (manual no Shopify)
- [ ] Testar fluxo completo
- [ ] Go-live

### Fase 8: Polish 🔄 (Próxima)
- [ ] Revisar animações
- [ ] Testar responsividade
- [ ] Validar acessibilidade
- [ ] Performance optimization

---

## 🐛 Debugging

### Context undefined
```
Error: useSubscription deve ser usado dentro de um SubscriptionProvider
```
**Solução:** Envolver componente com `<SubscriptionProvider>`

### Preços incorretos
Verifique a função `calculateSubscriptionPrice` em `pricing.ts`:
```typescript
const SUBSCRIPTION_DISCOUNTS = {
  30: 0.10, // 10%
  45: 0.12, // 12%
  60: 0.15, // 15%
  90: 0.18, // 18%
};
```

### Recomendação não personalizada
Verifique se `lawnData` está sendo passado:
```typescript
<SmartRecommendation lawnData={calculator.lawnData} />
```

---

## 📖 Recursos

- **Documentação Shopify:** [`SHOPIFY_SUBSCRIPTIONS_INTEGRATION.md`](./SHOPIFY_SUBSCRIPTIONS_INTEGRATION.md)
- **Tipos TypeScript:** [`src/lib/subscription/types.ts`](../src/lib/subscription/types.ts)
- **Mock Data:** [`src/lib/subscription/mock-data.ts`](../src/lib/subscription/mock-data.ts)

---

## 🚦 Próximos Passos

1. Configurar Selling Plans no Shopify Admin
2. Associar produtos aos planos
3. Configurar webhooks
4. Testar fluxo completo (staging)
5. Analytics e tracking
6. Go-live 🚀

---

**Versão:** 1.0  
**Data:** 04/02/2026  
**Status:** ✅ Desenvolvimento Completo (aguardando integração Shopify)
