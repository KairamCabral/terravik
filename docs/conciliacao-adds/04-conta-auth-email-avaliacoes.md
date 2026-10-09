# Conta, autenticação, e-mail e avaliações

Pré-requisito SQL comum (uma migration): `public.is_admin()` sobre o `get_auth_user_role()` que o Terravik já
tem, e `public.set_updated_at()`. As duas não existem no `schema.sql` do Terravik.

---

## U-01 Recuperação de senha completa
**Prio** P1 · **Esforço** M · **Risco** B · **Origem** `ba2cd14`, `233fd6f`, `25c74b0`, `e3bcf97`

**Problema.** No Terravik a recuperação de senha termina em 404. `auth/callback/route.ts:48` manda `type=recovery`
para `/redefinir-senha`, que não existe. `updatePassword` do `AuthProvider.tsx:146` não tem chamador. Além disso,
o 429 do Supabase ("aguarde 27 segundos") vira "Tente novamente" em `LoginForm.tsx:46`, `CadastroForm.tsx:63` e
`RecuperarSenhaForm.tsx:33`, e obedecer garante o próximo 429.

**Escopo.**
1. `src/lib/auth/erros.ts`: `segundosDeEspera(erro)` reconhece status 429, os códigos
   `over_email_send_rate_limit`, `over_request_rate_limit`, `over_sms_send_rate_limit` e o texto; extrai os
   segundos. `mensagemDeEspera()` para envio de e-mail e `mensagemDeMuitasTentativas()` para login. Nunca dizer
   "tente novamente". O ramo de limite entra antes do genérico e depois dos específicos.
2. `src/lib/auth/senha.ts`: regras de senha (8 caracteres, maiúscula, número) usadas pelo cadastro e pela
   redefinição.
3. `/redefinir-senha` com `noIndex`: estados carregando, sem sessão (link expirado: convite para pedir outro) e
   formulário com duas senhas. Sucesso vai para `/conta`.
4. Tela de sucesso da recuperação: "Comprar na loja não cria login no site. Se você nunca criou uma conta aqui, não
   há senha para recuperar", com link para `/cadastro`. Fala da regra, não do e-mail digitado (sem enumeração).
5. Incluir `/redefinir-senha` em `NOINDEX_NA_PAGINA` (B-02).

**Aceite.** Pedir o link, clicar e ver "Definir nova senha". Senha antiga falha, nova entra. Pedir o link duas
vezes seguidas mostra "Aguarde N segundos".

**Cuidado.** Estilo com tokens e logo do Terravik. `erros.ts` e `senha.ts` entram limpos; os forms, à mão.

---

## U-02 Área da conta que não mente
**Prio** P2 · **Esforço** M · **Risco** B · **Origem** `cfd2c1a`

Todos conferidos no Terravik:

| Arquivo | Defeito | Correção |
|---|---|---|
| `conta/preferencias/page.tsx:52` | descarta o retorno de `updateProfile` e mostra "salvas com sucesso" mesmo com o banco recusando | ler `resultado.success`, mostrar `<div role="alert">` |
| `conta/dados/page.tsx:53, 369` | `shopifyError` nunca renderiza; quem já comprou lê "Faça seu primeiro pedido" | alerta com "Tentar de novo" |
| `conta/dados/page.tsx:460` x `preferencias` | dois controles de "Notificações por e-mail" gravando campos diferentes | tirar o de `/conta/dados`, pôr link para preferências |
| `lib/services/profile.ts:26-54`, `dados/page.tsx:70, 99, 158` | `console.log` com telefone e endereço no navegador | remover |

**Aceite.** Forçar erro no update de preferências mostra alerta. Console sem dado pessoal.

**Não portar** `6dddc0f`: ali a ADDS tirou o verde, que é a identidade do Terravik. Só conferir o contraste dos
chips de status (`AccountPageClient.tsx:53-62`) e, se reprovarem, criar tokens `success.ink` e `warning.ink`.

---

