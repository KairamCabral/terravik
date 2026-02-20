/**
 * Constantes e Catálogo de Produtos — Calculadora Terravik
 * Fonte da verdade para P1, P2, P3
 */

import type { CatalogProduct, CalculatorInput, WizardStep } from '@/types/calculator'

// ============================================================
// CATÁLOGO DE PRODUTOS
// ============================================================

export const CATALOG: Record<'P1' | 'P2' | 'P3', CatalogProduct> = {
  P1: {
    id: 'P1',
    name: 'Gramado Novo',
    fullName: 'Gramado Novo (MAP 11-52-00)',
    base: 'MAP 11-52-00 (granulado)',
    doseMin: 8,
    doseMax: 12,
    doseDefault: 10,
    frequencyWeeksMin: 0,
    frequencyWeeksMax: 0,
    packs: [400, 900],
    description: 'Para enraizar, firmar e pegar mais rápido.',
    whenToUse: 'No plantio (antes ou junto do tapete/semente).',
    applicationSteps: [
      'Espalhe de forma uniforme na área.',
      'Siga a dose por m² do seu plano.',
      'Regue após aplicar para ativar.',
    ],
    warnings: [
      'Evite aplicar no sol forte do meio-dia.',
      'Se chover muito forte logo após, o plano pode sugerir reforço leve.',
    ],
  },
  P2: {
    id: 'P2',
    name: 'Verde Rápido',
    fullName: 'Verde Rápido (Sulfato de Amônio 21-0-0 + 24S)',
    base: 'Sulfato de Amônio 21-0-0 + 24S (granulado)',
    doseMin: 15,
    doseMax: 20,
    doseDefault: 18,
    frequencyWeeksMin: 4,
    frequencyWeeksMax: 6,
    packs: [2700],
    description: 'Para recuperar o verde e acelerar o crescimento.',
    whenToUse:
      '2–4 semanas após a implantação ou quando o gramado estiver fraco/amarelado.',
    applicationSteps: [
      'Espalhe de forma uniforme na área.',
      'Use o dosador e siga a dose por m².',
      'Regue após aplicar.',
    ],
    warnings: [
      'Se estiver muito seco e sem irrigação, use dose menor.',
      'Não aplique antes de chuva forte.',
    ],
  },
  P3: {
    id: 'P3',
    name: 'Resistência Total',
    fullName: 'Resistência Total (NPK 19-4-19)',
    base: 'NPK 19-4-19 (granulado) — Tecnologia Grânulo Único',
    doseMin: 15,
    doseMax: 25,
    doseDefault: 20,
    frequencyWeeksMin: 6,
    frequencyWeeksMax: 8,
    packs: [400, 900],
    description: 'Para calor intenso, pisoteio e uso frequente do gramado.',
    whenToUse:
      'Em períodos de calor, estresse, uso intenso e recuperação estrutural.',
    applicationSteps: [
      'Espalhe de forma uniforme na área.',
      'Siga a dose por m² do seu plano.',
      'Regue após aplicar.',
    ],
    warnings: [
      'No frio, reduza a dose ou pause (crescimento lento).',
      'Constância vale mais do que exagerar na dose.',
    ],
  },
}

// ============================================================
// DEFAULTS (para reduzir fricção no quiz)
// ============================================================

export const DEFAULTS: Partial<CalculatorInput> = {
  clima_hoje: 'ameno',
  sol: 'sol_pleno',
  irrigacao: '1_2x_semana',
  pisoteio: 'medio',
  nivel: 'bonito',
}

// ============================================================
// ORDEM DAS STEPS DO WIZARD
// ============================================================

export const WIZARD_STEPS: WizardStep[] = [
  'welcome',
  'area',
  'implanting',
  'objective',
  'climate',
  'sunlight',
  'irrigation',
  'traffic',
  'condition',
  'result',
]

export const STEP_COUNT = WIZARD_STEPS.length - 2 // Excluindo welcome e result

// ============================================================
// LABELS para a UI
// ============================================================

export const OBJECTIVE_LABELS = {
  implantacao: {
    title: 'Pegar mais rápido',
    description: 'Para enraizar e firmar o gramado.',
  },
  verde_vigor: {
    title: 'Verde e vigor',
    description: 'Para crescer e melhorar a cor.',
  },
  resistencia: {
    title: 'Resistência',
    description: 'Para aguentar uso intenso e estresse.',
  },
  plano_completo: {
    title: 'Plano completo',
    description: 'Para montar a rotina ideal.',
  },
} as const

export const CLIMATE_LABELS = {
  quente_chovendo: 'Quente e chovendo',
  quente_seco: 'Quente e seco',
  ameno: 'Ameno',
  frio: 'Frio (crescimento lento)',
} as const

export const SUNLIGHT_LABELS = {
  sol_pleno: 'Sol pleno (sol a maior parte do dia)',
  meia_sombra: 'Meia-sombra (sol parcial)',
  sombra: 'Sombra (pouco sol)',
} as const

export const IRRIGATION_LABELS = {
  '3x_semana': '3× ou mais por semana',
  '1_2x_semana': '1–2× por semana',
  quase_nao: 'Quase não rego / depende de chuva',
} as const

export const TRAFFIC_LABELS = {
  baixo: 'Baixo (quase ninguém usa)',
  medio: 'Médio (uso normal)',
  alto: 'Alto (crianças, pets, passagem, churrasqueira)',
} as const

export const CONDITION_LABELS = {
  bonito: 'Bonito (manutenção)',
  fraco_amarelado: 'Fraco ou amarelado',
  ralo_falhas: 'Ralo / com falhas',
} as const
