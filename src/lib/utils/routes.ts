/**
 * Casamento de rota por prefixo, com fronteira de segmento.
 *
 * Existe por causa de um bug real: `'/contato'.startsWith('/conta')` é `true`,
 * então `/contato` era tratada como área logada. O efeito visível era o header
 * da área autenticada numa página pública, e o invisível era pior:
 * `ConditionalLayout` removia o rodapé, a barra de anúncio e a gaveta de
 * carrinho da página de contato.
 *
 * `dentroDe('/contato', '/conta')` é false.
 * `dentroDe('/conta', '/conta')` e `dentroDe('/conta/pedidos', '/conta')` são true.
 */
export function dentroDe(pathname: string | null | undefined, base: string): boolean {
  if (!pathname) return false
  return pathname === base || pathname.startsWith(`${base}/`)
}

/** Versão para uma lista de bases. */
export function dentroDeAlguma(
  pathname: string | null | undefined,
  bases: readonly string[]
): boolean {
  return bases.some((base) => dentroDe(pathname, base))
}

/**
 * Rotas que recebem o layout de área autenticada: header colado no topo, sem
 * rodapé, sem barra de anúncio e sem gaveta de carrinho.
 *
 * Lista única, consumida por Header e por ConditionalLayout. Antes cada um
 * mantinha a sua.
 */
export const AREAS_AUTENTICADAS = [
  '/admin',
  '/conta',
  '/login',
  '/cadastro',
  '/recuperar-senha',
  '/redefinir-senha',
] as const