## U-03 Bugs silenciosos de pedidos e conquistas
**Prio** P2 · **Esforço** M · **Risco** M · **Origem** `ccfda98` (parte 1)

Independem do sistema de avaliações. Conferidos no Terravik:

- `api/sync/orders/route.ts:82-86` grava `line_items` sem `product_id`.
- `orders_sync` não tem `tracking_number`, `tracking_url`, `tracking_company`, `customer_email`, `fulfilled_at`,
  `delivered_at`. O botão "Rastrear pedido" (`conta/pedidos/page.tsx:261`) nunca aparece.
- `achievements` nunca foi semeada. `webhooks/shopify/route.ts:137` concede `first_purchase` em vão.
- `api/contact/route.ts` faz `console.log` e responde sucesso sem enviar nada.

**Escopo.** Migration com as colunas, a função `vincular_pedidos_ao_perfil(uuid)` e o trigger em `profiles` (adota
pedidos de quem comprou antes de criar conta). Seed de `achievements` com `on conflict (code) do nothing`.
`product_id` no sync. Webhook `orders/fulfilled` gravando rastreio. `/api/contact` honesto: envia por e-mail (U-04)
ou responde erro.

**Aceite.** Pedido despachado mostra "Rastrear pedido". Primeira compra concede a conquista.

---

## U-04 E-mail transacional com rastro
**Prio** P2 · **Esforço** G · **Risco** A · **Origem** `9835159`, `ccfda98` (`enviar.ts`)

**Problema.** Cadastro e recuperação saem pelo SMTP de desenvolvimento do Supabase: remetente genérico, limite
baixo por hora, sem resposta para "o cliente recebeu?".

**Escopo.**
- Resend por REST em `src/lib/email/enviar.ts` (`server-only`), registrando em `email_log`.
- Supabase, Authentication, Hooks, "Send Email Hook" (HTTP) para `POST /api/auth/email-hook`.
- Assinatura Standard Webhooks em `src/lib/webhooks/standard.ts` (HMAC-SHA256 de `id.timestamp.corpo`, tolerância
  5 minutos, `timingSafeEqual`). Serve Supabase e Resend.
- Link do e-mail montado à mão: `{SUPABASE_URL}/auth/v1/verify?token={token_hash}&type=...&redirect_to=...`.
- Templates (recovery, signup, magiclink, email_change, invite) com a marca do Terravik.
- `POST /api/webhooks/resend` atualiza o status (enviado, entregue, aberto, rejeitado).
- Painel `/admin/emails` com filtro e diagnóstico (chave válida, domínio verificado).
- Migration `email_log` com RLS só leitura para admin.
- Variáveis: `RESEND_API_KEY`, `EMAIL_REMETENTE`, `EMAIL_CONTATO`, `SUPABASE_AUTH_HOOK_SECRET`,
  `RESEND_WEBHOOK_SECRET`.

**Aceite.** Recuperação de senha chega com remetente do Terravik. A linha em `/admin/emails` vai de "enviado" a
"entregue".

**Cuidado.** O hook falha fechado. Com rota errada ou segredo ausente, ninguém recupera senha. Ligar no painel só
com o diagnóstico verde. O parâmetro `token` do link carrega o `token_hash`; trocar quebra o botão.

---

## U-05 Avaliações reais com foto
**Prio** P1 · **Esforço** G · **Risco** A · **Origem** `ccfda98`, `cc3f521`, `5fd93ec` (nota no card)

**Problema.** `src/lib/reviews/data.ts` do Terravik serve 7 depoimentos inventados, seis com `verified: true`.
Risco de confiança e de CDC. Não há como enviar avaliação.

**Escopo (mecanismo, sem conteúdo da ADDS).**
- Migrations: `shopify_products_map`, `product_reviews` (nota 1 a 5, texto 20 a 2000, status pendente, aprovado,
  recusado; índice único por usuário, produto e pedido), `review_media` (até 5 fotos, trigger de limite),
  `review_votes`, `product_review_stats` com `recalcular_stats_do_produto()`, `review_invites`, `email_optouts`.
  Policies: anon só vê aprovado; INSERT só pelo servidor.
