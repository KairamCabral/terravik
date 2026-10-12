/**
 * Motor de Cálculo da Calculadora Terravik.
 *
 * Funções puras, sem side effects.
 *
 * REGRA CENTRAL: a dose é a do rótulo, e nada passa dela. O rótulo diz "não
 * exceda a dose recomendada, o excesso queima a grama". As respostas do quiz
 * (objetivo, plantio e estado do gramado) escolhem QUAIS produtos entram no
 * plano; clima, rega e pisoteio só geram avisos. Elas não mexem mais na dose:
 * o rótulo traz um valor só por produto, e não dá base para faixa nenhuma.
 */

import type {
  CalculatorInput,
  CalculatorResult,
  CatalogProduct,
  ProductPlan,
  ProductId,
  PackRecommendation,
} from '@/types/calculator'
import { CATALOG, PACK_LABEL } from './constants'

// ============================================================
// 1) DECISÃO: quais produtos entram no plano
// ============================================================

/**
 * Cada produto entra pelo "para quem" do rótulo:
 * - Raiz Forte: "Vai plantar, reformar ou recuperar as falhas do gramado?"
 * - Verde Rápido: "Seu gramado está amarelado ou sem vida?" O verso fala em
 *   grama que "perde força, clareia e fica ralinha". É recuperação: não entra
 *   em gramado que já está bonito, a não ser que a pessoa peça cor.
 * - Resistência Total: uso contínuo, para o gramado forte o ano inteiro.
 */
export function selectProducts(input: CalculatorInput): ProductId[] {
  const products = new Set<ProductId>()

  if (input.implantando) products.add('P1')

  switch (input.objetivo) {
    case 'implantacao':
      products.add('P1')
      break

    case 'verde_vigor':
      products.add('P2')
      break

    case 'resistencia':
      products.add('P3')
      break

    case 'plano_completo':
      if (input.nivel === 'ralo_falhas') products.add('P1')
      if (input.nivel !== 'bonito') products.add('P2')
      products.add('P3')
      break
  }

  // A ordem P1, P2, P3 é a da linha do tempo da embalagem.
  return (['P1', 'P2', 'P3'] as const).filter((id) => products.has(id))
}

// ============================================================
// 2) DOSE (g/m²): a do rótulo, sempre
// ============================================================

/**
 * Dose em g/m². Devolve a dose do rótulo, que é o teto.
 * Não recebe as respostas do quiz de propósito: o contexto do gramado não
 * altera a dose.
 */
export function calculateDose(productId: ProductId): number {
  return CATALOG[productId].doseLabel
}

/**
 * Gramas que a área pede, pela conta do rótulo: o saco inteiro cobre
 * `yieldM2`. Usa o rendimento e não a dose arredondada, para o Verde Rápido
 * (16,7 g/m², escrito "cerca de 17") não passar do rótulo em área grande.
 */
export function calculateNeedGrams(area_m2: number, product: CatalogProduct): number {
  return Math.round((area_m2 * product.packGrams) / product.yieldM2)
}

// ============================================================
// 3) DOSADORES (a linguagem do rótulo)
// ============================================================

/**
 * Dosadores rasos que a área pede, em passos de meio dosador e arredondando
 * para BAIXO: na dúvida, o plano fica aquém do rótulo, nunca além.
 */
export function calculateScoops(area_m2: number, product: CatalogProduct): number {
  return Math.floor((area_m2 / product.scoopM2) * 2 + 1e-9) / 2
}

export function formatScoops(scoops: number): string {
  if (scoops < 0.5) return 'menos de meio dosador raso'
  if (scoops === 0.5) return 'cerca de meio dosador raso'
  const inteiros = Math.floor(scoops)
  const meio = scoops - inteiros >= 0.5
  const base = `${inteiros.toLocaleString('pt-BR')} ${inteiros === 1 ? 'dosador raso' : 'dosadores rasos'}`
  return `cerca de ${base}${meio ? ' e meio' : ''}`
}

// ============================================================
// 4) SACOS: um tamanho só
// ============================================================

