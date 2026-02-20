# SISTEMA DE ASSINATURAS TERRAVIK - DOCUMENTAÇÃO

## 📊 STATUS DA IMPLEMENTAÇÃO

### ✅ FASE 1 - FUNDAÇÃO (CONCLUÍDA)
- [x] Estrutura de pastas (lib/subscription, components/subscription, contexts, hooks)
- [x] Types TypeScript completos (src/lib/subscription/types.ts)
- [x] Lógica de pricing e cálculos (src/lib/subscription/pricing.ts)
- [x] Sistema de recomendação inteligente (src/lib/subscription/recommendations.ts)
- [x] Dados mock para desenvolvimento (src/lib/subscription/mock-data.ts)
- [x] Context global (src/contexts/SubscriptionContext.tsx)
- [x] Hooks customizados (src/hooks/useSubscription.ts)
- [x] Integração no layout raiz

### ✅ FASE 2 - COMPONENTES CORE (CONCLUÍDA)
- [x] PurchaseToggle.tsx - Toggle compra única vs assinatura
- [x] FrequencySelector.tsx - Seletor de frequência de entrega
- [x] SavingsCalculator.tsx - Calculadora visual de economia
- [x] SubscriptionBadge.tsx - Badges e indicadores visuais
- [x] TrustIndicators.tsx - Elementos de confiança e prova social

### ✅ FASE 3 - COMPONENTES AVANÇADOS (CONCLUÍDA)
- [x] SubscriptionCard.tsx - Card de produto com opção de assinatura
- [x] SubscriptionBenefits.tsx - Seção de benefícios
- [x] SubscriptionTimeline.tsx - Timeline visual de entregas
- [x] SmartRecommendation.tsx - Recomendação inteligente
- [x] SubscriptionCompare.tsx - Comparativo lado a lado

### ✅ FASE 5 - LANDING PAGE (CONCLUÍDA)
- [x] Estrutura da página /assinatura
- [x] Landing page completa com 12 seções otimizadas
- [x] Integração de todos os componentes
- [x] SEO metadata configurado

### ⏳ PENDENTE
- [ ] **Fase 4**: Dashboard do assinante (minha-assinatura/page.tsx)
- [ ] **Fase 6**: API routes (create, update, calculate, webhook)
- [ ] **Fase 7**: Documentação de integração Shopify
- [ ] **Fase 8**: Polish final (animações, acessibilidade, testes)

---

## 🎨 COMPONENTES IMPLEMENTADOS

### Core (Fase 2)

#### 1. PurchaseToggle
**Localização**: `src/components/subscription/PurchaseToggle.tsx`

**Uso**:
```tsx
import { PurchaseToggle } from '@/components/subscription';

<PurchaseToggle
  currentMode="subscription"
  onModeChange={(mode) => setMode(mode)}
  savings={{ amount: 173.44, percent: 12 }}
  productPrice={89.90}
/>
```

**Features**:
- Toggle visual entre compra única e assinatura
- Modal de loss aversion ao trocar para compra única
- Animações suaves
- Badge de economia flutuante

#### 2. FrequencySelector
**Localização**: `src/components/subscription/FrequencySelector.tsx`

**Uso**:
```tsx
import { FrequencySelector } from '@/components/subscription';

<FrequencySelector
  selectedFrequency={45}
  onFrequencyChange={(freq) => setFrequency(freq)}
  basePrice={89.90}
  lawnData={lawnData} // opcional
/>
```

**Features**:
- 4 opções de frequência (30, 45, 60, 90 dias)
- Recomendação personalizada baseada em dados do gramado
- Cálculo de preço e próxima entrega
- Layout grid ou lista

#### 3. SavingsCalculator
**Localização**: `src/components/subscription/SavingsCalculator.tsx`

**Uso**:
```tsx
import { SavingsCalculator } from '@/components/subscription';

<SavingsCalculator
  basePrice={89.90}
  frequency={45}
  quantity={1}
  showAnnualProjection={true}
/>
```

