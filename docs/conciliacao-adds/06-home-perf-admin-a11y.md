# Home, performance, admin, acessibilidade e conteúdo

---

## H-01 Service worker e cache de vídeo
**Prio** P1 · **Esforço** P · **Risco** B · **Origem** `586cf24`, `7a36306` (sw.js)

**Problema.** O handler `fetch` de `public/sw.js` do Terravik intercepta o vídeo da home
(`Fertilizante Terravik.mp4`, 1,3 MB, autoplay): perde o streaming por Range, enche um cache sem teto e sem versão,
e uma resposta 206 faz `cache.put` rejeitar. Arquivos em `public/` saem com `max-age=0`: o vídeo é revalidado a cada
navegação.

**Escopo.**
- `sw.js`: `return` antes de qualquer `respondWith` quando `request.destination` é `video` ou `audio`, quando há
  header `range` ou a URL termina em `.mp4`, `.webm`, `.mov`, `.m4v`. Cherry-pick deste arquivo tende a ser limpo.
- Precache só de rota viva. `cache.addAll()` é atômico: um 404 desliga o PWA sem erro visível.
- `next.config.mjs` `headers()`: `/video/:caminho*` com `public, max-age=604800, stale-while-revalidate=86400`.
  `immutable` só depois de versionar os nomes.
- Renomear `Fertilizante Terravik.mp4` para `fertilizante-terravik.mp4` (o próprio `VideoSection` já pede) e só
  então adotar o `.gitignore` de originais com espaço no nome (origem `477d458`).
- Conferir o uso de `trailler-terravik.mp4` (13 MB). Se não for usado, remover.

**Aceite.** Cache Storage sem `.mp4`. Seek no vídeo gera 206. `curl -I /video/...` mostra o `Cache-Control`.

---

## H-02 Performance do LCP e das consultas
**Prio** P2 · **Esforço** M · **Risco** B · **Origem** `eebacdc`

Itens independentes, todos com defeito equivalente no Terravik:

| Item | Terravik hoje | Correção |
|---|---|---|
| Consultas duplicadas | PDP chama `getProductByHandle` em `generateMetadata` e na página (2 POSTs; a memoização do Next não cobre POST) | `cache()` da React em `getProducts` e `getProductByHandle` |
| LCP de `/produtos` | grade toda `loading="lazy"` | prop explícita `prioridade` no card, `index < 2` |
| Preload do banner | `BannerSection.tsx` tem dois `<Image priority>` por slide (desktop e mobile, `sizes="100vw"`): provável preload duplo e celular baixando 1920x800 | um preload por tela com `media` complementares, ou `getImageProps` com `<picture>` |
| Logo como único preload | `Header.tsx:96` com `priority` | `loading="eager"` |
| Cache de imagem | default de 60 s no Next 14 | `images.minimumCacheTTL: 2678400` |
| Revalidate do layout | fetch com revalidate menor rebaixa a rota inteira | fetch do layout com `revalidate: 3600`; frescor pela tag `products` e webhook |

**Aceite.** Lighthouse sem "Preload LCP image". Log com 1 POST à Storefront por render da PDP. `/produtos` com dois
`fetchpriority="high"`.

**Next 14.** Usar `priority`, não `preload`. `images.qualities` não existe no 14. Conferir no HTML se o `<link>`
emitido dentro de componente sobe para o `<head>`.

---

## H-03 FAQ com FAQPage e seção compacta
**Prio** P2 · **Esforço** M · **Risco** B · **Origem** `5d82d4c`

`faqSchema()` existe em `lib/seo/metadata.ts:164` do Terravik e nunca é chamada. As perguntas estão escritas dentro
do client component, que o rastreador não lê no SSR. A seção é a mais alta da home.

**Escopo.** `src/lib/faq/home.ts` (sem React) com `{ id, pergunta, resposta, acao? }`; frete lido do config.
`src/app/page.tsx` (server) emite o JSON-LD a partir da mesma lista. Componente compacto: `py-14 lg:py-16`, sem a
linha de categoria, `<h3><button aria-expanded aria-controls>`, `useReducedMotion`. Revisar respostas que prometem o
que não existe (ex.: "resposta em 24 h" com `/api/contact` que não envia).

**Aceite.** `curl -s / | grep FAQPage`. Rich Results Test aceita.

---

## H-04 Carrossel de depoimentos em vídeo
**Prio** P2 · **Esforço** M · **Risco** B · **Origem** `9603974`, `365495f`

`InfluencersSection.tsx` do Terravik renderiza cada depoimento duas vezes (lista desktop e mobile, linhas 191 e
198), não tem carrossel no desktop, nem arrastar, e vários vídeos tocam juntos. Overline `text-gold` a 2,75:1.

