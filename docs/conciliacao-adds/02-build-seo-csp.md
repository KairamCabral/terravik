# Build, SEO, CSP e analytics

Defeitos desta frente são da família "build verde, produção quebrada". Nada no `next build` acusa.

---

## B-01 Interruptor de indexação e robots
**Prio** P1 · **Esforço** M · **Risco** M · **Origem** `46a4977`, `4d4bc6b`

**Problema.** Preview e deploy inacabado na `.vercel.app` são indexáveis. Não há interruptor.

**Escopo.**
- `ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'` em `constants.ts`.
- `next-sitemap.config.js`: sem a variável, `policies: [{ userAgent: '*', disallow: '/' }]`.
- `layout.tsx` e `createMetadata`: robots `noindex, nofollow, nocache` quando desligado.
- Opcional: válvula `ALLOW_NOINDEX_PROD=1` na guarda de build, para quando produção ainda não está no domínio final.

**Aceite.** Build sem a variável gera `Disallow: /` e meta `noindex`. Com `=true`, volta `Allow: /`.

**Cuidado.** O Terravik está em produção. Definir `NEXT_PUBLIC_ALLOW_INDEXING=true` no ambiente Production da
Vercel ANTES do merge, senão o site inteiro sai do Google no próximo deploy.

---

## B-02 Sitemap sem área logada e noindex nas páginas privadas
**Prio** P1 · **Esforço** M · **Risco** B · **Origem** `b0db6a8`, `708f2a8`, `e6faa34`, `238bee9`, `26d813d`

**Problema.** O sitemap do Terravik publica `/admin`, `/conta`, `/checkout`, `/login`, `/cadastro`,
`/recuperar-senha`, `/favoritos`, `/pedido-confirmado`, `/demo-announcement`, `/assinatura/minha-assinatura`,
`/academia/perfil` e `/academia/conquistas`. Nenhuma tem noindex. Grupos de robôs de IA só têm `Allow: /` e, pela
RFC 9309, não herdam o disallow do grupo `*`. Toda URL recebe `lastmod` com a hora do build.

**Escopo.**
- `PRIVADAS[]` em `next-sitemap.config.js`, `EXCLUDE = ['/api/*', ...PRIVADAS]`, disallow espelhando.
- `noIndex: true` via `createMetadata` em login, cadastro, recuperar-senha, redefinir-senha, favoritos, conta.
- `NOINDEX_NA_PAGINA[]`: rotas com noindex na página saem do disallow (o Google precisa ler a meta).
- Header `X-Robots-Tag: noindex, nofollow` em `/checkout/:path*`, `/conta/:path*`, `/admin/:path*` no
  `next.config.mjs` (o checkout é client component e não emite metadata).
- `DISALLOW_COMUM` repetido em cada grupo de robô de IA.
- `autoLastmod: false` e sem `lastmod` no transform.
- Parâmetro `follow` em `createMetadata` para páginas noindex que distribuem link (default `false`).
- Soft 404: `/produtos/nao-existe` e `/blog/nao-existe` respondem 200 no Terravik. `notFound()` em rota com
  `generateStaticParams` precisa de `export const dynamicParams = false` (origem `fac33a3`). Com isso, produto
  criado na Shopify depois do build dá 404 até o próximo deploy: ligar um deploy hook no webhook de produto.

**Aceite.** Depois do build, `grep -c '/admin' public/sitemap-0.xml` dá 0. `curl -I /checkout` mostra
`X-Robots-Tag`. O robots.txt tem `Disallow` dentro do grupo GPTBot.

**Cuidado.**
- Academia é viva no Terravik: NÃO excluir `/academia`, só `/academia/perfil`, `/academia/conquistas` e
  `/conta/academia`.
- Ordem: colocar `noIndex: true` nas páginas ANTES de tirá-las do disallow.
- Toda rota nova com `noIndex` precisa entrar em `NOINDEX_NA_PAGINA`. A guarda de B-06 cobra isso.

---

## B-03 CSP corrigida
**Prio** P1 · **Esforço** P · **Risco** B · **Origem** `8c1e5dd`, `8740d39`, `365495f`, `e6faa34`, `2b57745`

A CSP do Terravik é idêntica à da ADDS antes das correções. Quatro defeitos invisíveis:

| Diretiva | Defeito no Terravik | Efeito |
|---|---|---|
| `connect-src` | `https://*.shopify.com` não casa `loja.myshopify.com` | carrinho real bloqueado no navegador; o `CartProvider` cai em mock e diz "Adicionado!" com gaveta vazia |
| `connect-src` | sem `https://viacep.com.br` | CEP não preenche no checkout e no admin de lojas; o frete nunca calcula |
| `media-src` | ausente | todo `<video>` vindo do storage do Supabase é bloqueado em silêncio |
| `worker-src` | ausente | confete de `pedido-confirmado` e `CelebrationModal` violam a CSP |
| `connect-src` | só `www.google-analytics.com` | coletor regional do GA4 bloqueado |