- Buckets `avaliacoes-intake` (privado) e `avaliacoes` (público).
- Rotas: `POST /api/avaliacoes` exige login e pedido do usuário com o produto, devolve URL assinada de upload direto
  ao Storage (o corpo serverless da Vercel limita cerca de 4,5 MB). `concluir`, `moderar` (admin; recusa exige
  motivo; aprovação confere bytes mágicos, move mídia e cria cupom na Shopify ANTES de gravar), `elegibilidade`,
  `minhas`, `convites`.
- Convite por e-mail X dias após o envio, cron diário com `CRON_SECRET` e descadastro em um clique.
- UI: formulário, lista, resumo, `/conta/avaliacoes`, `/admin/avaliacoes`.
- `aggregateRating` no JSON-LD e nota no card só com 3 ou mais avaliações.
- `src/lib/supabase/public.ts` com `next: { revalidate, tags }`. Usar `cache: 'no-store'` derrubaria a PDP de ISR
  para dinâmica.
- Rate limit em `/api/avaliacoes` lembrando as três edições (`RATE_LIMIT_PATHS`, `matcher`, `rate-limit.ts`).
- Guarda de build que falha se `src/lib/reviews/data.ts` voltar.
- Testes: `scripts/testa-migrations.js` sobe Postgres em Docker, aplica `schema.sql` e as migrations e roda
  asserções de RLS trocando de papel com `set role` (o `postgres` ignora RLS e não serve de teste).

**Aceite.** Pedido de teste, avaliação com foto em `/conta/pedidos`, aprovação no admin, nota na PDP em segundos.
`anon` não vê pendente.

**Cuidado.** A PDP do Terravik é `[handle]`: encaixar a seção à mão. Upsert do PostgREST não funciona com índice
único parcial (erro 42P10). Precisa de token Admin com `write_discounts` para o cupom. Até lá, a ação mínima é
apagar as 7 avaliações inventadas.

---

## U-06 Cadastro profissional com cupom (opcional)
**Prio** P3 · **Esforço** G · **Risco** M · **Origem** `a7dd663`

Na ADDS é cadastro de dentista com CRO. No Terravik pode ser paisagista ou jardineiro.

**Mecanismo.** Tabela de leads com índice único pelo registro profissional, status pendente, RLS só admin.
`POST /api/<profissional>` valida o formato e grava pendente (409 em duplicado). `/admin/<profissional>` confere à
mão e aprova: o cupom é criado na Shopify PRIMEIRO (`discountCodeBasicCreate`, limite de uso, código sem
caracteres ambíguos) e só depois o status vira aprovado. Envio da mensagem é manual, sem fingir "enviado".
Rate limit na rota.

---

## U-07 Login pela Shopify (opcional, dormente)
**Prio** P3 · **Esforço** G · **Risco** A · **Origem** `4d32406`, `356c77f`, `4c5a970`, `9e265f7`, `fff7859`, `2f828a5`

Só se o Terravik decidir abandonar a senha. Na ADDS está desligado por decisão reversível.

**Mecanismo.** Customer Account API com PKCE. Fica desligado sem `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID`.
Rotas `/api/conta/login`, `callback`, `logout`. Ponte cria ou acha o perfil no Supabase pelo e-mail e abre sessão
sem senha. Tokens em tabela sem policy (só service role), nunca em cookie. Pedidos e endereços ao vivo da Shopify,
com a página Supabase antiga intacta como fallback.

**Armadilhas já pagas.** `redirect_uri` só confia em `NEXT_PUBLIC_SITE_URL` se for https. Cookies transitórios de
30 minutos (o código por e-mail da Shopify dura 15). Com redirect automático, o admin entra por `/login?equipe=1`.
Commits de 20/09 são Next 16: traduzir `await cookies()` e `await searchParams`.
