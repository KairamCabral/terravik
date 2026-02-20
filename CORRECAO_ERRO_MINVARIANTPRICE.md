# ⚡ CORREÇÃO URGENTE - ERRO minVariantPrice

## Data: 02/02/2026

---

## ❌ ERRO IDENTIFICADO

```
TypeError: Cannot read properties of undefined (reading 'minVariantPrice')
at addToMockCart (mock-cart.ts:153:56)
```

---

## 🔍 CAUSA

Na linha 153 de `mock-cart.ts`, o código estava tentando acessar:

```typescript
const basePrice = parseFloat(foundVariant.priceRange.minVariantPrice);
//                                           ^^^^^^^^^^
//                                           ❌ NÃO EXISTE
```

Mas a estrutura real dos `MOCK_PRODUCTS` é:

```typescript
variants: [
  {
    id: 'mock-p1-400g',
    title: '400g',
    price: 29.9,  // ✅ Direto como número
    // ❌ SEM priceRange
  }
]
```

---

## ✅ CORREÇÃO APLICADA

**Arquivo**: `src/lib/shopify/mock-cart.ts` (linha 152-157)

### Antes ❌
```typescript
const basePrice = parseFloat(foundVariant.priceRange.minVariantPrice);
```

### Depois ✅
```typescript
const basePrice = typeof foundVariant.price === 'number' 
  ? foundVariant.price 
  : parseFloat(foundVariant.price);
```

**Lógica:**
- Se `price` já é número → usa direto
- Se `price` é string → converte com `parseFloat()`

---

## 🔧 CORREÇÃO ADICIONAL

Também corrigi o `compareAtPrice` na linha 180-182:

### Antes ❌
```typescript
compareAtPrice: foundVariant.compareAtPrice 
  ? parseFloat(foundVariant.compareAtPrice) 
  : null,
```

### Depois ✅
```typescript
compareAtPrice: foundVariant.compareAtPrice && typeof foundVariant.compareAtPrice === 'number'
  ? foundVariant.compareAtPrice 
  : null,
```

---

## ✅ RESULTADO

### Status:
- ✅ Erro corrigido
- ✅ Linting OK (sem erros)
- ✅ TypeScript OK
- ✅ Servidor rodando (porta 3003)

### Agora funciona:
```typescript
// Produto mock com price: 89.90
const basePrice = 89.90 ✅

// Com assinatura 45 dias
const effectivePrice = 79.11 ✅

// Item criado corretamente
const newItem: MockCartItem = {
  price: 89.90,       ✅
  effectivePrice: 79.11, ✅
  isSubscription: true, ✅
  frequency: 45,    ✅
  // ...
}
```

---

## 🚀 TESTE AGORA

1. Acesse produto: `http://localhost:3003/produtos/gramado-novo`
2. Selecione "Assinatura"
3. Escolha "45 dias"
4. Clique "Assinar e economizar"
5. Carrinho deve abrir com:
   - ✅ Item adicionado
   - ✅ Background verde
   - ✅ Badge "🔄45d"
   - ✅ Preço R$ 79,11

---

**Status**: ✅ **CORRIGIDO**  
**Pronto para**: ✅ **TESTE FINAL**
