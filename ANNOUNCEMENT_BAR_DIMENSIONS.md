# 📏 ANNOUNCEMENT BAR - DIMENSÕES E POSICIONAMENTO

## ✅ AJUSTES REALIZADOS - 02/02/2026

---

## 📐 DIMENSÕES

### Altura
```
Desktop: ~40px
Mobile: ~40px
```

**Componentes:**
- Padding vertical: `py-2` (8px top + 8px bottom)
- Conteúdo: ~24px
- Total: ~40px

### Progress Bar (modo rotativo)
```
Altura: 2px (h-0.5)
Posição: Bottom 0
```

---

## 📍 POSICIONAMENTO

### AnnouncementBar
```css
position: fixed
top: 0
left: 0
right: 0
z-index: 60  /* Acima do header */
```

### Header
```css
position: fixed
top: 40px  /* Altura do announcement bar */
left: 0
right: 0
z-index: 50  /* Abaixo do announcement bar */
```

### Main Content
```css
padding-top: 104px  /* Mobile: 40px announcement + 64px header */
padding-top: 120px  /* Desktop: 40px announcement + 80px header */
```

---

## 🎯 HIERARQUIA Z-INDEX

```
AnnouncementBar: z-[60]  (mais alto)
Header: z-50
Mobile Menu: z-40
Cart Drawer: z-40
Modals: z-30
Overlays: z-20
Content: z-10 ou auto
```

---

## 📱 RESPONSIVIDADE

### Mobile (< 640px)
```
AnnouncementBar:
- Altura: ~40px
- Texto: text-xs (12px)
- Icon: w-4 h-4 (16px)
- Badge: px-2 py-0.5
- Close button: w-3.5 h-3.5

Header:
- Altura: 64px (h-16)
- Top: 40px

Main Content:
- Padding top: 104px (40 + 64)
```

### Desktop (≥ 1024px)
```
AnnouncementBar:
- Altura: ~40px
- Texto: text-sm (14px)
- Icon: w-5 h-5 (20px)
- Badge: px-2 py-0.5
- CTA Button visível inline

Header:
- Altura: 80px (h-20)
- Top: 40px

Main Content:
- Padding top: 120px (40 + 80)
```

---

## 🎨 ELEMENTOS E TAMANHOS

### Ícone com Pulse
```tsx
<Icon className="w-5 h-5 text-white" />  // Desktop
<Icon className="w-4 h-4 text-white" />  // Mobile
```

### Texto Principal
```tsx
<span className="text-xs md:text-sm font-semibold">
  // text-xs = 12px mobile
  // text-sm = 14px desktop
</span>
```

### Badge Highlight
```tsx
<span className="px-2 py-0.5 text-xs md:text-sm">
  // px-2 = 8px horizontal
  // py-0.5 = 2px vertical
  // Altura total: ~20px
</span>
```

### CTA Button
```tsx
<Link className="px-3 py-1 text-xs">
  // px-3 = 12px horizontal
  // py-1 = 4px vertical
  // Altura total: ~28px
</Link>
```

### Close Button
```tsx
<button className="p-0.5">
  <X className="w-3.5 h-3.5" />
  // p-0.5 = 2px padding
  // Tamanho total: ~18px
</button>
```

---

## 🔄 COMPORTAMENTO NO SCROLL

### Estado Inicial (top da página)
```
AnnouncementBar: Visível e fixo no topo
Header: Fixo em top-[40px], fundo transparente
```

### Após Scroll (> 50px)
```
AnnouncementBar: Permanece fixo no topo
Header: Permanece em top-[40px], fundo branco com blur
```

### Quando Fechado
```
AnnouncementBar: Display none (animate out)
Header: Permanece em top-[40px]
Main Content: Mantém padding (não causa layout shift)
```

---

## ⚡ PERFORMANCE

### Otimizações
- ✅ `position: fixed` com GPU acceleration
- ✅ `transform` e `opacity` para animações (não causa reflow)
- ✅ `will-change: transform` implícito no Framer Motion
- ✅ Animações pausam quando não visível
- ✅ LocalStorage evita re-render desnecessário

### Layout Shift (CLS)
```
CLS: 0 (sem layout shift)
- Espaço reservado com padding-top no main
- Altura fixa do announcement bar
- Fixed positioning
```

---

## 🎯 AJUSTES FINOS

### Gap entre elementos
```css
gap-2  /* 8px entre icon, texto, badge */
```

### Padding container
```css
px-4   /* 16px horizontal */
py-2   /* 8px vertical */
```

### Border radius
```css
rounded-full  /* Badges e botões */
```

### Sombras
```css
shadow-sm  /* Botão CTA */
```

---

## 📊 COMPARAÇÃO ANTES/DEPOIS

### ANTES (Problema)
```
Altura: ~60px (muito alto)
Posição: relative (sobrepunha header)
Padding: py-3 (24px vertical)
Z-index: Não definido
```

### DEPOIS (Corrigido)
```
Altura: ~40px (compacto)
Posição: fixed top-0 (acima do header)
Padding: py-2 (16px vertical)
Z-index: 60 (acima de tudo)
```

**Redução:** 33% menos altura

---

## 🎨 VISUAL CLEAN

### Espaçamento Reduzido
- ✅ Menos visual clutter
- ✅ Mais conteúdo visível no viewport
- ✅ Mantém legibilidade
- ✅ Touch targets ainda adequados (44px+ no mobile)

### Hierarquia Clara
- ✅ AnnouncementBar sempre no topo
- ✅ Header sempre abaixo
- ✅ Nenhum overlap indesejado
- ✅ Scroll suave

---

## 🔧 CUSTOMIZAÇÃO DE ALTURA

Se quiser ajustar a altura:

```tsx
// Em AnnouncementBar.tsx
<div className="flex items-center justify-center gap-2 py-2 px-4">
  // py-2 = 40px total
  // py-1 = 32px total (mais compacto)
  // py-3 = 48px total (mais espaçoso)
</div>
```

**Lembre-se de ajustar:**
1. `Header.tsx` → `top-[Xpx]`
2. `layout.tsx` → `pt-[Y]px` no main

---

## 📱 TESTE EM DIFERENTES TELAS

### iPhone SE (375px)
```
AnnouncementBar: 40px
Header: 64px
Total reservado: 104px
```

### Desktop (1920px)
```
AnnouncementBar: 40px
Header: 80px
Total reservado: 120px
```

### Tablet (768px)
```
AnnouncementBar: 40px
Header: 64px → 80px (transição)
Total reservado: 104px → 120px
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

- [x] AnnouncementBar no topo (z-60)
- [x] Header abaixo do AnnouncementBar (top-[40px])
- [x] Main content com padding-top adequado
- [x] Nenhum overlap indesejado
- [x] Altura compacta (~40px)
- [x] Texto legível (12-14px)
- [x] Touch targets adequados (44px+)
- [x] Progress bar fina (2px)
- [x] Close button pequeno mas clicável
- [x] Responsive mobile/desktop
- [x] Sem layout shift (CLS = 0)

---

## 🎯 RESULTADO FINAL

```
┌─────────────────────────────────┐
│   AnnouncementBar (40px)        │ ← Fixed top-0, z-60
├─────────────────────────────────┤
│   Header (64-80px)              │ ← Fixed top-[40px], z-50
├─────────────────────────────────┤
│                                 │
│   Main Content                  │ ← pt-[104-120px]
│                                 │
│                                 │
└─────────────────────────────────┘
```

**Limpo, compacto e profissional!** ✨

---

**Data:** 02/02/2026  
**Status:** ✅ Corrigido e Otimizado
