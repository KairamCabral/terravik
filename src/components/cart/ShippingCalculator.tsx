'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Loader2, Check, AlertCircle, ChevronRight, Truck } from 'lucide-react'
import type { ShippingAddress, ShippingOption } from '@/lib/shipping/types'
import { fetchAddressByCep, calculateShipping } from '@/lib/shipping/calculator'
import { formatPrice } from '@/lib/subscription/pricing'

interface ShippingCalculatorProps {
  cartSubtotal: number
  cartWeight?: number
  onShippingSelect: (option: ShippingOption) => void
  selectedShipping?: ShippingOption | null
}

export function ShippingCalculator({
  cartSubtotal,
  cartWeight = 1,
  onShippingSelect,
  selectedShipping,
}: ShippingCalculatorProps) {
  const [cep, setCep] = useState('')
  const [address, setAddress] = useState<ShippingAddress | null>(null)
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCalculated, setIsCalculated] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 5) return numbers
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleCalculate = useCallback(
    async (cepValue?: string) => {
      const cepToUse = cepValue || cep
      const cleanCep = cepToUse.replace(/\D/g, '')

      if (cleanCep.length !== 8) {
        setError('CEP inválido')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const addressData = await fetchAddressByCep(cleanCep)

        if (!addressData) {
          setError('CEP não encontrado')
          setIsLoading(false)
          return
        }

        setAddress(addressData)
        const shippingOptions = await calculateShipping(addressData, cartSubtotal, cartWeight)
        setOptions(shippingOptions)
        setIsCalculated(true)

        const recommended = shippingOptions.find((o) => o.isRecommended) || shippingOptions[0]
        if (recommended) {
          onShippingSelect(recommended)
        }
      } catch {
        setError('Erro ao calcular frete. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    },
    [cep, cartSubtotal, cartWeight, onShippingSelect]
  )

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value)
    setCep(formatted)
    setError(null)

    if (formatted.replace(/\D/g, '').length === 8) {
      handleCalculate(formatted)
    }
  }

  // Resumo compacto após cálculo
  if (isCalculated && selectedShipping && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-between py-1 text-sm group"
      >
        <div className="flex items-center gap-2 text-terravik-brown/60">
          <Truck className="w-3.5 h-3.5" />
          <span>Frete</span>
          {address && (
            <span className="text-terravik-brown/40 text-xs">
              ({address.city}/{address.state})
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className={`font-medium ${selectedShipping.isFree ? 'text-leaf' : 'text-terravik-brown'}`}>
            {selectedShipping.isFree ? 'Grátis' : formatPrice(selectedShipping.price)}
          </span>
          <span className="text-xs text-terravik-brown/40 group-hover:text-leaf transition-colors">Alterar</span>
        </div>
      </button>
    )
  }

  // Linha colapsada inicial
  if (!isExpanded && !isCalculated) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-between py-1 text-sm group"
      >
        <div className="flex items-center gap-2 text-terravik-brown/60">
          <Package className="w-3.5 h-3.5" />
          <span>Frete</span>
        </div>
        <span className="text-xs text-leaf font-medium flex items-center gap-0.5 group-hover:underline">
          Calcule seu frete <ChevronRight className="w-3 h-3" />
        </span>
      </button>
    )
  }

  return (
    <div className="space-y-3">
      {/* Input de CEP compacto */}
      <div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={cep}
              onChange={handleCepChange}
              placeholder="00000-000"
              maxLength={9}
              autoFocus
              className={`
                w-full px-3 py-2 text-sm rounded-lg border transition-colors text-terravik-brown
                ${error
                  ? 'border-accent-red/40 focus:border-accent-red'
                  : isCalculated
                    ? 'border-leaf-light/40 focus:border-leaf'
                    : 'border-terravik-brown/15 focus:border-leaf'
                }
                focus:outline-none focus:ring-1 focus:ring-leaf/20
                bg-white placeholder:text-terravik-brown/30
              `}
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-terravik-brown/30 animate-spin" />
              ) : isCalculated ? (
                <Check className="w-4 h-4 text-leaf" />
              ) : null}
            </div>
          </div>

          <button
            onClick={() => handleCalculate()}
            disabled={isLoading || cep.replace(/\D/g, '').length !== 8}
            className="px-3 py-2 bg-forest text-white text-sm rounded-lg font-medium hover:bg-leaf disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'OK'}
          </button>

          {!isCalculated && (
            <button
              onClick={() => setIsExpanded(false)}
              className="px-2 py-2 text-terravik-brown/30 hover:text-terravik-brown/60 text-xs"
            >
              &times;
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-terravik-brown/40 hover:text-leaf transition-colors"
          >
            Não sei meu CEP
          </a>
          {error && (
            <span className="flex items-center gap-1 text-[11px] text-accent-red">
              <AlertCircle className="w-3 h-3" />
              {error}
            </span>
          )}
        </div>
      </div>

      {/* Endereço + Opções */}
      <AnimatePresence>
        {options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5"
          >
            {address && (
              <p className="text-[11px] text-terravik-brown/40 truncate">
                {address.city}/{address.state}
                {address.neighborhood && ` - ${address.neighborhood}`}
              </p>
            )}

            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onShippingSelect(option)
                  setIsExpanded(false)
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all text-sm
                  ${selectedShipping?.id === option.id
                    ? 'border-leaf/40 bg-terravik-green-50'
                    : 'border-terravik-brown/10 hover:border-terravik-brown/20'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{option.icon}</span>
                  <div>
                    <span className="font-medium text-terravik-brown">{option.service}</span>
                    {option.isFree && (
                      <span className="ml-1.5 text-[10px] font-bold text-leaf bg-terravik-green-50 px-1 py-0.5 rounded">
                        GRÁTIS
                      </span>
                    )}
                    <p className="text-[11px] text-terravik-brown/40">
                      {option.estimatedDays.min === option.estimatedDays.max
                        ? `${option.estimatedDays.min} dia útil`
                        : `${option.estimatedDays.min}-${option.estimatedDays.max} dias úteis`}
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2">
                  {option.isFree ? (
                    <div>
                      <span className="font-semibold text-leaf text-sm">Grátis</span>
                      {option.originalPrice && (
                        <p className="text-[10px] text-terravik-brown/30 line-through">{formatPrice(option.originalPrice)}</p>
                      )}
                    </div>
                  ) : (
                    <span className="font-semibold text-terravik-brown text-sm">{formatPrice(option.price)}</span>
                  )}

                  {/* Radio */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${selectedShipping?.id === option.id ? 'border-leaf bg-leaf' : 'border-terravik-brown/20'}
                    `}
                  >
                    {selectedShipping?.id === option.id && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