**Features**:
- Animação de contagem progressiva
- Comparativo lado a lado
- Analogias tangíveis de economia
- Cofrinho animado de progresso

#### 4. SubscriptionBadge
**Localização**: `src/components/subscription/SubscriptionBadge.tsx`

**Variantes**:
```tsx
// Badge padrão
<SubscriptionBadge discount={12} />

// Badge flutuante
<FloatingSubscriptionBadge discount={12} position="top-right" />

// Badge de fidelidade
<LoyaltyBadge tier="ouro" />

// Badge de economia anual
<AnnualSavingsBadge amount={173.44} />
```

#### 5. TrustIndicators
**Localização**: `src/components/subscription/TrustIndicators.tsx`

**Uso**:
```tsx
// Versão completa
<TrustIndicators layout="horizontal" variant="light" />

// Barra compacta
<CompactTrustBar />

// Logos de segurança
<SecurityLogos />
```

### Avançados (Fase 3)

#### 6. SubscriptionCard
**Localização**: `src/components/subscription/SubscriptionCard.tsx`

**Uso**:
```tsx
<SubscriptionCard
  product={product}
  onAddToCart={(product, mode) => handleAddToCart(product, mode)}
  productUrl="/produtos/nutricao"
/>
```

**Features**:
- Toggle integrado de modo
- Cálculo automático de preços
- Badge flutuante de desconto
- Estados de loading

#### 7. SubscriptionBenefits
**Localização**: `src/components/subscription/SubscriptionBenefits.tsx`

**Variantes**:
```tsx
// Versão completa
<SubscriptionBenefits layout="grid" />

// Lista compacta
<CompactBenefitsList maxItems={5} />

// Inline (banners)
<InlineBenefits items={3} />
```

#### 8. SubscriptionTimeline
**Localização**: `src/components/subscription/SubscriptionTimeline.tsx`

**Uso**:
```tsx
<SubscriptionTimeline
  frequency={45}
  products={products}
  monthsToShow={6}
  showCumulativeSavings={true}
/>
```

**Features**:
- Timeline horizontal ou vertical
- Ícones de estações do ano
- Economia acumulada
- Destaque na próxima entrega

#### 9. SmartRecommendation
**Localização**: `src/components/subscription/SmartRecommendation.tsx`

**Uso**:
```tsx
<SmartRecommendation
  lawnData={lawnData}
  onAccept={(recommendation) => handleAccept(recommendation)}
  onCustomize={() => router.push('/calculadora')}
/>
```

**Features**:
- Integração com calculadora de gramado
- Algoritmo de recomendação personalizado
- Avatar de especialista
- Nível de confiança visual
- Insights adicionais

#### 10. SubscriptionCompare
**Localização**: `src/components/subscription/SubscriptionCompare.tsx`

**Uso**:
```tsx
// Versão completa
<SubscriptionCompare
  basePrice={89.90}
  frequency={45}
  quantity={1}
/>

// Versão compacta
<CompactCompare
  basePrice={89.90}
  subscriptionPrice={79.11}
  savingsAnnual={173.44}
/>
```

---

## 📚 LÓGICA DE NEGÓCIO

### Descontos por Frequência
```typescript
30 dias → 10% OFF
45 dias → 12% OFF (RECOMENDADO)
60 dias → 15% OFF
90 dias → 18% OFF (MAIOR ECONOMIA)
```

### Programa de Fidelidade
```typescript
Bronze (0-3 entregas)   → +0%
Prata (4-8 entregas)    → +2%
Ouro (9-15 entregas)    → +5%
Platina (16+ entregas)  → +10%
```

### Cálculos Importantes

