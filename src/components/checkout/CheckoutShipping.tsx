'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Loader2, Check, AlertCircle, Truck, Zap, Timer } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/subscription/pricing'
import { fetchAddressByCep, calculateShipping } from '@/lib/shipping/calculator'
import type { ShippingOption, ShippingAddress } from '@/lib/shipping/types'
import type { CheckoutAddress } from '@/lib/checkout/types'

/**
 * Mapeia ícone emoji do cálculo de frete para componentes Lucide premium
 */
function ShippingIcon({ serviceId, className }: { serviceId: string; className?: string }) {
  const base = cn('w-5 h-5', className)

  switch (serviceId) {
    case 'free':
      return <Package className={cn(base, 'text-forest')} />
    case 'pac':
      return <Truck className={cn(base, 'text-txt-muted')} />
    case 'sedex':
      return <Zap className={cn(base, 'text-gold')} />
    case 'express':
      return <Timer className={cn(base, 'text-forest-ink')} />
    default:
      return <Truck className={cn(base, 'text-txt-muted')} />
  }
}

interface CheckoutShippingProps {
  cep: string
  cartSubtotal: number
  selectedShipping: ShippingOption | null
  onShippingSelect: (option: ShippingOption) => void
  onAddressFound: (addr: ShippingAddress) => void
  onAddressLoading: (loading: boolean) => void
}

export function CheckoutShipping({
  cep,
  cartSubtotal,
  selectedShipping,
  onShippingSelect,
  onAddressFound,
  onAddressLoading,
}: CheckoutShippingProps) {
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCalculated, setIsCalculated] = useState(false)

  // Auto-calcular quando CEP tem 8 dígitos
  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) {
      setIsCalculated(false)
      setOptions([])
      return
    }

    let cancelled = false

    const calculate = async () => {
      setIsLoading(true)
      onAddressLoading(true)

      try {
        const addr = await fetchAddressByCep(cleanCep)
        if (cancelled) return
        if (!addr) {
          setIsLoading(false)
          onAddressLoading(false)
          return
        }

        onAddressFound(addr)
        const shippingOptions = await calculateShipping(addr, cartSubtotal, 1)
        if (cancelled) return

        setOptions(shippingOptions)
        setIsCalculated(true)

        const recommended = shippingOptions.find((o) => o.isRecommended) || shippingOptions[0]
        if (recommended) onShippingSelect(recommended)
      } catch {
        // silently fail
      } finally {
        if (!cancelled) {
          setIsLoading(false)
          onAddressLoading(false)
        }
      }
    }

    calculate()
    return () => { cancelled = true }
  }, [cep, cartSubtotal, onAddressFound, onShippingSelect, onAddressLoading])

  if (!isCalculated && !isLoading) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-forest" />
        <h3 className="text-sm font-semibold text-txt-primary">Opções de frete</h3>
        {isLoading && <Loader2 className="w-3.5 h-3.5 text-txt-muted animate-spin" />}
      </div>

      <AnimatePresence>
        {options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {options.map((opt) => {
              const isSelected = selectedShipping?.id === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => onShippingSelect(opt)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-left transition-all',
                    isSelected
                      ? 'border-forest bg-forest/5 ring-1 ring-forest/20'
                      : 'border-border-subtle hover:border-forest/30 bg-bg-surface'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      isSelected ? 'bg-forest/10' : 'bg-bg-surface-2'
                    )}>
                      <ShippingIcon serviceId={opt.id} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-txt-primary">{opt.service}</span>
                        {opt.isFree && (
                          <span className="text-[10px] font-bold text-forest bg-forest/10 px-1.5 py-0.5 rounded">
                            GRÁTIS
                          </span>
                        )}
                        {opt.isRecommended && !opt.isFree && (
                          <span className="text-[10px] font-bold text-gold bg-gold/10 px-1.5 py-0.5 rounded">
                            RECOMENDADO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-txt-muted mt-0.5">
                        {opt.estimatedDays.min === opt.estimatedDays.max
                          ? `${opt.estimatedDays.min} dia útil`
                          : `${opt.estimatedDays.min}–${opt.estimatedDays.max} dias úteis`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {opt.isFree ? (
                        <>
                          <span className="text-sm font-semibold text-forest">Grátis</span>
                          {opt.originalPrice && (
                            <p className="text-[10px] text-txt-muted line-through">
                              {formatPrice(opt.originalPrice)}
                            </p>
                          )}
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-txt-primary">
                          {formatPrice(opt.price)}
                        </span>
                      )}
                    </div>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                        isSelected ? 'border-forest bg-forest' : 'border-border-medium'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
