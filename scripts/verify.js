#!/usr/bin/env node

/**
 * Verificacao PRE-BUILD. Roda sozinha, via `prebuild`, em todo `npm run build`.
 *
 * Este script era `npm run verify`, manual, e exigia arquivos que ja nao
 * existem (src/lib/calculator/engine.ts, public/robots.txt, que e gerado no
 * postbuild e nem e versionado). Saia com codigo 1 e ninguem via, porque
 * ninguem o chamava. Guarda que depende de alguem lembrar de invoca-la nao e
 * guarda.
 *
 * O que ele olha e CONFIGURACAO e FONTE. O que saiu do forno e assunto do
 * scripts/verificar-build.js, no postbuild.
 *
 * Sem dependencia externa: so `fs` e `path`.
 */

const fs = require('fs')
const path = require('path')
const { carregarEnvLocal, motivoDoMock } = require('./lib/env')

const RAIZ = path.resolve(__dirname, '..')
process.chdir(RAIZ)

let errors = 0
let warnings = 0

const err = (m) => {
  console.log(`  ERRO   ${m}`)
  errors++
}
const warn = (m) => {
  console.log(`  aviso  ${m}`)
  warnings++
}
const ok = (m) => console.log(`  ok     ${m}`)

/** Todos os arquivos sob `dirs` cujo nome casa com `filtro`. */
function listarArquivos(dirs, filtro) {
  const pendentes = dirs.filter((d) => fs.existsSync(d))
  const achados = []
  while (pendentes.length > 0) {
    const dir = pendentes.pop()
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
      const caminho = path.join(dir, entrada.name)
      if (entrada.isDirectory()) pendentes.push(caminho)
      else if (filtro.test(entrada.name)) achados.push(caminho)
    }
  }
  return achados.sort()
}

console.log('\nVerificacao pre-build: Terravik Store\n')

// .env.local nao e lido por `node`. O ambiente real ganha do arquivo.
carregarEnvLocal(RAIZ)

// VERCEL_ENV, e nao NODE_ENV: `next build` roda com NODE_ENV=production
// sempre, inclusive na maquina de quem desenvolve, entao NODE_ENV nao
// distingue producao de build local.
const emProducao = process.env.VERCEL_ENV === 'production'

// ─────────────────────────────────────────────────────────────────
// CATALOGO MOCK
//
// A pergunta e feita com as MESMAS tres condicoes do runtime
// (shouldUseMock, em src/lib/shopify/client.ts). Sao variaveis NEXT_PUBLIC_*,
// inlinadas no bundle na hora do build: um token esquecido produz build verde
// que prerenderiza os produtos de exemplo e devolve 404 em todo produto real.
//
// Fora de producao o mock e modo de trabalho normal deste projeto, e so
// avisa. Em producao e erro, e a unica saida e declarar o desvio com
// ALLOW_MOCK_BUILD=1, que grita no log para nao virar permanente por
// esquecimento.
// ─────────────────────────────────────────────────────────────────
console.log('Catalogo')
{
  const motivo = motivoDoMock()
  const valvula = process.env.ALLOW_MOCK_BUILD === '1'

  if (!motivo) {
    ok('credenciais da Shopify presentes, catalogo real')
    if (valvula) {
      warn(
        'ALLOW_MOCK_BUILD=1 ainda esta definido e nao faz mais nada.\n' +
          '         A Shopify esta configurada. Remova a variavel para o ambiente\n' +
          '         nao carregar um desvio que ja terminou.'
      )
    }
  } else if (emProducao && !valvula) {
    err(
      `Build de PRODUCAO com catalogo mock. Motivo: ${motivo}.\n` +
        '         O site subiria com os produtos de exemplo de\n' +
        '         src/lib/shopify/mock-data.ts e 404 em todo produto real, com\n' +
        '         build verde. Configure as credenciais da Shopify no ambiente\n' +
        '         de producao da Vercel.\n' +
        '         Para publicar em mock de proposito: ALLOW_MOCK_BUILD=1.'
    )
  } else if (emProducao) {
    warn(
      `PRODUCAO com catalogo mock (${motivo}), liberado por ALLOW_MOCK_BUILD=1.\n` +
        '         O site publico esta servindo produtos de exemplo. No dia em que\n' +
        '         a Shopify for ligada, apague ALLOW_MOCK_BUILD na Vercel.'
    )
  } else {
    warn(
      `Catalogo mock (${motivo}).\n` +
        '         Normal em build local e preview. Em producao\n' +
        '         (VERCEL_ENV=production) seria erro sem ALLOW_MOCK_BUILD=1.'
    )
  }
}

