# Segurança e base

Todas as histórias desta frente são P0 ou P1. Fazer antes de qualquer melhoria visual.

---

## S-01 Fechar escalada de perfil a super_admin
**Prio** P0 · **Esforço** M · **Risco** A (migration em banco de produção)
**Origem** `d314fd6`, `2a6add9`

**Problema.** A policy de UPDATE em `profiles` só tem `USING`. Sem `WITH CHECK`, qualquer conta criada no site
faz `PATCH /rest/v1/profiles?id=eq.<uid>` com `{"role":"super_admin"}` usando a chave anônima e vira admin.
O Terravik tem a mesma policy (`supabase/schema.sql:450`, `profiles_update_own`). Também é possível reescrever
`shopify_customer_id` (ler dados de outro cliente) e `email`.

**Escopo.**
1. Nova migration: recriar `profiles_update_own` com `WITH CHECK`.
2. Trigger `BEFORE UPDATE` em `profiles` (SECURITY INVOKER, de propósito): se `current_user` é `anon` ou
   `authenticated` e quem escreve não é admin, devolve `OLD` em `role`, `email`, `shopify_customer_id`,
   `shopify_email`, `xp_total`, `level`. Congela a coluna sem recusar o UPDATE.
3. Trocar `public.is_admin()` por `get_auth_user_role() in ('admin','super_admin')`, que o Terravik já tem.
4. Redirect aberto: em `LoginForm`, aceitar `redirect` só se casar `/^\/(?!\/)/`.
5. `import 'server-only'` em `src/lib/supabase/admin.ts` e remover o fallback para a chave anônima.
   Antes do deploy, garantir `SUPABASE_SERVICE_ROLE_KEY` em todos os ambientes da Vercel.
6. Verificar se o service role não foi parar em chunk do navegador (ver B-06).

**Aceite.**
- Logado como cliente, `PATCH` em `profiles` com `{"role":"super_admin","full_name":"X"}` responde 204, o `role`
  continua `customer` e o `full_name` muda.
- `/login?redirect=https://evil.com` vai para `/conta`.

**Cuidado.** Não portar a parte de `product_reviews` da migration (a tabela só existe depois de U-05).

---

## S-02 Webhooks e revalidate deixam de falhar abertos
**Prio** P0 · **Esforço** P · **Risco** M · **Origem** `8783e98`, `7f17791` (parte HMAC)

**Problema.** `verifyWebhook()` retorna `true` quando `SHOPIFY_WEBHOOK_SECRET` está vazio. Qualquer POST anônimo
grava pedido no Supabase e revalida cache. Está igual em `webhooks/shopify/route.ts:12-15`,
`subscription/webhook/route.ts:192-195` e `revalidate/route.ts:8`.

**Escopo.** Sem segredo, retornar `false` com `console.error`. `/api/revalidate` responde 503 sem
`REVALIDATE_SECRET`. Comparar segredos e HMAC em tempo constante com `lib/seguranca/comparar.ts`
(`iguaisEmTempoConstante`: SHA-256 dos dois lados e `crypto.timingSafeEqual`). Documentar as variáveis no
`.env.example`.

**Aceite.** `curl -X POST /api/webhooks/shopify` sem HMAC e sem segredo responde 401. `/api/revalidate` sem
segredo responde 503.

**Cuidado.** Cherry-pick de `8783e98` é limpo (pai idêntico). Definir `SHOPIFY_WEBHOOK_SECRET` e
`REVALIDATE_SECRET` na Vercel ANTES do deploy, senão os webhooks passam a recusar tudo. O segredo é a chave
`shpss_` do app, não o token `shpat_`.

---

## S-03 Fechar rotas públicas que vazam ou gravam
**Prio** P0 · **Esforço** M · **Risco** M · **Origem** `7f17791`

Itens, todos conferidos no Terravik (arquivos idênticos ao pai):

| Rota | Defeito | Correção |
|---|---|---|
| `/api/shopify/customer` | lê `customerId` do corpo sem sessão: qualquer um lê e-mail, endereço e gasto de qualquer cliente; o PUT altera cadastro | exigir `auth.getUser()`, ler `profiles.shopify_customer_id` no servidor, ignorar o corpo, 502 genérico sem repassar `errors` |
| `/api/upload` | `folder` arbitrário em `path.join` | validar por regex de pastas permitidas (thumbnails, videos, materials) |
| `/api/contact` | sem teto de tamanho | `TETOS` por campo (200, 254, 30, 200, 5000) |
| `/api/newsletter`, `/api/subscription/create`, `/api/subscription/update` | rotas mortas que fingem funcionar | apagar (sem chamadores) |
| `/api/academia/seed` | POST público gravando com service role | NÃO apagar no Terravik (Academia é feature real): proteger com sessão admin ou segredo |
| webhook `customers/update` | grava "null null" como nome e apaga telefone | só gravar campos que vieram preenchidos |
| rate limit | `/login` e `/cadastro` contam GET; o Next pré-carrega `/login` e o cliente leva 429 | aplicar só a POST, PUT, PATCH e DELETE; tirar `/login` e `/cadastro` de `RATE_LIMIT_PATHS`, do `matcher` e de `rate-limit.ts` |

