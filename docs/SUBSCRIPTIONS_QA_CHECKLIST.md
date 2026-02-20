# ✅ Checklist de QA - Sistema de Assinaturas Terravik

## 📱 Responsividade

### Mobile (320px - 767px)

#### PurchaseToggle
- [ ] Botões empilhados verticalmente
- [ ] Texto legível em telas pequenas
- [ ] Badge de economia não sobrepõe conteúdo
- [ ] Touch targets mínimo de 44x44px

#### FrequencySelector
- [ ] Cards de frequência empilhados (1 coluna)
- [ ] Informações legíveis sem scroll horizontal
- [ ] Animações suaves em telas touch
- [ ] Badge "Recomendado" visível

#### SavingsCalculator
- [ ] Números grandes não quebram layout
- [ ] Analogias legíveis
- [ ] Animação de contagem funciona

#### SubscriptionDashboard
- [ ] Tabs navegáveis com swipe
- [ ] Cards de produtos empilhados
- [ ] Gráficos/estatísticas redimensionados
- [ ] Quick actions acessíveis

#### Landing Page `/assinatura`
- [ ] Hero image/gradient responsivo
- [ ] Seções empilhadas
- [ ] CTAs sempre visíveis
- [ ] FAQ expansível funciona

### Tablet (768px - 1023px)

#### Geral
- [ ] Layouts híbridos (2 colunas)
- [ ] Navegação horizontal quando apropriado
- [ ] Imagens em tamanho médio
- [ ] Espaçamentos adequados

### Desktop (1024px+)

#### Geral
- [ ] Máximo de largura respeitado (container-main)
- [ ] Grid de 3-4 colunas em componentes de lista
- [ ] Hover states funcionando
- [ ] Animações smooth

---

## ♿ Acessibilidade (WCAG 2.1 AA)

### Estrutura Semântica

- [ ] Headings hierárquicos (h1 → h2 → h3)
- [ ] Landmarks HTML5 (`<main>`, `<nav>`, `<section>`)
- [ ] Listas semânticas (`<ul>`, `<ol>`)
- [ ] Botões são `<button>` (não `<div>`)

### Navegação por Teclado

#### PurchaseToggle
- [ ] Tab navega entre opções
- [ ] Enter/Space seleciona
- [ ] Focus visível (outline)

#### FrequencySelector
- [ ] Tab navega entre frequências
- [ ] Arrow keys navegam dentro do grupo
- [ ] Enter/Space seleciona

#### Modais (PauseModal, CancellationFlow)
- [ ] Focus trap ativo quando aberto
- [ ] ESC fecha o modal
- [ ] Focus retorna ao trigger ao fechar
- [ ] Primeiro elemento focável recebe foco ao abrir

#### Forms
- [ ] Tab order lógico
- [ ] Labels associados a inputs (`htmlFor`)
- [ ] Enter submete form

### Contraste de Cores

- [ ] Texto normal: mínimo 4.5:1
- [ ] Texto grande (18px+): mínimo 3:1
- [ ] Ícones interativos: mínimo 3:1
- [ ] Botões disabled visualmente distintos

**Testar:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Screen Readers

#### Labels e Descrições
- [ ] Todos os buttons têm `aria-label` ou texto visível
- [ ] Inputs têm `aria-describedby` para erros
- [ ] Imagens decorativas têm `alt=""`
- [ ] Imagens informativas têm `alt` descritivo

#### Live Regions
- [ ] Calculadora de economia usa `aria-live="polite"`
- [ ] Erros de form usam `role="alert"`
- [ ] Loading states anunciados

#### Roles
- [ ] Tabs: `role="tablist"`, `role="tab"`, `role="tabpanel"`
- [ ] Tooltips: `role="tooltip"`
- [ ] Toasts: `role="status"` ou `role="alert"`

**Testar:** NVDA (Windows), VoiceOver (Mac/iOS), TalkBack (Android)

---

## 🎨 Animações

### Performance

- [ ] Usar `transform` e `opacity` (GPU-accelerated)
- [ ] Evitar `height`, `width`, `top`, `left` em animações
- [ ] FPS consistente acima de 60
- [ ] `will-change` apenas quando necessário

### Preferências do Usuário

```tsx
// Respeitar prefers-reduced-motion
const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={{ scale: shouldReduceMotion ? 1 : [1, 1.05, 1] }}
  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
>
```

