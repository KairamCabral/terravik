# Shopify, catálogo, carrinho, checkout e frete

O Terravik roda em mock hoje. Cada defeito abaixo foi encontrado na ADDS no dia em que a Shopify real foi
ligada, e o código do Terravik é o mesmo. Fazer esta frente antes de ligar a loja real no Terravik.

Ordem obrigatória: C-01, depois C-02, C-03, C-04, C-05. O resto pode vir em qualquer ordem.

---

## C-01 Fim da dupla normalização e do mock silencioso
**Prio** P1 · **Esforço** P · **Risco** B · **Origem** `2cf097d`

**Problema.** `getProducts()` e `getProductByHandle()` já devolvem `Product` normalizado. As páginas chamam
`normalizeProduct(p as any)` de novo, que lança `TypeError`, e o `catch` mudo troca tudo por mock. Com a Shopify
respondendo 200, o site serve os 3 produtos de exemplo. Conferido em `produtos/page.tsx:24` e
`produtos/[handle]/page.tsx:39` e `:60`.

**Escopo.**
- Remover o segundo `normalizeProduct` nos três pontos.
- Novo `src/lib/shopify/fallback.ts` com `reportarFalhaShopify(contexto, erro)`: ignora o sentinela de modo mock,
  loga com contexto, relança fora de produção e degrada para mock em produção.
- Aplicar nos `catch` de listagem, PDP e `generateStaticParams`.
- Apagar `queries/favorites.ts` (usa `MetafieldsSetInput`, que não existe na Storefront, e não tem consumidor).
- Exportar `shouldUseMock` de `client.ts` (pré-requisito de C-02 e B-06).

**Aceite.** Com credenciais reais, `/produtos` lista os handles da loja. Em dev, derrubar o token faz a página
estourar em vez de servir mock.

---

## C-02 CartProvider confiável
**Prio** P1 · **Esforço** G · **Risco** A · **Origem** `7da7ea0` (fatia A), `628d4d0` (cartRef), `b11995c`

Cinco defeitos conferidos em `src/components/cart/CartProvider.tsx` do Terravik:

| Linha | Defeito | Correção |
|---|---|---|
| 68 | `cookie.split('=')[1]` corta o id `gid://shopify/Cart/...?key=...` | gravar com `encodeURIComponent`, ler com `decodeURIComponent` |
| 59, 94, 117, 157, 207, 251 | qualquer erro liga o mock e persiste no localStorage para sempre | decidir o mock uma vez por `shouldUseMock()`; descartar mock salvo ao carregar |
| 144, 150 | `cart?.id` da closure: adições em sequência criam N carrinhos | `cartIdRef` com `useRef`; `addItem` usa `cartIdRef.current ?? lerCookie()` |
| 274 | `goToCheckout` com `[cart]`: "comprar agora" logo após `addItem` vê carrinho nulo | `cartRef` atualizado a cada `setCart` |
| todas | erro some e o botão diz "Adicionado!" | `showToast('error')` e relançar |

Também: `cartLinesAdd` que a Shopify recusa (carrinho expirado ou convertido) cai em `cartCreate`.

**Aceite.** Adicionar 2 produtos em sequência gera 2 linhas no mesmo carrinho. Recarregar mantém o carrinho.
Erro de rede mostra toast e o botão não confirma.

**Cuidado.**
- NUNCA cherry-pickar `7da7ea0` inteiro: ele apaga a assinatura, o checkout e `/pedido-confirmado`.
- O `addItem` do Terravik recebe `subscriptionData` no 3º parâmetro. Manter.
- Reescrever à mão; o arquivo diverge 493 linhas.

**Prova automática.** `scripts/testa-carrinho.js` (origem `c1aab1b`): Chrome headless via CDP abre uma PDP,
clica em "Adicionar ao carrinho" e confere se o cookie do carrinho contém `gid://shopify/Cart/`. Trocar a URL
padrão para `localhost:3000/produtos/gramado-novo` e o nome do cookie.

---

## C-03 Avisos da Shopify no carrinho
**Prio** P1 · **Esforço** P · **Risco** B · **Origem** `b11995c`

**Problema.** A Shopify pode devolver `userErrors: []`, carrinho válido e a linha com `quantity: 0`. O motivo vem
em `warnings` (`MERCHANDISE_OUT_OF_STOCK`), que a consulta não pede. Na ADDS isso custou dois dias de "a loja não
vende". A causa era depósito fora do perfil de entrega.

**Escopo.** `cartCreate` e `cartLinesAdd` pedem `warnings { code message }`. `recusarSeNaoEntrou(cart, warnings,
variantId)` lança `AvisoDaShopify` com a frase da Shopify quando vem um dos dois códigos de estoque, ou quando a
linha pedida volta com quantidade zero. O toast mostra essa frase.