**Escopo.** Em `next.config.mjs`:
- `shopifyOrigin` derivado de `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` (fallback `https://*.myshopify.com`), usado em
  `connect-src` e `frame-src`.
- `https://viacep.com.br` em `connect-src`.
- `media-src 'self' blob: data: https://*.supabase.co https://cdn.shopify.com ${shopifyOrigin}`.
- `worker-src 'self' blob:`.
- GA: `https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com`.

**Aceite.** Console sem "violates the following Content Security Policy directive" ao adicionar ao carrinho,
digitar CEP e abrir vídeo de depoimento. Cookie do carrinho com `gid://shopify/Cart/`.

**Cuidado.** `next.config.mjs` diverge 308 linhas. Aplicar à mão.

---

## B-04 GA4 que realmente mede
**Prio** P1 · **Esforço** P · **Risco** B · **Origem** `2b57745`, `eebacdc` (item gtag)

**Problema.** O `.env.example` do Terravik documenta `NEXT_PUBLIC_GA_ID` e o `gtag.ts` lê
`NEXT_PUBLIC_GA_MEASUREMENT_ID`. Se a Vercel foi configurada pelo exemplo, o site não mede nada. A troca de rota
dispara um segundo `gtag('config')` sem `page_location`. Os dois `<script>` crus no `<head>` competem com o LCP.

**Escopo.**
- `gtag.ts` aceita os dois nomes, valida `/^G-[A-Z0-9]{4,}$/i` e recusa marcador `XXXX`.
- `pageview()` envia `gtag('event','page_view',{page_path, page_location, page_title})`.
- `GoogleAnalytics.tsx` pula a primeira rota com `useRef` e usa `next/script` com `strategy="afterInteractive"`.
- Guarda: em produção com indexação ligada, ID inválido reprova o build. Válvula `ALLOW_SEM_ANALYTICS=1`.
- No painel do GA4, desligar "alterações de página por evento de histórico".

**Aceite.** GA4 Realtime mostra 1 page_view por navegação interna. Network sem bloqueio de CSP.

**Antes de tudo.** Conferir na Vercel qual nome de variável está definido.

---

## B-05 JSON-LD e metadata corretos
**Prio** P2 · **Esforço** M · **Risco** B · **Origem** `708f2a8`, `e6faa34`, `573636e`, `8646541`, `b0db6a8`

Defeitos conferidos em `src/lib/seo/metadata.ts` do Terravik:

- Título "X | Terravik | Terravik": `createMetadata` concatena a marca e o template do layout também. Passar
  título cru; a marca só no título social.
- `AggregateOffer` no Product: trocar por um `Offer` por variante (`price`, `priceCurrency`, `availability`,
  `itemCondition`, `seller: {@id}`, `sku`, `hasMerchantReturnPolicy` com a política do Terravik).
- `sku` vem do `variant.id` (gid). Acrescentar `sku` ao `PRODUCT_FRAGMENT`, ao tipo e ao mapper. As 3 variantes do
  mock precisam declarar `sku` (pode ser `null`).
- Variante com preço zero: omitir a oferta. Sem oferta válida, omitir `offers`.
- `JSON.stringify` sem escape em 17 blocos: criar `jsonLd(schema)` com `.replace(/</g, '\\u003c')`.
- Organization: `@id` fixo (`${SITE_URL}/#organization`), remover a cópia em `/sobre`, `sameAs` e `contactPoint`
  com os dados do Terravik.
- `logo` aponta para `/images/logo.png` e `/logo.png`, que não existem. Gerar `public/images/logo.png` (600x600) a
  partir do SVG do Terravik.
- `og/default.jpg` não existe: toda prévia de link sai sem imagem. Criar 1200x630.
- `SearchAction` para `/produtos?q=`, que ignora o parâmetro: remover.
- Canonical em página noindex: só emitir canonical quando `!noIndex`.
- `googleBot` do layout é sobrescrito pelo `robots` da página: repetir.
- Blog `[slug]` monta metadata à mão, sem canonical e com título fora do template: usar `createMetadata` e
  sobrepor `openGraph.type = 'article'`.
- `articleSchema`: acrescentar `dateModified`, `image`, `inLanguage: 'pt-BR'`, `publisher: {@id}`.
- Descrição cortada no meio da palavra: `resumoParaMeta(texto, 155)` corta em fim de palavra.
- `og:image` declarada 1200x630 para foto quadrada: aceitar largura e altura reais.
- Apple touch icon: criar PNG 180x180 antes de remover o rewrite para SVG.

