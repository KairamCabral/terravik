#!/bin/bash
# Envia as branches empilhadas e abre um PR por historia, cada um com base na branch anterior.
# Uso (Git Bash, na raiz do terravik-store):  bash abrir-prs.sh          -> so mostra o que faria
#                                             bash abrir-prs.sh --executar
set -e
EXEC=$1
BRANCHES=(
docs/conciliacao-adds fix/s-01-escalada-de-perfil fix/s-02-webhooks-falham-fechados fix/s-03-rotas-publicas
chore/s-04-next-14-2-35 fix/s-06-middleware-sem-credenciais fix/s-07-cache-do-supabase
feat/b-01-interruptor-de-indexacao fix/b-02-sitemap-e-noindex fix/b-03-csp fix/b-04-ga4
fix/c-01-dupla-normalizacao fix/c-02-cart-provider fix/c-03-avisos-da-shopify fix/c-04-cupom-real
feat/c-06-catalogo-no-servidor fix/h-01-service-worker feat/u-01-recuperacao-de-senha fix/b-05-json-ld-e-metadata
fix/h-07-painel-admin fix/p-01-preco-honesto fix/p-03-galeria fix/p-04-fluxo-de-compra chore/b-06-guardas-de-build
fix/b-08-contato-area-logada fix/u-02-area-da-conta fix/h-08-acessibilidade feat/c-08-eventos-ga4 fix/h-09-busca
feat/h-03-faq refactor/p-02-card-unico perf/h-02-lcp-e-consultas fix/h-06-dados-fabricados
fix/u-03-pedidos-e-conquistas fix/h-05-video-de-fundo fix/h-04-carrossel-de-depoimentos feat/c-07-frete-faixas fix/cadastro-handle-new-user
)
BASE=master
for B in "${BRANCHES[@]}"; do
  TITULO=$(git log -1 --format=%s "refs/heads/$B" --)
  ID=$(echo "$TITULO" | grep -oE '\(([A-Z]-[0-9]+)[^)]*\)$' | tr -d '()' | cut -d, -f1)
  CORPO=$(printf 'Historia: %s (docs/conciliacao-adds).\n\nCommits desta branch:\n%s\n\nPR empilhado: a base e `%s`. Fazer merge na ordem da pilha.\n\nVerificacao: type-check, lint e build verdes neste ponto da pilha; o aceite executado esta descrito no relatorio da sessao.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)' "${ID:-docs}" "$(git log --format='- %s%n%n%b' "refs/heads/$BASE..refs/heads/$B" -- | grep -v '^Co-Authored-By' | sed '/^$/N;/^\n$/D')" "$BASE")
  echo "== $B  (base: $BASE)  $TITULO"
  if [ "$EXEC" = "--executar" ]; then
    git push -u origin "$B"
    gh pr create --base "$BASE" --head "$B" --title "$TITULO" --body "$CORPO"
  fi
  BASE=$B
done