**Aceite.** Tirar o depósito do perfil de entrega na loja de teste. "Adicionar" mostra a frase da Shopify e não
confirma.

**Cuidado.** Conferir que a versão da Storefront API (`NEXT_PUBLIC_SHOPIFY_API_VERSION`, hoje 2024-10) tem
`warnings` nessas mutations. A ADDS usa 2026-07.

---

## C-04 Cupom real via Shopify
**Prio** P1 · **Esforço** M · **Risco** M · **Origem** `7da7ea0` (fatia B)

**Problema.** `CouponInput.tsx:43` valida o cupom no navegador contra lista local. `cartDiscountCodesUpdate` está
comentada em `queries/cart.ts:236-275`. A barra do topo anuncia um cupom (`AnnouncementBar.tsx:55-59`) que pode
não existir na loja.

**Escopo.** `aplicarCodigosDeDesconto(cartId, codes)` via `cartDiscountCodesUpdate`. Fragment do carrinho com
`discountCodes { code applicable }`. Se `applicable === false`, reenviar `[]` e dizer "inválido". Apagar
`lib/shipping/coupon.ts`. Cadastrar na Shopify todo cupom anunciado ou tirar o anúncio.

**Aceite.** Cupom inexistente mostra "inválido" e não muda o total. Cupom real aparece no checkout.

---

## C-05 Checkout direto na Shopify
**Prio** P1 · **Esforço** M · **Risco** A · **Origem** `7da7ea0` (fatia C)

**Problema.** O `/checkout` próprio do Terravik pede e-mail, CPF e endereço, mostra frete de uma tabela inventada
(com "Jadlog") e um cronômetro falso, e depois manda para a Shopify, que pede tudo de novo.

**Escopo.** `goToCheckout` vai para `cart.checkoutUrl` fora do mock. `/checkout` vira redirect ou some.
Remover `ShippingCalculator` (tabela) e `OrderBump` (ids de mock fixos em `lib/shipping/order-bump.ts:25-43`).

**Decisão do dono antes de começar.** O que fazer com `/checkout` e com o order bump. Sugestão: o bump vira a
sugestão por regra de C-07.

**Aceite.** "Finalizar" abre o checkout da Shopify com os itens do carrinho.

**Diagnóstico útil.** Se o checkout abrir a home da loja `.myshopify.com` com carrinho vazio, a causa costuma ser
vitrine com senha ou loja sem pagamento habilitado. Ver C-10. Testar sempre em janela anônima e deslogada do admin
da Shopify, porque sessão de admin passa pela senha da vitrine.

---

## C-06 Catálogo no servidor e guarda contra mock no client
**Prio** P1 · **Esforço** M · **Risco** M · **Origem** `5b786a9`, `ef92d64`, `dfb0472`, `d883661`, `91cf37b`, `b77dc52`

**Problema.** Client component não vê credenciais. Todo client que importa `mock-data` mostra o catálogo de
exemplo em produção. Conferido no Terravik:

| Arquivo | Defeito |
|---|---|
| `calculator/ProductPlanCard.tsx`, `CalculatorResultSubscription.tsx` | calculadora recomenda variantes `mock-*`; o carrinho real não aceita |
| `assinatura/SubscriptionLandingPage.tsx` | importa mock (conferir se ainda é usado; se não, apagar) |
| `favoritos/FavoritesPageClient.tsx`, `conta/favoritos/page.tsx` | `PRODUCTS_MAP` de 3 produtos escritos à mão, duas cópias; favorito fora do mapa some |
| `home/ProductsShowcase.tsx` | client com preços e `variantIds` digitados |
| `layout/Footer.tsx:19-22` | 3 handles fixos |
| `quick-purchase/constants.ts:32,43,44` | `mock-p1-400g` e `mock-p2-2700g` não existem nem no mock: a Compra Rápida não funciona hoje |

**Escopo.**
- `src/lib/shopify/catalogo.ts` com `import 'server-only'` e `getCatalogoComEstado(contexto)` devolvendo
  `{ produtos, degradado }`.
- Calculadora: a página server `/calculadora` resolve o catálogo e passa por prop; o motor recebe `Product[]`.
- Favoritos: páginas server, `FavoritesGrid` client recebe o catálogo. Com `degradado`, mostrar "não foi possível
  carregar" e nunca o botão "remover da lista".
- Vitrine: server busca, client recebe por prop, curadoria por lista de handles.
- Rodapé: `getLinksDeProdutoDoRodape()` no `RootLayout` (vira async) com `revalidate: 3600`.
- `/api/compra-rapida` com o catálogo real, só variantes disponíveis.
- Ligar a guarda de B-06 só depois de corrigir os três clients.

**Aceite.** Favoritar 5 produtos mostra 5 cards com foto e preço reais. Resultado da calculadora entra no
carrinho real. O bundle do navegador não contém `mock-data`.

---

