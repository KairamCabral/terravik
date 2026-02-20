# 🧪 GUIA DE TESTE - ASSINATURA NA PÁGINA DE PRODUTO

## ⚡ TESTE EM 3 MINUTOS

### 🔧 PASSO 1: Reiniciar o Servidor

```bash
# Parar o servidor (Ctrl+C)
npm run dev
```

⏳ Aguardar: `✓ Ready in X seconds`

---

### 🌐 PASSO 2: Abrir a Página de Produto

**URL**: http://localhost:3000/produtos/gramado-novo

---

## ✅ CHECKLIST DE VALIDAÇÃO VISUAL

### 📱 LAYOUT INICIAL

Ao abrir a página, você DEVE ver:

```
┌─────────────────────────────────────────────────┐
│  [GALERIA]              [INFO DO PRODUTO]       │
│                                                  │
│  [Imagens]              Gramado Novo            │
│                         ★★★★★ (2 avaliações)    │
│                                                  │
│                         💰 R$ 24,56             │
│                         ~~R$ 29,90~~            │
│                         🏷️ -18% assinante       │
│                                                  │
│                         ─────────────────────   │
│                                                  │
│                         COMO VOCÊ QUER RECEBER? │
│                         🟢 2.847 famílias...    │
│                                                  │
│                         [Compra Única] [Assinar⭐]│
│                                                  │
│                         FREQUÊNCIA DE ENTREGA   │
│                         [30] [45✓] [60] [90]   │
│                                                  │
│                         💚 SUA ECONOMIA ANUAL   │
│                         R$ 21,60/ano            │
│                                                  │
│                         Quantidade: [-] 1 [+]   │
│                         [🛒 ASSINAR E ECONOMIZAR]│
│                                                  │
│                         ✓ Até 18% • Frete grátis│
└─────────────────────────────────────────────────┘
```

---

### 🎯 VALIDAÇÕES DETALHADAS

#### 1️⃣ PREÇO E DESCONTO

- [ ] **Preço principal**: R$ 24,56 (em negrito grande)
- [ ] **Preço riscado**: R$ 29,90 (em cinza)
- [ ] **Badge verde**: "🏷️ −18% assinante"
- [ ] **Texto abaixo**: "por entrega"

**Se passar de 1 para 2 unidades**:
- [ ] Preço muda para: R$ 49,12
- [ ] Badge continua: "−18% assinante"
- [ ] Aparece texto: "2 unidades × R$ 24,56 cada"

---

#### 2️⃣ TOGGLE COMPRA/ASSINATURA

**Estado Inicial** (Assinatura selecionada):
- [ ] Card **"Assinar"** está:
  - Com borda verde
  - Background gradiente emerald/teal
  - Check ✓ dentro do círculo verde
  - Badge diagonal: "POPULAR"
  - Texto: "−18%" + "(R$ 5,34 off)"
  - Abaixo: "+ Frete grátis sempre"
  - ✨ Ícone Sparkles ao lado de "Assinar"
  
- [ ] Card **"Compra Única"** está:
  - Com borda cinza
  - Background branco
  - Círculo vazio (sem check)

**Social Proof**:
- [ ] No topo: "🟢 2.847 famílias assinam" (ponto verde pulsando)

---

#### 3️⃣ SELETOR DE FREQUÊNCIA

Deve aparecer **apenas quando "Assinar" está selecionado**:

- [ ] Grid com 4 opções
- [ ] **45 dias** está selecionado (borda verde)
- [ ] Badge acima do 45: "MAIS ESCOLHIDO" (verde)
- [ ] Badge acima do 90: "MAIOR DESCONTO" (âmbar)
- [ ] Cada card tem:
  - Ícone no topo
  - Número de dias
  - Badge de desconto (−12%, −18%, −15%, −10%)
  - Barra verde embaixo do selecionado

**Descrição dinâmica abaixo**:
- [ ] "💡 Equilíbrio perfeito — Você recebe a cada 45 dias"

---

#### 4️⃣ CARD DE ECONOMIA ANUAL

Deve aparecer **apenas em modo assinatura**:

- [ ] **Background**: Gradiente verde-água brilhante
- [ ] **Ícone**: ✨ Sparkles em círculo branco transparente
- [ ] **Título**: "Sua economia anual"
- [ ] **Valor grande**: R$ 21,60/ano (texto branco, grande)
- [ ] **Analogia**: "💡 Com esse valor você poderia ter alguns cafés especiais"
- [ ] **Stats em grid 2x2**:
  - Entregas/ano: 8
  - Economia/entrega: R$ 2,70
- [ ] **Padrões decorativos**: Círculos brancos desfocados no fundo

---

#### 5️⃣ BOTÃO ADICIONAR AO CARRINHO

