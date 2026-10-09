// src/lib/admin/metricas.ts
//
// Contas do painel admin, sem React e sem Supabase, para poderem ser testadas
// isoladas. Tudo aqui recebe "agora" por parametro: nada le o relogio sozinho.

/**
 * Fuso em que os pedidos sao agrupados por dia e por mes.
 *
 * `orders_sync.shopify_created_at` e timestamptz (UTC). A Shopify fecha os
 * relatorios no fuso da loja, entao um pedido das 22h de 31/08 em Brasilia
 * (01h de 01/09 em UTC) pertence a agosto. Agrupar em UTC, ou no fuso de quem
 * abriu o painel, faria a soma mensal divergir da Shopify.
 */
export const FUSO_DA_LOJA = 'America/Sao_Paulo'

const DIA_MS = 24 * 60 * 60 * 1000
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const MESES_CURTOS = MESES.map((m) => m.toLowerCase())

export interface PedidoParaMetrica {
  total_price?: number | string | null
  shopify_created_at?: string | null
}

export interface PontoMensal {
  /** 'AAAA-MM' no fuso da loja. */
  chave: string
  /** Rotulo do eixo: 'Jan', 'Fev' etc. */
  name: string
  revenue: number
  orders: number
}

export interface PontoDiario {
  /** 'AAAA-MM-DD' no fuso da loja. */
  chave: string
  /** Rotulo do eixo: '09 de out'. */
  date: string
  revenue: number
  orders: number
}

/**
 * Variacao percentual de `atual` sobre `anterior`.
 *
 * Devolve `undefined` quando nao ha base de comparacao (periodo anterior zerado,
 * negativo ou invalido). Dividir por zero daria Infinity, e mostrar "cresceu
 * infinito" e pior do que nao mostrar selo nenhum.
 */
export function variacao(atual: number, anterior: number): number | undefined {
  if (!Number.isFinite(atual) || !Number.isFinite(anterior)) return undefined
  if (anterior <= 0) return undefined
  return ((atual - anterior) / anterior) * 100
}

/** So existe selo quando existe numero finito. */
export function temVariacao(valor: number | undefined | null): valor is number {
  return typeof valor === 'number' && Number.isFinite(valor)
}

/** 12.5 vira '12,5%'; -8 vira '8,0%' (o sinal fica por conta do icone). */
export function formatarVariacao(valor: number): string {
  return `${Math.abs(valor).toFixed(1).replace('.', ',')}%`
}

/**
 * Janela atual e janela anterior, de mesmo tamanho, terminando em `agora`.
 * atual = [inicioAtual, agora) e anterior = [inicioAnterior, inicioAtual).
 */
export function janelas(agora: Date, dias: number): { inicioAtual: Date; inicioAnterior: Date } {
  return {
    inicioAtual: new Date(agora.getTime() - dias * DIA_MS),
    inicioAnterior: new Date(agora.getTime() - 2 * dias * DIA_MS),
  }
}

/** `iso` cai em [de, ate)? Data ausente ou invalida nunca cai. */
export function dentroDe(iso: string | null | undefined, de: Date, ate: Date): boolean {
  if (!iso) return false
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return false
  return t >= de.getTime() && t < ate.getTime()
}

export function valorDoPedido(pedido: PedidoParaMetrica): number {
  const n = Number(pedido.total_price)
  return Number.isFinite(n) ? n : 0
}

export function somarReceita(pedidos: PedidoParaMetrica[]): number {
  return pedidos.reduce((soma, p) => soma + valorDoPedido(p), 0)
}

/** Ano, mes (1 a 12) e dia de um instante, lidos no fuso informado. */
function partesNoFuso(data: Date, timeZone: string): { ano: number; mes: number; dia: number } {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(data)
  const ler = (tipo: string) => Number(partes.find((p) => p.type === tipo)?.value)
  return { ano: ler('year'), mes: ler('month'), dia: ler('day') }
}

const doisDigitos = (n: number) => String(n).padStart(2, '0')

/** 'AAAA-MM' do instante no fuso; `null` para data ausente ou invalida. */
export function chaveDoMes(iso: string | Date | null | undefined, timeZone = FUSO_DA_LOJA): string | null {
  const dia = chaveDoDia(iso, timeZone)
  return dia ? dia.slice(0, 7) : null
}