**Escopo.** Faixa única com `snap-x snap-mandatory`; arrastar só com mouse (toque usa rolagem nativa), sem snap
durante o arrasto, clique cancelado se o ponteiro andou mais de 4 px; setas com `disabled` nas pontas; um vídeo por
vez; cartão inteiro é `<button aria-label>`; seção some sem dado. Depende de `media-src` (B-03), senão o vídeo do
Supabase não toca.

---

## H-05 Vídeo de fundo com regras de rede e acessibilidade
**Prio** P2 · **Esforço** M · **Risco** B · **Origem** `8bae5ff`, `8771214`, `64bb296`, `b363d2a`

O `VideoSection.tsx` do Terravik é `<video autoPlay loop muted>` sem nenhuma regra. Copiar `HeroVideo.tsx` e
`hero-video.ts` (sem `'use client'` no módulo de dados) e aplicar:

1. Fontes só entram depois do `load` da janela e de `requestIdleCallback`.
2. Não carrega com save-data ou 2G.
3. Não toca sozinho com reduced-motion: poster e botão play.
4. `IntersectionObserver` pausa fora da tela e retoma se a pausa não foi manual.
5. Botão de pausa sempre no DOM (WCAG 2.2.2). Se o dono não quiser botão visível: `opacity-0` com
   `focus-visible:opacity-100` e contêiner `pointer-events-none`.

Mais: `el.muted = true` pela propriedade antes de `play()`; `webm` antes de `mp4` e `onError` só no último source;
fade só em `onPlaying`; campo `descricao` vira `alt` do poster quando o vídeo é conteúdo; trocou o arquivo, troque
o nome (o Next guarda a imagem otimizada pelo nome).

**Aceite.** Network sem vídeo antes do `load`. Reduced-motion: zero bytes de vídeo até clicar. Tab e Enter pausam.

---

## H-06 Dados fabricados e guarda de alegações
**Prio** P1 · **Esforço** M · **Risco** B · **Origem** `7a36306`, `df6ea8e`, `1dbc3a1`, `9858506`, `7996555`, `b7a7850`, `692551a`

**Problema.** Números e pessoas sem fonte publicados no Terravik, com o mesmo risco de CDC que a ADDS corrigiu:

| Onde | O quê |
|---|---|
| `HeroSection.tsx:113, 147` | "4.9/5 (2.847 avaliações)", "+2.847 jardins" (o componente nem é usado pela home: apagar) |
| `AcademiaCTA.tsx:63` | "2.847 alunos" |
| `CalculatorCTA.tsx:18-19` | "50K+ cálculos", "98% satisfação" |
| `SobrePageClient.tsx:23-24` | "50K+ gramados", "98% satisfação" |
| `ProductPageClient.tsx:126` | "2.847 famílias" |
| `subscription/TrustIndicators.tsx` | "2.847 famílias", "4,8/5 (1.423 avaliações)" |
| `lib/subscription/mock-data.ts` | `MOCK_TESTIMONIALS` |
| `lib/locations/representatives.ts` | 4 representantes inventados com e-mail e telefone |
| `lib/reviews/data.ts` | 7 avaliações inventadas, seis "verificadas" (ver U-05) |
| `StoreLocationsSection.tsx` | 5 marketplaces anunciados como ponto de venda sem confirmação |
| `conta/pedidos/page.tsx:35`, `CheckoutHelp.tsx:11` | telefone `5511999999999` |
| `constants.ts` | `SOCIAL_LINKS.whatsapp` com `55XXXXXXXXXXX` |
| `AnnouncementBar.tsx:47` | "R$ 150" escrito à mão, coincide com o config só por enquanto |

**Escopo.**
1. Trocar cada número por dado real ou remover. Seção sem dado não renderiza.
2. Frete e parcelamento em fonte única (`FREE_SHIPPING_CONFIG`, `lib/pagamento/parcelas.ts`).
3. Guarda em `scripts/verify.js`: lista `ALEGACOES = [{ nome, frases: RegExp[], prova }]` varrendo `src/`,
   `content/` e `public/` (SVG carrega texto). Frase proibida reprova o build citando a prova. Lista própria do
   Terravik, por exemplo `/2\.847/`, `/50\s?K\+/`, `/98\s?%\s+satisfa/`.
4. Fileira de logos de parceiros e link para o mapa só com loja real na tabela.

**Dica.** Resíduo se acha por vocabulário do domínio, não pelo nome da marca.

**Aceite.** `grep -rn "2\.847\|50K\|98%" src` vazio ou com fonte. Inserir a frase num comentário faz o prebuild falhar.

---

## H-07 Painel admin com dado real
**Prio** P2 · **Esforço** M · **Risco** B · **Origem** `d47424e`, `78feca2`

