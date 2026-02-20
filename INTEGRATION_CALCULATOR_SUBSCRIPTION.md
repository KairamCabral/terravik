# 🔗 INTEGRAÇÃO CALCULADORA + ASSINATURA - GUIA COMPLETO

## 📊 VISÃO GERAL

Esta integração é **crítica** para maximizar conversões. A calculadora é o ponto de conversão mais importante porque:

✅ Usuário já demonstrou interesse (completou 7 perguntas)  
✅ Forneceu dados valiosos do gramado (área, condição, objetivo)  
✅ Está no mindset de "resolver o problema"  
✅ Personalização baseada em dados aumenta conversão em 40%+  
✅ Momento perfeito para apresentar assinatura como solução

---

## 🎯 O QUE FOI IMPLEMENTADO

### Novo Componente: CalculatorResultSubscription.tsx

**Localização**: `src/components/calculator/CalculatorResultSubscription.tsx`

**Features** (550+ linhas):
- ✅ Toggle visual Compra Única vs Assinatura
- ✅ Assinatura pré-selecionada por padrão (default effect)
- ✅ Seletor de frequência integrado
- ✅ Calculadora de economia personalizada
- ✅ Aviso de perda se escolher compra única (loss aversion)
- ✅ Recomendação inteligente baseada nos dados do gramado
- ✅ Benefícios da assinatura visíveis
- ✅ Trust indicators integrados
- ✅ CTA adaptativo por modo

---

## 📁 ESTRUTURA DE ARQUIVOS

```
src/
├── components/
│   ├── calculator/
│   │   ├── CalculatorResult.tsx                    # Antigo (mantido)
│   │   ├── CalculatorResultSubscription.tsx  ✨ NOVO
│   │   ├── CalculatorWizard.tsx                    # Atualizar
│   │   ├── ProductPlanCard.tsx                     # Reutilizado
│   │   ├── CalendarBlock.tsx                       # Reutilizado
│   │   └── ...
│   │
│   └── subscription/                               # Sistema completo
│       ├── PurchaseToggle.tsx
│       ├── FrequencySelector.tsx
│       ├── SavingsCalculator.tsx
│       ├── SmartRecommendation.tsx
│       └── ...
│
├── hooks/
│   ├── useCalculator.ts                            # Já existe
│   └── useSubscription.ts                          # Sistema de assinatura
│
└── contexts/
    ├── CalculatorContext.tsx                       # Já existe
    └── SubscriptionContext.tsx                     # Sistema de assinatura
```

---

## 🔧 COMO INTEGRAR

### Opção 1: Substituir Completamente (Recomendado)

Editar `src/components/calculator/CalculatorWizard.tsx`:

```tsx
// ANTES
import { CalculatorResult } from './CalculatorResult'

// DEPOIS
import { CalculatorResultSubscription } from './CalculatorResultSubscription'

// No render:
{currentStep === 'result' && result && (
  <CalculatorResultSubscription 
    calculator={calculator}
    onAddToCart={(config) => {
      console.log('Adicionar ao carrinho:', config);
      // TODO: Implementar lógica real do carrinho
    }}
  />
)}
```

### Opção 2: A/B Testing (Avançado)

Criar toggle para testar ambas as versões:

```tsx
const [useNewResult, setUseNewResult] = useState(
  Math.random() > 0.5 // 50% para cada versão
);

{currentStep === 'result' && result && (
  <>
    {useNewResult ? (
      <CalculatorResultSubscription calculator={calculator} />
    ) : (
      <CalculatorResult calculator={calculator} />
    )}
  </>
)}
```

---

## 🎨 INTERFACE DO USUÁRIO

### Fluxo Visual

