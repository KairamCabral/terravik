/**
 * As regras da senha, em um lugar só.
 *
 * Usadas pelo cadastro e por /redefinir-senha. Duas listas de requisito
 * mantidas em paralelo divergem, e aqui a divergência não estoura nada: ela só
 * tranca alguém do lado de fora, com uma senha aceita numa tela e recusada na
 * outra.
 */

export interface ForcaDaSenha {
  checks: { length: boolean; uppercase: boolean; number: boolean }
  passed: number
  total: number
}

export function forcaDaSenha(senha: string): ForcaDaSenha {
  const checks = {
    length: senha.length >= 8,
    uppercase: /[A-Z]/.test(senha),
    number: /[0-9]/.test(senha),
  }
  return { checks, passed: Object.values(checks).filter(Boolean).length, total: 3 }
}

export const REQUISITOS_DE_SENHA = [
  { chave: 'length', rotulo: 'Mínimo 8 caracteres' },
  { chave: 'uppercase', rotulo: 'Uma letra maiúscula' },
  { chave: 'number', rotulo: 'Um número' },
] as const
