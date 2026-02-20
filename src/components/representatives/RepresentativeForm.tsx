'use client'

import { useState, FormEvent } from 'react'
import { Button, Input } from '@/components/ui'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'

export function RepresentativeForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    experience: 'Sim, com produtos agrícolas',
    message: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validação básica
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório'
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório'
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória'
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setState('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: 'Quero ser Representante',
        }),
      })

      if (response.ok) {
        setState('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          experience: 'Sim, com produtos agrícolas',
          message: '',
        })
      } else {
        setState('error')
      }
    } catch (error) {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mb-2 font-display text-2xl font-bold text-green-900">
          Recebemos seu interesse!
        </h3>
        <p className="text-green-800">
          Nossa equipe entrará em contato em breve.
        </p>
      </div>
    )
  }

  return (
    <div id="representante-form">
      <h2 className="mb-4 font-display text-2xl font-bold text-terravik-brown">
        Quero ser Representante Terravik
      </h2>
      <p className="mb-6 text-terravik-brown/70">
        Preencha o formulário e nossa equipe entrará em contato.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome completo"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
          fullWidth
        />

        <Input
          label="E-mail"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
          fullWidth
        />

        <Input
          label="Telefone/WhatsApp"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
          required
          fullWidth
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Cidade"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            error={errors.city}
            required
            fullWidth
          />

          <Input
            label="Estado"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="Ex: SC"
            error={errors.state}
            required
            fullWidth
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-terravik-brown">
            Já trabalha com vendas?
          </label>
          <select
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="w-full rounded-lg border-2 border-terravik-brown/20 px-4 py-3 focus:border-terravik-green focus:outline-none focus:ring-2 focus:ring-terravik-green/20"
          >
            <option>Sim, com produtos agrícolas</option>
            <option>Sim, em outro setor</option>
            <option>Não, mas tenho interesse</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-terravik-brown">
            Mensagem (opcional)
          </label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full rounded-lg border-2 border-terravik-brown/20 px-4 py-3 focus:border-terravik-green focus:outline-none focus:ring-2 focus:ring-terravik-green/20"
          />
        </div>

        <Button type="submit" fullWidth loading={state === 'loading'}>
          <Send className="h-5 w-5" />
          Enviar interesse
        </Button>
      </form>
    </div>
  )
}