```
┌─────────────────────────────────────────────────────────────┐
│  CALCULADORA (7 perguntas)                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  RESULTADO COM OPÇÃO DE ASSINATURA                          │
│                                                              │
│  [✅ Seu plano personalizado está pronto!]                  │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  📏 250m² | 🎯 Nutrição | 🌤️ Clima úmido         │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [Produtos recomendados - Cards tradicionais]               │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ⚡ RECOMENDADO PARA VOCÊ                          │    │
│  │                                                      │    │
│  │  Escolha como quer receber                          │    │
│  │                                                      │    │
│  │  [Toggle: Compra Única | 🟢 Assinatura ← PRÉ-SELECIONADA]  │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │ Frequência de entrega:                        │  │    │
│  │  │ [ ] 30 dias  [✓] 45 dias  [ ] 60  [ ] 90     │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │                                                      │    │
│  │  💰 ECONOMIA ANUAL: R$ 173,44                       │    │
│  │  (O equivalente a uma escapada de fim de semana)   │    │
│  │                                                      │    │
│  │  Benefícios:                                        │    │
│  │  ✓ Economize R$ 173/ano                            │    │
│  │  ✓ Frete grátis                                    │    │
│  │  ✓ Lembretes automáticos                           │    │
│  │  ✓ Cancele quando quiser                           │    │
│  │                                                      │    │
│  │  [🛒 Assinar e economizar]  [Refazer cálculo]     │    │
│  │                                                      │    │
│  │  ✨ Sem compromisso. Cancele quando quiser.        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [Recomendação inteligente se houver dados]                │
│  [Calendário de aplicação]                                 │
│  [Trust indicators]                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 PSICOLOGIA APLICADA

### Técnicas Implementadas

| Técnica | Como está aplicado |
|---------|-------------------|
| **Default Effect** | Assinatura vem pré-selecionada |
| **Loss Aversion** | Aviso vermelho ao escolher compra única: "Você vai perder R$ X!" |
| **Anchoring** | Preço original sempre riscado antes do preço de assinatura |
| **Personalization** | "Para seu gramado de Xm²...", frequência baseada na condição |
| **Social Proof** | "2.847 famílias já assinam" visível |
| **Commitment** | Usuário já investiu tempo (7 perguntas) → mais propenso a converter |
| **Reciprocidade** | Ferramenta gratuita → sentimento de retribuir |
| **Simplicity** | Máximo 4 opções de frequência, interface limpa |
| **Framing** | "Assinar e economizar" não "Pagar mensalmente" |
| **Urgency (ética)** | "Economize já na primeira entrega" |

---

## 📊 DADOS PERSONALIZADOS

### O que o componente usa da Calculadora

```typescript
// Dados do resultado
result.area_m2           // Área em m²
result.context.objetivo   // new_lawn, nutrition, recovery
result.context.clima_hoje // Clima atual
result.plan              // Produtos recomendados

// Dados do gramado (para SmartRecommendation)
lawnData.area            // m²
lawnData.grassType       // Tipo de grama
lawnData.currentCondition // new, established, recovering
```

### Recomendações Personalizadas

#### Frequência baseada na condição:

```typescript
if (condição === 'new' || condição === 'recovering') {
  frequência_recomendada = 30 dias
  reasoning = "Gramados novos precisam de nutrição frequente"
}

if (condição === 'established' && área <= 200m²) {
  frequência_recomendada = 60 dias
  reasoning = "Áreas menores já estabelecidas: 60 dias é ideal"
}

if (condição === 'established' && área > 200m²) {
  frequência_recomendada = 45 dias
  reasoning = "Equilíbrio perfeito para sua área"
}
```

---

## 🔌 INTEGRAÇÃO COM CARRINHO

### Handler onAddToCart

```typescript
const handleAddToCart = async (config: {
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    basePrice: number;
  }>;
  mode: 'one-time' | 'subscription';
  frequency?: 30 | 45 | 60 | 90;
}) => {
  // 1. Adicionar produtos ao carrinho Shopify
  for (const product of config.products) {
    await cartAddItem({
      variantId: product.productId,
      quantity: product.quantity,
      // Se assinatura, incluir sellingPlanId
      ...(config.mode === 'subscription' && {
        sellingPlanId: getSellingPlanId(config.frequency),
      }),
    });
  }
  
  // 2. Salvar configuração de assinatura
  if (config.mode === 'subscription') {
    localStorage.setItem('terravik_subscription_config', JSON.stringify({
      frequency: config.frequency,
      products: config.products,
      createdAt: new Date().toISOString(),
    }));
  }
  
  // 3. Analytics
  trackEvent('calculator_conversion', {
    mode: config.mode,
    frequency: config.frequency,
    value: config.products.reduce((sum, p) => sum + p.basePrice, 0),
  });
  
  // 4. Feedback visual
  toast.success(
    config.mode === 'subscription' 
      ? '✅ Assinatura adicionada! Você está economizando!' 
      : '✅ Produtos adicionados ao carrinho'
  );
  
  // 5. Abrir drawer ou redirecionar
  if (config.mode === 'subscription') {
    router.push('/carrinho?highlight=subscription');
  } else {
    setCartOpen(true);
  }
};
```

---

## 🧪 TESTES E VALIDAÇÃO

### Checklist de Validação

- [ ] **Calculadora carrega corretamente**
- [ ] **Resultado mostra toggle compra/assinatura**
- [ ] **Assinatura vem pré-selecionada**
- [ ] **Seletor de frequência aparece quando assinatura ativa**
- [ ] **Economia é calculada corretamente**
- [ ] **Aviso de perda aparece ao trocar para compra única**
- [ ] **Recomendação inteligente funciona** (se houver dados)
- [ ] **CTA "Assinar e economizar" funciona**
- [ ] **Handler onAddToCart é chamado**
- [ ] **Analytics são enviados**
- [ ] **Mobile responsivo**
- [ ] **Animações suaves**
- [ ] **Loading states funcionam**

### Testes Manuais

```bash
# 1. Preencher calculadora com dados de teste
Area: 250m²
Condição: Gramado estabelecido
Objetivo: Nutrição
Clima: Úmido