- [ ] Animações desativadas se `prefers-reduced-motion: reduce`
- [ ] Transições essenciais mantidas (ex: fade)

### Timing

- [ ] Hover: 150ms
- [ ] Click feedback: 200ms
- [ ] Page transition: 300ms
- [ ] Complex animation: 400-600ms
- [ ] Nunca > 1s

### Framer Motion - Checklist

#### PurchaseToggle
- [ ] Troca de modo smooth (200ms)
- [ ] Badge de economia com spring
- [ ] Warning de perda com scale + opacity

#### SavingsCalculator
- [ ] Números animam de 0 ao valor real
- [ ] Duração: 600ms
- [ ] Easing: `easeOut`

#### FrequencySelector
- [ ] Seleção com scale (1 → 1.02 → 1)
- [ ] Border color transition 200ms
- [ ] Badge de desconto com pop

#### Modais
- [ ] Backdrop fade in/out 200ms
- [ ] Content scale + fade 300ms
- [ ] Exit animation completa antes de unmount

---

## 📊 Performance

### Core Web Vitals

- [ ] **LCP** (Largest Contentful Paint) < 2.5s
- [ ] **FID** (First Input Delay) < 100ms
- [ ] **CLS** (Cumulative Layout Shift) < 0.1

### Otimizações

#### Images
- [ ] Next.js `<Image>` component
- [ ] WebP/AVIF quando suportado
- [ ] Lazy loading fora do viewport
- [ ] Sizes adequados (não carregar 2000px em mobile)

#### JavaScript
- [ ] Code splitting por rota
- [ ] Dynamic imports para modais
- [ ] Tree shaking ativo
- [ ] Bundle < 200KB (gzipped)

#### CSS
- [ ] Tailwind CSS purge configurado
- [ ] Critical CSS inline
- [ ] Unused CSS removido

#### Fonts
- [ ] `font-display: swap`
- [ ] Preload de fontes críticas
- [ ] WOFF2 format

---

## 🧪 Testes Funcionais

### PurchaseToggle

#### Cenário 1: Trocar de assinatura para compra única
1. [ ] Assinatura pré-selecionada
2. [ ] Clicar em "Compra Única"
3. [ ] Warning de perda aparece
4. [ ] Clicar em "Confirmar"
5. [ ] Context atualizado (`mode: 'one-time'`)

#### Cenário 2: Cancelar troca
1. [ ] Clicar em "Compra Única"
2. [ ] Warning aparece
3. [ ] Clicar em "Cancelar"
4. [ ] Permanece em "Assinatura"

### FrequencySelector

#### Cenário 1: Selecionar frequência
1. [ ] 45 dias pré-selecionado
2. [ ] Clicar em 60 dias
3. [ ] Context atualizado (`frequency: 60`)
4. [ ] Preço recalculado
5. [ ] Desconto atualizado (15%)

### SavingsCalculator

#### Cenário 1: Calcular economia
1. [ ] basePrice = 89.90
2. [ ] frequency = 45
3. [ ] Mostrar economia por entrega: ~R$ 10.79
4. [ ] Mostrar economia anual: ~R$ 86.32
5. [ ] Analogia tangível exibida

### SubscriptionDashboard

#### Cenário 1: Navegar entre tabs
1. [ ] Tab "Overview" ativa por padrão
2. [ ] Clicar em "Entregas"
3. [ ] Conteúdo muda
4. [ ] Tab ativa visualmente destacada

#### Cenário 2: Pausar assinatura
1. [ ] Clicar em "Pausar"
2. [ ] Modal aberto
3. [ ] Selecionar 2 meses
4. [ ] Confirmar
5. [ ] Status → "paused"
6. [ ] Data de retorno calculada

### CancellationFlow

#### Cenário 1: Cancelar (retenção bem-sucedida)
1. [ ] Clicar em "Cancelar"
2. [ ] Etapa 1: Loss aversion (o que perde)
3. [ ] Clicar em "Continuar"
4. [ ] Etapa 2: Alternativas (pause/frequência)
5. [ ] Clicar em "Pausar ao invés"
6. [ ] Modal de pause aberto
7. [ ] Flow cancelado

