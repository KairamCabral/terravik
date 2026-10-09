# Histórias para levar as melhorias da ADDS ao Terravik

Auditoria dos 190 commits (sem merges) que a ADDS fez desde que nasceu como cópia do Terravik.
Ponto de divergência: `b37271b` (19/02/2026). Terravik em `2903cac` (24/07/2026), Next 14.2.21, React 18.
ADDS em `origin/master`, Next 16, React 19.

Cada história abaixo é independente o bastante para virar uma branch e um PR no projeto Terravik.
Todas foram conferidas contra os arquivos reais do Terravik (cópia local somente leitura). Quando o texto diz
"o Terravik tem o mesmo defeito", o arquivo e a linha foram lidos.

## Como usar

1. Abra uma branch por história no repositório do Terravik, a partir de `master`.
2. Não use `git cherry-pick` em bloco. Os arquivos mais tocados (`next.config.mjs`, `metadata.ts`, `verify.js`,
   `CartProvider.tsx`, `ProductPageClient.tsx`) divergem de 200 a 700 linhas. Reimplemente por história.
3. Onde a história diz "limpo", o commit pai é idêntico ao arquivo do Terravik e o cherry-pick aplica.
4. O SHA de origem fica na ADDS: `git show <sha>` no repositório adds-store mostra o diff de referência.

## Regras para não perder a identidade visual do Terravik

- Nunca copiar valor de cor, fonte, logo, foto, vídeo, copy, handle de produto ou promoção da ADDS.
- Copiar mecanismo: componente, helper, query, migration, guarda de build, padrão de acessibilidade.
- Tokens Tailwind do Terravik seguem `terravik-*`, `forest`, `gold`, `cream`. Não renomear para `adds-*`.
  A ADDS fez esse rename em `d187e24` e ele quebra todo cherry-pick posterior (ver `07-nao-portar.md`).
