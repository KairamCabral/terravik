# Header UI/UX - Técnicas Avançadas

## Melhorias Implementadas

### 1. **Alinhamento Perfeito (Optical Alignment)**

#### Container Principal
```tsx
<div className="flex h-16 lg:h-20 items-center justify-between">
```
- Altura fixa para prevenir layout shift
- `justify-between` para distribuição perfeita
- `items-center` para alinhamento vertical preciso

#### Logo
- `flex-shrink-0` previne compressão
- Largura proporcional mantida (`w-auto`)
- Transição suave no hover (`hover:opacity-80`)

#### Navegação Desktop
```tsx
<nav className="hidden lg:flex flex-1 justify-center px-8">
```
- `flex-1` permite expansão para centralização
- `px-8` cria respiro visual entre logo e ações
- `justify-center` garante navegação centralizada

#### Actions Group
```tsx
<div className="flex items-center gap-2">
```
- Gap consistente de 8px entre elementos
- Agrupamento visual de ícones relacionados

---

### 2. **Hierarquia Visual**

#### Consistência de Ícones
- **Todos os ícones**: `w-5 h-5` (20x20px)
- **Botões de ação**: `w-10 h-10` (40x40px)
- **Badges**: altura 16px, mínimo 16px de largura

#### Estados Visuais
1. **Default**: `text-neutral-700`
2. **Hover**: `text-forest` + `bg-neutral-100`
3. **Active**: Indicado por badge/underline

#### Separator
```tsx
<div className="w-px h-6 bg-neutral-200 mx-1" />
```
- Linha sutil de 1px
- Altura 24px para alinhamento óptico
- Margin horizontal de 4px

---

### 3. **Sistema de Badges**

#### Posicionamento Preciso
```tsx
className="absolute -right-0.5 -top-0.5"
```
- Offset negativo para sangrar do container
- Posicionamento consistente em todos badges

#### Design Visual
- **Favoritos**: `bg-red-500` (semântica de "amor")
- **Carrinho**: `bg-forest` (cor primária)
- **Font**: 9px, bold, branco
- **Tamanho**: altura 16px, min-width 16px
- **Shape**: `rounded-full` (círculo perfeito)

#### Anatomia do Badge
```tsx
<span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-forest px-1 text-[9px] font-bold text-white">
  {count}
</span>
```

---

### 4. **Spacing Rhythm (Ritmo de Espaçamento)**

Sistema baseado em 4px:
- **4px** (gap-1): Entre badges e bordas
- **8px** (gap-2): Entre ícones de ação
- **12px** (gap-3): Entre grupos funcionais
- **32px** (px-8): Padding da navegação

---

### 5. **Hover States Avançados**

#### Transições Suaves
```tsx
transition-colors  // Para cor
transition-all     // Para múltiplas propriedades
transition-shadow  // Para sombras
```

#### Efeitos Visuais
1. **Ícones**: Cor + Background
2. **Navegação**: Underline animado
3. **CTA**: Shadow elevation

#### Underline Hover
```tsx
after:content-[''] 
after:absolute 
after:bottom-0 
after:left-1/2 
after:-translate-x-1/2
after:w-0 
after:h-[2px] 
after:bg-forest 
after:rounded-full
after:transition-all 
after:duration-300 
hover:after:w-3/4
```
- Começa com `w-0` (invisível)
- Expande para 75% no hover
- Centralizado com `translate-x-1/2`
- 300ms de transição suave

---

### 6. **Responsividade Progressive**

#### Mobile First
```tsx
// Mobile: sempre sólido
bg-white

// Desktop: translúcido até scroll
lg:bg-white/95 lg:backdrop-blur-md

// Scrolled: sólido com sombra
scrolled && 'shadow-md lg:bg-white'
```

#### Icon Group Consistency
```tsx
<div className="flex items-center gap-1">
  {/* Mesma estrutura mobile/desktop */}
</div>
```

---

### 7. **Acessibilidade (a11y)**

#### Labels Descritivos
```tsx
aria-label={`Favoritos (${favoritesCount})`}
title="Meus Favoritos"
```

#### Navegação
```tsx
aria-label="Navegação principal"
aria-expanded={mobileMenuOpen}
```

#### Focus States
- Todos botões têm estados de foco visíveis
- Ordem de tab lógica

---

### 8. **Performance**

#### Lazy Loading
```tsx
<Image priority /> // Para logo apenas
```

#### CSS Optimization
```tsx
className={cn(
  // Base classes
  'fixed top-[40px]',
  // Conditional
  scrolled && 'shadow-md'
)}
```

#### Render Optimization
- `useCallback` para handlers
- Memoização de contadores

---

## Ícones Implementados

| Elemento | Ícone | Cor | Badge |
|----------|-------|-----|-------|
| Favoritos | `Heart` | forest | red-500 |
| Conta | `User` | forest | - |
| Carrinho | `ShoppingCart` | forest | forest |
| Menu | `Menu` | neutral-700 | - |
| Calculadora | `Calculator` | white | - |

---

## Paleta de Cores Aplicada

```css
/* Texto */
text-neutral-700    /* Padrão */
text-forest         /* Hover/Active */
text-white          /* CTA */

/* Background */
bg-white            /* Header base */
bg-neutral-100      /* Hover state */
bg-forest           /* CTA + badge carrinho */
bg-red-500          /* Badge favoritos */

/* Border */
border-neutral-200  /* Separadores */
```

---

## Comparação: Antes vs Depois

### Antes
- Ícone genérico de dashboard
- Sem favoritos no header
- Alinhamento inconsistente
- Gaps variáveis
- Badges desalinhados

### Depois
- Ícone User semântico
- Favoritos com contador visual
- Alinhamento óptico perfeito
- Spacing rhythm 4/8/12px
- Badges posicionados precisamente
- Separator visual entre grupos
- Hover states consistentes
- Responsividade aprimorada

---

## Próximas Melhorias Possíveis

1. **Sticky behavior** mais avançado (header menor ao scrollar)
2. **Search bar** com autocomplete
3. **Notificações** dropdown
4. **Multi-currency** selector
5. **Idioma** selector
