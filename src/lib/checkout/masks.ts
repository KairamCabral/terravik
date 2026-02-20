/**
 * Máscaras de input para o checkout
 */

export function maskCPF(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 11)
  if (clean.length <= 3) return clean
  if (clean.length <= 6) return `${clean.slice(0, 3)}.${clean.slice(3)}`
  if (clean.length <= 9)
    return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`
  return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`
}

export function maskPhone(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 11)
  if (clean.length <= 2) return clean.length ? `(${clean}` : ''
  if (clean.length <= 7) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`
  if (clean.length <= 10)
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`
  return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`
}

export function maskCEP(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 8)
  if (clean.length <= 5) return clean
  return `${clean.slice(0, 5)}-${clean.slice(5)}`
}

export function unmask(value: string): string {
  return value.replace(/\D/g, '')
}
