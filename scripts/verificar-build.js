#!/usr/bin/env node

/**
 * Assercao POS-BUILD sobre o que foi realmente gerado.
 *
 * A verificacao pre-build (scripts/verify.js) olha configuracao e fonte. Esta
 * olha RESULTADO: quais PDPs sairam do forno, o que o sitemap anuncia e o que
 * foi parar nos arquivos que o navegador baixa.
 *
 * Roda no `postbuild`, depois do next-sitemap. Sem dependencia externa.
 */

const fs = require('fs')
const path = require('path')
const { carregarEnvLocal, motivoDoMock } = require('./lib/env')

const RAIZ = path.resolve(__dirname, '..')

// Mesmo ambiente que o `next build` enxergou. O ambiente real ganha do arquivo.
carregarEnvLocal(RAIZ, { avisarDuplicadas: false })

function morrer(titulo, corpo) {
  console.error('\n' + '━'.repeat(70))
  console.error(`  BUILD REPROVADO: ${titulo}`)
  console.error('━'.repeat(70))
  console.error(corpo.trimEnd() + '\n')
  process.exit(1)
}

const aviso = (m) => console.log(`  AVISO  ${m}`)
const ok = (m) => console.log(`  ok     ${m}`)

// ═════════════════════════════════════════════════════════════════
// 1. AS PDPs GERADAS SAO AS DO MOCK?
//
// O caso que passa por todas as outras defesas: a loja esta configurada, a
// Shopify responde (ou falha em silencio), o app cai para o catalogo de
// exemplo e o build termina verde. Nao ha erro nenhum para o TypeScript, o
// lint ou o build verem: so o catalogo errado.
//
// So REPROVA quando a loja esta configurada. Em modo mock de proposito os
// handles SAO os do mock, e isso e o esperado: ai so avisa.
// ═════════════════════════════════════════════════════════════════
function conferirPdps() {
  console.log('\nAssercao pos-build: PDPs geradas\n')

  const manifesto = path.join(RAIZ, '.next', 'prerender-manifest.json')
  if (!fs.existsSync(manifesto)) {
    morrer(
      'prerender-manifest.json nao encontrado',
      `  Esperado em ${path.relative(RAIZ, manifesto)}.
  Sem ele nao da para saber o que o build gerou. Rode \`npm run build\`.`
    )
  }

  const rotas = Object.keys(JSON.parse(fs.readFileSync(manifesto, 'utf8')).routes || {})
  const handles = rotas
    .filter((r) => /^\/produtos\/[^/]+$/.test(r))
    .map((r) => decodeURIComponent(r.replace('/produtos/', '')))
    .sort()

  // Os handles do mock sao lidos da fonte, e nao copiados para ca: lista
  // copiada deriva em silencio no dia em que o mock ganha um produto.
  const fonteMock = path.join(RAIZ, 'src', 'lib', 'shopify', 'mock-data.ts')
  const handlesMock = fs.existsSync(fonteMock)
    ? [
        ...new Set(
          [...fs.readFileSync(fonteMock, 'utf8').matchAll(/^\s*handle:\s*['"]([^'"]+)['"]/gm)].map(
            (m) => m[1]
          )
        ),
      ].sort()
    : []

  if (handlesMock.length === 0) {
    aviso(
      'nao consegui ler os handles de src/lib/shopify/mock-data.ts.\n' +
        '         O cheque "catalogo gerado e o mock" NAO rodou.'
    )
    return
  }

  const igualAoMock =
    handles.length === handlesMock.length && handlesMock.every((h) => handles.includes(h))
  const motivo = motivoDoMock()

  if (motivo) {
    aviso(
      `modo mock (${motivo}): ${handles.length} PDP(s) prerenderizada(s),\n` +
        `         ${igualAoMock ? 'exatamente as do catalogo de exemplo' : 'conjunto: ' + (handles.join(', ') || '(nenhuma)')}.\n` +
        '         Esperado enquanto a Shopify nao estiver ligada.'
    )
    return
  }

  if (igualAoMock) {
    morrer(
      'o catalogo gerado E o catalogo mock',
      `  A loja esta configurada, e mesmo assim as ${handles.length} PDPs geradas sao
  EXATAMENTE os handles de src/lib/shopify/mock-data.ts:

      ${handles.join(', ')}

  A Shopify nao foi consultada, ou respondeu e o resultado foi descartado.
  Este site iria ao ar com produtos de exemplo e 404 em todo produto real.

  O que verificar, nesta ordem:
    1. NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN e o .myshopify.com correto?
    2. NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN e de Storefront API?
    3. Os produtos estao publicados no canal de vendas do token?
    4. Os handles reais sao mesmo iguais aos do mock? Se forem, o mock precisa
       de um handle que nao exista na loja para esta guarda ter o que medir.`
    )
  }

  ok(`${handles.length} PDP(s), conjunto difere do catalogo mock`)
}

