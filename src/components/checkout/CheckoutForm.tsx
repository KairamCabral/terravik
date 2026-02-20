'use client'

import { useEffect } from 'react'
import { User, MapPin, Building2 } from 'lucide-react'
import { MaskedInput } from './MaskedInput'
import { cn } from '@/lib/utils/cn'
import type { CheckoutCustomer, CheckoutAddress } from '@/lib/checkout/types'

export type DocumentType = 'cpf' | 'cnpj'

interface CheckoutFormProps {
  customer: CheckoutCustomer
  address: Partial<CheckoutAddress>
  errors: Partial<Record<string, string>>
  touched: Set<string>
  documentType: DocumentType
  onDocumentTypeChange: (type: DocumentType) => void
  onCustomerChange: <K extends keyof CheckoutCustomer>(field: K, value: string) => void
  onAddressChange: <K extends keyof CheckoutAddress>(field: K, value: string) => void
  onBlur: (field: string) => void
  cepValue: string
  onCepChange: (raw: string, masked: string) => void
  isAddressLoading: boolean
}

/**
 * Detecta automaticamente se é CPF ou CNPJ baseado no número de dígitos
 */
function detectDocumentType(value: string): DocumentType {
  const digits = value.replace(/\D/g, '')
  if (digits.length >= 12) return 'cnpj'
  return 'cpf'
}