// ─────────────────────────────────────────────────────────────────
// ANALYTICS
//
// O codigo le NEXT_PUBLIC_GA_MEASUREMENT_ID (ou NEXT_PUBLIC_GA_ID) e, quando
// o valor nao serve, o componente devolve null sem erro: o site vai ao ar
// sem medir nada e ninguem fica sabendo.
//
// A regra de validade e a MESMA de src/lib/analytics/gtag.ts. Mudou la, muda
// aqui.
//
// Escopo estreito de proposito: so exige ID no build que serve o site
// publico (producao COM indexacao ligada). Preview e desenvolvimento seguem
// sem medir, que e o certo.
// ─────────────────────────────────────────────────────────────────
console.log('\nAnalytics')
{
  const indexa = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true'
  const id = (
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_GA_ID ||
    ''
  ).trim()
  const valido = /^G-[A-Z0-9]{4,}$/i.test(id) && !/X{4,}/i.test(id)
  const valvula = process.env.ALLOW_SEM_ANALYTICS === '1'

  if (valido) {
    ok(`GA4 configurado (${id})`)
    if (valvula) {
      warn(
        'ALLOW_SEM_ANALYTICS=1 ainda esta definido e nao faz mais nada.\n' +
          '         O GA4 esta configurado. Remova a variavel.'
      )
    }
  } else if (emProducao && indexa && !valvula) {
    const motivo = id
      ? `O valor "${id}" nao tem a forma de um ID de fluxo do GA4.\n` +
        '         Esperado: G- seguido de letras e numeros. O marcador\n' +
        '         G-XXXXXXXXXX do .env.example e recusado de proposito.'
      : 'Nenhuma das duas variaveis esta definida:\n' +
        '         NEXT_PUBLIC_GA_MEASUREMENT_ID (preferida) ou NEXT_PUBLIC_GA_ID.'
    err(
      'Build do SITE PUBLICO sem Google Analytics.\n' +
        `         ${motivo}\n` +
        '         O ID fica em Administrador > Fluxos de dados, e comeca com "G-".\n' +
        '         Para publicar antes de criar a propriedade: ALLOW_SEM_ANALYTICS=1.'
    )
  } else if (emProducao && indexa) {
    warn(
      'Producao SEM analytics, liberado por ALLOW_SEM_ANALYTICS=1.\n' +
        '         Enquanto durar, nao ha medicao de primeira mao do site.'
    )
  } else {
    ok('sem GA4 valido (so e exigido em producao com indexacao ligada)')
  }
}

