# GUIA DE MIGRAÇÃO - REDESIGN PREMIUM

## Status: ⚠️ AÇÃO NECESSÁRIA

Após implementar o redesign premium, alguns ajustes são necessários no código existente para garantir compatibilidade total.

---

## 🔧 CORREÇÕES NECESSÁRIAS

### 1. Button Variant "outline" → "secondary"

A variante `outline` foi renomeada para `secondary` no redesign premium.

**Encontrar e substituir em todos os arquivos:**

```typescript
// ANTES
<Button variant="outline">

// DEPOIS
<Button variant="secondary">
```

**Arquivos afetados (11 arquivos):**
- `src/app/assinatura/SubscriptionLandingPage.tsx`
- `src/app/error.tsx`
- `src/app/not-found.tsx`
- `src/components/calculator/CalculatorResult.tsx`
- `src/components/contact/ContactForm.tsx`
- `src/components/home/ProductsShowcase.tsx`
- `src/components/locations/LocationCard.tsx`
- `src/components/product/ProductFilters.tsx`
- `src/components/representatives/FindRepresentative.tsx`
- `src/components/subscription/PurchaseToggle.tsx`
- `src/components/subscription/SmartRecommendation.tsx`

**Como corrigir em massa:**

```bash
# PowerShell (Windows)
Get-ChildItem -Path "src" -Recurse -Filter "*.tsx" | ForEach-Object {
  (Get-Content $_.FullName) -replace 'variant="outline"', 'variant="secondary"' | Set-Content $_.FullName
}

# Bash (Linux/Mac)
find src -name "*.tsx" -type f -exec sed -i 's/variant="outline"/variant="secondary"/g' {} +
```

---

### 2. Modal Props - isOpen → open

O componente Modal teve uma atualização de prop.

**Arquivo afetado:**
- `src/components/subscription/PurchaseToggle.tsx:247`

**Antes:**
```typescript
<Modal
  isOpen={modalOpen}
  onClose={closeModal}
  title="Detalhes da Assinatura"
>
```

**Depois:**
```typescript
<Modal
  open={modalOpen}
  onClose={closeModal}
  title="Detalhes da Assinatura"
>
```

---

### 3. SubscriptionCard - Conditional Variant

**Arquivo afetado:**
- `src/components/subscription/SubscriptionCard.tsx:164`

**Antes:**
```typescript
<Button variant={highlighted ? 'primary' : 'outline'}>
```

**Depois:**
```typescript
<Button variant={highlighted ? 'primary' : 'secondary'}>
```

---

### 4. Calculator Context - lawnData Property

**Arquivo afetado:**
- `src/app/assinatura/SubscriptionLandingPage.tsx:34`

**Erro:**
```
Property 'lawnData' does not exist on type CalculatorContext
```

**Solução:**
Verificar a tipagem do `CalculatorContext` e usar a propriedade correta (possivelmente `answers` ou similar).

---

## ✅ CORREÇÃO AUTOMÁTICA RECOMENDADA

Execute este comando no terminal (PowerShell):

```powershell
# Navegar para o diretório do projeto
cd "d:\2 PESSOAL\0 CURSOR\Terravik\terravik-store"

# Substituir variant="outline" por variant="secondary"
Get-ChildItem -Path "src" -Recurse -Filter "*.tsx" | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  $content = $content -replace 'variant="outline"', 'variant="secondary"'
  Set-Content -Path $_.FullName -Value $content -NoNewline
}

Write-Host "✅ Substituições concluídas!"
```

---

## 🔍 VERIFICAÇÃO PÓS-MIGRAÇÃO

Após fazer as correções, execute:

```bash
# Verificar tipos TypeScript
npm run type-check

# Verificar linter
npm run lint

# Build de produção (teste)
npm run build

# Rodar dev server
npm run dev
```

---

## 📝 MUDANÇAS NO BUTTON COMPONENT

### Variantes Disponíveis

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'premium' | 'ghost' | 'danger'
```

**Descrição:**
- `primary`: Verde escuro, ação principal (ex: "Adicionar ao Carrinho")
- `secondary`: Outline verde, ação secundária (ex: "Ver Detalhes") - **ANTES ERA "outline"**
- `premium`: Gradiente dourado, CTAs especiais (ex: "Assinar Premium")
- `ghost`: Transparente, ações terciárias (ex: "Cancelar")
- `danger`: Vermelho, ações destrutivas (ex: "Excluir")

### Tamanhos Disponíveis

```typescript
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
```

**Descrição:**
- `sm`: 36px altura (h-9)
- `md`: 44px altura (h-11) - **PADRÃO**
- `lg`: 56px altura (h-14)
- `xl`: 64px altura (h-16) - para Hero CTAs

---

## 🎨 GUIA DE USO - VARIANTES

### Quando usar cada variante:

**PRIMARY (verde escuro):**
- Adicionar ao carrinho
- Finalizar compra
- Confirmar ação importante
- Call-to-action principal da página

**SECONDARY (outline verde):**
- Ver mais detalhes
- Expandir seção
- Ação alternativa
- Navegação secundária
- Filtros e ordenação

**PREMIUM (gradiente dourado):**
- Assinar plano premium
- Upgrade de conta
- Ofertas especiais
- CTAs de conversão premium
- "Calcular Dose" (CTA especial da Terravik)

**GHOST (transparente):**
- Fechar modal
- Cancelar ação
- Links discretos
- Ações terciárias
- Ícones clicáveis

**DANGER (vermelho):**
- Excluir item
- Remover do carrinho
- Cancelar assinatura
- Ações irreversíveis

---

## 📋 CHECKLIST DE MIGRAÇÃO

- [ ] Substituir todas as ocorrências de `variant="outline"` por `variant="secondary"`
- [ ] Corrigir Modal props (`isOpen` → `open`)
- [ ] Corrigir `SubscriptionCard` variant condicional
- [ ] Verificar `lawnData` no `SubscriptionLandingPage`
- [ ] Executar `npm run type-check` (sem erros)
- [ ] Executar `npm run lint` (sem erros)
- [ ] Testar build: `npm run build` (sucesso)
- [ ] Testar visualmente todas as páginas
- [ ] Verificar responsividade mobile
- [ ] Testar interações de hover/focus
- [ ] Verificar animações Framer Motion
- [ ] Validar acessibilidade (foco, contraste)

---

## 🚨 SE ALGO DER ERRADO

### Reverter para versão anterior do Button

Se necessário, você pode restaurar a variante `outline` adicionando-a de volta:

```typescript
// src/components/ui/Button.tsx
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'premium' | 'ghost' | 'danger'
  // ...
}

const variants = {
  // ... outras variantes
  outline: 'bg-transparent text-forest border-2 border-forest hover:bg-forest hover:text-white',
}
```

Mas **NÃO É RECOMENDADO**. Prefira usar `secondary` que é semanticamente mais correto.

---

## 💡 DICAS

1. **Use VSCode Search/Replace:**
   - Pressione `Ctrl+Shift+H` (Windows) ou `Cmd+Shift+H` (Mac)
   - Busque: `variant="outline"`
   - Substitua: `variant="secondary"`
   - Clique em "Replace All"

2. **Teste incremental:**
   - Corrija um arquivo por vez
   - Teste visualmente após cada correção
   - Commit frequente no Git

3. **Backup:**
   - Faça commit antes de iniciar as correções
   - Assim você pode reverter se necessário

---

**Data:** 02/02/2026  
**Autor:** Claude Sonnet 4.5  
**Versão:** 1.0.0
