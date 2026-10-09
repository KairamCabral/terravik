/**
 * Regras de quando um vídeo de fundo pode baixar e tocar sozinho.
 *
 * Ficam aqui, e não dentro do componente, para que um segundo vídeo em loop
 * no site use a mesma regra em vez de uma cópia que diverge.
 *
 * Só funcionam no navegador. Chame dentro de `useEffect`.
 */

type Conexao = { saveData?: boolean; effectiveType?: string }

/**
 * A pessoa pediu para economizar dados, ou a conexão é 2G?
 *
 * Nesses casos o vídeo NÃO baixa. O pôster fica, e o botão de reproduzir
 * oferece a escolha.
 */
export function economizandoDados(): boolean {
  const conexao = (navigator as Navigator & { connection?: Conexao }).connection
  if (!conexao) return false
  // effectiveType: 'slow-2g' | '2g' | '3g' | '4g'
  return Boolean(conexao.saveData) || /2g$/.test(conexao.effectiveType ?? '')
}

/**
 * A pessoa pediu menos movimento no sistema operacional?
 *
 * Aí o vídeo não toca sozinho: loop automático é o tipo de movimento que
 * provoca enjoo em quem tem sensibilidade vestibular.
 */
export function preferemMenosMovimento(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
