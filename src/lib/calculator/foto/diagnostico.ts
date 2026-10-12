/**
 * Diagnóstico do gramado por foto: tipos, frases e a ponte para a calculadora.
 *
 * A IA só CLASSIFICA o que a foto mostra, escolhendo entre valores fixos. Ela
 * não escreve texto para a tela e não decide dose: todas as frases estão aqui
 * e a quantidade continua saindo do motor da calculadora, com a tabela do
 * rótulo. Arquivo sem dependência de servidor: serve na tela e na rota.
 */

import type { CalculatorInput } from '@/types/calculator'
import { DEFAULTS } from '@/lib/calculator/constants'

export const ESTADOS_DO_GRAMADO = ['bonito', 'amarelado', 'ralo_falhas', 'solo_exposto'] as const
export type EstadoDoGramado = (typeof ESTADOS_DO_GRAMADO)[number]

export const QUALIDADES_DA_FOTO = ['boa', 'escura', 'desfocada', 'longe_demais', 'perto_demais'] as const
export type QualidadeDaFoto = (typeof QUALIDADES_DA_FOTO)[number]

export const PADROES_DO_PROBLEMA = ['uniforme', 'manchas_localizadas', 'nao_se_aplica'] as const
export type PadraoDoProblema = (typeof PADROES_DO_PROBLEMA)[number]

export interface DiagnosticoDaFoto {
  estado: EstadoDoGramado
  padrao: PadraoDoProblema
  pisoteio: boolean
}

export type MotivoDaRecusa =
  | 'nao_e_gramado'
  | 'foto_ruim'
  | 'limite_pessoa'
  | 'limite_geral'
  | 'arquivo_invalido'
  | 'indisponivel'

export type RespostaDaAnalise =
  | { ok: true; diagnostico: DiagnosticoDaFoto }
  | { ok: false; motivo: MotivoDaRecusa; qualidade?: QualidadeDaFoto }

/** Limites do arquivo, iguais na tela e na rota. */
export const FOTO_LADO_MAXIMO = 1280
export const FOTO_BYTES_MAXIMOS = 1_500_000

export const TEXTO_DO_ESTADO: Record<EstadoDoGramado, { titulo: string; texto: string }> = {
  bonito: {
    titulo: 'Gramado bonito',
    texto: 'Verde e fechado, sem falhas aparentes. O cuidado aqui é manter.',
  },
  amarelado: {
    titulo: 'Gramado amarelado ou sem cor',
    texto: 'A grama perdeu a cor e a força.',
  },
  ralo_falhas: {
    titulo: 'Gramado ralo ou com falhas',
    texto: 'Há trechos sem grama ou com a grama muito aberta.',
  },
  solo_exposto: {
    titulo: 'Terra à mostra, hora de plantar',
    texto: 'Quase não há grama: é plantio ou reforma.',
  },
}

export const TEXTO_DA_RECUSA: Record<MotivoDaRecusa, string> = {
  nao_e_gramado: 'Não encontrei um gramado nessa foto. Tente outra, mostrando a grama de perto.',
  foto_ruim: 'A foto não ficou boa para analisar. Tente de novo.',
  limite_pessoa: 'Você chegou ao limite de fotos de hoje. Responda as perguntas para montar o seu plano.',
  limite_geral: 'A análise por foto atingiu o limite de hoje. Responda as perguntas para montar o seu plano.',
  arquivo_invalido: 'Não consegui ler essa imagem. Tente outra foto.',
  indisponivel: 'A análise por foto não está disponível agora. Responda as perguntas para montar o seu plano.',
}

export const DICA_DA_QUALIDADE: Record<Exclude<QualidadeDaFoto, 'boa'>, string> = {
  escura: 'A foto ficou escura. Tire de dia, com luz natural.',
  desfocada: 'A foto ficou tremida. Segure o celular firme e tente de novo.',
  longe_demais: 'A grama ficou longe demais. Chegue mais perto, a uns 2 metros.',
  perto_demais: 'A foto ficou perto demais. Afaste um pouco, para pegar uns 2 metros de gramado.',
}

/**
 * Aviso quando o problema aparece em manchas: nem todo amarelado é falta de
 * nutriente, e o site não vende adubo para o que adubo não resolve.
 */
export const AVISO_DE_MANCHAS =
  'Pelo que a foto mostra, o problema está em manchas, não no gramado todo. Manchas localizadas podem ter outra causa, como urina de pet, fungo, praga ou falta de rega naquele ponto. Se for o caso, o fertilizante sozinho não resolve.'

export const AVISO_DA_FOTO =
  'Este plano parte do que a foto mostra. Se o gramado for diferente em outros pontos, refaça com outra foto ou responda as perguntas.'

/**
 * Respostas da calculadora a partir do diagnóstico. Um produto por estado,
 * seguindo o "para quem" do rótulo: quem manda foto quer saber o que precisa,
 * não a linha inteira.
 */
export function respostasDaFoto(diagnostico: DiagnosticoDaFoto, areaM2: number): CalculatorInput {
  const porEstado: Record<EstadoDoGramado, Pick<CalculatorInput, 'implantando' | 'objetivo' | 'nivel'>> = {
    bonito: { implantando: false, objetivo: 'resistencia', nivel: 'bonito' },
    amarelado: { implantando: false, objetivo: 'verde_vigor', nivel: 'fraco_amarelado' },
    ralo_falhas: { implantando: false, objetivo: 'implantacao', nivel: 'ralo_falhas' },
    solo_exposto: { implantando: true, objetivo: 'implantacao', nivel: 'ralo_falhas' },
  }

  return {
    area_m2: areaM2,
    clima_hoje: DEFAULTS.clima_hoje ?? 'ameno',
    sol: DEFAULTS.sol ?? 'sol_pleno',
    irrigacao: DEFAULTS.irrigacao ?? '1_2x_semana',
    pisoteio: diagnostico.pisoteio ? 'alto' : 'medio',
    ...porEstado[diagnostico.estado],
  }
}

/** Avisos próprios do caminho da foto, mostrados antes dos avisos do plano. */
export function avisosDaFoto(diagnostico: DiagnosticoDaFoto): string[] {
  const avisos: string[] = []
  if (diagnostico.padrao === 'manchas_localizadas' && diagnostico.estado !== 'bonito') {
    avisos.push(AVISO_DE_MANCHAS)
  }
  avisos.push(AVISO_DA_FOTO)
  return avisos
}

/** Confere o formato do diagnóstico vindo de fora (IA ou navegador). */
export function ehDiagnostico(valor: unknown): valor is DiagnosticoDaFoto {
  if (!valor || typeof valor !== 'object') return false
  const d = valor as Record<string, unknown>
  return (
    ESTADOS_DO_GRAMADO.includes(d.estado as EstadoDoGramado) &&
    PADROES_DO_PROBLEMA.includes(d.padrao as PadraoDoProblema) &&
    typeof d.pisoteio === 'boolean'
  )
}
