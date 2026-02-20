'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  Mail,
  Clock,
  Users,
  ArrowRight,
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { SOCIAL_LINKS } from '@/lib/utils/constants'
import { cn } from '@/lib/utils/cn'

/**
 * Página de Contato — Premium & Estratégica
 *
 * Técnicas de UX aplicadas:
 * 1. Progressive Disclosure — mostra o formulário só após escolher o motivo
 * 2. Reduce Friction — campos mínimos necessários por assunto
 * 3. Quick Actions — WhatsApp e e-mail antes do formulário
 * 4. Visual Hierarchy — ação principal clara
 * 5. Feedback States — loading, sucesso, erro visuais
 * 6. Trust Signals — tempo de resposta, horário, canais
 */

type ContactReason =
  | null
  | 'produto'
  | 'pedido'
  | 'representante'
  | 'parceria'
  | 'outro'

const reasons = [
  { id: 'produto' as const, label: 'Dúvida sobre produto', icon: HelpCircle },
  { id: 'pedido' as const, label: 'Pedido ou entrega', icon: Clock },
  { id: 'representante' as const, label: 'Quero representar', icon: Users },
  { id: 'parceria' as const, label: 'Parceria comercial', icon: Users },
  { id: 'outro' as const, label: 'Outro assunto', icon: Mail },
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

export function ContactPageClient() {
  const [selectedReason, setSelectedReason] = useState<ContactReason>(null)
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const n = { ...prev }
        delete n[field]
        return n
      })
    }
  }

  const formatPhone = (value: string) => {
    const d = value.replace(/\D/g, '')
    if (d.length <= 2) return d
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = 'Obrigatório'
    if (!formData.email.trim()) e.email = 'Obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'E-mail inválido'
    if (!formData.message.trim()) e.message = 'Obrigatório'
    else if (formData.message.trim().length < 10)
      e.message = 'Mínimo 10 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setFormState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: reasons.find((r) => r.id === selectedReason)?.label || 'Outro',
        }),
      })
      if (res.ok) {
        setFormState('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        const data = await res.json()
        setFormState('error')
        setErrorMsg(data.message || 'Erro ao enviar. Tente novamente.')
      }
    } catch {
      setFormState('error')
      setErrorMsg('Erro de conexão. Tente novamente.')
    }
  }

  const resetForm = () => {
    setFormState('idle')
    setSelectedReason(null)
  }

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-28 lg:pt-32 pb-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-h2 lg:text-h1 text-txt-primary">
            Fale conosco
          </h1>
          <p className="mt-2 text-body text-txt-secondary max-w-lg mx-auto">
            Escolha o canal mais rápido ou envie uma mensagem.
            Respondemos em até <span className="text-forest font-semibold">24h úteis</span>.
          </p>
        </motion.div>

        {/* Quick Actions — canais diretos */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 gap-3 mb-8"
        >
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-bg-surface hover:border-forest/30 hover:shadow-card transition-all duration-300"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center group-hover:bg-forest/20 transition-colors">
              <MessageCircle className="w-4 h-4 text-forest" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-txt-primary">WhatsApp</p>
              <p className="text-xs text-txt-muted">Resposta imediata</p>
            </div>
            <ArrowRight className="w-4 h-4 text-txt-muted group-hover:text-forest group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="mailto:contato@terravik.com.br"
            className="group flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-bg-surface hover:border-forest/30 hover:shadow-card transition-all duration-300"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
              <Mail className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-txt-primary">E-mail direto</p>
              <p className="text-xs text-txt-muted">contato@terravik.com.br</p>
            </div>
            <ArrowRight className="w-4 h-4 text-txt-muted group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
          </a>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-border-subtle" />
          <span className="text-xs text-txt-muted uppercase tracking-wider">ou envie uma mensagem</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        {/* Success State */}
        <AnimatePresence mode="wait">
          {formState === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl border border-forest/20 bg-forest/5 p-8 text-center"
            >
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-forest" />
              </div>
              <h3 className="font-heading text-h4 text-txt-primary mb-1.5">
                Mensagem enviada
              </h3>
              <p className="text-sm text-txt-secondary mb-4">
                Respondemos em até 24h úteis. Obrigado pelo contato!
              </p>
              <button
                onClick={resetForm}
                className="text-sm font-semibold text-forest hover:text-forest/80 transition-colors"
              >
                Enviar outra mensagem
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {/* Step 1 — Motivo do contato */}
              <div className="mb-6">
                <p className="text-sm font-medium text-txt-primary mb-3">
                  Qual o motivo do contato?
                </p>
                <div className="flex flex-wrap gap-2">
                  {reasons.map((reason) => (
                    <button
                      key={reason.id}
                      onClick={() => setSelectedReason(reason.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200',
                        selectedReason === reason.id
                          ? 'border-forest bg-forest/5 text-forest'
                          : 'border-border-subtle text-txt-secondary hover:border-forest/30 hover:text-txt-primary'
                      )}
                    >
                      <reason.icon className="w-4 h-4" />
                      {reason.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 — Formulário (aparece após escolher motivo) */}
              <AnimatePresence>
                {selectedReason && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-border-subtle bg-bg-surface p-5 sm:p-6 space-y-4">
                      {/* Nome + Email */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-txt-primary mb-1.5">
                            Nome <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={cn(
                              'w-full px-4 py-3 rounded-xl border bg-transparent text-sm text-txt-primary placeholder:text-txt-muted transition-colors focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest',
                              errors.name ? 'border-red-400' : 'border-border-subtle'
                            )}
                            placeholder="Seu nome"
                          />
                          {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-txt-primary mb-1.5">
                            E-mail <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={cn(
                              'w-full px-4 py-3 rounded-xl border bg-transparent text-sm text-txt-primary placeholder:text-txt-muted transition-colors focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest',
                              errors.email ? 'border-red-400' : 'border-border-subtle'
                            )}
                            placeholder="seu@email.com"
                          />
                          {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      {/* Telefone — só quando relevante */}
                      {(selectedReason === 'representante' || selectedReason === 'parceria') && (
                        <div>
                          <label className="block text-sm font-medium text-txt-primary mb-1.5">
                            Telefone/WhatsApp
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
                            className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-transparent text-sm text-txt-primary placeholder:text-txt-muted transition-colors focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                            placeholder="(XX) XXXXX-XXXX"
                          />
                        </div>
                      )}

                      {/* Mensagem */}
                      <div>
                        <label className="block text-sm font-medium text-txt-primary mb-1.5">
                          Mensagem <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          className={cn(
                            'w-full px-4 py-3 rounded-xl border bg-transparent text-sm text-txt-primary placeholder:text-txt-muted transition-colors focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none',
                            errors.message ? 'border-red-400' : 'border-border-subtle'
                          )}
                          placeholder="Como podemos ajudar?"
                        />
                        {errors.message && (
                          <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                        )}
                      </div>

                      {/* Erro geral */}
                      {formState === 'error' && errorMsg && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          <p className="text-sm text-red-700">{errorMsg}</p>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={formState === 'loading'}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-forest hover:bg-forest/90 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
                      >
                        {formState === 'loading' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Enviar mensagem
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards informativos — representante + FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid sm:grid-cols-2 gap-3 mt-8"
        >
          <Link
            href="/representantes"
            className="group flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-bg-surface hover:border-gold/30 hover:shadow-card transition-all duration-300"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
              <Users className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-txt-primary">Quer ser representante?</h3>
              <p className="text-xs text-txt-muted">Conheça nosso programa</p>
            </div>
          </Link>

          <Link
            href="/#faq"
            className="group flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-bg-surface hover:border-forest/30 hover:shadow-card transition-all duration-300"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-forest/10 flex items-center justify-center group-hover:bg-forest/20 transition-colors">
              <HelpCircle className="w-4 h-4 text-forest" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-txt-primary">Perguntas frequentes</h3>
              <p className="text-xs text-txt-muted">Muitas dúvidas já respondidas</p>
            </div>
          </Link>
        </motion.div>

        {/* Horário */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center text-xs text-txt-muted mt-6 flex items-center justify-center gap-1.5"
        >
          <Clock className="w-3.5 h-3.5" />
          Atendimento Seg–Sex, 8h às 18h
        </motion.p>
      </div>
    </div>
  )
}