// ─────────────────────────────────────────────────────────────────
// ARQUIVOS
//
// So o que o build realmente precisa e que e versionado. Sairam da lista
// antiga: src/lib/calculator/engine.ts (nao existe), public/robots.txt
// (gerado no postbuild), .env.local.example e a conferencia de dependencias
// (o proprio build acusa pacote faltando).
// ─────────────────────────────────────────────────────────────────
console.log('\nArquivos')
{
  const obrigatorios = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/lib/shopify/client.ts',
    'src/lib/shopify/mock-data.ts',
    'next.config.mjs',
    'next-sitemap.config.js',
    'tailwind.config.ts',
    'tsconfig.json',
    'public/manifest.json',
  ]
  const faltando = obrigatorios.filter((f) => !fs.existsSync(f))
  if (faltando.length === 0) ok(`${obrigatorios.length} arquivos obrigatorios presentes`)
  else faltando.forEach((f) => err(`${f} FALTANDO`))
  ;[
    ['public/images/og/default.jpg', 'imagem Open Graph padrao'],
    ['public/apple-touch-icon.png', 'apple touch icon'],
    ['public/favicon.svg', 'favicon'],
  ].forEach(([p, rotulo]) => {
    if (!fs.existsSync(p)) warn(`${rotulo} ausente (${p})`)
  })
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE CLIENTE NAO IMPORTA O CATALOGO MOCK
//
// Arquivo que roda no NAVEGADOR lendo dados de exemplo serve esses dados em
// producao, com build verde, porque nenhuma decisao de servidor o alcanca.
// O catalogo se resolve no servidor e desce por prop (historia C-06).
//
// Pega o padrao direto: arquivo cuja primeira instrucao e 'use client' e que
// tem `from '...shopify/mock-data'`. NAO pega o caso transitivo (client que
// importa uma lib que importa o mock, como src/lib/shopify/mock-cart.ts):
// e limitacao conhecida, cobrir isso exigiria seguir o grafo de imports.
//
// Servidor pode importar o mock a vontade: la ele e fallback legitimo.
// ─────────────────────────────────────────────────────────────────
console.log('\nCatalogo mock em componente cliente')
{
  const suspeitos = listarArquivos(['src'], /\.(tsx?|jsx?|mjs)$/).filter((caminho) => {
    const fonte = fs.readFileSync(caminho, 'utf8')

    // A diretiva so vale como primeira instrucao: comentario antes dela pode.
    const semCabecalho = fonte
      .replace(/^﻿/, '')
      .replace(/^(?:\s+|\/\*[\s\S]*?\*\/|\/\/[^\n]*)+/, '')
    if (!/^['"]use client['"]/.test(semCabecalho)) return false

    // Import de verdade, e nao mencao em comentario: a forma
    // `from '...shopify/mock-data'` so aparece em declaracao de import/export.
    return /\bfrom\s+['"][^'"\n]*shopify\/mock-data(?:\.[jt]sx?)?['"]/.test(fonte)
  })

  if (suspeitos.length === 0) {
    ok('nenhum componente cliente importa mock-data')
  } else {
    suspeitos.forEach((f) =>
      err(
        `${f} e 'use client' e importa o catalogo mock.\n` +
          '         Componente cliente serviria dados de exemplo em producao, com\n' +
          '         build verde. Resolva o catalogo no servidor e passe por prop.'
      )
    )
  }
}

// ─────────────────────────────────────────────────────────────────
// SVG PRECISA DO PROLOGO XML
//
// O otimizador de imagem do Next 14 reconhece SVG por uma unica assinatura
// de bytes: '<?xml'. Arquivo que comeca direto em '<svg' nao e reconhecido, e
// /_next/image responde 400 "The requested resource isn't a valid image". O
// arquivo serve normal pela URL direta e so falha atraves do next/image, sem
// quebrar o build.
// ─────────────────────────────────────────────────────────────────
console.log('\nSVGs (prologo XML exigido pelo next/image)')
{
  const svgs = listarArquivos(['public'], /\.svg$/i)
  const semProlog = svgs.filter(
    (f) => !fs.readFileSync(f, 'utf8').replace(/^﻿/, '').trimStart().startsWith('<?xml')
  )

  if (semProlog.length === 0) {
    ok(`${svgs.length} SVG(s) com prologo`)
  } else {
    semProlog.forEach((f) =>
      err(
        `${f} nao comeca com <?xml: /_next/image devolve 400.\n` +
          '         Acrescente <?xml version="1.0" encoding="UTF-8"?> na primeira linha.'
      )
    )
  }
}

// ─────────────────────────────────────────────────────────────────
// ALEGACOES SEM PROVA
//
// Frase de venda que o site nao consegue provar e publicidade enganosa (CDC,
// art. 37), e e exatamente o tipo de texto que alguem escreve de novo sem
// conferir. Cada item diz o que procurar e qual e a prova que falta:
//
//   { nome: 'rotulo curto', frases: [/regex/i, ...], prova: 'por que nao vale' }
//
// Campo opcional `exceto: RegExp[]`, casado contra o CAMINHO do arquivo, para
// onde a frase aparece legitimamente.
//
// A lista entrou com a historia H-06, depois de cada frase ser retirada do
// site. E a lista do TERRAVIK: o que ja foi publicado aqui sem fonte.
//
// Comentario de codigo conta. Varre src/, content/ (se existir) e public/,
// onde SVG carrega texto desenhado. NAO varre scripts/ nem docs/: esta lista
// e as historias citam as frases sem afirma-las.
//
// As regras de numero solto (sem a palavra ao lado) deixam SVG de fora:
// coordenada de path tem a mesma cara e reprovaria desenho inocente. As
// regras com vocabulario ("... gramados", "... avaliacoes") valem em tudo.
// ─────────────────────────────────────────────────────────────────
console.log('\nAlegacoes sem prova')
{
  const SO_SVG = [/\.svg$/i]

  const ALEGACOES = [
    {
      nome: 'uma contagem de clientes sem fonte (2.847)',
      frases: [
        /2\.847\+?\s*(gramados|fam[ií]lias|alunos|avalia|jardins|assinantes|clientes)/i,
      ],
      prova:
        'O numero 2.847 foi publicado como gramados, familias, alunos e\n' +
        '         avaliacoes ao mesmo tempo, sem pedido, cadastro ou medicao que o\n' +
        '         sustente. Contagem so entra lida de uma fonte real (banco, Shopify).',
    },
    {
      nome: 'o numero 2.847 (ou 2847) solto',
      frases: [/(?<![\d.,])2\.847(?!\d)/, /(?<![\d.,])2847(?![\d.,]\d)/],
      exceto: SO_SVG,
      prova:
        'Mesma contagem inventada, agora como valor de constante ou rotulo.\n' +
        '         Se for coincidencia legitima (preco, medida), ajuste a guarda.',
    },
    {
      nome: '"50K+" de calculos ou gramados',
      frases: [/50\s?K\s?\+/i, /50\s?mil\s?\+?\s+(gramados|c[aá]lculos|clientes|fam[ií]lias)/i],
      // PENDENCIA CONHECIDA: FAQSection.tsx ainda afirma "mais de 50 mil
      // gramados" (resposta e destaque da primeira pergunta). O arquivo estava
      // fora do alcance da H-06. Retirada a frase, apague esta excecao.
      exceto: [/home[\\/]FAQSection\.tsx$/],
      prova:
        'Nao ha contador de uso da calculadora nem base de 50 mil clientes.\n' +
        '         Volume so entra lido do analytics ou do banco.',
    },
    {
      nome: '"98%" de satisfacao ou recomendacao',
      frases: [
        /98\s?%\s*(de\s+)?(satisfa|recomend|dos\s+clientes|aprova)/i,
        // A forma em que estava no codigo: { value: '98%', label: 'Satisfacao' }.
        /['"`>]\s*98\s?%\s*['"`<]/,
      ],
      prova:
        'Nunca houve pesquisa de satisfacao. Percentual so entra com a\n' +
        '         pesquisa (amostra, data, pergunta) citada ao lado.',
    },
    {
      nome: 'uma nota media de avaliacoes inventada',
      frases: [
        /4[.,][89]\s?\/\s?5/,
        /1\.423\s*avalia/i,
        /(?<![\d.,])1423(?![\d.,]\d)/,
        /averageRating\s*:\s*4[.,]\d/,
      ],
      exceto: SO_SVG,
      prova:
        'O site nao tem sistema de avaliacoes de comprador (historia U-05).\n' +
        '         Nota e contagem so entram calculadas de avaliacoes reais.',
    },
    {
      nome: 'um telefone de exemplo',
      frases: [
        /5511999999999/,
        /55X{6,}/,
        /0800[\s.-]?123[\s.-]?4567/,
        /wa\.me\/\d*X{3,}/i,
      ],
      prova:
        'Numero de exemplo publicado manda o cliente para um desconhecido.\n' +
        '         Telefone e WhatsApp vem de CONTATO, em src/lib/utils/constants.ts,\n' +
        '         que fica vazio (e o botao some) ate o dono informar o numero real.',
    },
    {
      nome: 'um marcador de exemplo esquecido',
      frases: [/SEU_LINK_AQUI/, /X{8,}/],
      // O comentario de gtag.ts explica por que o marcador G-XXXXXXXXXX do
      // .env.example e recusado em tempo de execucao: cita, nao usa.
      exceto: [/analytics[\\/]gtag\.ts$/],
      prova:
        'Marcador de preenchimento chegou ao site como se fosse dado. Link ou\n' +
        '         identificador sem valor real nao e renderizado.',
    },
    {
      nome: 'o valor do frete gratis escrito a mao',
      frases: [/frete\s+gr[aá]tis\s+(acima|a\s+partir)\s+de\s+R\$\s?\d/i],
      // PENDENCIA CONHECIDA: ProductsPageClient.tsx ainda traz o valor a mao
      // (e diferente do config). O arquivo estava fora do alcance da H-06.
      // Quando ele passar a usar fraseFreteGratis(), apague esta excecao.
      exceto: [/produtos[\\/]ProductsPageClient\.tsx$/],
      prova:
        'O valor oficial esta em FREE_SHIPPING_CONFIG (src/lib/shipping/config.ts).\n' +
        '         Use fraseFreteGratis() ou limiteFreteGratis(): numero digitado no\n' +
        '         componente diverge do config no dia em que o valor muda.',
    },
  ]

  const arquivos = listarArquivos(
    ['src', 'content', 'public'],
    /\.(tsx?|jsx?|mdx?|json|svg)$/i
  )
  const achados = []

  if (ALEGACOES.length > 0) {
    for (const caminho of arquivos) {
      const aplicaveis = ALEGACOES.filter(
        (a) => !(a.exceto || []).some((re) => re.test(caminho))
      )
      if (aplicaveis.length === 0) continue

      fs.readFileSync(caminho, 'utf8')
        .split('\n')
        .forEach((linha, i) => {
          for (const alegacao of aplicaveis) {
            if (alegacao.frases.some((re) => re.test(linha))) {
              achados.push({ onde: `${caminho}:${i + 1}`, alegacao })
            }
          }
        })
    }
  }

  if (ALEGACOES.length === 0) {
    ok(`lista vazia; ${arquivos.length} arquivo(s) no alcance da varredura`)
  } else if (achados.length === 0) {
    ok(
      `nenhuma alegacao sem prova em ${arquivos.length} arquivo(s) ` +
        `(${ALEGACOES.map((a) => a.nome).join(', ')})`
    )
  } else {
    achados.forEach(({ onde, alegacao }) =>
      err(
        `${onde} afirma ${alegacao.nome}.\n` +
          `         ${alegacao.prova}\n` +
          '         Se a prova aparecer, ajuste esta guarda junto, com ela no comentario.'
      )
    )
  }
}

// ─────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(64))
if (errors > 0) {
  console.log(`\n  ${errors} erro(s), ${warnings} aviso(s). BUILD ABORTADO.\n`)
  process.exit(1)
}
console.log(
  warnings > 0 ? `\n  Sem erros. ${warnings} aviso(s).\n` : '\n  Tudo certo.\n'
)