# 2. Verificar resultado
✅ Mostra toggle?
✅ Assinatura pré-selecionada?
✅ Frequência 45 dias recomendada?
✅ Economia exibida?

# 3. Interações
✅ Trocar para 60 dias → economia aumenta?
✅ Trocar para compra única → aviso aparece?
✅ Voltar para assinatura → aviso desaparece?
✅ Click em "Assinar" → handler executado?
```

---

## 📈 MÉTRICAS A MONITORAR

### KPIs Críticos

```typescript
// Analytics a implementar
{
  // Conversão geral
  calculator_completion_rate: '% que completa calculadora',
  subscription_selection_rate: '% que escolhe assinatura',
  conversion_rate: '% que adiciona ao carrinho',
  
  // Por modo
  subscription_vs_onetime: 'Ratio assinatura vs compra única',
  avg_cart_value_subscription: 'Ticket médio assinatura',
  avg_cart_value_onetime: 'Ticket médio compra única',
  
  // Frequências
  frequency_30_selection: '% que escolhe 30 dias',
  frequency_45_selection: '% que escolhe 45 dias',
  frequency_60_selection: '% que escolhe 60 dias',
  frequency_90_selection: '% que escolhe 90 dias',
  
  // Comportamento
  mode_switch_rate: '% que troca de modo',
  loss_warning_impact: '% que volta após ver aviso',
  time_on_result_page: 'Tempo médio na página de resultado',
}
```

### Eventos para Google Analytics

```typescript
// Completou calculadora
gtag('event', 'calculator_complete', {
  area_m2: result.area_m2,
  condition: result.context.objetivo,
});

// Escolheu assinatura
gtag('event', 'subscription_selected', {
  frequency: frequency,
  products_count: result.plan.length,
});

// Trocou de modo
gtag('event', 'purchase_mode_change', {
  from: previousMode,
  to: currentMode,
});

// Viu aviso de perda
gtag('event', 'loss_warning_shown', {
  savings_amount: calculations.annualSavings,
});

// Converteu
gtag('event', 'purchase', {
  mode: mode,
  frequency: mode === 'subscription' ? frequency : null,
  value: totalValue,
});
```

---

## 🚀 PRÓXIMOS PASSOS

### Imediato
1. ✅ **Testar integração** em localhost
2. ⏳ **Implementar handler real** do carrinho
3. ⏳ **Conectar com Shopify** Selling Plans

### Curto Prazo
4. ⏳ **Implementar analytics** completo
5. ⏳ **A/B testing** versão antiga vs nova
6. ⏳ **Otimizar mobile** (se necessário)

### Médio Prazo
7. ⏳ **Email follow-up** para quem não converteu
8. ⏳ **Remarketing** com economia personalizada
9. ⏳ **Melhorias baseadas em dados**

---

## 💡 DICAS DE OTIMIZAÇÃO

### Conversão
- Reduzir friction ao máximo (1 clique para adicionar)
- Manter assinatura pré-selecionada sempre
- Tornar aviso de perda mais dramático (se necessário)
- Testar diferentes analogias de economia

### UX
- Animações sutis (não distrair)
- Loading states claros
- Feedback imediato ao clicar
- Breadcrumbs visíveis

### Performance
- Lazy load componentes pesados
- Otimizar imagens dos produtos
- Cache de cálculos

---

## 🐛 TROUBLESHOOTING

### Problema: Assinatura não aparece pré-selecionada
```typescript
// Verificar SubscriptionContext
const { mode } = useSubscription();
console.log('Mode atual:', mode); // Deve ser 'subscription'

// Se não estiver, verificar INITIAL_STATE em SubscriptionContext.tsx
const INITIAL_STATE = {
  mode: 'subscription', // ← deve ser 'subscription'
  frequency: 45,
  ...
};
```

### Problema: Economia não calcula
```typescript
// Verificar se calculations existe
console.log('Calculations:', calculations);

// Se null, verificar se há produtos selecionados
console.log('Selected products:', selectedProducts);
```

### Problema: Recomendação não aparece
```typescript
// Verificar lawnData
console.log('Lawn data:', lawnData);

// Se undefined, garantir que CalculatorContext está fornecendo
```

---

## 📚 RECURSOS

- **Componente**: `src/components/calculator/CalculatorResultSubscription.tsx`
- **Hooks**: `src/hooks/useSubscription.ts`
- **Context**: `src/contexts/SubscriptionContext.tsx`
- **Pricing**: `src/lib/subscription/pricing.ts`
- **Docs**: `SUBSCRIPTION_SYSTEM.md`

---

**Desenvolvido por**: Terravik Team  
**Data**: 02/02/2026  
**Versão**: 1.0  
**Status**: ✅ Pronto para teste
