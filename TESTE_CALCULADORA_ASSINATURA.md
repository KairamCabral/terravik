# 🎯 TESTE RÁPIDO - CALCULADORA → ASSINATURA

## 3 Passos para Testar

### 1️⃣ Acessar (30 segundos)
```
http://localhost:3001/calculadora
```

### 2️⃣ Preencher (2 minutos)
- Área: 100m²
- Completar todos os passos
- Chegar no resultado

### 3️⃣ Testar Oferta (1 minuto)
- [ ] Toggle Compra/Assinatura funciona?
- [ ] Seletor de frequência funciona?
- [ ] Economia anual aparece?
- [ ] Botão adiciona ao carrinho?
- [ ] Carrinho abre?

---

## ✅ Checklist Visual

### Header da Oferta
- [ ] Mostra área do gramado (ex: "100m²")
- [ ] Cor verde Terravik
- [ ] Ícone Sparkles

### Produto
- [ ] Imagem aparece
- [ ] Nome correto
- [ ] Quantidade correta

### Toggle
- [ ] Compra única: preço cheio
- [ ] Assinatura: preço com desconto
- [ ] Badge "POPULAR" aparece

### Frequências
- [ ] 4 opções (30/45/60/90)
- [ ] Tags aparecem
- [ ] Desconto correto

### Economia
- [ ] Card verde com valor
- [ ] Analogia tangível
- [ ] Emoji

### Aviso de Perda
- [ ] Aparece ao escolher compra única
- [ ] CTA "Quero economizar"
- [ ] Volta para assinatura

### Botão Final
- [ ] Texto muda (Assinar / Adicionar)
- [ ] Loading funciona
- [ ] Feedback visual

---

## 🐛 O Que Verificar no Console

```javascript
// Deve aparecer ao adicionar:
"Produto adicionado ao carrinho via calculadora"
```

---

## 📱 Mobile (DevTools F12)

1. Device: iPhone 12 Pro
2. Verificar:
   - [ ] Toggle não quebra
   - [ ] Frequências em grid 4 colunas
   - [ ] Botão full-width

---

## ⏱️ Tempo Total: ~3 minutos

Se tudo funcionar → ✅ PRONTO PARA PRODUÇÃO!