**Economia anual**:
```typescript
import { calculateAnnualSavings } from '@/lib/subscription/pricing';

const annualSavings = calculateAnnualSavings(
  basePrice,        // 89.90
  subscriptionPrice, // 79.11
  frequency,        // 45
  quantity          // 1
);
// Resultado: R$ 173,44/ano (incluindo frete grátis)
```

**Próximas entregas**:
```typescript
import { calculateDeliveryDates } from '@/lib/subscription/pricing';

const dates = calculateDeliveryDates(
  new Date(),  // data inicial
  45,          // frequência
  6            // número de entregas
);
```

---

## 🎯 PRINCÍPIOS DE PSICOLOGIA APLICADOS

### 1. Ancoragem de Preço (Price Anchoring)
- Preço original sempre riscado antes do preço de assinatura
- Economia mostrada em R$ (não apenas %)
- "Por entrega" para valores parecerem menores

### 2. Efeito Default (Default Effect)
- Assinatura pré-selecionada por padrão
- Frequência de 45 dias como recomendada
- Verde para destaque visual da opção desejada

### 3. Aversão à Perda (Loss Aversion)
- Modal ao trocar para compra única mostrando o que se perde
- "Você deixará de economizar R$ X/ano"
- Lista de benefícios perdidos visível

### 4. Prova Social
- Números específicos: "2.847 famílias" (não "milhares")
- Avaliações reais com fotos e localização
- Rating 4.8/5 sempre visível

### 5. Compromisso e Consistência
- Micro-compromissos progressivos
- Integração com calculadora de gramado
- "Baseado no seu gramado de Xm²..."

### 6. Reciprocidade
- Frete grátis no primeiro mês
- Conteúdo gratuito (guias, lembretes)
- Sem taxa de cancelamento

### 7. Simplicidade (Paradoxo da Escolha)
- Máximo 4 opções de frequência
- Plano "Recomendado" destacado
- Interface limpa e focada

### 8. Enquadramento Positivo (Framing)
- "Investimento" não "gasto"
- "Cuidado contínuo" não "pagamento recorrente"
- "Seu agrônomo pessoal" não "assinatura de fertilizante"

### 9. Redução de Fricção
- Zero burocracia para pausar/cancelar
- Sem taxa de cancelamento explícito
- "Modificar a qualquer momento" sempre visível

### 10. Urgência Ética
- "Frete grátis no primeiro mês"
- Sem contadores falsos ou pressão antiética

---

## 🚀 COMO USAR O SISTEMA

### 1. Provider (já integrado no layout)
```tsx
// src/app/layout.tsx
<SubscriptionProvider>
  <CartProvider>
    {children}
  </CartProvider>
</SubscriptionProvider>
```

### 2. Hook useSubscription
```tsx
import { useSubscription } from '@/hooks/useSubscription';

function MyComponent() {
  const {
    mode,              // 'one-time' | 'subscription'
    frequency,         // 30 | 45 | 60 | 90
    setMode,
    setFrequency,
    calculations,      // cálculos automáticos
    isSubscriptionMode,
    // ... mais propriedades
  } = useSubscription();
  
  return (
    <div>
      {calculations && (
        <p>Economia anual: {calculations.formattedSavings.value}</p>
      )}
    </div>
  );
}
```

### 3. Hook de Recomendação
```tsx
import { useSmartRecommendation } from '@/hooks/useSubscription';

const { recommendation, insights, isLoading, generate } = useSmartRecommendation(lawnData);

useEffect(() => {
  if (lawnData) {
    generate();
  }
}, [lawnData, generate]);
```

### 4. Analytics
```tsx
import { useSubscriptionAnalytics } from '@/hooks/useSubscription';

const { trackView, trackSubscribe, trackCancel } = useSubscriptionAnalytics();

// Rastrear eventos
trackView();
trackSubscribe(45, 89.90);
trackCancel('price_high');
```

---

## 📱 LANDING PAGE

**URL**: `/assinatura`