#### Cenário 2: Cancelar (definitivo)
1. [ ] Etapa 1 → Continuar
2. [ ] Etapa 2 → "Sim, quero cancelar"
3. [ ] Etapa 3: Motivo + oferta
4. [ ] Selecionar motivo
5. [ ] Confirmar cancelamento
6. [ ] Status → "cancelled"
7. [ ] Código de retorno gerado

### API Routes

#### `/api/subscription/calculate`
```bash
# Request válido
curl -X POST http://localhost:3000/api/subscription/calculate \
  -H "Content-Type: application/json" \
  -d '{"products": [{"basePrice": 89.90, "quantity": 1}], "frequency": 45}'

# Deve retornar: 200 OK com calculation object
```

- [ ] Request válido: 200 OK
- [ ] Frequency inválida: 400 Bad Request
- [ ] Products vazio: 400 Bad Request

#### `/api/subscription/webhook`
- [ ] HMAC válido: 200 OK
- [ ] HMAC inválido: 401 Unauthorized
- [ ] Headers faltando: 401 Unauthorized
- [ ] Topic desconhecido: 200 OK (logged)

---

## 🔒 Segurança

### Frontend

- [ ] Nenhum token/secret hardcoded
- [ ] Validação de inputs antes de enviar
- [ ] HTTPS em produção
- [ ] CORS configurado

### Backend

- [ ] Validação de HMAC em webhooks
- [ ] Rate limiting em API routes
- [ ] Sanitização de inputs
- [ ] Logs sem dados sensíveis

---

## 📈 Analytics

### Eventos a Trackear

#### Conversão
- [ ] `subscription_toggle_changed` (one-time ↔ subscription)
- [ ] `subscription_frequency_selected`
- [ ] `subscription_created`
- [ ] `subscription_recommendation_accepted`

#### Retenção
- [ ] `subscription_paused`
- [ ] `subscription_cancel_started`
- [ ] `subscription_cancel_retained` (motivo)
- [ ] `subscription_cancelled` (motivo)

#### Engajamento
- [ ] `dashboard_tab_changed`
- [ ] `delivery_calendar_viewed`
- [ ] `savings_calculator_viewed`

---

## 🌐 Cross-Browser

### Navegadores Suportados

- [ ] Chrome/Edge (2 últimas versões)
- [ ] Firefox (2 últimas versões)
- [ ] Safari (2 últimas versões)
- [ ] Safari iOS (2 últimas versões)
- [ ] Chrome Android (2 últimas versões)

### Funcionalidades Críticas

- [ ] Animações Framer Motion
- [ ] localStorage (fallback se indisponível)
- [ ] Fetch API / async/await
- [ ] CSS Grid e Flexbox

---

## 📝 Conteúdo

### Copywriting

- [ ] Tom consistente (premium, acessível, confiável)
- [ ] CTA claros e acionáveis
- [ ] Números sempre formatados (R$ 89,90)
- [ ] Datas em pt-BR (DD/MM/AAAA)

### Erros e Feedback

- [ ] Mensagens de erro amigáveis
- [ ] Loading states informativos
- [ ] Success messages celebratórios
- [ ] Instruções claras em todos os passos

---

## 🚀 Deploy Checklist

### Antes do Deploy

- [ ] Todos os TODOs resolvidos ou documentados
- [ ] Testes manuais completos
- [ ] Lighthouse score > 90 (mobile e desktop)
- [ ] Nenhum console.error em produção
- [ ] Variáveis de ambiente configuradas

### Após o Deploy

- [ ] Testar em produção (staging primeiro)
- [ ] Verificar webhooks recebidos
- [ ] Monitorar erros (Sentry/similar)
- [ ] Analytics trackando corretamente
- [ ] A/B test setup (se aplicável)

---

## 🎯 Métricas de Sucesso

### Conversão
- **Meta:** >60% escolhem assinatura vs compra única
- **Como medir:** Analytics event `subscription_toggle_changed`

### Retenção no Cancelamento
- **Meta:** >30% retidos no `CancellationFlow`
- **Como medir:** Ratio `subscription_cancel_retained / subscription_cancel_started`

### Performance
- **Meta:** LCP < 2.5s, CLS < 0.1
- **Como medir:** Google PageSpeed Insights

### Acessibilidade
- **Meta:** Score 100 no Lighthouse Accessibility
- **Como medir:** Chrome DevTools Lighthouse

---

**Última atualização:** 04/02/2026  
**Versão:** 1.0
