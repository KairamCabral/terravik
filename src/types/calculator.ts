/**
 * Tipos da Calculadora/Quiz Terravik
 * Baseado na spec Calculadora_Quiz.md
 */

// ---- Inputs do Quiz ----

export type Objective =
  | 'implantacao'
  | 'verde_vigor'
  | 'resistencia'
  | 'plano_completo'

export type Climate =
  | 'quente_chovendo'
  | 'quente_seco'
  | 'ameno'
  | 'frio'

export type Sunlight = 'sol_pleno' | 'meia_sombra' | 'sombra'

export type Irrigation = '3x_semana' | '1_2x_semana' | 'quase_nao'

export type Traffic = 'baixo' | 'medio' | 'alto'

export type LawnCondition = 'bonito' | 'fraco_amarelado' | 'ralo_falhas'

export interface CalculatorInput {
  area_m2: number
  implantando: boolean
  objetivo: Objective
  clima_hoje: Climate
  sol: Sunlight
  irrigacao: Irrigation
  pisoteio: Traffic
  nivel: LawnCondition
}

// ---- Produtos do catálogo ----

export type ProductId = 'P1' | 'P2' | 'P3'

/**
 * Como o rótulo manda repetir o produto.
 * - pontual: aplica uma vez (plantio, reforma, gramado muito falhado).
 * - se_precisar: o rótulo dá um intervalo, e só enquanto o problema durar.
 * - desconhecida: o rótulo lido não diz. O plano não inventa intervalo.
 */
export type FrequencyKind = 'pontual' | 'se_precisar' | 'desconhecida'

export interface CatalogProduct {
  id: ProductId
  name: string
  fullName: string
  base: string
  /** Peso líquido do saco, em gramas. Hoje só existe um tamanho. */
  packGrams: number
  /** Área que um saco cobre, segundo o rótulo ("rende até X m²"). */
  yieldM2: number
  /**
   * Dose do rótulo em g/m², arredondada como o rótulo permite escrever.
   * É o TETO: nenhuma recomendação passa disso.
   */
  doseLabel: number
  /** true quando a dose do rótulo é aproximada ("cerca de 17 g/m²"). */
  doseApprox: boolean
  /** Área que 1 dosador raso (100 ml) cobre, em m². */
  scoopM2: number
  /** true quando scoopM2 foi deduzido por proporção e não lido do rótulo. */
  scoopDeduced: boolean
  frequencyKind: FrequencyKind
  /** Intervalo de repetição em dias, só quando o rótulo informa. */
  repeatDaysMin: number | null
  repeatDaysMax: number | null
  /** Frase pronta sobre repetição, na linguagem do rótulo. */
  frequencyText: string
  description: string
  whenToUse: string
  applicationSteps: string[]
  warnings: string[]
}

// ---- Resultado ----

export interface PackRecommendation {
  size_g: number
  qty: number
  label: string // "2 sacos de 1,6 kg"
}

export interface ProductPlan {
  product_id: ProductId
  name: string
  /** Dose do rótulo em g/m². Nunca é maior que a do rótulo. */
  dose_g_m2: number
  dose_display: string // "50 g" ou "cerca de 17 g"
  /** true quando a dose do rótulo é aproximada: a tela escreve "cerca de". */
  dose_approx: boolean
  need_g: number
  need_display: string // "1.500 g" ou "1,5 kg"
  /** Quantos dosadores rasos (100 ml) a área pede. */
  dosadores: number
  dosadores_display: string // "cerca de 25 dosadores rasos"
  /** "1 dosador raso cobre cerca de 2 m²" */
  scoop_display: string
  packs: PackRecommendation[]
  packs_display: string // "2 sacos de 1,6 kg"
  /** Total de sacos: é a quantidade que vai para o carrinho. */
  packs_qty: number
  frequency_kind: FrequencyKind
  /** 0 quando não há repetição automática (uso pontual ou intervalo desconhecido). */
  frequency_days: number
  frequency_days_max: number
  frequency_display: string // frase completa, na linguagem do rótulo
  notes: string[]
  whenToUse: string
  applicationSteps: string[]
}

export interface CalculatorResult {
  area_m2: number
  context: CalculatorInput
  plan: ProductPlan[]
  alerts: string[]
  summary: {
    next_steps: string[]
    next_application_date: string | null
  }
}

// ---- State do Wizard ----

export type WizardStep =
  | 'welcome'
  | 'area'
  | 'implanting'
  | 'objective'
  | 'climate'
  | 'sunlight'
  | 'irrigation'
  | 'traffic'
  | 'condition'
  | 'result'

export interface WizardState {
  currentStep: WizardStep
  answers: Partial<CalculatorInput>
  result: CalculatorResult | null
  isComplete: boolean
}