/** Quantos sacos a área precisa: o menor número inteiro que cobre a área. */
export function recommendPacks(
  area_m2: number,
  product: CatalogProduct
): PackRecommendation[] {
  const qty = Math.max(1, Math.ceil(area_m2 / product.yieldM2 - 1e-9))
  return [
    {
      size_g: product.packGrams,
      qty,
      label: `${qty} ${qty === 1 ? 'saco' : 'sacos'} de ${PACK_LABEL}`,
    },
  ]
}

// ============================================================
// 5) ALERTAS CONDICIONAIS
// ============================================================

export function generateAlerts(
  input: CalculatorInput,
  productIds: ProductId[] = selectProducts(input)
): string[] {
  const alerts: string[] = []

  if (productIds.length > 1) {
    alerts.push(
      'Aplique um produto por vez, na ordem da linha do tempo da embalagem. Não some as doses no mesmo dia.'
    )
  }

  if (input.irrigacao === 'quase_nao') {
    alerts.push(
      'O fertilizante só funciona com água. Aplique apenas quando puder regar logo em seguida.'
    )
  }

  if (input.clima_hoje === 'quente_seco') {
    alerts.push(
      'No calor, aplique de manhã ou no fim da tarde. Evite o sol forte do meio-dia.'
    )
  }

  if (input.clima_hoje === 'frio') {
    alerts.push(
      'No frio o gramado cresce menos, e o resultado pode demorar mais para aparecer.'
    )
  }

  if (input.nivel === 'fraco_amarelado' && !productIds.includes('P2')) {
    alerts.push(
      'Você contou que o gramado está fraco ou amarelado. O Verde Rápido é o produto da linha para devolver a cor.'
    )
  }

  if (input.nivel === 'ralo_falhas' && !productIds.includes('P1')) {
    alerts.push(
      'Você contou que o gramado está ralo ou com falhas. O Raiz Forte é o produto da linha para recuperar as falhas.'
    )
  }

  if (input.pisoteio === 'alto' && !productIds.includes('P3')) {
    alerts.push(
      'Seu gramado tem uso intenso. O Resistência Total é o produto da linha para aguentar seca, sol e pisoteio.'
    )
  }

  return alerts
}

// ============================================================
// 6) MOTOR PRINCIPAL: gera o plano completo
// ============================================================

export function generatePlan(input: CalculatorInput): CalculatorResult {
  const productIds = selectProducts(input)
  const alerts = generateAlerts(input, productIds)

  const plan: ProductPlan[] = productIds.map((pid) => {
    const catalog = CATALOG[pid]
    const needGrams = calculateNeedGrams(input.area_m2, catalog)
    const packs = recommendPacks(input.area_m2, catalog)
    const scoops = calculateScoops(input.area_m2, catalog)

    return {
      product_id: pid,
      name: catalog.name,
      dose_g_m2: catalog.doseLabel,
      dose_display: `${catalog.doseApprox ? 'cerca de ' : ''}${catalog.doseLabel} g`,
      dose_approx: catalog.doseApprox,
      need_g: needGrams,
      need_display: formatGrams(needGrams),
      dosadores: scoops,
      dosadores_display: formatScoops(scoops),
      scoop_display: `1 dosador raso cobre cerca de ${catalog.scoopM2} m²`,
      packs,
      packs_display: packs.map((p) => p.label).join(' + '),
      packs_qty: packs.reduce((sum, p) => sum + p.qty, 0),
      frequency_kind: catalog.frequencyKind,
      // Só agenda repetição quando o rótulo dá o intervalo.
      frequency_days: catalog.repeatDaysMin ?? 0,
      frequency_days_max: catalog.repeatDaysMax ?? 0,
      frequency_display: catalog.frequencyText,
      notes: catalog.warnings,
      whenToUse: catalog.whenToUse,
      applicationSteps: catalog.applicationSteps,
    }
  })

  const nextSteps = [`Começar por ${plan[0]?.name ?? 'seu produto'}`]
  for (const p of plan) {
    if (p.frequency_days > 0) {
      nextSteps.push(`${p.name}: ${lowerFirst(p.frequency_display)}`)
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
    // Até duas casas, sem zeros sobrando: 1250 g vira "1,25 kg", não "1,3 kg".
    const kg = (grams / 1000).toFixed(2).replace(/\.?0+$/, '')
    return `${kg.replace('.', ',')} kg`
  }
  return `${grams} g`
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1)
}
