'use client'

import { useState, FormEvent } from 'react'
import { Button, Input } from '@/components/ui'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

interface FormErrors {
  [key: string]: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'Dúvida sobre produto',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [state, setState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setState('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setState('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Dúvida sobre produto',
          message: '',
        })
      } else {
        setState('error')
        setErrorMessage(
          data.message || 'Erro ao enviar mensagem. Tente novamente.'
        )
      }
    } catch (error) {
      setState('error')
      setErrorMessage(
        'Erro ao enviar mensagem. Tente novamente ou envie direto para contato@terravik.com.br'
      )
    }
  }

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpar erro do campo ao editar
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '')
    // Aplica máscara (XX) XXXXX-XXXX
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  if (state === 'success') {
    return (
      <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mb-2 font-display text-2xl font-bold text-green-900">
          Mensagem enviada!
        </h3>
        <p className="text-green-800">
          Respondemos em até 24h úteis. Obrigado pelo contato!
        </p>
        <Button
          className="mt-6"
          onClick={() => setState('idle')}
          variant="outline"
        >
          Enviar outra mensagem
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div>
        <Input
          label="Nome completo"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          fullWidth
        />
      </div>

      {/* E-mail */}
      <div>
        <Input
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
          fullWidth
        />
      </div>

      {/* Telefone/WhatsApp */}
      <div>
        <Input
          label="Telefone/WhatsApp"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
          helperText="Opcional"
          placeholder="(XX) XXXXX-XXXX"
          fullWidth
        />
      </div>

      {/* Assunto */}
      <div>
        <label
          htmlFor="subject"
          className="mb-2 block text-sm font-medium text-terravik-brown"
        >
          Assunto
        </label>
        <select
          id="subject"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          className="w-full rounded-lg border-2 border-terravik-brown/20 px-4 py-3 transition-colors focus:border-terravik-green focus:outline-none focus:ring-2 focus:ring-terravik-green/20"
        >
          <option value="Dúvida sobre produto">Dúvida sobre produto</option>
          <option value="Pedido / Entrega">Pedido / Entrega</option>
          <option value="Representação comercial">
            Representação comercial
          </option>
          <option value="Parceria">Parceria</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      {/* Mensagem */}
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-terravik-brown"
        >
          Mensagem <span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          className="w-full rounded-lg border-2 border-terravik-brown/20 px-4 py-3 transition-colors focus:border-terravik-green focus:outline-none focus:ring-2 focus:ring-terravik-green/20"
          placeholder="Digite sua mensagem aqui..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      {/* Erro geral */}
      {state === 'error' && errorMessage && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Botão submit */}
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={state === 'loading'}
        disabled={state === 'loading'}
      >
        <Send className="h-5 w-5" />
        {state === 'loading' ? 'Enviando...' : 'Enviar mensagem'}
      </Button>
    </form>
  )
}