**Aceite.** Rich Results Test na PDP mostra `Offer` com preço. `curl -I /images/logo.png` responde 200.
View-source de `/sobre` com um único bloco Organization e `<title>` sem marca dupla.

**Cuidado.** Arquivo diverge 619 linhas. Reimplementar sobre o Terravik.

---

## B-06 Guardas de build
**Prio** P2 · **Esforço** M · **Risco** B · **Origem** `e8e1738`, `d98f155`, `2d524d8`, `d314fd6`, `2a6add9`, `5b786a9`

O `verify.js` do Terravik é manual, não roda no prebuild e exige arquivos que podem sumir. Criar:

**`scripts/verify.js` (prebuild).**
- Mock em produção: reproduzir as três condições de `shouldUseMock()` (flag, domínio vazio, token vazio). Erro se
  `VERCEL_ENV === 'production'` (nunca `NODE_ENV`, que é `production` em todo build). Local: válvula
  `ALLOW_MOCK_BUILD=1`.
- SVG sem prólogo: varrer `public/**/*.svg` e reprovar arquivo que não começa com `<?xml`. O Next 14 devolve 400
  em `/_next/image` para SVG sem prólogo. Hoje só `public/lojas/placeholder.svg` está sem.
- Client que importa mock: reprovar arquivo `'use client'` com `from '.../shopify/mock-data'`. ATENÇÃO: reprova o
  Terravik na primeira rodada (3 arquivos, ver C-06). Corrigir antes de ligar.
- Alegações proibidas: ver H-06.

**`scripts/verificar-build.js` (postbuild, depois de `next-sitemap`).**
- Conjunto de handles das PDPs no `prerender-manifest.json` igual ao do mock: reprova.
- Sitemap x noindex: para cada `<loc>` do sitemap, abrir `.next/server/app/<rota>.html` e reprovar se a meta robots
  tem `noindex`.
- Segredo em chunk: varrer chunks do navegador por `env.NOME` de `SUPABASE_SERVICE_ROLE_KEY`,
  `SHOPIFY_ADMIN_ACCESS_TOKEN`, `SHOPIFY_WEBHOOK_SECRET`, `REVALIDATE_SECRET` e por formatos de chave
  (`sb_secret_`, `shpat_`, `shpss_`, `whsec_`, `re_`). Procurar em `.next/static/chunks` e em
  `.vercel/output/static/...` (na Vercel a saída é reorganizada antes do postbuild); sem nenhuma pasta, avisar e
  sair 0.

**`package.json`.** `"prebuild": "node scripts/verify.js"`, `"postbuild": "next-sitemap && node scripts/verificar-build.js"`.

**Aceite.** `NEXT_PUBLIC_USE_MOCK_DATA=true VERCEL_ENV=production npm run build` sai com código 1. Remover o
prólogo de um SVG faz o prebuild falhar.

---

## B-07 Utilitário de .env para scripts
**Prio** P3 · **Esforço** P · **Risco** B · **Origem** `31c1a4a`

`scripts/lib/env.js` com `carregarEnvLocal(raiz, { avisarDuplicadas })`: dentro do arquivo a última ocorrência
vence (como o Next), o ambiente real ganha do arquivo e chave repetida gera aviso. Base de todo script novo.
Junto: `.gitignore` com `.env*.bak*`, `.env*.backup`, `.env*.save` (origem `cc3f521`; usar `.bak*`, porque
`.env*.bak` não cobre `.bak2`).

---

## B-08 /contato tratada como área logada
**Prio** P2 · **Esforço** P · **Risco** B · **Origem** `08d128c`

`'/contato'.startsWith('/conta')` é verdadeiro em `ConditionalLayout.tsx:21-28` e `Header.tsx:43-48` do
Terravik: `/contato` sai sem rodapé, sem barra de anúncio e sem gaveta. Criar `src/lib/utils/routes.ts` com
`dentroDe(pathname, base) = pathname === base || pathname.startsWith(base + '/')` e `AREAS_AUTENTICADAS`. Manter
`isCalculatorRoute`.

**Aceite.** `/contato` com rodapé; `/conta/pedidos` com layout logado.

---

## B-09 Data pura exibida com um dia a menos
**Prio** P3 · **Esforço** P · **Risco** B · **Origem** `573636e` (só `formatters.ts`, cherry-pick limpo)

`formatDate('2026-01-01')` em UTC-3 mostra 31/12/2025. Para string `^\d{4}-\d{2}-\d{2}$`, formatar com
`timeZone: 'UTC'`.

**Aceite.** `TZ=America/Sao_Paulo` e `formatDate('2026-01-01')` devolve "01 de janeiro de 2026".