export function CheckoutForm({
  customer,
  address,
  errors,
  touched,
  documentType,
  onDocumentTypeChange,
  onCustomerChange,
  onAddressChange,
  onBlur,
  cepValue,
  onCepChange,
  isAddressLoading,
}: CheckoutFormProps) {
  const err = (field: string) => (touched.has(field) ? errors[field] : undefined)
  const ok = (field: string, value?: string) => touched.has(field) && !errors[field] && !!value

  // Detecta automaticamente o tipo de documento ao digitar
  useEffect(() => {
    const detected = detectDocumentType(customer.cpf)
    if (detected !== documentType) {
      onDocumentTypeChange(detected)
    }
  }, [customer.cpf, documentType, onDocumentTypeChange])

  // Define se é pessoa jurídica (CNPJ)
  const isPJ = documentType === 'cnpj'

  return (
    <div className="space-y-6">
      {/* Informações pessoais */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-forest" />
          <h3 className="text-sm font-semibold text-txt-primary">Informações pessoais</h3>
        </div>

        <div className="space-y-3">
          <MaskedInput
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={customer.email}
            onChange={(_raw, masked) => onCustomerChange('email', masked)}
            onBlur={() => onBlur('email')}
            error={err('email')}
            success={ok('email', customer.email)}
            required
            autoComplete="email"
          />

          <MaskedInput
            label={isPJ ? 'Razão Social' : 'Nome completo'}
            placeholder={isPJ ? 'Razão Social da empresa' : 'Como está no documento'}
            value={customer.fullName}
            onChange={(_raw, masked) => onCustomerChange('fullName', masked)}
            onBlur={() => onBlur('fullName')}
            error={err('fullName')}
            success={ok('fullName', customer.fullName)}
            required
            autoComplete="name"
          />

          {/* CPF/CNPJ com detecção automática */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <MaskedInput
                label="CPF/CNPJ"
                mask="cpf-cnpj"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={customer.cpf}
                onChange={(_raw, masked) => onCustomerChange('cpf', masked)}
                onBlur={() => onBlur('cpf')}
                error={err('cpf')}
                success={ok('cpf', customer.cpf)}
                required
                autoComplete="off"
              />
              {!isPJ && customer.cpf.replace(/\D/g, '').length > 0 && customer.cpf.replace(/\D/g, '').length < 11 && (
                <p className="text-[10px] text-txt-muted mt-1">
                  Digite CPF (11 dígitos) ou CNPJ (14 dígitos)
                </p>
              )}
              {isPJ && (
                <p className="text-[10px] text-forest mt-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  Pessoa Jurídica detectada
                </p>
              )}
            </div>

            <MaskedInput
              label="Telefone"
              mask="phone"
              inputMode="tel"
              placeholder="(00) 00000-0000"
              value={customer.phone}
              onChange={(_raw, masked) => onCustomerChange('phone', masked)}
              onBlur={() => onBlur('phone')}
              error={err('phone')}
              success={ok('phone', customer.phone)}
              required
              autoComplete="tel"
            />
          </div>

          {/* Campos adicionais de PJ (aparecem automaticamente) */}
          {isPJ && (
            <>
              <MaskedInput
                label="Inscrição Estadual"
                placeholder="000.000.000.000 (opcional)"
                value={customer.inscricaoEstadual || ''}
                onChange={(_raw, masked) => onCustomerChange('inscricaoEstadual', masked)}
                onBlur={() => onBlur('inscricaoEstadual')}
                error={err('inscricaoEstadual')}
                success={ok('inscricaoEstadual', customer.inscricaoEstadual)}
                autoComplete="off"
              />
              <p className="text-xs text-txt-muted -mt-2">
                A Inscrição Estadual é necessária se sua empresa for contribuinte do ICMS
              </p>
            </>
          )}
        </div>
      </section>

      {/* Endereço */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-forest" />
          <h3 className="text-sm font-semibold text-txt-primary">Endereço de entrega</h3>
        </div>

        <div className="space-y-3">
          {/* CEP primeiro — para auto-fill */}
          <div className="max-w-[220px]">
            <MaskedInput
              label="CEP"
              mask="cep"
              inputMode="numeric"
              placeholder="00000-000"
              value={cepValue}
              onChange={onCepChange}
              onBlur={() => onBlur('cep')}
              error={err('cep')}
              success={ok('cep', cepValue)}
              required
              autoComplete="postal-code"
            />
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-forest hover:underline mt-0.5 inline-block"
            >
              Não sei meu CEP
            </a>
          </div>

          {/* Endereço auto-preenchido pelo CEP */}
          {address.city && (
            <p className="text-xs text-txt-muted -mt-1">
              {address.neighborhood && `${address.neighborhood} · `}{address.city}/{address.state}
              {isAddressLoading && ' · Buscando...'}
            </p>
          )}

          <MaskedInput
            label="Rua"
            placeholder="Nome da rua"
            value={address.street || ''}
            onChange={(_raw, masked) => onAddressChange('street', masked)}
            onBlur={() => onBlur('street')}
            error={err('street')}
            success={ok('street', address.street)}
            required
            autoComplete="street-address"
          />

          <div className="grid grid-cols-3 gap-3">
            <MaskedInput
              label="Número"
              placeholder="Nº"
              value={address.number || ''}
              onChange={(_raw, masked) => onAddressChange('number', masked)}
              onBlur={() => onBlur('number')}
              error={err('number')}
              success={ok('number', address.number)}
              required
              autoComplete="off"
            />

            <div className="col-span-2">
              <MaskedInput
                label="Complemento"
                placeholder="Apto, bloco, etc. (opcional)"
                value={address.complement || ''}
                onChange={(_raw, masked) => onAddressChange('complement', masked)}
                autoComplete="address-line2"
              />
            </div>
          </div>

          <MaskedInput
            label="Bairro"
            placeholder="Bairro"
            value={address.neighborhood || ''}
            onChange={(_raw, masked) => onAddressChange('neighborhood', masked)}
            onBlur={() => onBlur('neighborhood')}
            error={err('neighborhood')}
            success={ok('neighborhood', address.neighborhood)}
            required
            autoComplete="off"
          />

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <MaskedInput
                label="Cidade"
                placeholder="Cidade"
                value={address.city || ''}
                onChange={(_raw, masked) => onAddressChange('city', masked)}
                onBlur={() => onBlur('city')}
                error={err('city')}
                success={ok('city', address.city)}
                required
                autoComplete="address-level2"
              />
            </div>

            <MaskedInput
              label="UF"
              placeholder="SP"
              maxLength={2}
              value={address.state || ''}
              onChange={(_raw, masked) => onAddressChange('state', masked.toUpperCase())}
              onBlur={() => onBlur('state')}
              error={err('state')}
              success={ok('state', address.state)}
              required
              autoComplete="address-level1"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
