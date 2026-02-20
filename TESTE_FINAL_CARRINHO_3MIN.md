# 🎯 TESTE FINAL - ASSINATURA NO CARRINHO (3 MIN)

## ⚡ TESTE RÁPIDO

### 1. Acessar Produto (30s)
```
http://localhost:3003/produtos/gramado-novo
```

### 2. Configurar Assinatura (30s)
- [ ] Toggle para "Assinatura"
- [ ] Selecionar "45 dias"
- [ ] Quantidade: 2
- [ ] Ver preço: **R$ 79,11** (era R$ 89,90)

### 3. Adicionar ao Carrinho (30s)
- [ ] Clicar "Assinar e economizar"
- [ ] Ver feedback "Adicionando..."
- [ ] Ver "Adicionado!"
- [ ] Carrinho abre automaticamente

### 4. Verificar no Carrinho (90s)
- [ ] **Background verde claro** no item
- [ ] **Badge "🔄45d"** no canto da imagem
- [ ] **Badge "A cada 45 dias"** 
- [ ] **Badge "-12%"**
- [ ] **Preço R$ 79,11** (verde, destaque)
- [ ] **Preço R$ 89,90** (cinza, riscado)
- [ ] **Total R$ 158,22** (não R$ 179,80)
- [ ] **Box verde** "1 assinatura"
- [ ] **"Você está economizando: R$ 21,58"**

---

## 🧪 TESTES ADICIONAIS

### Teste A: Compra Única
```
1. Voltar ao produto
2. Toggle para "Compra única"
3. Adicionar ao carrinho
4. Verificar:
   - [ ] SEM background verde
   - [ ] SEM badges de assinatura
   - [ ] Preço: R$ 89,90 (normal)
```

### Teste B: Frequências Diferentes
```
1. Limpar carrinho
2. Adicionar: Assinatura 30 dias (x1)
3. Adicionar: Assinatura 45 dias (x1)
4. Adicionar: Assinatura 60 dias (x1)
5. Verificar:
   - [ ] 3 linhas separadas no carrinho
   - [ ] Badge "🔄30d", "🔄45d", "🔄60d"
   - [ ] Descontos: -10%, -12%, -15%
   - [ ] "3 assinaturas" no resumo
```

### Teste C: Mesmo Produto, Modos Diferentes
```
1. Limpar carrinho
2. Adicionar: Compra única (x1)
3. Adicionar: Assinatura 45d (x1)
4. Verificar:
   - [ ] 2 linhas no carrinho
   - [ ] Uma sem badge (compra única)
   - [ ] Uma com badge 🔄45d (assinatura)
   - [ ] "1 assinatura" no resumo
```

---

## 🔍 CONSOLE (F12)

### O que deve aparecer:
```
✅ [CartProvider] Adicionando ao mock cart: mock-p1-400g {purchaseMode: 'subscription', frequency: 45, ...}
✅ Item adicionado ao carrinho
```

### O que NÃO deve aparecer:
```
❌ TypeError: Cannot read properties...
❌ minVariantPrice undefined
```

---

## 📊 CÁLCULOS ESPERADOS

### Produto: Gramado Novo (R$ 89,90)
### Assinatura 45 dias, Quantidade 2

| Item | Valor |
|------|-------|
| Preço base unitário | R$ 89,90 |
| Desconto | 12% |
| Preço com desconto | R$ 79,11 |
| Economia por unidade | R$ 10,79 |
| Quantidade | 2 |
| **Total no carrinho** | **R$ 158,22** |
| **Economia total** | **R$ 21,58** |

---

## ✅ CHECKLIST VISUAL DO CARRINHO

```
┌─────────────────────────────────────┐
│ Seu Carrinho (2)               [X]  │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────┐    │ ← Verde claro
│ │ 🌱           Gramado Novo    │    │
│ │              🔄45d ←─────────┤    │ ← Badge no canto
│ │                              │    │
│ │ 🔄 A cada 45 dias  -12% ←────┤    │ ← Badges info
│ │                              │    │
│ │ R$ 79,11  R$ 89,90 ←─────────┤    │ ← Preços
│ │                              │    │
│ │ [ - ] 2 [ + ]         [🗑️]  │    │
│ │                              │    │
│ │ Total: R$ 158,22 ←───────────┤    │ ← Total correto
│ └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐    │ ← Box verde
│ │ 🔄 1 assinatura             │    │
│ │ Receba automaticamente •    │    │
│ │ Frete grátis •              │    │
│ │ Cancele quando quiser       │    │
│ └─────────────────────────────┘    │
│                                     │
│ Você está economizando: R$ 21,58   │ ← Economia
│                                     │
│ Subtotal         R$ 158,22         │
│                                     │
│ [Finalizar Compra]                 │
└─────────────────────────────────────┘
```

---

## 💡 SE DER ERRO

### Erro: "Produto não encontrado"
```
→ Verificar se está acessando um handle válido:
  - /produtos/gramado-novo
  - /produtos/verde-rapido
  - /produtos/gramado-forte
```

### Erro: "Variant não encontrado"
```
→ Verificar se o produto tem variants disponíveis
→ Consultar mock-data.ts para ver IDs corretos
```

### Carrinho não abre
```
→ F12 → Console → Ver erros
→ Verificar se CartProvider está funcionando
```

---

## ⏱️ Tempo Total: 3 minutos

Se tudo funcionar conforme esperado:
- ✅ Background verde
- ✅ Badges corretos
- ✅ Preço com desconto
- ✅ Economia visível
- ✅ Resumo de assinaturas

**→ Sistema 100% funcional e pronto para produção!** 🚀
