/**
 * Leitura dos arquivos .env para os scripts, com a mesma semantica do Next.
 *
 * `node script.js` nao carrega .env.local sozinho; quem faz isso e o Next,
 * dentro do build. Uma guarda que le variavel de ambiente precisa enxergar o
 * mesmo valor que o site vai enxergar, senao ela mede outra coisa.
 *
 * Duas regras, e so estas:
 *
 *   1. O AMBIENTE REAL sempre ganha do arquivo. Na Vercel e no CI nao existe
 *      .env.local e as variaveis vem do ambiente. Sobrescrever process.env com
 *      o arquivo faria a guarda ler o valor errado justamente onde ela mais
 *      importa, e impediria testar passando a variavel na linha de comando.
 *
 *   2. Dentro de um ARQUIVO, a ultima ocorrencia da chave vence, como no
 *      dotenv e no Next.
 *
 * Entre arquivos vale a ordem do `next build`: o primeiro da lista ganha.
 */

const fs = require('fs')
const path = require('path')

// Ordem de precedencia do Next em build de producao.
const ARQUIVOS = ['.env.production.local', '.env.local', '.env.production', '.env']

/** Le um arquivo .env e devolve { valores, duplicadas }. */
function lerArquivoEnv(arquivo) {
  const valores = new Map()
  const contagem = new Map()

  for (const linha of fs.readFileSync(arquivo, 'utf8').split(/\r?\n/)) {
    const m = linha.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!m) continue

    const chave = m[1]
    let valor = m[2].trim()
    const aspas = /^(["'])(.*)\1/.exec(valor)
    if (aspas) {
      valor = aspas[2]
    } else {
      // Sem aspas, " #" abre comentario de fim de linha.
      valor = valor.replace(/\s+#.*$/, '').trim()
    }

    // Map.set sobrescreve: fica a ULTIMA ocorrencia do arquivo.
    valores.set(chave, valor)
    contagem.set(chave, (contagem.get(chave) || 0) + 1)
  }

  const duplicadas = [...contagem].filter(([, n]) => n > 1).map(([k]) => k)
  return { valores, duplicadas }
}

/**
 * Carrega .env.local (e os demais arquivos .env que o Next le) em process.env.
 *
 * @param {string} raiz  pasta do projeto
 * @param {{ avisarDuplicadas?: boolean }} [opcoes]
 * @returns {{ duplicadas: string[], carregadas: number }}
 */
function carregarEnvLocal(raiz, opcoes = {}) {
  const { avisarDuplicadas = true } = opcoes
  const duplicadas = []
  let carregadas = 0

  for (const nome of ARQUIVOS) {
    const arquivo = path.join(raiz, nome)
    if (!fs.existsSync(arquivo)) continue

    const lido = lerArquivoEnv(arquivo)
    for (const [chave, valor] of lido.valores) {
      // Quem ja esta em process.env ganha: o ambiente real, ou um arquivo de
      // precedencia maior lido antes deste.
      if (process.env[chave] === undefined) {
        process.env[chave] = valor
        carregadas++
      }
    }

    if (lido.duplicadas.length > 0) {
      duplicadas.push(...lido.duplicadas)
      if (avisarDuplicadas) {
        console.warn(
          `\nAVISO: ${nome} tem chave repetida: ${lido.duplicadas.join(', ')}\n` +
            'Vale a ULTIMA ocorrencia, que e o que o Next tambem enxerga. Apague as\n' +
            'linhas antigas: uma delas vazia faz o valor depender da ordem do arquivo.\n'
        )
      }
    }
  }

  return { duplicadas, carregadas }
}

/**
 * As tres condicoes de shouldUseMock() em src/lib/shopify/client.ts, lidas do
 * ambiente. Devolve o motivo, ou null quando a loja esta configurada.
 * Mudou la, muda aqui.
 */
function motivoDoMock() {
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return 'NEXT_PUBLIC_USE_MOCK_DATA=true'
  }
  if (!(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '').trim()) {
    return 'NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN vazio'
  }
  if (!(process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '').trim()) {
    return 'NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN vazio'
  }
  return null
}

module.exports = { carregarEnvLocal, motivoDoMock }
