# 📋 CHEAT SHEET - TERRAVIK

## ⚡ COMANDOS ESSENCIAIS

```bash
# Iniciar servidor
npm run dev

# Limpar cache
rm -rf .next node_modules/.cache

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 🌐 URLS IMPORTANTES

```
Home: http://localhost:3000
Produto: http://localhost:3000/produtos/gramado-novo
Calculadora: http://localhost:3000/calculadora
Assinatura: http://localhost:3000/assinatura
```

---

## 📂 ARQUIVOS CHAVE

### Sistema de Assinatura
```
src/components/product/PurchaseSection.tsx        ← Orquestrador
src/lib/subscription/pricing.ts                   ← Cálculos
```

### Carrinho Mock
```
src/lib/shopify/mock-cart.ts                      ← Mock cart
src/lib/shopify/mappers.ts                        ← Normalização
src/components/cart/CartProvider.tsx              ← Provider
```

### Configuração
```
.env.local                                        ← Variáveis
tailwind.config.ts                                ← Design system
```

---

## 🎨 COMPONENTES CRIADOS

```
PurchaseSection          Container principal
├── PriceDisplay         Preço dinâmico
├── PurchaseModeToggle   Toggle compra/assinatura
├── FrequencyPicker      Seletor 30/45/60/90 dias
├── SavingsHighlight     Card verde de economia
├── AddToCartSection     Botão + quantidade
├── SubscriptionBenefits Badges de benefícios
└── TrustSignals         Indicadores de confiança
```

---

## 🧮 CÁLCULOS PRINCIPAIS

```typescript
// Desconto percentual (ex: 12 para 12%)
getDiscountPercent(45) → 12

// Preço de assinatura
calculateSubscriptionPrice(29.90, 45) → 26.11

// Economia anual
calculateAnnualSavings(29.90, 45, 1) → 30.32

// Entregas por ano
getDeliveriesPerYear(45) → 8

// Analogia
getSavingsAnalogy(30.32) → "aquele livro que você quer"
```

---

## 💰 DESCONTOS POR FREQUÊNCIA

```
30 dias → 10% off
45 dias → 12% off  ⭐ Recomendado
60 dias → 15% off
90 dias → 18% off  💰 Maior economia
```

---

## 🎯 CHECKLIST DE VALIDAÇÃO

### Visual (5 items)
- [ ] Toggle aparece
- [ ] Assinatura pré-selecionada
- [ ] Preço com desconto
- [ ] Seletor de frequência
- [ ] Card de economia

### Funcional (4 items)
- [ ] Trocar modo funciona
- [ ] Trocar frequência recalcula
- [ ] Quantidade multiplica
- [ ] Adicionar ao carrinho OK

### Console (2 items)
- [ ] Sem erro de import
- [ ] Sem erro de reduce

---

## 🐛 ERROS COMUNS

### Erro de Import
```
'getDiscountPercent' is not exported
```
**Solução**: Ver `CORRECAO_PRICING_FUNCTIONS.md`

### Erro de Reduce
```
Cannot read properties of undefined (reading 'reduce')
```
**Solução**: Ver `CORRECAO_MOCK_CART.md`

### Erro de Undefined API
```
https://undefined/api/2024-10/graphql.json
```
**Solução**: Verificar `.env.local` existe

---

## 📚 DOCUMENTAÇÃO POR ASSUNTO

### 🚀 Testes
- TESTE_AGORA_3_PASSOS.md (1 min)
- TESTE_ASSINATURA_PRODUTO.md (5 min)
- TESTE_CARRINHO_AGORA.md (2 min)

### 📖 Técnica
- IMPLEMENTACAO_COMPLETA_ASSINATURA.md ⭐
- INTEGRACAO_ASSINATURA_PRODUTO.md
- RESUMO_FINAL_IMPLEMENTACAO.md

### 🔧 Correções
- CORRECAO_MOCK_CART.md
- CORRECAO_PRICING_FUNCTIONS.md

### 🎨 Visual
- VISUAL_REFERENCE_ASSINATURA.md

### 📊 Histórico
- DASHBOARD_DOCUMENTATION.md
- INTEGRATION_CALCULATOR_SUBSCRIPTION.md
- SHOPIFY_INTEGRATION.md
- IMPLEMENTATION_SUMMARY.md
- STATUS_FINAL_E_PROXIMOS_PASSOS.md

---

## 🎨 CORES PRINCIPAIS

```css
/* Assinatura */
emerald-600: #059669
emerald-50: #f0fdf4

/* Compra Única */
neutral-900: #171717
neutral-200: #e5e5e5

/* Aviso */
amber-900: #78350f
amber-50: #fffbeb

/* Popular */
amber-400: #fbbf24
orange-400: #fb923c
```

---

## 📱 RESPONSIVIDADE

```
Mobile: < 640px  → Stack vertical
Tablet: 768px    → 2 colunas
Desktop: 1024px  → 2 colunas largo
```

---

## ⚙️ VARIÁVEIS DE AMBIENTE

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-10
```

---

## 🎯 PRÓXIMA AÇÃO

**AGORA**:
```bash
npm run dev
# Abrir: http://localhost:3000/produtos/gramado-novo
# Testar: 1 minuto
```

**DEPOIS**:
- Mobile test
- Analytics
- Shopify integration

---

## 📞 NAVEGAÇÃO

**INÍCIO**: TESTE_AGORA_3_PASSOS.md  
**ÍNDICE**: INDICE_DOCUMENTACAO.md  
**COMPLETO**: IMPLEMENTACAO_COMPLETA_ASSINATURA.md  

---

**Tudo em um lugar! 🎊**
