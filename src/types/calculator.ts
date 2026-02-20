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

export interface CatalogProduct {
  id: ProductId
  name: string
  fullName: string
  base: string
  doseMin: number
  doseMax: number
  doseDefault: number
  frequencyWeeksMin: number
  frequencyWeeksMax: number
  packs: number[] // gramas disponíveis
  description: string
  whenToUse: string
  applicationSteps: string[]
  warnings: string[]
}

// ---- Resultado ----

export interface PackRecommendation {
  size_g: number
  qty: number
  label: string // "1× 900g"
}

export interface ProductPlan {
  product_id: ProductId
  name: string
  dose_g_m2: number
  need_g: number
  need_display: string // "1.500 g" ou "1,5 kg"
  packs: PackRecommendation[]
  packs_display: string // "2× 900g"
  frequency_days: number
  frequency_display: string // "a cada 6–8 semanas"
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
