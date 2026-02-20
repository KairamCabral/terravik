/**
 * Validação do Checkout — Tempo real e submissão
 */

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Informe seu e-mail'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(email)) return 'E-mail inválido'
  return null
}

export function validateFullName(name: string): string | null {
  if (!name.trim()) return 'Informe seu nome completo'
  if (name.trim().split(/\s+/).length < 2) return 'Informe nome e sobrenome'
  return null
}

export function validateCPF(cpf: string): string | null {
  const clean = cpf.replace(/\D/g, '')
  if (!clean) return 'Informe seu CPF'
  if (clean.length !== 11) return 'CPF deve ter 11 dígitos'

  if (/^(\d)\1{10}$/.test(clean)) return 'CPF inválido'

  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i)
  let remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(clean[9])) return 'CPF inválido'

  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10) remainder = 0
  if (remainder !== parseInt(clean[10])) return 'CPF inválido'

  return null
}

export function validateCNPJ(cnpj: string): string | null {
  const clean = cnpj.replace(/\D/g, '')
  if (!clean) return 'Informe seu CNPJ'
  if (clean.length !== 14) return 'CNPJ deve ter 14 dígitos'

  if (/^(\d)\1{13}$/.test(clean)) return 'CNPJ inválido'

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  let sum = 0
  for (let i = 0; i < 12; i++) sum += parseInt(clean[i]) * weights1[i]
  let remainder = sum % 11
  if (remainder < 2) { if (parseInt(clean[12]) !== 0) return 'CNPJ inválido' }
  else { if (parseInt(clean[12]) !== 11 - remainder) return 'CNPJ inválido' }

  sum = 0
  for (let i = 0; i < 13; i++) sum += parseInt(clean[i]) * weights2[i]
  remainder = sum % 11
  if (remainder < 2) { if (parseInt(clean[13]) !== 0) return 'CNPJ inválido' }
  else { if (parseInt(clean[13]) !== 11 - remainder) return 'CNPJ inválido' }

  return null
}

/**
 * Valida CPF ou CNPJ conforme o tipo do documento
 */
export function validateDocument(value: string, type: 'cpf' | 'cnpj'): string | null {
  return type === 'cpf' ? validateCPF(value) : validateCNPJ(value)
}

export function validatePhone(phone: string): string | null {
  const clean = phone.replace(/\D/g, '')
  if (!clean) return 'Informe seu telefone'
  if (clean.length < 10 || clean.length > 11) return 'Telefone inválido'
  return null
}

export function validateCEP(cep: string): string | null {
  const clean = cep.replace(/\D/g, '')
  if (!clean) return 'Informe o CEP'
  if (clean.length !== 8) return 'CEP deve ter 8 dígitos'
  return null
}

export function validateStreet(street: string): string | null {
  if (!street.trim()) return 'Informe a rua'
  return null
}

export function validateNumber(number: string): string | null {
  if (!number.trim()) return 'Informe o número'
  return null
}

export function validateNeighborhood(neighborhood: string): string | null {
  if (!neighborhood.trim()) return 'Informe o bairro'
  return null
}

export function validateCity(city: string): string | null {
  if (!city.trim()) return 'Informe a cidade'
  return null
}

export function validateState(state: string): string | null {
  if (!state.trim()) return 'Informe o estado'
  if (state.length !== 2) return 'Use a sigla do estado (ex: SP)'
  return null
}

/**
 * Validação completa do formulário — retorna mapa de erros
 */
export function validateCheckoutForm(data: {
  email: string
  fullName: string
  cpf: string
  phone: string
  cep: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
}): Record<string, string> {
  const errors: Record<string, string> = {}

  const checks: [string, string | null][] = [
    ['email', validateEmail(data.email)],
    ['fullName', validateFullName(data.fullName)],
    ['cpf', validateCPF(data.cpf)],
    ['phone', validatePhone(data.phone)],
    ['cep', validateCEP(data.cep)],
    ['street', validateStreet(data.street)],
    ['number', validateNumber(data.number)],
    ['neighborhood', validateNeighborhood(data.neighborhood)],
    ['city', validateCity(data.city)],
    ['state', validateState(data.state)],
  ]

  for (const [field, error] of checks) {
    if (error) errors[field] = error
  }

  return errors
}
