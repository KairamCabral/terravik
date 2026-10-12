import { NextRequest, NextResponse } from 'next/server'
import { analisarFoto, analiseConfigurada } from '@/lib/calculator/foto/analisar'
import { cotaConfigurada, registrarUso } from '@/lib/calculator/foto/cota'
import {
  FOTO_BYTES_MAXIMOS,
  type MotivoDaRecusa,
  type QualidadeDaFoto,
  type RespostaDaAnalise,
} from '@/lib/calculator/foto/diagnostico'
import { getClientIp } from '@/lib/rate-limit'

/**
 * Análise da foto do gramado.
 *
 * A foto chega como o corpo da requisição (JPEG já reduzido no navegador), é
 * conferida, enviada para classificação e descartada: nada é gravado em disco,
 * em banco ou em log. A resposta traz só a classificação.
 *
 * Ordem das barreiras, da mais barata para a mais cara:
 * 1. limite por minuto por IP (middleware);
 * 2. origem: só o próprio site chama;
 * 3. tipo, tamanho e assinatura do arquivo;
 * 4. cota diária por visitante e do site inteiro (banco);
 * 5. só então a chamada paga.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SEM_CACHE = { 'Cache-Control': 'no-store' }

function recusar(motivo: MotivoDaRecusa, status: number, qualidade?: QualidadeDaFoto) {
  const corpo: RespostaDaAnalise = { ok: false, motivo, ...(qualidade ? { qualidade } : {}) }
  return NextResponse.json(corpo, { status, headers: SEM_CACHE })
}

/** A requisição precisa vir de uma página do próprio site. */
function mesmaOrigem(request: NextRequest): boolean {
  const origem = request.headers.get('origin')
  if (!origem) return false
  try {
    return new URL(origem).host === request.nextUrl.host
  } catch {
    return false
  }
}

/** Assinatura de arquivo JPEG: começa com FF D8 FF e termina com FF D9. */
function ehJpeg(bytes: Uint8Array): boolean {
  const n = bytes.length
  return (
    n > 1024 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff &&
    bytes[n - 2] === 0xff &&
    bytes[n - 1] === 0xd9
  )
}

export async function POST(request: NextRequest) {
  if (!analiseConfigurada() || !cotaConfigurada()) return recusar('indisponivel', 503)
  if (!mesmaOrigem(request)) return recusar('indisponivel', 403)

  if (request.headers.get('content-type') !== 'image/jpeg') return recusar('arquivo_invalido', 415)

  // O tamanho declarado é conferido antes de ler, e o lido é conferido de novo.
  const declarado = Number(request.headers.get('content-length') ?? '0')
  if (!Number.isFinite(declarado) || declarado <= 0) return recusar('arquivo_invalido', 411)
  if (declarado > FOTO_BYTES_MAXIMOS) return recusar('arquivo_invalido', 413)

  let bytes: Uint8Array
  try {
    bytes = new Uint8Array(await request.arrayBuffer())
  } catch {
    return recusar('arquivo_invalido', 400)
  }
  if (bytes.length > FOTO_BYTES_MAXIMOS) return recusar('arquivo_invalido', 413)
  if (!ehJpeg(bytes)) return recusar('arquivo_invalido', 415)

  const cota = await registrarUso(getClientIp(request))
  if (cota === 'pessoa') return recusar('limite_pessoa', 429)
  if (cota === 'geral') return recusar('limite_geral', 429)
  if (cota !== 'ok') return recusar('indisponivel', 503)

  const resultado = await analisarFoto(Buffer.from(bytes).toString('base64'))

  switch (resultado.tipo) {
    case 'diagnostico': {
      const corpo: RespostaDaAnalise = { ok: true, diagnostico: resultado.diagnostico }
      return NextResponse.json(corpo, { headers: SEM_CACHE })
    }
    case 'nao_e_gramado':
      return recusar('nao_e_gramado', 422)
    case 'foto_ruim':
      return recusar('foto_ruim', 422, resultado.qualidade)
    default:
      return recusar('indisponivel', 502)
  }
}
