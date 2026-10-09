#!/usr/bin/env node

/**
 * Teste ponta a ponta do "Adicionar ao carrinho", num Chrome de verdade.
 *
 * Abre uma ou mais PDPs em sequência, clica em "Adicionar ao carrinho" em cada
 * uma, recarrega e confere o carrinho. A interface não serve de prova: o que
 * decide é o cookie do carrinho (loja real) ou o localStorage (modo mock).
 *
 * USO
 *
 *   node scripts/testa-carrinho.js
 *   node scripts/testa-carrinho.js http://localhost:3000/produtos/gramado-novo http://localhost:3000/produtos/verde-rapido
 *   node scripts/testa-carrinho.js --mock      # aceita o carrinho mock como sucesso
 *
 * Sai com código 1 se o carrinho não tiver uma linha por PDP visitada. Sem
 * --mock, exige carrinho real da Shopify (id gid://shopify/Cart/...).
 *
 * Depende de `ws`, dependência transitiva do Next, e de um Chrome instalado.
 * Não roda no build: é ferramenta de verificação manual.
 */

const { spawn } = require('child_process')
const http = require('http')
const fs = require('fs')
const os = require('os')
const path = require('path')

const URLS_PADRAO = [
  'http://localhost:3000/produtos/gramado-novo',
  'http://localhost:3000/produtos/verde-rapido',
]
const args = process.argv.slice(2)
const aceitaMock = args.includes('--mock')
const urls = args.filter((a) => !a.startsWith('--'))
const paginas = urls.length > 0 ? urls : URLS_PADRAO
const PORTA = 9555
const COOKIE = 'terravik-cart-id'
const CHAVE_MOCK = 'terravik_mock_cart'

/** Caminhos usuais do Chrome. O primeiro que existir vence. */
const CANDIDATOS_CHROME = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)

const chromePath = CANDIDATOS_CHROME.find((p) => {
  try {
    return fs.existsSync(p)
  } catch {
    return false
  }
})

if (!chromePath) {
  console.error('Chrome nao encontrado. Defina CHROME_PATH apontando para o executavel.')
  process.exit(1)
}

let WebSocket
try {
  ;({ WebSocket } = require('ws'))
} catch {
  console.error('Modulo `ws` ausente. Rode a partir da raiz do repositorio.')
  process.exit(1)
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

async function alvoDepuracao() {
  for (let i = 0; i < 60; i++) {
    try {
      const lista = await new Promise((res, rej) => {
        http
          .get(`http://127.0.0.1:${PORTA}/json/list`, (r) => {
            let corpo = ''
            r.on('data', (d) => (corpo += d))
            r.on('end', () => res(JSON.parse(corpo)))
          })
          .on('error', rej)
      })
      const pagina = lista.find((t) => t.type === 'page')
      if (pagina) return pagina.webSocketDebuggerUrl
    } catch {
      // Chrome ainda subindo.
    }
    await esperar(250)
  }
  throw new Error('Chrome nao abriu a porta de depuracao')
}

async function main() {
  // Perfil descartável: o teste não pode herdar carrinho de outra execução.
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'tvk-carrinho-'))
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    `--user-data-dir=${perfil}`,
    `--remote-debugging-port=${PORTA}`,
    'about:blank',
  ])

  const ws = new WebSocket(await alvoDepuracao())
  await new Promise((r) => ws.on('open', r))

  let id = 0
  const pendentes = new Map()
  const logs = []

  ws.on('message', (bruto) => {
    const m = JSON.parse(bruto.toString())
    if (m.id && pendentes.has(m.id)) {
      pendentes.get(m.id)(m.result)
      pendentes.delete(m.id)
    }
    if (m.method === 'Log.entryAdded') {
      logs.push(`[${m.params.entry.level}] ${m.params.entry.text}`)
    }
    if (m.method === 'Runtime.consoleAPICalled') {
      const texto = (m.params.args || []).map((a) => a.value ?? a.description ?? '').join(' ')
      if (texto) logs.push(`[${m.params.type}] ${texto}`)
    }
  })

  const cdp = (metodo, params = {}) =>
    new Promise((res) => {
      const meu = ++id
      pendentes.set(meu, res)
      ws.send(JSON.stringify({ id: meu, method: metodo, params }))
    })

  const avaliar = async (expression) =>
    (await cdp('Runtime.evaluate', { expression, returnByValue: true })).result?.value

  await cdp('Page.enable')
  await cdp('Runtime.enable')
  await cdp('Log.enable')
  await cdp('Network.enable')

  for (const url of paginas) {
    console.log(`\nAbrindo ${url}`)
    await cdp('Page.navigate', { url })
    await esperar(9000)

    const clique = await avaliar(`(() => {
      const b = [...document.querySelectorAll('button')]
        .find(x => /adicionar ao carrinho/i.test(x.textContent || '') && !x.disabled)
      if (!b) return 'botao nao encontrado'
      b.click()
      return 'clicado'
    })()`)
    console.log('  botao "Adicionar ao carrinho" : ' + clique)
    await esperar(5000)
  }

  // Recarrega: o carrinho precisa sobreviver.
  await cdp('Page.navigate', { url: paginas[0] })
  await esperar(7000)

  const cookies = await cdp('Network.getCookies')
  const cookieCarrinho = (cookies.cookies || []).find((c) => c.name === COOKIE)
  const valor = cookieCarrinho ? decodeURIComponent(cookieCarrinho.value) : ''
  const carrinhoReal = valor.includes('gid://shopify/Cart/')

  const linhasMock = await avaliar(`(() => {
    try { return JSON.parse(localStorage.getItem('${CHAVE_MOCK}') || '{}').items?.length ?? 0 } catch { return 0 }
  })()`)
  // O contador do carrinho no cabeçalho, depois do reload.
  const contador = await avaliar(`(() => {
    const b = document.querySelector('button[aria-label*="arrinho"]')
    return b ? (b.textContent || '').trim() : 'sem botao de carrinho'
  })()`)

  console.log(`\n  cookie ${COOKIE}        : ${valor || 'ausente'}`)
  console.log(`  linhas no carrinho mock        : ${linhasMock}`)
  console.log(`  contador no cabecalho (reload) : ${contador}`)

  const bloqueios = logs.filter((l) =>
    /content security policy|refused to connect|\[carrinho\]/i.test(l)
  )
  if (bloqueios.length > 0) {
    console.log('\n  Sinais de falha no console:')
    bloqueios.slice(0, 8).forEach((l) => console.log('    ' + l.slice(0, 200)))
  }

  ws.close()
  chrome.kill()

  if (carrinhoReal) {
    console.log('\n  OK: carrinho real criado na Shopify.\n')
    process.exit(0)
  }

  if (aceitaMock && linhasMock === paginas.length) {
    console.log(`\n  OK (modo mock): ${linhasMock} linhas no mesmo carrinho, mantidas apos o reload.\n`)
    process.exit(0)
  }

  console.log(
    '\n  FALHOU: ' +
      (aceitaMock
        ? `esperava ${paginas.length} linhas no carrinho mock.\n`
        : 'nenhum carrinho da Shopify foi criado.\n' +
          '  Suspeitos:\n' +
          '    1. CSP connect-src sem o dominio da loja. Ver next.config.mjs.\n' +
          '    2. Credenciais da Storefront ausentes (o site esta em modo mock?).\n' +
          '    3. Variante sem estoque ou handle divergente entre mock e Shopify.\n')
  )
  process.exit(1)
}

main().catch((erro) => {
  console.error(erro)
  process.exit(1)
})
