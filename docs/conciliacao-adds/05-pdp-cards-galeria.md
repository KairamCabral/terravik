# Página de produto, cards e galeria

A rota da PDP no Terravik é `src/app/produtos/[handle]/`. Na ADDS é `[...slug]/`. Nenhum cherry-pick que toque
`ProductPageClient.tsx` ou `page.tsx` aplica. Tudo aqui é reimplementação com os tokens do Terravik.

Pré-requisitos comuns, sem UI: token de texto escuro sobre dourado (`gold-ink` ou `gold-500`, cerca de 4,8:1),
`lib/shopify/variant-options.ts`, `lib/shopify/color-swatches.ts` (só se houver opção de cor),
`lib/produtos/tags.ts` com as tags de gramado, `lib/utils/midia.ts`.

---

## P-01 Preço honesto
**Prio** P1 · **Esforço** P · **Risco** B · **Origem** `f1b10f0`, `8646541`

**Problema.** `PriceDisplay.tsx:32/66` risca `compareAtPrice` só por existir. A Shopify devolve
`compareAtPrice` igual ao preço sem promoção, então a PDP mostra "R$ 89,90 ~~R$ 89,90~~". Produto com preço zero
anuncia "R$ 0,00" e parcela de R$ 0,00. `VariantSelector` diz "Tamanho" fixo.

**Escopo.**
- Riscar só se `compareAtPrice > price`.
- `price <= 0`: bloco "Preço em definição" com link para contato, sem parcela, sem selo, sem oferta no JSON-LD.
- Rótulo da opção vem de `Object.keys(variants[0].options)[0]` (via `rotuloDaOpcao`). `fieldset` e `legend`.
- Selos `% OFF` com tinta escura que passe AA.

**Aceite.** PDP sem promoção não mostra valor riscado. Variante com preço zero mostra "Preço em definição".

---

## P-02 Card de produto único
**Prio** P2 · **Esforço** M · **Risco** M · **Origem** `1c1b2de`, `86e4899`

**Problema.** O Terravik tem quatro cards: `ProductCardPremium` inline em `ProductsPageClient.tsx:386-520`,
`ProductCard.tsx` (usado só pelo `ProductGrid`, que ninguém importa), card próprio em `/favoritos` e card de mock
na vitrine. Duas listas de rótulo de tag (`PRODUCT_BENEFITS` e `TAG_LABELS`). Packshot com `object-cover` cortado
em `ProductsPageClient.tsx:428-434`, `ProductCard.tsx:36-42` e `CartLine.tsx:69`. A listagem diz "N tamanhos"
fixo (linha 507).

**Escopo.**
1. Primeiro `1c1b2de`: `variant-options.ts` (`rotuloDaOpcao`, `rotuloNoPlural`, `valorDaOpcao`) e
   `object-contain` nos três lugares sobre a superfície creme.
2. Depois `86e4899`: o card premium vira `src/components/product/ProductCard.tsx`, único card de navegação.
   API `{ product, index?, featured?, acaoDoCoracao?: 'favoritar' | 'remover', onRemover?, prioridade? }`.
   Selos sobre a foto, coração à direita, chips de `chipsDoProduto(tags)` (máximo 2), "a partir de" quando há
   variação de preço.
3. `lib/produtos/tags.ts` com `TAGS_DE_PRODUTO`, `rotuloDaTag`, `chipsDoProduto`, usado também na PDP.

**Aceite.** `/produtos` e `/favoritos` desenham o mesmo card. A mesma tag tem o mesmo rótulo na listagem e na PDP.
Foto inteira nos três lugares.

---

## P-03 Galeria: foto inteira, zoom condicionado, tela cheia
**Prio** P1 · **Esforço** M · **Risco** B · **Origem** `1ac57b2`, `3b89ff6`, `33987a9` (só `min-w-0`)

Conferido em `ProductGallery.tsx` do Terravik:

- Linhas 99-100: `object-cover` e `scale-150` em qualquer foto. Trocar por `object-contain` e ligar a lente só com
  foto de 800 px ou mais em cada lado.
- Lightbox por volta da linha 294: caixa `max-h-[90vh] max-w-[90vw]` sem largura própria e filho `w-full`.
  Na ADDS media 0x0: foto carregada e invisível. Confirmar no navegador. Substituir por `GaleriaEmTelaCheia`:
  caixa do tamanho da tela, zoom no ponto clicado, setas, arrastar no celular, foco preso, Esc fecha, foco volta.
- Linhas 77-83: foto principal é `<div onClick>`. Dar `role="button"`, `tabIndex={0}` e Enter ou Espaço.
- Linhas 160-166: faixa de miniaturas sem `min-w-0`; com 5 fotos em 400 px a página rola de lado.

**Aceite.** Clicar na foto abre a foto inteira. Tab chega na foto e Enter abre. Em 405 px,
`scrollWidth === innerWidth`.

**Decisão de marca.** O fundo claro da tela cheia é da ADDS. No Terravik pode ficar escuro.

---

## P-04 Fluxo de compra na PDP
**Prio** P1 · **Esforço** M · **Risco** M · **Origem** `628d4d0`, `031df48`, `89f5967`

Conferido no Terravik:

| Defeito | Onde | Correção |
|---|---|---|
| barra fixa do celular coberta pela nav inferior (ambas `z-50`) e o botão só rola ao topo | `ProductPageClient.tsx:427`, `MobileBottomNav.tsx:33` | `z-[60]`, `pb-[max(0.75rem,env(safe-area-inset-bottom))]`, preço x quantidade, botão compra |
| quantidade é `<span>` | `AddToCartSection.tsx:92-96` | `<input inputMode="numeric">` com estado local, confirma no blur e no Enter, teto 999 |
| trocar a variante não troca a foto | galeria | prop `imagemDaVariante`; ajustar o índice durante o render, sem `useEffect` |
| disponibilidade do produto, não da variante | `ProductPageClient.tsx:133, 421` | `selectedVariant.available` |
| `?variant=` ignorado | PDP | ler depois do mount e gravar na URL ao trocar |
| alt "Foto 2 de 5" sem o produto | galeria | passar `title` |