Conferido no Terravik: `admin/page.tsx` com receita de 6 meses escrita à mão (linha 102), deltas fixos 12,5, 8,2,
15,3 e 22,1 (linhas 62-65) e "Lojas conveniadas: --" (linha 213) com a tabela `stores` existindo.
`admin/metricas/page.tsx` com 6 deltas fixos, "Visitantes: 1000" literal e carrinho estimado como usos x 0,6.

**Escopo.**
- Receita por mês agrupada de `orders_sync.shopify_created_at`.
- `variacao(atual, anterior)` contra os 30 dias anteriores; `undefined` sem base. O selo só aparece com número.
- Funil só com etapas medidas.
- Contagem real de `stores`. Remover duplicata de "Assinaturas ativas".
- Cartão da calculadora só se a calculadora gravar em `calculator_logs` (a tabela existe, nenhum código insere).
- Estado vazio no gráfico.
- Princípio visual: cor só para estado. Aplicar com os tokens do Terravik.

**Aceite.** Com zero pedidos, gráfico vazio e nenhum selo de %. Com pedidos, soma mensal bate com a Shopify.

---

## H-08 Acessibilidade estrutural
**Prio** P2 · **Esforço** G · **Risco** M · **Origem** `6fdbb99`, `7da7ea0` (skip link), `3b89ff6` (anúncio)

Todos conferidos no Terravik:

| Componente | Defeito | Correção |
|---|---|---|
| `Modal` | `id="modal-title"` fixo, sem prender foco | `useId`, `prenderFoco`, foco entra ao abrir e volta ao fechar |
| `MobileMenu` | `role="dialog"` sem `aria-modal` nem gestão de foco | `aria-modal`, `aria-hidden={!open}`, `aria-controls` no botão, devolver foco antes de esconder |
| `StarRating` | 5 `<button disabled>` lidos como botões indisponíveis | um `role="img"` com `aria-label="Nota 4,5 de 5"` |
| `Toast` | `aria-live` no container e `role="alert"` em tudo: anuncia duas vezes | erro `alert`, resto `status`, sem live no container |
| `Input` | `Math.random` no id: hydration mismatch | `useId` |
| `Footer` | `h3` como título de coluna | `<p id>` com `<ul aria-labelledby>` |
| `conta/layout.tsx:190` | `<main>` dentro de `<main>` | `<div>`, nav com `aria-label` e `aria-current` |
| `SearchBar` | sem `aria-expanded` e sem anúncio de resultados | `aria-expanded`, `aria-controls`, região `sr-only aria-live` |
| `MobileBottomNav` | sem safe-area | `pb-[max(0.5rem,env(safe-area-inset-bottom))]` |
| `RotatingAnnouncementBar` | gira a cada 6 s sem pausa (WCAG 2.2.2) | não girar; escolher a mensagem por hash do caminho (`Math.random` deu erro de hidratação) |
| `AddToCartButton` | `bg-green-600` com branco | token de sucesso escuro |
| layout | sem skip link | `href="#main-content"` com `sr-only focus:not-sr-only` |
| contraste | `text.muted` #7A807A e `gold` sobre claro | medir com os valores do Terravik; não copiar os hex da ADDS |

**Aceite.** axe ou Lighthouse sem falha nas páginas tocadas. Tab com modal aberto não sai do modal. Leitor de tela
lê "Nota 4,5 de 5".

---

## H-09 Busca, representantes e correções pequenas
**Prio** P2 · **Esforço** P · **Risco** B · **Origem** `e4509cf`, `442ed3f`, `4e80238` (frete), `b7a7850`

- **Busca.** `SearchBar.tsx:62`: `if (query.length < 2) { setResults([]); return }` não desliga o spinner. Apagar
  rápido deixa o spinner eterno e some o botão limpar. Acrescentar `setIsLoading(false)`. No `catch` de
  `/api/search`, não empurrar produtos do mock.
- **Representantes.** O campo diz "Mensagem (opcional)" e `/api/contact:28-31` exige 10 caracteres. O formulário
  é impossível de enviar sem mensagem. Antes do fetch, compor a mensagem com cidade, UF e experiência.
- **CalculatorCTA.** `bg-fixed` baixa uma foto coberta por overlay de 85% e o iOS ignora. Remover.

**Aceite.** Enviar o formulário de representante em branco responde 200. Apagar a busca até 1 letra para o spinner.

---

## H-10 Blog em MDX com taxonomia
**Prio** P3 · **Esforço** G · **Risco** M · **Origem** `82ba6ff`, `26d813d`, `d98f155`

Hoje o blog do Terravik é um array em `src/lib/blog/articles.ts` e `/blog` redireciona para `/academia`.

