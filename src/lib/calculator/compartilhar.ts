/**
 * Plano da calculadora em link e em mensagem de WhatsApp.
 *
 * O link leva as respostas, não o plano: quem abre refaz a conta com a tabela
 * do rótulo. Por isso o que chega pelo link é conferido campo a campo antes de
 * virar plano: é dado de fora.
 */

import type { CalculatorInput, CalculatorResult } from '@/types/calculator'

const OBJETIVOS = ['implantacao', 'verde_vigor', 'resistencia', 'plano_completo'] as const
const CLIMAS = ['quente_chovendo', 'quente_seco', 'ameno', 'frio'] as const
const SOL = ['sol_pleno', 'meia_sombra', 'sombra'] as const
const REGA = ['3x_semana', '1_2x_semana', 'quase_nao'] as const
const PISOTEIO = ['baixo', 'medio', 'alto'] as const
const NIVEIS = ['bonito', 'fraco_amarelado', 'ralo_falhas'] as const

const AREA_MAXIMA = 100_000

function um<T extends string>(valor: unknown, lista: readonly T[]): valor is T {
  return typeof valor === 'string' && (lista as readonly string[]).includes(valor)
}

/** Respostas completas e válidas, ou null. Copia só os campos conhecidos. */
export function validarRespostas(valor: unknown): CalculatorInput | null {
  if (!valor || typeof valor !== 'object') return null
  const r = valor as Record<string, unknown>
  const area = r.area_m2
  if (typeof area !== 'number' || !Number.isFinite(area) || area <= 0 || area > AREA_MAXIMA) return null
  if (typeof r.implantando !== 'boolean') return null
  if (!um(r.objetivo, OBJETIVOS) || !um(r.clima_hoje, CLIMAS) || !um(r.sol, SOL)) return null
  if (!um(r.irrigacao, REGA) || !um(r.pisoteio, PISOTEIO) || !um(r.nivel, NIVEIS)) return null
  return {
    area_m2: area,
    implantando: r.implantando,
    objetivo: r.objetivo,
    clima_hoje: r.clima_hoje,
    sol: r.sol,
    irrigacao: r.irrigacao,
    pisoteio: r.pisoteio,
    nivel: r.nivel,
  }
}

export function codificarRespostas(respostas: CalculatorInput): string {
  return btoa(JSON.stringify(respostas))
}

export function decodificarRespostas(codigo: string): CalculatorInput | null {
  // Um plano codificado tem cerca de 250 caracteres: o resto não é plano.
  if (!codigo || codigo.length > 1000) return null
  try {
    return validarRespostas(JSON.parse(atob(codigo)))
  } catch {
    return null
  }
}

/** Endereço que reabre o plano. */
export function linkDoPlano(respostas: CalculatorInput, origem: string): string {
  const url = new URL('/calculadora', origem)
  url.searchParams.set('plan', codificarRespostas(respostas))
  return url.toString()
}

/** Texto do plano para mandar por mensagem. */
export function mensagemDoPlano(resultado: CalculatorResult, link: string): string {
  const linhas = [`Meu plano Terravik para um gramado de ${resultado.area_m2} m²:`, '']
  for (const p of resultado.plan) {
    linhas.push(`• ${p.name}: ${p.packs_display} (${p.dosadores_display}, ${p.dose_display} por m²)`)
  }
  linhas.push('', `Ver o plano completo: ${link}`)
  return linhas.join('\n')
}

export function linkDoWhatsApp(mensagem: string): string {
  return `https://wa.me/?text=${encodeURIComponent(mensagem)}`
}