**Em modo Assinatura**:
- [ ] Background: **Gradiente verde** (emerald → teal)
- [ ] Texto: **"🛒 Assinar e economizar"**
- [ ] **Efeito shimmer**: Brilho passa pela superfície a cada ~5s
- [ ] Hover: Botão cresce levemente (scale 1.01)
- [ ] Shadow: Verde brilhante

**Em modo Compra Única**:
- [ ] Background: **Preto/cinza escuro**
- [ ] Texto: **"🛒 Adicionar ao carrinho"**
- [ ] Sem shimmer

**Seletor de Quantidade**:
- [ ] Botão **[-]** e **[+]** com borda
- [ ] Número no centro
- [ ] Hover: Background cinza claro

**Texto extra** (apenas em assinatura):
- [ ] "Primeira entrega em até 7 dias • Cancele quando quiser"

---

#### 6️⃣ BENEFÍCIOS COMPACTOS

Aparecem **após interagir** com o toggle (modo assinatura):

- [ ] 4 badges horizontais:
  - 💰 Até 18% off
  - 🚚 Frete grátis
  - 📅 Flexível
  - ❌ Cancele grátis
- [ ] Background: Verde claro
- [ ] Aparecem com animação sequencial (stagger)

---

#### 7️⃣ TRUST SIGNALS (BASE)

Na parte inferior:

- [ ] 4 ícones pequenos em linha:
  - 🛡️ Compra segura
  - 🚚 Entrega garantida
  - 🔄 Troca grátis
  - 💳 Parcele em até 12x
- [ ] Texto cinza pequeno
- [ ] Borda superior sutil

---

## 🔄 TESTE DE INTERAÇÕES

### INTERAÇÃO 1: Trocar para "Compra Única"

**Ação**: Clicar no card "Compra Única"

**Resultado esperado**:
1. ✅ Check move para "Compra Única"
2. ✅ Preço muda: R$ 24,56 → **R$ 29,90**
3. ✅ Preço riscado **desaparece**
4. ✅ Badge muda: "por entrega" → "Compra única — sem desconto recorrente"
5. ✅ **Seletor de frequência desaparece** (animação height + opacity)
6. ✅ **Card de economia desaparece**
7. ✅ **Benefícios desaparecem**
8. ✅ Botão fica: **preto** com texto "Adicionar ao carrinho"
9. ✅ **AVISO AMARELO APARECE**:

```
┌────────────────────────────────────────────────┐
│ ⚠️  Você está deixando de economizar          │
│     R$ 21,60/ano                               │
│                                                │
│ Com a assinatura você recebe frete grátis...  │
│                                                │
│ [Quero economizar →]                           │
└────────────────────────────────────────────────┘
```

**Validar aviso**:
- [ ] Background: Gradiente amarelo/laranja claro
- [ ] Ícone: ⚠️ em círculo amarelo
- [ ] Texto em âmbar escuro
- [ ] Link sublinhado: "Quero economizar"
- [ ] Emoji 💸 decorativo desfocado no canto

---

### INTERAÇÃO 2: Clicar "Quero economizar"

**Ação**: Clicar no link do aviso

**Resultado esperado**:
1. ✅ Volta para modo "Assinar"
2. ✅ Aviso amarelo **desaparece**
3. ✅ Seletor de frequência **reaparece**
4. ✅ Card de economia **reaparece**
5. ✅ Preço volta para R$ 24,56
6. ✅ Botão volta para gradiente verde

---

### INTERAÇÃO 3: Trocar Frequência

**Ação**: Clicar em **"60 dias"**

**Resultado esperado**:
1. ✅ Barra verde **desliza** de 45 para 60 (animação suave)
2. ✅ Card 60 fica: borda verde, background verde claro
3. ✅ Card 45 volta: borda cinza, background branco
4. ✅ Preço **recalcula**:
   - R$ 24,56 (−18%) → **R$ 25,42** (−15%)
5. ✅ Badge muda: "−18%" → **"−15%"**
6. ✅ Preço riscado: R$ 29,90 (mantém)
7. ✅ Card de economia **recalcula**:
   - R$ 21,60/ano → **R$ 17,92/ano**
   - Entregas/ano: 8 → **6**
   - Economia/entrega: R$ 2,70 → **R$ 2,99**
8. ✅ Descrição muda: "💡 Gramado saudável — Você recebe a cada 60 dias"

---

### INTERAÇÃO 4: Aumentar Quantidade

**Ação**: Clicar no botão **[+]** duas vezes

**Resultado esperado**:
1. ✅ Quantidade: 1 → 2 → 3
2. ✅ Preço **multiplica**:
   - 1 un: R$ 24,56
   - 2 un: R$ 49,12
   - 3 un: R$ 73,68
3. ✅ Aparece texto: "3 unidades × R$ 24,56 cada"
4. ✅ Card de economia **recalcula**:
   - R$ 21,60/ano → **R$ 64,80/ano** (3x mais)
   - Analogia muda: "alguns cafés" → "um jantar delivery"
