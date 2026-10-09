import { createHash, timingSafeEqual } from 'crypto'

/**
 * Compara dois segredos em tempo constante.
 *
 * `===` para no primeiro caractere diferente, e o tempo de resposta vaza
 * quantos caracteres do palpite estão certos. Os dois lados passam por
 * SHA-256 antes da comparação para terem o mesmo tamanho: `timingSafeEqual`
 * lança com buffers de tamanhos diferentes.
 */
export function iguaisEmTempoConstante(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a, 'utf8').digest()
  const hashB = createHash('sha256').update(b, 'utf8').digest()
  return timingSafeEqual(hashA, hashB)
}