**Estrutura** (12 seções):
1. Hero com CTAs principais
2. Barra de prova social rápida
3. Como funciona (3 passos)
4. Calculadora de economia / Recomendação inteligente
5. Benefícios completos (8 benefícios)
6. Comparativo lado a lado
7. Produtos disponíveis (grid de cards)
8. Timeline visual (6 meses)
9. Depoimentos (3 assinantes)
10. FAQ (10 perguntas)
11. Trust indicators
12. CTA final com urgência

**Otimizações SEO**:
- Title: "Assinatura Terravik - Gramado Perfeito no Piloto Automático"
- Description completa
- Keywords relevantes
- Open Graph configurado

---

## 🎨 DESIGN TOKENS

### Cores
```typescript
brand-green: #2D5A3D
green-50: #F0FDF4
green-100: #DCFCE7
green-600: #16A34A
yellow-400: #FACC15 (badges, highlights)
```

### Animações
- Todas usando Framer Motion
- `whileHover`, `whileTap` para interatividade
- `initial`, `animate`, `exit` para transições
- `viewport={{ once: true }}` para scroll-triggered

### Responsividade
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Grid adaptativo: 1 col mobile → 2/3/4 cols desktop

---

## 🔧 PRÓXIMOS PASSOS

### Fase 4 - Dashboard do Assinante
- [ ] Página `/assinatura/minha-assinatura`
- [ ] SubscriptionDashboard.tsx
- [ ] DeliveryCalendar.tsx
- [ ] PauseModal.tsx
- [ ] CancellationFlow.tsx

### Fase 6 - API Routes
- [ ] POST `/api/subscription/create` - Criar assinatura
- [ ] POST `/api/subscription/update` - Atualizar assinatura
- [ ] POST `/api/subscription/calculate` - Calcular economia
- [ ] POST `/api/subscription/webhook` - Webhooks Shopify

### Fase 7 - Integração Shopify
- [ ] Configurar Selling Plans no Shopify Admin
- [ ] Criar Selling Plan Groups
- [ ] Configurar webhooks
- [ ] Documentar fluxo completo

### Fase 8 - Polish Final
- [ ] Testes de acessibilidade (WCAG 2.1 AA)
- [ ] Animações de micro-interação
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Testes E2E

---

## 📊 MÉTRICAS A MONITORAR

Após lançamento, acompanhar:
1. **Taxa de conversão**: % visitantes que assinam
2. **Ticket médio**: Valor médio de assinatura
3. **Churn rate**: % cancelamentos/mês
4. **LTV**: Valor do cliente ao longo do tempo
5. **Pause rate**: % que pausa vs cancela
6. **Reativação**: % que volta após cancelar
7. **Frequência mais escolhida**
8. **Origem**: Calculadora vs direta

---

## 🐛 DEBUGGING

### Verificar estado da assinatura
```tsx
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';

const context = useSubscriptionContext();
console.log(context);
```

### Ver dados no localStorage
```javascript
// No DevTools Console
localStorage.getItem('terravik_subscription_state');
```

### Testar recomendações
```tsx
import { generateRecommendation } from '@/lib/subscription/recommendations';

const lawnData = {
  area: 250,
  grassType: 'Esmeralda',
  currentCondition: 'established',
};

const recommendation = generateRecommendation(lawnData);
console.log(recommendation);
```

---

## 📞 SUPORTE

Para dúvidas sobre implementação:
1. Consultar este documento
2. Ver comentários inline nos arquivos
3. Testar componentes isoladamente em `/dev` (criar página de testes)

**Arquivos-chave**:
- `src/lib/subscription/types.ts` - Todos os tipos
- `src/lib/subscription/pricing.ts` - Toda a lógica de cálculo
- `src/hooks/useSubscription.ts` - Hooks principais
- `src/components/subscription/index.ts` - Exportações

---

**Data da implementação**: 02/02/2026  
**Versão**: 1.0  
**Status**: Fase 5 concluída, fases 4, 6, 7 e 8 pendentes