/** 'AAAA-MM-DD' do instante no fuso; `null` para data ausente ou invalida. */
export function chaveDoDia(iso: string | Date | null | undefined, timeZone = FUSO_DA_LOJA): string | null {
  if (!iso) return null
  const data = iso instanceof Date ? iso : new Date(iso)
  if (Number.isNaN(data.getTime())) return null
  const { ano, mes, dia } = partesNoFuso(data, timeZone)
  return `${ano}-${doisDigitos(mes)}-${doisDigitos(dia)}`
}

/**
 * Receita e pedidos dos ultimos `quantidade` meses (o mes de `agora` incluso),
 * do mais antigo para o mais novo. Mes sem pedido entra com zero, para o eixo
 * nao pular meses. Pedido fora da janela ou sem data e ignorado.
 */
export function agruparReceitaPorMes(
  pedidos: PedidoParaMetrica[],
  agora: Date,
  quantidade = 6,
  timeZone = FUSO_DA_LOJA
): PontoMensal[] {
  const { ano, mes } = partesNoFuso(agora, timeZone)
  const pontos: PontoMensal[] = []
  const porChave = new Map<string, PontoMensal>()

  for (let i = quantidade - 1; i >= 0; i--) {
    // Aritmetica so de calendario (ano e mes), sem passar por fuso.
    const indice = ano * 12 + (mes - 1) - i
    const a = Math.floor(indice / 12)
    const m = indice % 12
    const ponto: PontoMensal = {
      chave: `${a}-${doisDigitos(m + 1)}`,
      name: MESES[m],
      revenue: 0,
      orders: 0,
    }
    pontos.push(ponto)
    porChave.set(ponto.chave, ponto)
  }

  for (const pedido of pedidos) {
    const chave = chaveDoMes(pedido.shopify_created_at, timeZone)
    const ponto = chave ? porChave.get(chave) : undefined
    if (!ponto) continue
    ponto.revenue += valorDoPedido(pedido)
    ponto.orders += 1
  }

  return pontos
}

/**
 * Receita e pedidos por dia, de `dias` dias atras ate hoje (dias + 1 pontos),
 * com os dias contados no fuso da loja. Dia sem pedido entra com zero.
 */
export function agruparPorDia(
  pedidos: PedidoParaMetrica[],
  agora: Date,
  dias: number,
  timeZone = FUSO_DA_LOJA
): PontoDiario[] {
  const hoje = partesNoFuso(agora, timeZone)
  const pontos: PontoDiario[] = []
  const porChave = new Map<string, PontoDiario>()

  for (let i = dias; i >= 0; i--) {
    // Date.UTC serve so de calculadora de calendario: normaliza dia negativo
    // e virada de mes sem depender do fuso de quem roda.
    const d = new Date(Date.UTC(hoje.ano, hoje.mes - 1, hoje.dia - i))
    const ponto: PontoDiario = {
      chave: `${d.getUTCFullYear()}-${doisDigitos(d.getUTCMonth() + 1)}-${doisDigitos(d.getUTCDate())}`,
      date: `${doisDigitos(d.getUTCDate())} de ${MESES_CURTOS[d.getUTCMonth()]}`,
      revenue: 0,
      orders: 0,
    }
    pontos.push(ponto)
    porChave.set(ponto.chave, ponto)
  }

  for (const pedido of pedidos) {
    const chave = chaveDoDia(pedido.shopify_created_at, timeZone)
    const ponto = chave ? porChave.get(chave) : undefined
    if (!ponto) continue
    ponto.revenue += valorDoPedido(pedido)
    ponto.orders += 1
  }

  return pontos
}

/**
 * Ha o que desenhar? Uma serie toda zerada nao e grafico, e uma linha reta no
 * eixo: nesse caso a tela mostra o estado vazio.
 */
export function temMovimento(
  pontos: ReadonlyArray<{ revenue: number; orders: number }>,
  campo: 'revenue' | 'orders'
): boolean {
  return pontos.some((p) => p[campo] > 0)
}
