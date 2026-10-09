# O que não portar

Commits da ADDS que não devem ir para o Terravik, e por quê. Serve para ninguém perder tempo tentando.

## Anti-história

| Commit | O que fez | Por que não |
|---|---|---|
| `d187e24` | renomeou tokens `terravik-*` para `adds-*` em 38 arquivos | quebra todo cherry-pick posterior nos dois sentidos. Ao portar qualquer commit da ADDS depois de 24/07, resolver o conflito mantendo `terravik-*`. Se um dia quiser limpar nomes, convergir os dois repos para tokens semânticos (`forest`, `gold`, `txt-*`, `border-*`) |

## Identidade da ADDS

| Commit | Conteúdo |
|---|---|
| `32f846d`, `40458e4`, `7293007` | paleta, fontes, logo, copy de higiene bucal |
| `6dddc0f`, `78feca2` (parte visual) | conta e admin sem o verde, que é a identidade do Terravik |
| `824e5f5`, `f8750a7`, `fe9f084` | página Sobre e lojas parceiras da ADDS (o esqueleto de script por slug com upload de logo serve) |
| `917fcc6`, `aa795bd` | frase-âncora e termos de busca da ADDS |
| `df6ea8e`, `1dbc3a1`, `7996555` | as frases proibidas em si (o mecanismo está em H-06) |
| `67fdd95` | mínimo de personalização por produto |
| todos os commits de fotos e vídeos (`c8bf430`, `066f49a`, `1ecb3f1`, `bea023a`, `f3e75ad`, `3e4ece1`, `546e2be`, `fe43975`, `fc97bf8`, `8771214`, `64bb296`, `b363d2a`, `71b3a51`) | mídia da ADDS; só a receita de compressão e os padrões de componente são portáveis |

## Funcionalidade que o Terravik mantém

| Commit | O que a ADDS removeu | Terravik |
|---|---|---|
| `106626a` | calculadora de gramado (virou quiz) | mantém a calculadora. Só a lição: ao remover rota, varrer links, nav, layout, índice da busca e precache do service worker |
| `73270e1`, `14f1c1e`, `9858506` | assinatura (virou "Leve 3") | mantém a assinatura. Portar só `discountAllocations` (C-09) |
| `4e80238` (desligar) | Academia desligada | mantém ligada. O mecanismo de flag está em G-03, com padrão ligado |
| `7da7ea0` (inteiro) | apaga checkout, pedido confirmado e assinatura junto | portar só em fatias (C-02, C-04, C-05) |

## Específico da migração de domínio da ADDS

`d990b90`, `38df727`, `16d245d`, `baea39f`, `136f9fb`, `2364c17`, `1a9b55d`, `74c2f0f`, `dd86240`, `793e805` e
os documentos de `docs/migracao-seo/`. Só servem se o Terravik trocar de domínio ou de plataforma. Nesse caso, os
dois scripts (`gen-redirects.js` e `analisa-baseline.js`) são o ponto de partida, com uma regra aprendida: toda
verificação declara a fonte dos dados no cabeçalho e avisa alto quando cai em fallback.

## Já existe no Terravik

`e1a3514`, `9547fb1`, `13fffba`: correções que vieram do próprio Terravik para a ADDS.

## Dados importados

`44dab9f`, `63f7936`, `9472b54`: 52 avaliações da loja antiga da ADDS. Nunca importar no Terravik.

## Só documentação

Cerca de 35 commits `docs(...)` registram estado de sessão, briefings de mídia, passo a passo de e-mail e o plano
da migração de domínio da ADDS. As lições úteis deles já estão nas histórias. O passo a passo de configuração de
e-mail (`docs/EMAILS.md` na ADDS) serve de roteiro para U-04.

## Commits de controle

`836c5d8` (commit vazio para forçar deploy), `c286326` (URL por id, superado por G-02), `363c4fc` (check de
avaliações da ADDS). Lição de `836c5d8`: na Vercel, variável nova só vale depois de novo deploy.