- A ADDS usa tokens que o Terravik não tem: `gold-ink`, `gold-soft`, `forest-soft`, `blue-ink`, `bg-dark`,
  `txt-on-dark`, `border-strong`, `success-ink`. Ao portar, mapear para o equivalente do Terravik que passe em
  contraste AA, ou criar o token em `colors.ts` com o valor do Terravik. O `gold` do Terravik (#B38B25) sobre
  branco dá cerca de 3,2:1 e reprova para texto pequeno.
- `bg-white` em cards e galeria é decisão da ADDS (packshot sobre branco). No Terravik usar o token de superfície
  creme. As fotos dele são PNG transparente, então `object-contain` sobre creme não cria emenda.
- A assinatura, a Academia e a calculadora de gramado são identidade do Terravik. A ADDS removeu as três.
  Nenhuma história aqui remove nada disso.

## Legenda

- **Esforço**: P (até meio dia), M (1 a 2 dias), G (3 a 5 dias).
- **Risco**: B (baixo), M (médio), A (alto, mexe em produção, banco ou cobrança).
- **Prioridade**: P0 crítico de segurança, P1 quebra funcionalidade real, P2 melhoria de qualidade, P3 opcional.

## Ondas recomendadas

| Onda | Objetivo | Histórias |
|---|---|---|
| 0 | Fechar brechas de segurança hoje | S-01, S-02, S-03, S-04 |
| 1 | Produção que mede e entrega certo | B-01, B-02, B-03, B-04, C-01 |
| 2 | Carrinho e catálogo reais | C-02 a C-08 |
| 3 | Conta, senha e e-mail | U-01 a U-05 |
| 4 | PDP, cards e galeria | P-01 a P-08 |
| 5 | Home, performance, admin, acessibilidade | H-01 a H-08 |
| 6 | Opcionais grandes | G-01 a G-04 |

## Índice de histórias

Arquivos: `01-seguranca-e-base.md`, `02-build-seo-csp.md`, `03-shopify-carrinho.md`,
`04-conta-auth-email-avaliacoes.md`, `05-pdp-cards-galeria.md`, `06-home-perf-admin-a11y.md`,
`07-nao-portar.md`.

| ID | Título | Prio | Esforço | Risco |
|---|---|---|---|---|
| S-01 | Fechar escalada de perfil a super_admin | P0 | M | A |
| S-02 | Webhooks e revalidate deixam de falhar abertos | P0 | P | M |
| S-03 | Fechar rotas públicas que vazam ou gravam | P0 | M | M |
| S-04 | Next 14.2.35 (crítica de middleware) | P0 | P | B |
| S-05 | Atualização para Next 16 (PR único) | P2 | G | A |
| S-06 | Middleware sem credenciais não derruba o site | P1 | P | B |
| S-07 | Cache do Next engolindo leituras do Supabase | P1 | P | B |
| B-01 | Interruptor de indexação e robots | P1 | M | M |
| B-02 | Sitemap sem área logada e noindex nas privadas | P1 | M | B |
| B-03 | CSP corrigida (Shopify, viacep, mídia, worker) | P1 | P | B |
| B-04 | GA4 que realmente mede | P1 | P | B |
| B-05 | JSON-LD e metadata corretos | P2 | M | B |
| B-06 | Guardas de build (mock, segredo, SVG, sitemap) | P2 | M | B |
| B-07 | Utilitários de script: parser de .env | P3 | P | B |
| B-08 | /contato tratada como área logada | P2 | P | B |
| B-09 | Data pura exibida com um dia a menos | P3 | P | B |
| C-01 | Fim da dupla normalização e do mock silencioso | P1 | P | B |
| C-02 | CartProvider confiável | P1 | G | A |
| C-03 | Avisos da Shopify no carrinho | P1 | P | B |
| C-04 | Cupom real via Shopify | P1 | M | M |
| C-05 | Checkout direto na Shopify | P1 | M | A |
| C-06 | Catálogo no servidor e guarda contra mock no client | P1 | M | M |
| C-07 | Frete: faixas, simulador por CEP, tabela inventada fora | P2 | G | M |
| C-08 | Eventos de comércio no GA4 | P2 | M | B |
| C-09 | Desconto da Shopify visível na linha do carrinho | P3 | P | B |
| C-10 | Scripts de diagnóstico da loja Shopify | P3 | M | B |
| U-01 | Recuperação de senha completa | P1 | M | B |
| U-02 | Área da conta que não mente | P2 | M | B |
| U-03 | Bugs silenciosos de pedidos e conquistas | P2 | M | M |
| U-04 | E-mail transacional com rastro | P2 | G | A |
| U-05 | Avaliações reais com foto, no lugar das inventadas | P1 | G | A |
| U-06 | Cadastro profissional com cupom (opcional) | P3 | G | M |
| U-07 | Login pela Shopify (opcional, dormente) | P3 | G | A |
| P-01 | Preço honesto | P1 | P | B |
| P-02 | Card de produto único | P2 | M | M |
| P-03 | Galeria: foto inteira, zoom condicionado, tela cheia | P1 | M | B |
| P-04 | Fluxo de compra na PDP | P1 | M | M |
| P-05 | Vídeo de terceiro bloqueado pela CSP | P2 | P | B |
| P-06 | Conteúdo de PDP em três camadas | P3 | G | M |
| P-07 | Vídeo em loop e grade de detalhes na PDP | P3 | M | B |
| P-08 | Vocabulário de ícones | P3 | P | B |
| H-01 | Service worker e cache de vídeo | P1 | P | B |
| H-02 | Performance do LCP e das consultas | P2 | M | B |
| H-03 | FAQ com FAQPage e seção compacta | P2 | M | B |
| H-04 | Carrossel de depoimentos em vídeo | P2 | M | B |
| H-05 | Vídeo de fundo com regras de rede e acessibilidade | P2 | M | B |
| H-06 | Dados fabricados e guarda de alegações | P1 | M | B |
| H-07 | Painel admin com dado real | P2 | M | B |
| H-08 | Acessibilidade estrutural | P2 | G | M |
| H-09 | Busca, representantes e correções pequenas | P2 | P | B |
| H-10 | Blog em MDX com taxonomia | P3 | G | M |
| H-11 | Proteção de mídia contra hotlink | P3 | P | B |
| H-12 | Achados menores da home | P3 | P | B |
| G-01 | Ordem de catálogo em código | P3 | P | B |
| G-02 | URL de produto ancorada em SKU | P3 | M | M |
| G-03 | Feature flag da Academia | P3 | P | B |
| G-04 | Chaves de storage com prefixo | P3 | P | M |
