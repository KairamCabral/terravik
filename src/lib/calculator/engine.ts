/**
 * Motor de Cálculo — Calculadora/Quiz Terravik
 *
 * Funções puras, sem side effects.
 * Implementa a spec de Calculadora_Quiz.md
 */

import type {
  CalculatorInput,
  CalculatorResult,
  ProductPlan,
  ProductId,
  PackRecommendation,
} from '@/types/calculator'
import { CATALOG, DEFAULTS } from './constants'

// ============================================================
// 1) DECISÃO: quais produtos entram no plano
// ============================================================

export function selectProducts(input: CalculatorInput): ProductId[] {
  const products: ProductId[] = []

  // Se implantando → incluir P1
  if (input.implantando) {
    products.push('P1')
  }

  switch (input.objetivo) {
    case 'implantacao':
      if (!products.includes('P1')) products.push('P1')
      break

    case 'verde_vigor':
      products.push('P2')
      break

    case 'resistencia':
      products.push('P3')
      break

    case 'plano_completo':
      if (input.implantando) {
        if (!products.includes('P1')) products.push('P1')
        products.push('P2')
        // P3 somente se pisoteio alto ou quente e seco
        if (input.pisoteio === 'alto' || input.clima_hoje === 'quente_seco') {
          products.push('P3')
        }
      } else {
        products.push('P2')
        products.push('P3')
      }
      break
  }

  // Remover duplicatas
  return [...new Set(products)]
}

// ============================================================
// 2) CÁLCULO DE DOSE (g/m²) por produto
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function calculateDoseP1(input: CalculatorInput): number {
  let dose = CATALOG.P1.doseDefault // 10

  if (input.nivel === 'ralo_falhas') dose += 1
  if (input.clima_hoje === 'quente_chovendo') dose += 1
  if (input.irrigacao === 'quase_nao') dose -= 1
  if (input.clima_hoje === 'frio') dose -= 1

  return clamp(dose, CATALOG.P1.doseMin, CATALOG.P1.doseMax)
}

export function calculateDoseP2(input: CalculatorInput): number {
  let dose = CATALOG.P2.doseDefault // 18

  if (input.nivel === 'fraco_amarelado' || input.nivel === 'ralo_falhas') {
    dose += 2
  }
  if (input.clima_hoje === 'quente_chovendo') dose += 1
  if (input.clima_hoje === 'quente_seco' && input.irrigacao === 'quase_nao') {
    dose -= 2
  }
  if (input.sol === 'meia_sombra' || input.sol === 'sombra') dose -= 1
  if (input.clima_hoje === 'frio') dose -= 2

  return clamp(dose, CATALOG.P2.doseMin, CATALOG.P2.doseMax)
}

export function calculateDoseP3(input: CalculatorInput): number {
  let dose = CATALOG.P3.doseDefault // 20

  if (input.pisoteio === 'alto') dose += 3
  if (input.clima_hoje === 'quente_seco' && input.irrigacao !== 'quase_nao') {
    dose += 2
  }
  if (input.irrigacao === 'quase_nao') dose -= 3
  if (input.sol === 'sombra') dose -= 3
  if (input.clima_hoje === 'frio') dose -= 5

  return clamp(dose, CATALOG.P3.doseMin, CATALOG.P3.doseMax)
}

export function calculateDose(
  productId: ProductId,
  input: CalculatorInput
): number {
  switch (productId) {
    case 'P1':
      return calculateDoseP1(input)
    case 'P2':
      return calculateDoseP2(input)
    case 'P3':
      return calculateDoseP3(input)
  }
}

// ============================================================
// 3) RECOMENDAÇÃO DE EMBALAGENS (menor sobra)
// ============================================================