// ═════════════════════════════════════════════════════════════════
// 2. NENHUMA URL DO SITEMAP PODE ESTAR NOINDEX
//
// Sitemap dizendo "indexe" e meta dizendo "nao indexe" e sinal contraditorio,
// e rastreio gasto para o Google descobrir isso. A lista NOINDEX_NA_PAGINA de
// next-sitemap.config.js e mantida a mao; este cheque e o que avisa quando
// uma rota ganha noIndex e ninguem lembra de tira-la do sitemap.
// ═════════════════════════════════════════════════════════════════
function conferirSitemap() {
  console.log('\nAssercao pos-build: sitemap x noindex\n')

  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== 'true') {
    console.log('         pulado: indexacao desligada (NEXT_PUBLIC_ALLOW_INDEXING),')
    console.log('         entao TODA pagina esta noindex por decisao.')
    return
  }

  const dirPublic = path.join(RAIZ, 'public')
  const sitemaps = fs.existsSync(dirPublic)
    ? fs.readdirSync(dirPublic).filter((n) => /^sitemap-\d+\.xml$/.test(n))
    : []
  if (sitemaps.length === 0) {
    morrer(
      'nenhum public/sitemap-N.xml encontrado',
      '  O next-sitemap roda antes deste script no postbuild e deveria te-lo gerado.'
    )
  }

  const dirApp = path.join(RAIZ, '.next', 'server', 'app')
  const conflitos = []
  let checadas = 0
  let total = 0

  for (const nome of sitemaps) {
    const xml = fs.readFileSync(path.join(dirPublic, nome), 'utf8')
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      total++
      let rota
      try {
        rota = decodeURIComponent(new URL(m[1].trim()).pathname).replace(/\/$/, '')
      } catch {
        continue
      }
      const html = path.join(dirApp, `${rota || '/index'}.html`)
      if (!fs.existsSync(html)) continue // rota dinamica, sem HTML estatico
      checadas++

      // Toda meta robots do documento, em qualquer ordem de atributos.
      const metas = fs.readFileSync(html, 'utf8').match(/<meta\b[^>]*>/gi) || []
      const robots = metas
        .filter((t) => /\bname=["'](?:robots|googlebot)["']/i.test(t))
        .map((t) => (/\bcontent=["']([^"']*)["']/i.exec(t) || [])[1] || '')
      const proibe = robots.find((c) => /noindex/i.test(c))
      if (proibe) conflitos.push(`${rota || '/'} -> ${proibe}`)
    }
  }

  if (conflitos.length > 0) {
    morrer(
      `${conflitos.length} URL(s) no sitemap com noindex`,
      `  ${conflitos.join('\n  ')}

  O sitemap pede indexacao e a meta tag proibe.

  Escolha um lado:
    - a pagina deve ser indexada  -> tire o noIndex do metadata da rota
    - a pagina nao deve           -> acrescente a rota a NOINDEX_NA_PAGINA em
                                     next-sitemap.config.js`
    )
  }

  if (checadas === 0) {
    aviso(
      `${total} URL(s) no sitemap, mas nenhum HTML estatico em .next/server/app.\n` +
        '         O cruzamento NAO conferiu nada.'
    )
    return
  }
  ok(`${checadas} de ${total} URL(s) do sitemap conferidas no HTML, nenhuma noindex`)
}