## C-07 Frete: faixas, simulador por CEP e fim da tabela inventada
**Prio** P2 · **Esforço** G · **Risco** M · **Origem** `8c0556a`, `a6a5273`, `500ef02`

**Problema.** `lib/shipping/config.ts:6-9` tem `threshold: 150` e 6 UF sem o ES. `calculator.ts:43-114` tem
tabela de frete inventada. A barra de frete grátis não diz a região. A barra de anúncio repete "R$ 150" à mão.

**Escopo.**
1. `config.ts` como fonte única: `FAIXAS_DE_FRETE_GRATIS: {regiao, ufs[], minimo}[]`, `faixaDaUf(uf)`,
   `fraseDoFreteGratis()`, `ufSemFaixa()` (teste prova as 27 UF). Pode ser uma faixa só.
2. `progressoDoFreteGratis(subtotal)` mede o trecho atual e devolve `{liberada, proxima, falta, percentual}`.
   `FreeShippingBar` só desenha o que ele devolve, com `aria-valuenow`. Toda copy lê a frase do config.
3. Simulador por CEP na PDP e na gaveta: `opcoesDeFrete(linhas, destino)` cria um carrinho DESCARTÁVEL, adiciona
   endereço com `cartDeliveryAddressesAdd` (`oneTimeUse: true`) e lê `deliveryGroups.deliveryOptions`. Descartável
   porque a mutation acumula endereços. Omitir opção chamada "grátis" com preço maior que zero. ViaCEP só para UF e
   cidade. CEP lembrado em `localStorage` com evento para sincronizar PDP e gaveta.
4. Sugestão no carrinho por regra (substitui o order bump): até 2 itens, o que fecha o frete grátis vem primeiro,
   servido por `/api/catalogo-leve`.

**Aceite.** O preço do simulador bate com o do checkout da Shopify para o mesmo carrinho e CEP. `ufSemFaixa()`
vazio.

**Cuidado.** `cartDeliveryAddressesAdd` exige versão recente da Storefront API. Em mock, esconder o simulador.

---

## C-08 Eventos de comércio no GA4
**Prio** P2 · **Esforço** M · **Risco** B · **Origem** `500ef02`

O Terravik nunca chama `ecommerce.*` (zero ocorrências fora de `gtag.ts`). Disparar SÓ no `CartProvider`:
`add_to_cart` lendo o item do carrinho normalizado, `remove_from_cart`, `begin_checkout` com `currency` e `value`.
Origem da adição (`pdp`, `vitrine`, `calculadora`, `compra-rapida`, `sugestao-carrinho`) vira `item_list_name`.

**Cuidado.** Acrescentar `origem` como 4º parâmetro ou objeto de opções. Não trocar `subscriptionData`.

**Aceite.** Stub de `window.gtag` captura `add_to_cart` com `item_list_name` correto em cada origem.

---

## C-09 Desconto da Shopify visível na linha do carrinho
**Prio** P3 · **Esforço** P · **Risco** B · **Origem** `73270e1` (só esta parte)

Fragment do carrinho com `discountAllocations { discountedAmount { amount currencyCode } }`. `normalizeCartLine`
soma em `descontoAplicado`. `CartLine` mostra "economia de R$ X" lida da Shopify, nunca de conta local. Vale para
qualquer desconto automático, inclusive o de assinatura.

**Opcional.** Desconto por quantidade criado por script na Shopify (`scripts/shopify-descontos-quantidade.js`,
com `combinesWith.productDiscounts: true`), se o Terravik quiser essa promoção. Sem tirar a assinatura.

---

## C-10 Scripts de diagnóstico da loja Shopify
**Prio** P3 · **Esforço** M · **Risco** B · **Origem** `19c90f7`, `406eeb0`, `69e6802`, `73d0f0d`, `8efde0a`, `fa80a3f`, `343fcc8`

Ferramentas, todas sobre `scripts/lib/env.js` (B-07):

- `shopify-webhooks.js`: lista, cria (`--criar https://terravik.com.br`) e remove webhooks, idempotente. Usar só os
  tópicos que a rota do Terravik trata.
- `testa-webhook.js`: assina um `products/update` com o segredo local e envia. 200 prova segredo, roteamento e
  escrita. Lembra do redeploy na Vercel.
- `checa-loja.js`: `lojaPodeVender()` lê `shop.json` e diz se a vitrine tem senha e se a loja cobra;
  `checkoutAbreParaCliente()` cria um carrinho e segue o `checkoutUrl` sem cookie; compara estoque da Storefront
  com o do Admin.
- Rota `/api/sync/orders`: versão da API lida do env (hoje fixa em `2024-01`) e 403 de escopo vira mensagem que diz
  qual escopo falta.
- Token Admin por `client_credentials` (`admin-token.ts`, com renovação) só se o app do Terravik for do Dev
  Dashboard. Com token `shpat_` fixo, pular.
