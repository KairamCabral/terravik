# 🚀 GUIA RÁPIDO: TESTAR INTEGRAÇÃO CALCULADORA + ASSINATURA

## ⚡ INÍCIO RÁPIDO (5 minutos)

### 1. Rodar o Projeto

```bash
cd d:\2 PESSOAL\0 CURSOR\Terravik\terravik-store
npm run dev
```

### 2. Testar Integração

Abrir: **http://localhost:3000/calculadora**

### 3. Preencher Calculadora

Use estes dados de teste:

```
❓ Qual a área do seu gramado?
   → 250 m²

❓ Você está implantando agora?
   → Não

❓ Qual seu objetivo?
   → Nutrição (manter verde)

❓ Como está o clima hoje?
   → Úmido

❓ Quanto sol o gramado recebe?
   → Sol pleno

❓ Tem sistema de irrigação?
   → Sim

❓ Qual o tráfego?
   → Médio

❓ Condição do gramado?
   → Estabelecido e saudável
```

### 4. Verificar Resultado ✨

**O que você DEVE ver**:

```
┌─────────────────────────────────────────────────────┐
│  ✅ Seu plano personalizado está pronto!           │
│                                                      │
│  📏 250m² | 🎯 Nutrição | 🌤️ Úmido                 │
├─────────────────────────────────────────────────────┤
│  Produtos recomendados                              │
│  [Cards dos produtos...]                            │
├─────────────────────────────────────────────────────┤
│  ⚡ RECOMENDADO PARA VOCÊ                           │
│                                                      │
│  Escolha como quer receber                          │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ [Toggle:]                                    │   │
│  │                                              │   │
│  │ [ Compra Única ]  [✓ Assinatura] ← VERDE!  │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  Frequência de entrega:                             │
│  [ ] 30 dias  [✓] 45 dias  [ ] 60  [ ] 90          │
│                                                      │
│  💰 ECONOMIA ANUAL: R$ 173,44                       │
│                                                      │
│  Benefícios:                                        │
│  ✓ Economize R$ 173/ano                            │
│  ✓ Frete grátis                                    │
│  ✓ Lembretes automáticos                           │
│  ✓ Cancele quando quiser                           │
│                                                      │
│  [🛒 Assinar e economizar]  [Refazer cálculo]     │
└─────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE TESTE (2 minutos)

Interagir com o resultado:

### Testes Visuais
- [ ] **Toggle aparece?** (2 botões lado a lado)
- [ ] **Assinatura está verde?** (pré-selecionada)
- [ ] **Seletor de frequência aparece?** (4 opções)
- [ ] **Economia é mostrada?** (valor em R$)
- [ ] **4 benefícios aparecem?** (com ícones)
- [ ] **CTA "Assinar e economizar"** está visível?

### Testes de Interação
- [ ] **Click em 60 dias**: Economia aumenta?
- [ ] **Click em "Compra Única"**: Aviso vermelho aparece?
- [ ] **Voltar para "Assinatura"**: Aviso desaparece?
- [ ] **Click em "Assinar e economizar"**: Console.log mostra dados?

### Mobile (opcional)
- [ ] **Abrir em celular** ou DevTools (F12 > Toggle device)
- [ ] **Tudo empilha verticalmente?**
- [ ] **Botões são clicáveis?**

---

## 🐛 TROUBLESHOOTING

### Problema: Página fica branca

```bash
# Verificar erros no console (F12)
# Geralmente é import errado

# Abrir DevTools e ver mensagem de erro
# Procurar por:
# - "Cannot find module"
# - "is not defined"
# - "Unexpected token"
```

**Solução comum**:
```typescript
// Verificar imports no CalculatorResultSubscription.tsx
import { useSubscription } from '@/hooks/useSubscription'  // ← deve existir
import { PurchaseToggle } from '@/components/subscription' // ← deve existir
```

### Problema: Toggle não aparece

**Causa**: SubscriptionProvider não está no layout

**Solução**:
```typescript
// Abrir: src/app/layout.tsx
// Verificar estrutura:

<SubscriptionProvider>
  <CartProvider>
    {children}
  </CartProvider>
</SubscriptionProvider>
```

### Problema: Economia não calcula

**Causa**: Nenhum produto selecionado

**Console**:
```typescript
// Abrir DevTools Console (F12)
// Verificar:
const { calculations } = useSubscription();
console.log('Calculations:', calculations); // ← deve ter valores
```

### Problema: Animações não funcionam

**Causa**: Framer Motion não instalado

**Solução**:
```bash
npm install framer-motion
npm run dev
```

---

## 📱 TESTE EM DIFERENTES TELAS

### Desktop (1440px+)
```
Layout em 2 colunas
Espaçamentos generosos
Imagens grandes
```

### Tablet (768px - 1024px)
```
Layout se adapta
Grid de 2 colunas
Toggle horizontal
```

### Mobile (< 768px)
```
Tudo empilhado
Toggle em coluna
CTA full-width
```

**Como testar**: F12 > Toggle Device Toolbar

---

## 🎯 PRÓXIMO PASSO

**Se tudo funcionar**:
1. ✅ Testar outros dados na calculadora
2. ✅ Ver página `/assinatura` (landing dedicada)
3. ✅ Explorar componentes em `src/components/subscription/`

**Se algo não funcionar**:
1. ⚠️ Verificar console do navegador (F12)
2. ⚠️ Verificar terminal do npm run dev
3. ⚠️ Consultar `INTEGRATION_CALCULATOR_SUBSCRIPTION.md`

---

## 📚 DOCUMENTAÇÃO COMPLETA

Arquivos criados na raiz do projeto:

1. **`SUBSCRIPTION_SYSTEM.md`** (800+ linhas)
   - Documentação completa do sistema
   - Uso de cada componente
   - Exemplos de código

2. **`SHOPIFY_INTEGRATION.md`** (500+ linhas)
   - Como integrar com Shopify
   - Selling Plans setup
   - Webhooks e APIs

3. **`INTEGRATION_CALCULATOR_SUBSCRIPTION.md`** (700+ linhas)
   - Esta integração específica
   - Psicologia aplicada
   - Troubleshooting detalhado

4. **`EXECUTION_CHECKLIST.md`** (1000+ linhas)
   - Checklist completo de execução
   - 9 sessões passo a passo
   - Validações finais

5. **`IMPLEMENTATION_SUMMARY.md`** (400+ linhas)
   - Resumo executivo
   - Estatísticas do projeto
   - Status de cada fase

---

## 🎉 SUCESSO!

**Se você vê**:
- ✅ Toggle funcionando
- ✅ Economia calculando
- ✅ Animações suaves
- ✅ Mobile responsivo

**Então**: INTEGRAÇÃO COMPLETA! 🎊

Você tem agora o sistema mais avançado de assinaturas para e-commerce de gramados do Brasil!

---

## 📞 SUPORTE

**Estrutura de arquivos**:
```
src/
├── components/
│   ├── calculator/
│   │   └── CalculatorResultSubscription.tsx  ← NOVO
│   └── subscription/                          ← 10 componentes
├── hooks/
│   └── useSubscription.ts                     ← 5 hooks
├── lib/
│   └── subscription/                          ← Lógica de negócio
└── contexts/
    └── SubscriptionContext.tsx                ← Estado global
```

**Em caso de dúvida**:
1. Ler documentação completa (arquivos MD)
2. Ver comentários inline nos arquivos
3. Consultar exemplos nos componentes existentes

---

**Desenvolvido com ❤️ para Terravik**  
**Data**: 02/02/2026  
**Versão**: 1.0  
**Status**: ✅ Pronto para teste