**Mecanismo.** `content/blog/<slug>.mdx` e `src/lib/blog/`: `taxonomia.ts` (categorias declaradas e planejadas,
tags, autores), `schema.ts` (zod do frontmatter), `index.ts` (gray-matter, slug pelo nome do arquivo, tempo de
leitura por 200 palavras, relacionados). Render com next-mdx-remote, remark-gfm, rehype-slug. Rotas
`/blog/categoria/[slug]` (index) e `/blog/tag/[slug]` (noindex com follow) geradas a partir do conteúdo.
No Next 14, `experimental.outputFileTracingIncludes['/api/search'] = ['./content/blog/**/*']`, senão a busca não
acha artigo em produção. Guardas: categoria declarada tem post, toda categoria e tag com post tem rota.

**Decisão do dono.** Se `/blog` continua redirecionando para a Academia, esta história pode esperar.

---

## H-11 Proteção de mídia contra hotlink
**Prio** P3 · **Esforço** P · **Risco** B · **Origem** `801881a`

Outro site embutindo o vídeo faz a loja pagar a banda. `rewrites().beforeFiles` com `has` referer e `missing`
referer próprio para `/video/:caminho*` mandam para `/api/midia-de-terceiro`, que devolve 403 com
`Cache-Control: private, no-store`. Referer ausente passa (prévia no WhatsApp). Com isso, os headers de cache de
H-01 precisam da forma dupla (`missing` referer e `has` referer próprio), porque o header do config sobrepõe o da
rota.

---

## H-12 Achados menores da home
**Prio** P3 · **Esforço** P · **Risco** B · **Origem** `98a5fba`, `163cd9e`, `11799be`, `076b008`

- **Vitrine que cabe na tela.** Em 1440x900 o card da vitrine da ADDS media 809 px e "Comprar" pedia três cliques.
  Princípios: medir a altura útil, selos sobre a foto, um clique adiciona 1 unidade da variante padrão, frete no
  cabeçalho lido do config, assinatura como caminho secundário. Reescrever a vitrine do Terravik junto com C-06.
- **Grade sem buraco.** Com contagem ímpar de produtos, o último quadro é um link "ver todos" com borda tracejada.
- **Tipos do Supabase.** `TestimonialsSection.tsx:58` do Terravik usa `(supabase as any).from('photo_testimonials')`,
  o que desliga a checagem da consulta. Rodar `supabase gen types` ou acrescentar as duas tabelas de depoimento em
  `src/types/database.ts` e remover o cast.
- **Altura da primeira dobra.** Se o Terravik trocar o fallback do carrossel por um hero tipográfico, o hero deve ter
  a mesma proporção do banner como piso (`aspect-[1080/1350] lg:aspect-[1920/800]`), senão a home pula ao publicar
  ou despublicar banner. Hoje o fallback do Terravik já são banners na mesma proporção.

---

## G-01 Ordem de catálogo em código
**Prio** P3 · **Esforço** P · **Risco** B · **Origem** `917fcc6`

`src/lib/produtos/ordem.ts` com `ORDEM_DE_PRIORIDADE` e `ordenarPorPrioridade()` (estável, não muta, fora da lista
vai ao fim). Aplicada dentro de `getProducts()`. Reordenar no admin da Shopify deixa de mudar o site sem ninguém
saber. Valor baixo com 3 produtos.

## G-02 URL de produto ancorada em SKU
**Prio** P3 · **Esforço** M · **Risco** M · **Origem** `0cf9724`

Handle quebra quando o admin renomeia, id quebra quando a loja é trocada. `SKUS_POR_SLUG` com índice em memória
(`products(query: "sku:...")` da Storefront não filtra). Guarda que reprova o build com produto sem SKU. Só quando
houver catálogo real com redirects. Não portar `c286326` (por id), que foi superado.

## G-03 Feature flag da Academia
**Prio** P3 · **Esforço** P · **Risco** B · **Origem** `4e80238`

`FEATURES.academia` lido de `NEXT_PUBLIC_FEATURE_ACADEMIA`, com valor padrão LIGADO no Terravik. `academia/layout.tsx`
chama `notFound()` com a flag desligada; redirects condicionais no `next.config.mjs` (notFound em rota estática
responde 200). Útil para desligar a Academia sem apagar código.

## G-04 Chaves de storage com prefixo
**Prio** P3 · **Esforço** P · **Risco** M · **Origem** `46eb3e3`

`storageKey(nome)` com `SITE.storagePrefix` evita que ADDS e Terravik dividam carrinho e favoritos em localhost.
Cuidado: mudar o formato apaga favoritos e estado de assinatura já salvos nos navegadores dos clientes. Manter os
nomes atuais ou migrar na leitura.