**Aceite.** POST em `/api/shopify/customer` sem cookie responde 401. Abrir 15 páginas e clicar em Entrar não dá
429. `folder=../../src` no upload responde 400. `/conta/dados` ainda mostra os dados (usa `numberOfOrders`, não
`ordersCount`).

**Cuidado.** A rota de customer usa `createServerSupabaseClient()` síncrono no Next 14. Se portar depois de S-05,
acrescentar `await`.

---

## S-04 Next 14.2.35
**Prio** P0 · **Esforço** P · **Risco** B · **Origem** `c3f75b4`

O Terravik está em `next: 14.2.21` exato, dentro da faixa do GHSA-f82v-jwr5-mffw (bypass de autorização no
middleware, crítica), e protege `/conta` e `/admin` exatamente pelo middleware.

**Escopo.** `next` e `eslint-config-next` para `^14.2.35`. `engines.node: ">=18.0.0 <23.0.0"`. Rodar
`npm install`. Não cherry-pickar o lockfile.

**Aceite.** `npm audit --omit=dev` sem o GHSA. `curl -H "x-middleware-subrequest: middleware" /conta`
responde 307.

---

## S-05 Atualização para Next 16 (PR único)
**Prio** P2 · **Esforço** G · **Risco** A · **Origem** `4e4a017`, `14a3f45`, `6d828ec`, `6a6457e`, `d8f2a4f`

Fecha as duas advisories restantes (RCE no otimizador de imagem com AVIF; o Terravik tem
`formats: ['image/avif','image/webp']`) e zera `npm audit --omit=dev`. Só depois de S-01 a S-04, S-06 e de tudo
que edita `middleware.ts`.

**Escopo.**
- `next ^16.3.5`, `react` e `react-dom ^19.3.0`, `@types/react*`, `eslint ^9.39.5`, `eslint-config-next ^16.3.5`.
- `npm audit fix` sem `--force` e `server-only` como dependência.
- ESLint flat: `eslint.config.mjs` (sem FlatCompat), apagar `.eslintrc.json`, script `lint: eslint .`.
  Regras novas do react-hooks como `warn` (a ADDS ficou com 44 avisos de dívida).
- `tsconfig`: `jsx: react-jsx` e `include` com `.next/dev/types/**/*.ts`.
- `params`, `searchParams`, `cookies()` e `headers()` viram Promise: `blog/[slug]`, `produtos/[handle]`,
  `supabase/server.ts`, `auth/callback/route.ts`.
- `export const revalidate` literal (60, 300); o Next 16 rejeita constante.
- `revalidateTag('products', 'max')` em `webhooks/shopify` e `revalidate`.
- `git mv src/middleware.ts src/proxy.ts` e renomear a função para `proxy`.
- `Button.tsx`: `children as ReactElement<{ className?: string }>`.
- Procurar `UnsafeUnwrapped` e remover.

**Aceite.** `tsc --noEmit`, `eslint .` e `next build` verdes. `npm audit --omit=dev` zero. `/conta` redireciona,
`/login` abre, imagem AVIF responde.

**Cuidado.** Nenhuma outra história exige Next 16. Se o time preferir adiar, S-04 basta.

---

## S-06 Middleware sem credenciais não derruba o site
**Prio** P1 · **Esforço** P · **Risco** B · **Origem** `42ca414` (cherry-pick limpo, pai idêntico)

O middleware chama `createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, ...)` em toda requisição. Sem a
variável, o site inteiro responde 500. Ler `supabaseUrl` e `supabaseKey` antes. Se faltarem, rota protegida
redireciona para `/login?redirect=<path>` e o resto segue sem sessão.

**Aceite.** `next dev` sem `NEXT_PUBLIC_SUPABASE_URL`: `/` responde 200 e `/conta` responde 307.
Fazer antes de S-05, porque depois o arquivo passa a ser `proxy.ts`.

---

## S-07 Cache do Next engolindo leituras do Supabase
**Prio** P1 · **Esforço** P · **Risco** B · **Origem** `5148d00` (cherry-pick limpo)

O App Router embrulha o `fetch` global num cache que sobrevive a restart. O supabase-js usa esse fetch.
`force-dynamic` impede o cache da rota, não da chamada interna. O `/api/stores` do Terravik tem o mesmo padrão,
então loja cadastrada no admin pode não aparecer em `/onde-encontrar`.

**Escopo.** Em `getSupabaseAdmin()`, `global.fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' })`.

**Aceite.** Inserir uma loja em `stores` e chamar `/api/stores`: ela aparece sem apagar `.next`.

**Extra, mesma branch.** O hostname do Supabase em `next.config.mjs` do Terravik está fixo em
`lfydrrbmiticiusjznil.supabase.co`, enquanto o `.env.local.example` aponta para outro projeto. Derivar de
`NEXT_PUBLIC_SUPABASE_URL` (origem `46eb3e3`, só este trecho). Sem isso, `next/image` devolve 400 para imagens
do storage do projeto atual.
