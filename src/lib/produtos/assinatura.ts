/**
 * Quais produtos podem ser assinados, e de quanto em quanto tempo.
 *
 * A regra vem do rótulo (docs/produtos-fatos-do-rotulo.md):
 * - Resistência Total: uso contínuo, a cada 60 dias. É o único assinável.
 * - Raiz Forte: uso pontual, não se repete todo mês.
 * - Verde Rápido: recuperação, repete só enquanto o gramado estiver amarelado.
 *
 * A entrega segue o intervalo de aplicação. Entregar antes sobraria produto
 * ou convidaria a passar da dose, e o rótulo diz para não exceder.
 */
const INTERVALO_POR_HANDLE: Record<string, 60> = {
  'resistencia-total': 60,
}

/** Intervalo da assinatura em dias, ou null quando o produto não é assinável. */
export function intervaloDaAssinatura(handle: string): 60 | null {
  return INTERVALO_POR_HANDLE[handle] ?? null
}