// ═════════════════════════════════════════════════════════════════
// 3. SEGREDO NO BUNDLE DO NAVEGADOR
//
// Uma cadeia de imports basta: um componente 'use client' importa algo que
// importa, alguns niveis abaixo, um modulo que le a chave de servico. O Next
// so inlina variaveis NEXT_PUBLIC_, entao o VALOR nao vaza: a protecao e
// acidental. Basta alguem renomear a variavel com o prefixo publico para a
// chave que ignora toda a RLS ser servida a qualquer visitante.
//
// Este cheque pega as duas pontas: a LEITURA da variavel em chunk de
// navegador (sinal de modulo de servidor arrastado) e o FORMATO de chave
// (valor que chegou ao bundle por qualquer caminho).
// ═════════════════════════════════════════════════════════════════
function conferirSegredos() {
  console.log('\nAssercao pos-build: segredo no bundle do navegador\n')

  // Lista, e nao um caminho so: na Vercel quem roda e `vercel build`, que
  // reorganiza a saida no formato Build Output API antes do nosso postbuild.
  const CANDIDATOS = [
    path.join(RAIZ, '.next', 'static', 'chunks'),
    path.join(RAIZ, '.vercel', 'output', 'static', '_next', 'static', 'chunks'),
    path.join(RAIZ, '.next', 'static'),
    path.join(RAIZ, '.vercel', 'output', 'static'),
  ]
  const dirChunks = CANDIDATOS.find((c) => fs.existsSync(c))

  // Variaveis cuja LEITURA jamais deve aparecer no que o navegador baixa.
  //
  // Procura-se `env.NOME`, e nao o nome solto: uma frase de ajuda numa tela do
  // admin ("preencha SHOPIFY_ADMIN_ACCESS_TOKEN com o token que comeca em
  // shpat_") e texto para uma pessoa ler e nao tem segredo nenhum. Guarda que
  // reprova o certo e desligada na primeira semana.
  const NOMES_PROIBIDOS = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'SHOPIFY_ADMIN_ACCESS_TOKEN',
    'SHOPIFY_WEBHOOK_SECRET',
    'REVALIDATE_SECRET',
  ]

  // Formato de segredo, e nao o valor: comparar com o valor poria o segredo na
  // memoria deste script e no risco de acabar num log de CI.
  const FORMATOS = [
    [/\bsb_secret_[A-Za-z0-9_-]{10,}/, 'chave de servico do Supabase (sb_secret_)'],
    [/\bshpat_[a-f0-9]{32}/, 'token Admin da Shopify (shpat_)'],
    [/\bshpss_[a-f0-9]{32}/, 'segredo da Shopify (shpss_)'],
    [/\bwhsec_[A-Za-z0-9+/=_-]{20,}/, 'segredo de webhook (whsec_)'],
    [/\bre_(?:[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}|[A-Za-z0-9]{20,})/, 'chave do Resend (re_)'],
  ]

  // Nao achar a pasta nao e vazamento, e o cheque cego. Derrubar o build por
  // cegueira transforma rede de protecao em interrupcao: avisa alto e passa.
  if (!dirChunks) {
    aviso(
      'nenhum diretorio de chunk encontrado. O cheque NAO rodou.\n' +
        '         Procurado em:\n' +
        CANDIDATOS.map((c) => '           ' + path.relative(RAIZ, c)).join('\n') +
        '\n         Se a saida do build mudou de lugar, acrescente o caminho a\n' +
        '         CANDIDATOS em scripts/verificar-build.js.'
    )
    return
  }

  const arquivos = []
  const empilhar = (dir) => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const alvo = path.join(dir, item.name)
      if (item.isDirectory()) empilhar(alvo)
      else if (/\.(js|mjs)$/.test(item.name)) arquivos.push(alvo)
    }
  }
  empilhar(dirChunks)

  const achados = []
  for (const arquivo of arquivos) {
    const conteudo = fs.readFileSync(arquivo, 'utf8')
    const relativo = path.relative(RAIZ, arquivo)

    for (const nome of NOMES_PROIBIDOS) {
      // `env.NOME` ou `env["NOME"]`: as duas formas que sobrevivem a
      // minificacao quando codigo de servidor e arrastado para um chunk.
      const leitura = new RegExp(`\\benv\\s*(?:\\.\\s*${nome}\\b|\\[\\s*["'\`]${nome}["'\`]\\s*\\])`)
      if (leitura.test(conteudo)) achados.push(`${relativo}\n      le a variavel ${nome}`)
    }
    for (const [formato, oQueE] of FORMATOS) {
      if (formato.test(conteudo)) achados.push(`${relativo}\n      contem o que parece ser ${oQueE}`)
    }
  }

  if (achados.length > 0) {
    morrer(
      `${achados.length} indicio(s) de segredo em chunk de navegador`,
      `  ${achados.join('\n  ')}

  Estes arquivos sao baixados por qualquer visitante.

  O caminho mais comum e uma cadeia de imports: um componente 'use client'
  importa algo que importa, alguns niveis abaixo, um modulo de servidor.
  Procure o nome da variavel no chunk para achar a cadeia.

  A correcao e \`import 'server-only'\` no modulo de servidor, e mover para um
  arquivo sem dependencias a funcao que o componente cliente realmente usava.`
    )
  }

  ok(
    `${arquivos.length} chunk(s) em ${path.relative(RAIZ, dirChunks)}: ` +
      'nenhum le segredo nem tem formato de chave'
  )
}

conferirPdps()
conferirSitemap()
conferirSegredos()
console.log()