export function recommendPacks(
  needGrams: number,
  availablePacks: number[]
): PackRecommendation[] {
  // Ordenar packs do maior para o menor
  const sortedPacks = [...availablePacks].sort((a, b) => b - a)

  // Para caso simples (1 tamanho, ex: P2 só tem 2700g)
  if (sortedPacks.length === 1) {
    const packSize = sortedPacks[0]
    const qty = Math.ceil(needGrams / packSize)
    return [
      {
        size_g: packSize,
        qty,
        label: `${qty}× ${formatPackSize(packSize)}`,
      },
    ]
  }

  // Para 2 tamanhos (400g e 900g): busca menor sobra
  type Combo = { packs: PackRecommendation[]; total: number; waste: number }
  let bestCombo: Combo | null = null

  const largest = sortedPacks[0]
  const smallest = sortedPacks[1]
  const maxLarge = Math.ceil(needGrams / smallest) // upper bound

  for (let nLarge = 0; nLarge <= maxLarge; nLarge++) {
    const remaining = needGrams - nLarge * largest
    if (remaining <= 0) {
      // Só com large
      const total = nLarge * largest
      const waste = total - needGrams
      const combo: Combo = {
        packs: [
          {
            size_g: largest,
            qty: nLarge,
            label: `${nLarge}× ${formatPackSize(largest)}`,
          },
        ],
        total,
        waste,
      }
      if (!bestCombo || waste < bestCombo.waste) {
        bestCombo = combo
      }
      continue
    }

    const nSmall = Math.ceil(remaining / smallest)
    const total = nLarge * largest + nSmall * smallest
    const waste = total - needGrams

    const packs: PackRecommendation[] = []
    if (nLarge > 0) {
      packs.push({
        size_g: largest,
        qty: nLarge,
        label: `${nLarge}× ${formatPackSize(largest)}`,
      })
    }
    if (nSmall > 0) {
      packs.push({
        size_g: smallest,
        qty: nSmall,
        label: `${nSmall}× ${formatPackSize(smallest)}`,
      })
    }

    const combo: Combo = { packs, total, waste }

    if (
      !bestCombo ||
      waste < bestCombo.waste ||
      (waste === bestCombo.waste &&
        packs.reduce((s, p) => s + p.qty, 0) <
          bestCombo.packs.reduce((s, p) => s + p.qty, 0))
    ) {
      bestCombo = combo
    }
  }

  return bestCombo?.packs || []
}

// ============================================================
// 4) ALERTAS CONDICIONAIS
// ============================================================

export function generateAlerts(input: CalculatorInput): string[] {
  const alerts: string[] = []

  if (input.irrigacao === 'quase_nao') {
    alerts.push(
      'Sem irrigação, o produto não ativa direito. Recomendamos dose menor e aplicação antes de uma rega.'
    )
  }

  if (input.clima_hoje === 'frio') {
    alerts.push(
      'No frio o gramado cresce menos. Você pode reduzir dose ou pausar o plano até o crescimento voltar.'
    )
  }

  if (input.clima_hoje === 'quente_seco' && input.irrigacao === 'quase_nao') {
    alerts.push(
      'Evite dose alta com o gramado seco. Primeiro regue e aplique com dose reduzida.'
    )
  }

  if (input.pisoteio === 'alto') {
    alerts.push(
      'Seu gramado tem uso intenso. A linha Resistência Total tende a dar o melhor retorno com constância.'
    )
  }

  return alerts
}

// ============================================================
// 5) MOTOR PRINCIPAL — gera o plano completo
// ============================================================

export function generatePlan(input: CalculatorInput): CalculatorResult {
  const productIds = selectProducts(input)
  const alerts = generateAlerts(input)

  const plan: ProductPlan[] = productIds.map((pid) => {
    const catalog = CATALOG[pid]
    const dose = calculateDose(pid, input)
    const needGrams = Math.round(input.area_m2 * dose)
    const packs = recommendPacks(needGrams, catalog.packs)

    const frequencyDays = Math.round(
      ((catalog.frequencyWeeksMin + catalog.frequencyWeeksMax) / 2) * 7
    )

    // Notas específicas do produto
    const notes: string[] = [
      'Aplique com o gramado seco e regue depois.',
      'Evite aplicar no sol forte do meio-dia.',
    ]

    if (pid === 'P2' && input.irrigacao === 'quase_nao') {
      notes.push('Se o gramado estiver sem irrigação e muito seco, use dose menor.')
    }

    if (pid === 'P3') {
      notes.push(
        'Para resistência de verdade, a constância vale mais do que exagerar na dose.'
      )
    }

    return {
      product_id: pid,
      name: catalog.name,
      dose_g_m2: dose,
      need_g: needGrams,
      need_display: formatGrams(needGrams),
      packs,
      packs_display: packs.map((p) => p.label).join(' + '),
      frequency_days: frequencyDays,
      frequency_display: `a cada ${catalog.frequencyWeeksMin}–${catalog.frequencyWeeksMax} semanas`,
      notes,
      whenToUse: catalog.whenToUse,
      applicationSteps: catalog.applicationSteps,
    }
  })

  const nextSteps = ['Aplicar hoje']
  if (plan.some((p) => p.frequency_days > 0 && p.product_id !== 'P1')) {
    const nextPlan = plan.find((p) => p.product_id !== 'P1')
    if (nextPlan) {
      nextSteps.push(`Reaplicar em ${nextPlan.frequency_display}`)
    }
  }

  return {
    area_m2: input.area_m2,
    context: input,
    plan,
    alerts,
    summary: {
      next_steps: nextSteps,
      next_application_date: null, // Preenchido na UI quando user escolher data
    },
  }
}

// ============================================================
// HELPERS
// ============================================================

function formatGrams(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000
    return `${kg.toFixed(1).replace('.', ',')} kg`
  }
  return `${grams} g`
}

function formatPackSize(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000
    return `${kg.toString().replace('.', ',')}kg`
  }
  return `${grams}g`
}
