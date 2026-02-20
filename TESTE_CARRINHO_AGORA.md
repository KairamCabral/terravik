# 🧪 TESTE O CARRINHO AGORA - GUIA RÁPIDO

## ⚡ TESTE EM 2 MINUTOS

### 1️⃣ Reiniciar o Servidor

```bash
# Parar o servidor atual (Ctrl+C no terminal)
npm run dev
```

⏳ **Aguarde** até ver:
```
✓ Ready in 3s
○ Local: http://localhost:3000
```

---

### 2️⃣ Abrir o Produto

**URL**: http://localhost:3000/produtos/gramado-novo

---

### 3️⃣ Adicionar ao Carrinho

1. Click no botão **"Adicionar ao Carrinho"**
2. **Aguardar** (~1 segundo)

**O que deve acontecer**:
```
Botão inicial: "🛒 Adicionar ao Carrinho"
        ↓
Botão loading: "🛒 Adicionando..."
        ↓
Botão sucesso: "✓ Adicionado!" (verde)
        ↓
Drawer abre automaticamente à direita
```

---

### 4️⃣ Verificar o Drawer

**O drawer deve mostrar**:

```
┌────────────────────────────────────────┐
│  Seu Carrinho (1)                     │
├────────────────────────────────────────┤
│  ┌──────────────────────────────────┐ │
│  │ [Imagem]  Gramado Novo           │ │
│  │           400g                    │ │
│  │           R$ 29,90                │ │
│  │                                   │ │
│  │  [-]  1  [+]     🗑️              │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Subtotal: R$ 29,90                   │
│  [Finalizar Compra]                   │
└────────────────────────────────────────┘
```

---

### 5️⃣ Testar Interações

#### Aumentar Quantidade
- Click no botão **[+]**
- Quantidade deve mudar: `1 → 2`
- Total deve atualizar: `R$ 29,90 → R$ 59,80`

#### Diminuir Quantidade
- Click no botão **[-]**
- Quantidade deve voltar: `2 → 1`
- Total deve voltar: `R$ 59,80 → R$ 29,90`

#### Remover Item
- Click no botão **🗑️**
- Item deve **desaparecer**
- Drawer deve mostrar: "Carrinho vazio"

---

### 6️⃣ Verificar Console (F12)

**Abrir DevTools**: F12 ou Ctrl+Shift+I

**Na aba Console, você DEVE ver**:
```
✅ [Shopify Client] Mock mode ativo - retornando erro controlado
✅ [CartProvider] Shopify falhou, usando mock cart: Error: MOCK_MODE_ACTIVE
✅ [CartProvider] Adicionando ao mock cart: mock-p1-400g
```

**Você NÃO DEVE ver**:
```
❌ TypeError: Cannot read properties of undefined
❌ https://undefined/api/2024-10/graphql.json
❌ Error at normalizeCartLine
❌ .reduce is not a function
```

---

### 7️⃣ Testar Múltiplos Produtos

1. **Adicionar Gramado Novo** (400g) → Drawer mostra 1 produto
2. **Ir para** `/produtos/verde-rapido`
3. **Adicionar Verde Rápido** (2,7kg) → Drawer mostra 2 produtos
4. **Verificar total**: R$ 29,90 + R$ 89,90 = R$ 119,80

---

### 8️⃣ Testar Persistência

1. **Adicionar 2 produtos** ao carrinho
2. **Recarregar página** (F5)
3. **Abrir carrinho** novamente (ícone no header)
4. **Produtos ainda devem estar lá!**

**Console deve mostrar**:
```
✅ [CartProvider] Carrinho mock encontrado, usando mock mode
```

---

## ✅ CHECKLIST DE SUCESSO

### Visual
- [ ] Botão "Adicionar ao Carrinho" funciona
- [ ] Drawer abre automaticamente
- [ ] Produto aparece com imagem
- [ ] Nome e variante corretos
- [ ] Preço exibido corretamente
- [ ] Botão + aumenta quantidade
- [ ] Botão - diminui quantidade
- [ ] Total atualiza automaticamente
- [ ] Botão 🗑️ remove item
- [ ] Múltiplos produtos podem ser adicionados

### Console
- [ ] Vê `[Shopify Client] Mock mode ativo`
- [ ] Vê `[CartProvider] Adicionando ao mock cart`
- [ ] **NÃO vê** erro de `undefined`
- [ ] **NÃO vê** erro de `.reduce`
- [ ] **NÃO vê** `TypeError`

### localStorage
- [ ] Abrir DevTools → Application → Local Storage
- [ ] Ver chave `terravik_mock_cart`
- [ ] Dados do carrinho salvos
- [ ] Carrinho persiste após F5

---

## 🎯 SE TUDO FUNCIONAR

**Parabéns! 🎉** O carrinho está **100% funcional**!

Você pode agora:
- ✅ Adicionar qualquer produto
- ✅ Gerenciar quantidades
- ✅ Ver totais calculados
- ✅ Carrinho persiste
- ✅ Integrar sistema de assinatura

**Próximo passo**: Adicionar toggle de assinatura na página de produto!

---

## 🐛 SE DER ERRO

### Erro Persiste

**Verificar**:
1. Servidor foi **reiniciado**?
2. Cache do navegador foi **limpo**?
3. Aba **anônima** foi testada?

**Se sim, me avise com**:
- Screenshot do erro
- Console completo (F12)
- Qual produto tentou adicionar

### Erro Diferente

Se aparecer um erro **diferente** do original, é progresso! Significa que a correção funcionou parcialmente.

**Me envie**:
- Novo erro exato
- Linha do erro
- Console completo

---

## 📱 TESTE EM MOBILE

**Opcional** mas recomendado:

1. F12 → Toggle Device Toolbar (Ctrl+Shift+M)
2. Escolher **iPhone 12 Pro** ou similar
3. Repetir teste
4. Verificar se drawer abre corretamente

---

## 🎊 RESULTADO ESPERADO

Após o teste bem-sucedido, você terá:

✅ **Carrinho mock funcionando perfeitamente**  
✅ **3 produtos disponíveis para teste**  
✅ **Persistência em localStorage**  
✅ **Base sólida para adicionar assinatura**  
✅ **Sistema pronto para integração Shopify real**

---

**AGORA: Reinicie o servidor e teste! ⚡**

**Tempo estimado**: 2 minutos para validar tudo! ⏱️