Também: botão primário "Comprar agora" (adiciona e vai ao checkout, depende do `cartRef` de C-02) e secundário
"Adicionar ao carrinho". `freteSlot` entre a variante e a quantidade, para o simulador de C-07.

**Aceite.** Em 390 px a barra fixa aparece sobre a nav. "Comprar agora" na primeira compra chega ao checkout.
Digitar 12 atualiza o preço. Variante esgotada mostra indisponível.

---

## P-05 Vídeo de terceiro bloqueado pela CSP
**Prio** P2 · **Esforço** P · **Risco** B · **Origem** `b81014d`

`ProductPageClient.tsx:50-53` do Terravik mapeia os três produtos para o vídeo do YouTube `bjSMskOK6zg`
(Departamento de Agricultura de Maryland), e a `frame-src` não libera o YouTube. O botão "Assistir" abre
"conteúdo bloqueado".

**Decisão do dono.** Esvaziar o mapa até haver vídeo próprio, ou liberar `https://www.youtube-nocookie.com` na
`frame-src` e usar vídeo da marca. MP4 próprio em `public/` dispensa a CSP de frame.

---

## P-06 Conteúdo de PDP em três camadas
**Prio** P3 · **Esforço** G · **Risco** M · **Origem** `33987a9`, `71f76ac`, `d908d5f`, `21d1040`, `b7ec15f`

**Problema.** A PDP do Terravik guarda `benefits`, `audiences` e FAQ como mapas por handle dentro do
`ProductPageClient.tsx` (linhas 533, 557, 596). Produto novo na Shopify sai sem conteúdo e ajustar texto exige
deploy.

**Arquitetura a copiar.**
- Dados em `src/lib/produtos/lp/`: `tipos.ts` (`ConteudoDaLp`, todo campo opcional), `metafields.ts` (namespace
  `lp` na Shopify), `ancoras.ts` (registro por produto em código), `conteudo.ts` (padrões por categoria),
  `slots.ts` (especificação de cada imagem), `index.ts` (`resolverLp` mescla campo a campo: Shopify, depois código,
  depois padrão), `servidor.ts` (`server-only`, descarta imagem declarada sem arquivo).
- Componentes em `src/components/product/lp/`: cada seção decide sozinha se renderiza.
- `page.tsx` resolve no servidor e emite o `faqSchema` com as mesmas perguntas da tela.
- Query Storefront com `metafields(identifiers: [...])` e `Product.metafields` no tipo.

**Guardas que vêm junto.**
- `CAMPOS_TRATADOS: Record<keyof ConteudoDaLp, true>`: campo novo no tipo sem tratamento quebra o type-check.
- Classe Tailwind em arquivo de dado precisa ser literal completa, e `./src/lib/**` precisa estar no `content` do
  `tailwind.config.ts`. O Terravik não tem `src/lib` lá (linhas 7-12). Sem isso o banner sai com altura zero.
- `useEntrada()` devolve `{}` com `useReducedMotion()`: o CSS de reduced-motion não alcança transform inline do
  framer-motion.
- Imagens de exemplo em dev: ligadas por padrão no `next dev`, por opt-in em preview e nunca em produção.
  A trava é `VERCEL_ENV === 'production'`, não `NODE_ENV`.

**Reescrever com o Terravik.** `ancoras.ts`, `conteudo.ts`, categorias e `tokens.ts` dos acentos com forest, gold e
cream. Não copiar texto, foto nem vídeo da ADDS.

---

## P-07 Vídeo em loop e grade de detalhes na PDP
**Prio** P3 · **Esforço** M · **Risco** B · **Origem** `15bfa91`, `bdfcc87`, `d908d5f`

Depende de P-06.

- `VideoDeSlot`: `<video muted loop playsInline preload="none">` cujo `source` só entra a 300 px da tela, pausa fora
  da tela, não toca com save-data, 2G ou reduced-motion, tem botão de pausa (WCAG 2.2.2) e cai para o poster em erro.
  Poster sem vídeo vira foto; vídeo sem poster derruba o slot.
- `GradeDeDetalhes`: cada foto em `<figure>` com legenda própria (não o `alt`), carrossel com encaixe no celular.
  `mix-blend-multiply` só para JPG de fundo branco; o Terravik usa PNG transparente.
- `BlocoDeVideo` com controles, poster e transcrição visível. `PainelTecnico` com números grandes.
- Receita de compressão: `ffmpeg -i entrada.mp4 -vf "scale=-2:720:flags=lanczos" -c:v libx264 -preset slow -crf 27
  -profile:v high -pix_fmt yuv420p -an -movflags +faststart saida.mp4`. Alvo 2 MB.

---

## P-08 Vocabulário de ícones
**Prio** P3 · **Esforço** P · **Risco** B · **Origem** `a93ceab`

O Terravik usa `Sparkles` 47 vezes para significados diferentes. Tabela: assinar `Repeat`, desconto `Percent`,
calculadora ou localizador `Compass`, selo `Award`, prova social `Users`, recomendação `Target`, tempo `Timer`,
depoimento `Quote`, economia `PiggyBank`, comprar `ShoppingBag`, novo `Star`. Todo ícone decorativo com
`aria-hidden="true"`.
