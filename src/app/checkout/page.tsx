'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCart } from '@/components/cart/CartProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import {
  validateEmail,
  validateFullName,
  validateCPF,
  validateCNPJ,
  validatePhone,
  validateCEP,
  validateStreet,
  validateNumber,
  validateNeighborhood,
  validateCity,
  validateState,
} from '@/lib/checkout/validation'
import type { CheckoutCustomer, CheckoutAddress } from '@/lib/checkout/types'
import type { ShippingOption, ShippingAddress } from '@/lib/shipping/types'
import type { AppliedCoupon } from '@/lib/shipping/coupon'
import type { DocumentType } from '@/components/checkout/CheckoutForm'
import {
  CheckoutHeader,
  CheckoutProgress,
  CheckoutForm,
  CheckoutShipping,
  CheckoutOrderBump,
  CheckoutCTA,
  CheckoutHelp,
  CheckoutTrustBadges,
  CheckoutOrderSummary,
  CheckoutMobileSummary,
  ExitIntentModal,
  CheckoutCoupon,
} from '@/components/checkout'
import { FreeShippingBar } from '@/components/cart/FreeShippingBar'

const FIELD_VALIDATORS: Record<string, (v: string) => string | null> = {
  email: validateEmail,
  fullName: validateFullName,
  phone: validatePhone,
  cep: validateCEP,
  street: validateStreet,
  number: validateNumber,
  neighborhood: validateNeighborhood,
  city: validateCity,
  state: validateState,
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, isLoading: cartLoading } = useCart()
  const { user, profile } = useAuth()

  // Document type
  const [documentType, setDocumentType] = useState<DocumentType>('cpf')

  // Form state
  const [customer, setCustomer] = useState<CheckoutCustomer>({
    email: '',
    fullName: '',
    cpf: '',
    phone: '',
    razaoSocial: '',
    inscricaoEstadual: '',
  })
  const [address, setAddress] = useState<Partial<CheckoutAddress>>({})
  const [cepRaw, setCepRaw] = useState('')
  const [cepMasked, setCepMasked] = useState('')
  const [shipping, setShipping] = useState<ShippingOption | null>(null)
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddressLoading, setIsAddressLoading] = useState(false)

  // Pre-fill from Supabase profile
  const prefilled = useRef(false)
  useEffect(() => {
    if (prefilled.current) return
    if (!profile && !user) return

    prefilled.current = true
    const email = profile?.email || user?.email || ''
    const fullName = profile?.full_name || ''
    const phone = profile?.phone || ''

    setCustomer((prev) => ({
      email: prev.email || email,
      fullName: prev.fullName || fullName,
      cpf: prev.cpf,
      phone: prev.phone || phone,
    }))

    // Pre-fill address if profile has it
    if (profile?.address && typeof profile.address === 'object') {
      const addr = profile.address as Record<string, string>
      setAddress((prev) => ({
        cep: prev.cep || addr.cep || '',
        street: prev.street || addr.street || '',
        number: prev.number || addr.number || '',
        complement: prev.complement || addr.complement || '',
        neighborhood: prev.neighborhood || addr.neighborhood || '',
        city: prev.city || addr.city || '',
        state: prev.state || addr.state || '',
      }))
      if (addr.cep) {
        setCepRaw(addr.cep.replace(/\D/g, ''))
        const clean = addr.cep.replace(/\D/g, '')
        setCepMasked(clean.length > 5 ? `${clean.slice(0, 5)}-${clean.slice(5)}` : clean)
      }
    }
  }, [profile, user])

  // Determine current step
  const currentStep = useMemo(() => {
    if (shipping) return 'payment' as const
    if (cepRaw.length === 8) return 'shipping' as const
    return 'info' as const
  }, [shipping, cepRaw])

  // Email real-time validation (after user stops typing)
  useEffect(() => {
    if (!customer.email) return
    const timer = setTimeout(() => {
      const error = validateEmail(customer.email)
      setErrors((prev) => {
        const next = { ...prev }
        if (error) next.email = error
        else delete next.email
        return next
      })
      if (customer.email.length > 3) {
        setTouched((prev) => new Set(prev).add('email'))
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [customer.email])

  // Handlers
  const handleCustomerChange = useCallback(
    <K extends keyof CheckoutCustomer>(field: K, value: string) => {
      setCustomer((prev) => ({ ...prev, [field]: value }))
      if (field !== 'email' && errors[field]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[field]
          return next
        })
      }
    },
    [errors]
  )

  const handleAddressChange = useCallback(
    <K extends keyof CheckoutAddress>(field: K, value: string) => {
      setAddress((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[field]
          return next
        })
      }
    },
    [errors]
  )

  const handleBlur = useCallback(
    (field: string) => {
      setTouched((prev) => new Set(prev).add(field))

      // Validate single field
      let validator = FIELD_VALIDATORS[field]

      // CPF/CNPJ special handling
      if (field === 'cpf') {
        validator = (v: string) =>
          documentType === 'cpf' ? validateCPF(v) : validateCNPJ(v)
      }

      if (!validator) return

      let value = ''
      if (field in customer) {
        value = (customer[field as keyof CheckoutCustomer] ?? '') as string
      } else if (field === 'cep') {
        value = cepRaw
      } else {
        value = (address[field as keyof CheckoutAddress] as string) || ''
      }

      const error = validator(value)
      setErrors((prev) => {
        const next = { ...prev }
        if (error) next[field] = error
        else delete next[field]
        return next
      })
    },
    [customer, address, cepRaw, documentType]
  )

  const handleCepChange = useCallback((raw: string, masked: string) => {
    const cleanRaw = raw.replace(/\D/g, '').slice(0, 8)
    setCepRaw(cleanRaw)
    setCepMasked(masked)
    setAddress((prev) => ({ ...prev, cep: cleanRaw }))
  }, [])

  const handleAddressFound = useCallback((addr: ShippingAddress) => {
    setAddress((prev) => ({
      ...prev,
      cep: addr.cep || prev.cep,
      street: addr.street || prev.street,
      neighborhood: addr.neighborhood || prev.neighborhood,
      city: addr.city || prev.city,
      state: addr.state || prev.state,
    }))
  }, [])

  const handleShippingSelect = useCallback((opt: ShippingOption) => {
    setShipping(opt)
  }, [])

  const handleDocumentTypeChange = useCallback((type: DocumentType) => {
    setDocumentType(type)
    // Limpa campos de PJ se voltar para CPF
    if (type === 'cpf') {
      setCustomer((prev) => ({ 
        ...prev, 
        razaoSocial: '', 
        inscricaoEstadual: '' 
      }))
      setErrors((prev) => {
        const next = { ...prev }
        delete next.razaoSocial
        delete next.inscricaoEstadual
        return next
      })
      setTouched((prev) => {
        const next = new Set(prev)
        next.delete('razaoSocial')
        next.delete('inscricaoEstadual')
        return next
      })
    }
  }, [])

  // Totals
  const couponDiscount = coupon?.discountAmount ?? 0
  const shippingCost = shipping?.price ?? 0
  const subtotal = cart?.subtotal ?? 0
  const total = Math.max(0, subtotal - couponDiscount) + shippingCost

  const totalSavings = useMemo(() => {
    if (!cart) return 0
    const subSavings = cart.items.reduce((acc, item) => {
      if (item.subscription?.isSubscription && item.subscription.subscriptionPrice) {
        return acc + (item.price - item.subscription.subscriptionPrice) * item.quantity
      }
      return acc
    }, 0)
    const freightSavings = shipping?.isFree && shipping.originalPrice ? shipping.originalPrice : 0
    return subSavings + freightSavings + couponDiscount
  }, [cart, shipping, couponDiscount])

  // Submit
  const handleSubmit = useCallback(async () => {
    if (!cart || cart.items.length === 0) return

    const docValidator = documentType === 'cpf' ? validateCPF : validateCNPJ
    const allErrors: Record<string, string> = {}

    // Validate customer fields
    const emailErr = validateEmail(customer.email)
    if (emailErr) allErrors.email = emailErr
    const nameErr = validateFullName(customer.fullName)
    if (nameErr) allErrors.fullName = nameErr
    const docErr = docValidator(customer.cpf)
    if (docErr) allErrors.cpf = docErr
    const phoneErr = validatePhone(customer.phone)
    if (phoneErr) allErrors.phone = phoneErr

    // Validate address
    const cepErr = validateCEP(cepRaw)
    if (cepErr) allErrors.cep = cepErr
    const streetErr = validateStreet(address.street || '')
    if (streetErr) allErrors.street = streetErr
    const numErr = validateNumber(address.number || '')
    if (numErr) allErrors.number = numErr
    const neighErr = validateNeighborhood(address.neighborhood || '')
    if (neighErr) allErrors.neighborhood = neighErr
    const cityErr = validateCity(address.city || '')
    if (cityErr) allErrors.city = cityErr
    const stateErr = validateState(address.state || '')
    if (stateErr) allErrors.state = stateErr

    if (!shipping) {
      allErrors.shipping = 'Selecione uma opção de frete'
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      setTouched(new Set([
        'email', 'fullName', 'cpf', 'phone',
        'cep', 'street', 'number', 'neighborhood', 'city', 'state',
      ]))
      const firstErrorField = document.querySelector('[aria-invalid="true"]')
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsSubmitting(true)

    try {
      if (cart.checkoutUrl && cart.checkoutUrl !== '#mock-checkout') {
        window.location.href = cart.checkoutUrl
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const orderData = {
        orderId: `ORD-${Date.now()}`,
        orderNumber: `#${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString(),
        customerName: customer.fullName,
        email: customer.email,
        itemCount: cart.totalQuantity,
        subtotal,
        shippingCost,
        couponDiscount,
        total,
        shippingService: shipping?.service || '',
        shippingDaysMin: shipping?.estimatedDays.min || 0,
        shippingDaysMax: shipping?.estimatedDays.max || 0,
        xpEarned: Math.floor(total * 2),
      }

      const params = new URLSearchParams()
      Object.entries(orderData).forEach(([key, value]) => {
        params.set(key, String(value))
      })

      router.push(`/pedido-confirmado?${params.toString()}`)
    } catch {
      setErrors({ submit: 'Erro ao processar. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }, [cart, customer, address, cepRaw, shipping, couponDiscount, shippingCost, subtotal, total, router, documentType])

  // Empty cart
  if (!cartLoading && (!cart || cart.items.length === 0)) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <CheckoutHeader />
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-bg-surface-2 flex items-center justify-center mb-6">
            <span className="text-3xl">🛒</span>
          </div>
          <h1 className="font-heading text-2xl font-semibold text-txt-primary mb-2">
            Seu carrinho está vazio
          </h1>
          <p className="text-sm text-txt-muted mb-6 max-w-sm">
            Adicione produtos ao carrinho para continuar com a compra.
          </p>
          <button
            onClick={() => router.push('/produtos')}
            className="h-12 px-8 bg-forest text-white font-semibold rounded-xl hover:bg-forest-ink transition-colors"
          >
            Ver produtos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <CheckoutHeader />

      {/* Mobile summary */}
      {cart && (
        <CheckoutMobileSummary cart={cart} shipping={shipping} coupon={coupon} />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        {/* Progress */}
        <div className="mb-8">
          <CheckoutProgress currentStep={currentStep} />
        </div>

        {/* 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left column: Form */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* Free shipping bar */}
            {cart && (
              <FreeShippingBar cartSubtotal={cart.subtotal} />
            )}

            {/* Personal info + Address form (with CEP first) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CheckoutForm
                customer={customer}
                address={address}
                errors={errors}
                touched={touched}
                documentType={documentType}
                onDocumentTypeChange={handleDocumentTypeChange}
                onCustomerChange={handleCustomerChange}
                onAddressChange={handleAddressChange}
                onBlur={handleBlur}
                cepValue={cepMasked}
                onCepChange={handleCepChange}
                isAddressLoading={isAddressLoading}
              />
            </motion.div>

            {/* Shipping options (auto-appear when CEP is valid) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CheckoutShipping
                cep={cepRaw}
                cartSubtotal={subtotal}
                selectedShipping={shipping}
                onShippingSelect={handleShippingSelect}
                onAddressFound={handleAddressFound}
                onAddressLoading={setIsAddressLoading}
              />
            </motion.div>

            {/* Coupon — 1 clique para abrir e já focar no input */}
            {cart && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <CheckoutCoupon
                  cartSubtotal={subtotal}
                  coupon={coupon}
                  onCouponChange={setCoupon}
                />
              </motion.div>
            )}

            {/* Order Bump */}
            {cart && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CheckoutOrderBump
                  cartProductIds={cart.items.map((i) => i.productId)}
                />
              </motion.div>
            )}

            {/* Submit error */}
            {errors.submit && (
              <p className="text-sm text-functional-error text-center">{errors.submit}</p>
            )}
            {errors.shipping && (
              <p className="text-sm text-functional-error text-center">{errors.shipping}</p>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <CheckoutCTA
                total={total}
                isSubmitting={isSubmitting}
                disabled={!cart || cart.items.length === 0}
                onClick={handleSubmit}
                savings={totalSavings}
              />
            </motion.div>

            {/* Mobile trust badges */}
            <div className="lg:hidden">
              <CheckoutTrustBadges variant="compact" />
            </div>

            {/* Help */}
            <CheckoutHelp />
          </div>

          {/* Right column: Order Summary (desktop only, sticky) */}
          {cart && (
            <div className="hidden lg:block w-[380px] flex-shrink-0">
              <div className="sticky top-20">
                <CheckoutOrderSummary
                  cart={cart}
                  shipping={shipping}
                  coupon={coupon}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exit intent modal (desktop only) */}
      <ExitIntentModal />
    </div>
  )
}
