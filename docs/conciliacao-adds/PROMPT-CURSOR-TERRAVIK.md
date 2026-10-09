# Prompt para o Cursor no projeto Terravik

Cole o bloco abaixo no chat do Cursor, com o projeto `terravik-store` aberto.

```text
Você vai trabalhar no projeto terravik-store (loja Terravik, fertilizantes para gramado, Next.js 14.2.21,
React 18, Shopify headless, Supabase). Existe um projeto irmão, o adds-store, que nasceu como cópia deste
aqui e recebeu 190 commits de correções e melhorias. Uma auditoria comparou os dois e produziu 57 histórias
do que vale trazer para cá. Sua tarefa é implementar essas histórias neste projeto, uma por vez, sem mudar
a identidade visual do Terravik.

ONDE ESTÁ O MATERIAL

- Histórias: D:\2 PESSOAL\0 CURSOR\ADDS\adds-store\docs\conciliacao\
  Comece pelo README.md (índice, prioridades, ondas, regras). Depois os arquivos 01 a 07.
  Se a pasta não existir no disco, ela está na branch docs/historias-para-terravik do repositório
  github.com/KairamCabral/adds-store.
- Código de referência: o repositório adds-store em D:\2 PESSOAL\0 CURSOR\ADDS\adds-store.
  Cada história cita os commits de origem. Para ver o que foi feito lá:
    git -C "D:\2 PESSOAL\0 CURSOR\ADDS\adds-store" show <sha>
    git -C "D:\2 PESSOAL\0 CURSOR\ADDS\adds-store" show <sha> -- <arquivo>
  O adds-store é SOMENTE LEITURA. Nunca edite, faça checkout, commit ou push lá.

PRIMEIRO PASSO, ANTES DE QUALQUER CÓDIGO

1. Copie a pasta de histórias para docs/conciliacao-adds/ deste projeto, para ela não depender da branch
   do outro repositório.
2. Leia o README.md inteiro e o arquivo 07-nao-portar.md.
3. Me devolva um resumo curto do que entendeu e a lista das histórias da Onda 0, e espere meu ok.

COMO TRABALHAR CADA HISTÓRIA

1. Uma história, uma branch, um PR. Branch criada a partir de master atualizada, com nome
   fix/, feat/, chore/ ou docs/ seguido do assunto (exemplo: fix/s-01-escalada-de-perfil).
2. Antes de editar, abra os arquivos do Terravik que a história cita e confirme que o defeito ainda
   está lá. As linhas citadas são da auditoria e podem ter mudado. Se o defeito não existir mais,
   pare e me avise em vez de inventar trabalho.
3. Leia o diff de origem no adds-store para entender o mecanismo. Depois reimplemente aqui.
   Não use git cherry-pick, a não ser que a história diga "cherry-pick limpo". Os arquivos grandes
   (next.config.mjs, metadata.ts, verify.js, CartProvider.tsx, ProductPageClient.tsx) divergem
   centenas de linhas entre os dois projetos.
4. Faça só o escopo da história. Achou outro problema no caminho? Anote e me conte no fim, não conserte junto.
5. Ao terminar, rode npm run type-check, npm run lint e npm run build, e execute os passos da seção
   "Aceite" da história. Me mostre o resultado real de cada um. Se algo falhar, diga que falhou.
6. Descreva o PR com: o problema, o que mudou, como foi verificado e o ID da história.
7. Pare e espere minha revisão antes de começar a próxima história.

ORDEM

Siga as ondas do README. Onda 0 (S-01 a S-04) é segurança e vem antes de tudo. Dentro da frente de
carrinho, a ordem C-01, C-02, C-03, C-04, C-05 é obrigatória. S-05 (Next 16) só depois de tudo que
edita src/middleware.ts. Histórias marcadas P3 ou "opcional" só com meu pedido explícito.

IDENTIDADE VISUAL DO TERRAVIK, REGRAS QUE NÃO SE QUEBRAM

- Traga mecanismo, nunca aparência. Componente, helper, query, migration, guarda de build e padrão de
  acessibilidade podem vir. Cor, fonte, logo, foto, vídeo, texto, nome de produto, handle e promoção
  da ADDS não podem.
- Paleta e tipografia do Terravik ficam como estão: verde, dourado e creme, tokens forest, gold, cream
  e terravik-*. Não renomeie tokens. Não crie token com nome adds-*.
- O código da ADDS usa tokens que não existem aqui: gold-ink, gold-soft, forest-soft, blue, blue-ink,
  bg-dark, txt-on-dark, border-strong, success-ink. Para cada um, use o token equivalente do Terravik.
  Se não houver equivalente que passe em contraste AA (4,5:1 para texto pequeno), crie o token em
  src/design-system/colors.ts com um valor da paleta do Terravik e me avise qual valor escolheu.
- Onde a ADDS usa bg-white em card e galeria, use a superfície creme do Terravik.
- Todo texto visível continua falando de gramado e fertilizante. Se um diff trouxer texto de higiene
  bucal, escova, dentista ou CRO, descarte o texto e mantenha só a estrutura.
- Assinatura, Academia (cursos) e calculadora de gramado são funcionalidades do Terravik e ficam.
  A ADDS removeu as três. Nenhuma história autoriza remover nada disso. O terceiro parâmetro
  subscriptionData de addItem continua existindo.
- Mudança que altere o que o cliente vê além do necessário para corrigir o defeito: me mostre antes.
- Texto novo para o site: sem travessão. Use vírgula, dois-pontos ou ponto.

PARE E ME PERGUNTE ANTES DE

- Aplicar qualquer migration ou SQL no Supabase. Escreva o arquivo em supabase/migrations/ e me mostre.
  Eu aplico ou autorizo.
- Mudar variável de ambiente na Vercel, configuração no painel da Shopify, do Supabase ou do Resend.
  Liste o que eu preciso configurar e em que ordem em relação ao deploy.
- Apagar rota, página ou componente que ainda tenha uso.
- Qualquer história com Risco A no índice.
- As decisões que são minhas: destino do /checkout próprio e do order bump (C-05), vídeo do YouTube
  na página de produto (P-05), se o /blog continua redirecionando para a Academia (H-10).

ARMADILHAS JÁ CONHECIDAS

- Este projeto é Next 14. Vários commits da ADDS depois de 12/09/2026 são Next 16. Aqui params,
  searchParams e cookies() são síncronos, o arquivo é src/middleware.ts (não proxy.ts), a prop de
  imagem é priority (não preload), e revalidateTag recebe um argumento só.
- A página de produto aqui é src/app/produtos/[handle]/. Na ADDS é [...slug]/.
- Algumas correções falham fechadas. Sem SHOPIFY_WEBHOOK_SECRET, REVALIDATE_SECRET e
  SUPABASE_SERVICE_ROLE_KEY definidos na Vercel antes do deploy, webhooks e escritas param.
- O interruptor de indexação (B-01) tira o site do Google se NEXT_PUBLIC_ALLOW_INDEXING=true não
  estiver em produção antes do merge.
- A guarda de build contra mock em client (B-06) reprova três arquivos deste projeto. Corrija-os
  primeiro (C-06).
- Nunca use git add -A. Adicione só os arquivos da história. Nunca commite .env.local nem cópias dele.
- No Git Bash do Windows, caminho começando com / vira caminho do Windows. Para testar rotas com curl,
  use MSYS_NO_PATHCONV=1.

COMECE AGORA pelo primeiro passo: copiar a pasta, ler o README e o 07, e me devolver o resumo com a
lista da Onda 0.
```
