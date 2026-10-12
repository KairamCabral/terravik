/**
 * Constantes e Catálogo de Produtos da Calculadora Terravik.
 *
 * Tudo o que está em CATALOG foi lido do rótulo das embalagens. `base` é o que
 * a tela mostra e fala do benefício; a composição técnica fica em `fullName`
 * e na ficha técnica da página do produto, não na frente. A fonte é
 * docs/produtos-fatos-do-rotulo.md. O que não está lá não pode ser afirmado
 * aqui: nada de composição, dose, prazo ou número inventado.
 */

import type { CatalogProduct, CalculatorInput, WizardStep } from '@/types/calculator'

// ============================================================
// EMBALAGEM E DOSADOR
// ============================================================

/** Único tamanho que existe: saco de 1,6 kg (peso líquido). */
export const PACK_GRAMS = 1600

/** Texto do tamanho, como aparece no site. */
export const PACK_LABEL = '1,6 kg'

/**
 * Como usar, igual no verso das três embalagens.
 */
const COMO_USAR: string[] = [
  'Pegue o dosador que vem dentro da embalagem e separe a quantidade de dosadores do seu plano.',
  'Espalhe os grânulos por igual no gramado, sem deixar montinhos.',
  'Regue imediatamente após a aplicação: a água dissolve os grânulos e leva a nutrição até a raiz. Nunca pule essa etapa.',
]

/** Limitações e cuidados do rótulo. */
const CUIDADOS: string[] = [
  'Espalhe por igual: grânulos acumulados podem queimar a grama.',
  'Não exceda a dose recomendada: o excesso queima a grama.',
  'Aplique com a grama seca, de manhã ou no fim da tarde. Evite o sol forte do meio-dia.',
  'Evite aplicar com vento forte.',
  "Evite aplicar sobre piso molhado ou onde possa escorrer para ralos e corpos d'água.",
  'Mantenha crianças e animais afastados durante a aplicação. Depois de aplicar, regue e aguarde secar antes de liberar o acesso.',
  'Em caso de contato com olhos ou pele, lave abundantemente com água. Em caso de ingestão, procure orientação médica.',
]

// ============================================================
// CATÁLOGO DE PRODUTOS
// ============================================================

export const CATALOG: Record<'P1' | 'P2' | 'P3', CatalogProduct> = {
  P1: {
    id: 'P1',
    name: 'Raiz Forte',
    fullName: 'Raiz Forte (superfosfato simples granulado)',
    base: 'Fósforo e cálcio para firmar a raiz',
    packGrams: PACK_GRAMS,
    yieldM2: 32, // rótulo: 1,6 kg rende até 32 m²
    doseLabel: 50, // 1600 g / 32 m²
    doseApprox: false,
    scoopM2: 2, // rótulo: 1 dosador raso cobre cerca de 2 m²
    scoopDeduced: false,
    frequencyKind: 'pontual',
    repeatDaysMin: null,
    repeatDaysMax: null,
    frequencyText:
      'Uso pontual: no plantio, na reforma ou quando o gramado estiver muito falhado. Não precisa repetir todo mês.',
    description: 'A base do plantio: prepara o solo e firma a raiz para o gramado crescer forte.',
    whenToUse: 'No plantio, na reforma ou quando o gramado estiver muito falhado.',
    applicationSteps: COMO_USAR,
    warnings: [
      'O fósforo quase não se move no solo. Por isso o Raiz Forte é feito para ser incorporado à terra, na zona das raízes.',
      ...CUIDADOS,
    ],
  },
  P2: {
    id: 'P2',
    name: 'Verde Rápido',
    fullName: 'Verde Rápido (sulfato de amônio granulado, 21-00-00 + 24S)',
    base: 'Nitrogênio e enxofre para devolver a cor',
    packGrams: PACK_GRAMS,
    yieldM2: 96, // rótulo: 1,6 kg rende até 96 m²
    doseLabel: 17, // 1600 g / 96 m² = 16,7. O rótulo permite dizer "cerca de 17 g"
    doseApprox: true,
    scoopM2: 6, // rótulo: 1 dosador raso cobre cerca de 6 m²
    scoopDeduced: false,
    frequencyKind: 'se_precisar',
    repeatDaysMin: 30,
    repeatDaysMax: 45,
    frequencyText: 'Se precisar, repita a cada 30 a 45 dias, até o verde voltar.',
    description: 'Recupera o gramado amarelado e devolve a cor.',
    whenToUse: 'Quando o gramado estiver amarelado ou sem cor.',
    applicationSteps: COMO_USAR,
    warnings: CUIDADOS,
  },
  P3: {
    id: 'P3',
    name: 'Resistência Total',
    fullName: 'Resistência Total (NPK granulado 19-04-19)',
    base: 'Nutrição completa com potássio',
    packGrams: PACK_GRAMS,
    yieldM2: 64, // rótulo: 1,6 kg rende até 64 m²
    doseLabel: 25, // 1600 g / 64 m²
    doseApprox: false,
    scoopM2: 4, // rótulo: 1 dosador raso cobre cerca de 4 m²
    scoopDeduced: false,
    // Rótulo: "Uso contínuo: resistência se constrói com rotina. Aplique a
    // cada 60 dias e mantenha o gramado forte o ano todo."
    frequencyKind: 'continuo',
    repeatDaysMin: 60,
    repeatDaysMax: 60,
    frequencyText: 'Uso contínuo: aplique a cada 60 dias para manter o gramado forte o ano todo.',
    description:
      'Nutrição completa com potássio, que deixa a grama resistente à seca, ao sol e ao pisoteio.',
    whenToUse: 'Quando o gramado precisa de força para aguentar seca, sol e pisoteio.',
    applicationSteps: COMO_USAR,
    warnings: CUIDADOS,
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
  '1_2x_semana': '1 a 2× por semana',
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