5. ✅ Preço riscado também multiplica:
   - R$ 29,90 → R$ 89,70

---

### INTERAÇÃO 5: Adicionar ao Carrinho

**Ação**: Clicar no botão **"Assinar e economizar"**

**Resultado esperado**:
1. ✅ Botão muda: "Adicionando..." + spinner
2. ✅ Após ~1s: "✓ Adicionado!" (verde)
3. ✅ **Drawer do carrinho abre** à direita
4. ✅ Produto aparece no carrinho
5. ✅ Botão volta ao normal após 2s

---

## 🎭 TESTE DE ANIMAÇÕES

### Animações para Validar:

1. **Check no Toggle**:
   - [ ] Animação spring (bola elástica)
   - [ ] Duração: ~200ms

2. **Indicador de Frequência**:
   - [ ] Barra verde **desliza suavemente**
   - [ ] Não pula, move fluido
   - [ ] Usa `layoutId` (Framer Motion)

3. **Preço**:
   - [ ] Fade out + slide up (número antigo)
   - [ ] Fade in + slide down (número novo)
   - [ ] Duração: ~200ms

4. **Card de Economia**:
   - [ ] Fade in + scale (0.98 → 1)
   - [ ] Valor pulsa levemente ao mudar

5. **Seletor de Frequência**:
   - [ ] Aparece: height 0 → auto + opacity 0 → 1
   - [ ] Desaparece: height auto → 0 + opacity 1 → 0
   - [ ] Duração: ~300ms

6. **Aviso Amarelo**:
   - [ ] Scale (0.95 → 1) + fade in
   - [ ] Aparece suave, não pula

7. **Benefícios Compactos**:
   - [ ] Aparecem sequencialmente (delay 50ms cada)
   - [ ] Fade + slide up

8. **Shimmer no Botão**:
   - [ ] Brilho passa da esquerda → direita
   - [ ] Loop infinito a cada ~5s
   - [ ] Só aparece em modo assinatura

---

## 📱 TESTE MOBILE (OPCIONAL)

### 1. Ativar Device Toolbar

**DevTools (F12)** → **Toggle device toolbar** (Ctrl+Shift+M)

### 2. Escolher Device

- iPhone 12 Pro
- Samsung Galaxy S21
- Pixel 5

### 3. Validar Layout Mobile

- [ ] Toggle: 2 cards lado a lado (OK até 320px)
- [ ] Frequência: 4 cards em linha (pode ficar apertado em 320px)
- [ ] Card economia: OK
- [ ] Botão: Largura 100%
- [ ] Benefícios: Flex wrap OK
- [ ] Trust signals: Wrap OK

---

## 🐛 ERROS COMUNS

### "Cannot find module framer-motion"

```bash
npm install framer-motion lucide-react
```

### Preço não muda ao trocar frequência

**Verificar**:
- Console do navegador (F12)
- Erro de cálculo em `pricing.ts`?

### Animações não aparecem

**Verificar**:
- Tailwind compilou classes?
- Framer Motion está instalado?
- Console tem erros?

### Botão não adiciona ao carrinho

**Verificar**:
- Mock cart está ativo?
- `CartProvider` está no layout?
- Console mostra erro?

---

## ✅ CHECKLIST FINAL DE SUCESSO

Marque tudo que validou:

### Visual Básico
- [ ] Preço exibido corretamente
- [ ] Toggle aparece
- [ ] Assinatura pré-selecionada
- [ ] Seletor de frequência visível
- [ ] Card de economia aparece
- [ ] Botão verde com gradiente

### Interações
- [ ] Trocar para compra única funciona
- [ ] Aviso amarelo aparece
- [ ] Trocar frequência recalcula preço
- [ ] Aumentar quantidade multiplica total
- [ ] Adicionar ao carrinho funciona

### Animações
- [ ] Check tem spring
- [ ] Indicador de frequência desliza
- [ ] Preço faz fade
- [ ] Cards aparecem suave
- [ ] Shimmer visível no botão

### Mobile
- [ ] Layout responsivo funciona
- [ ] Todos elementos visíveis
- [ ] Touch funciona

---

## 🎉 RESULTADO ESPERADO

Se todos os itens estão ✅, você tem:

✨ **Sistema de assinatura PREMIUM integrado**  
✨ **Psicologia comportamental aplicada**  
✨ **Micro-interações encantadoras**  
✨ **Conversão otimizada**  

**Parabéns! A integração está perfeita! 🚀**

---

## 📊 MÉTRICAS PARA ACOMPANHAR

Após deploy em produção:

1. **Taxa de conversão geral** (antes vs depois)
2. **% de assinaturas vs compra única**
3. **Frequência mais escolhida** (45 dias?)
4. **Cliques no aviso "Quero economizar"**
5. **Ticket médio** (assinantes vs únicos)
6. **Taxa de abandono no carrinho**

---

**Teste completo! Se tudo funcionar, próximo passo: Deploy! 🚀**
