/**
 * Rótulos das tags de produto, em um lugar só.
 *
 * A listagem e a página de produto tinham cada uma a sua lista. A mesma tag
 * precisa ter o mesmo rótulo nos dois lugares.
 */
export interface TagDeProduto {
  rotulo: string
  /** Classes do chip (literais completas, para o Tailwind enxergar). */
  cor: string
}

export const TAGS_DE_PRODUTO: Record<string, TagDeProduto> = {
  implantacao: { rotulo: 'Implantação', cor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  crescimento: { rotulo: 'Crescimento', cor: 'bg-sky-50 text-sky-700 border-sky-200' },
  resistencia: { rotulo: 'Proteção', cor: 'bg-amber-50 text-amber-700 border-amber-200' },
  protecao: { rotulo: 'Resistência', cor: 'bg-orange-50 text-orange-700 border-orange-200' },
  novo: { rotulo: 'Lançamento', cor: 'bg-forest/5 text-forest border-forest/20' },
  verde: { rotulo: 'Verde Intenso', cor: 'bg-green-50 text-green-700 border-green-200' },
}

/** Rótulo da tag; tag desconhecida aparece como veio. */
export function rotuloDaTag(tag: string): string {
  return TAGS_DE_PRODUTO[tag]?.rotulo ?? tag
}

/** Chips do card: só tags conhecidas, no máximo `maximo`. */
export function chipsDoProduto(tags: string[], maximo = 2): TagDeProduto[] {
  return tags
    .map((t) => TAGS_DE_PRODUTO[t])
    .filter((t): t is TagDeProduto => Boolean(t))
    .slice(0, maximo)
}
