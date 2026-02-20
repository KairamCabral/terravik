'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, CheckCircle2, Bell, Mail, Megaphone } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { updateProfile } from '@/lib/services/profile'

/**
 * Preferências — Notificações e configurações
 * DONO: Supabase (100% Terravik)
 */

interface NotificationSettings {
  email_orders: boolean
  email_promotions: boolean
  email_academy: boolean
  push_orders: boolean
  push_promotions: boolean
}

const DEFAULT_SETTINGS: NotificationSettings = {
  email_orders: true,
  email_promotions: true,
  email_academy: true,
  push_orders: true,
  push_promotions: false,
}

export default function PreferenciasPage() {
  const { user, profile, isLoading: authLoading, refreshProfile } = useAuth()

  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile?.notification_settings) {
      setSettings({ ...DEFAULT_SETTINGS, ...(profile.notification_settings as Partial<NotificationSettings>) })
    }
  }, [profile])

  const toggleSetting = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)

    await updateProfile(user.id, {
      notification_settings: JSON.parse(JSON.stringify(settings)),
    })

    await refreshProfile()
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-forest animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Preferências</h1>
        <p className="text-neutral-500">Gerencie suas notificações e configurações</p>
      </div>

      {/* Saved feedback */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700"
        >
          <CheckCircle2 className="w-5 h-5" />
          <p className="text-sm">Preferências salvas com sucesso!</p>
        </motion.div>
      )}

      {/* E-mail Notifications */}
      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-neutral-100">
          <Mail className="w-5 h-5 text-neutral-500" />
          <h2 className="font-semibold text-neutral-900">Notificações por E-mail</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          <ToggleRow
            title="Pedidos e entregas"
            description="Atualizações sobre seus pedidos"
            checked={settings.email_orders}
            onChange={() => toggleSetting('email_orders')}
          />
          <ToggleRow
            title="Promoções e novidades"
            description="Ofertas especiais e lançamentos"
            checked={settings.email_promotions}
            onChange={() => toggleSetting('email_promotions')}
          />
          <ToggleRow
            title="Cursos Terravik"
            description="Novos cursos e conteúdos educativos"
            checked={settings.email_academy}
            onChange={() => toggleSetting('email_academy')}
          />
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-neutral-100">
          <Bell className="w-5 h-5 text-neutral-500" />
          <h2 className="font-semibold text-neutral-900">Notificações Push</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          <ToggleRow
            title="Pedidos e entregas"
            description="Notificações no navegador sobre seus pedidos"
            checked={settings.push_orders}
            onChange={() => toggleSetting('push_orders')}
          />
          <ToggleRow
            title="Promoções"
            description="Receba ofertas em tempo real"
            checked={settings.push_promotions}
            onChange={() => toggleSetting('push_promotions')}
          />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 focus:outline-none focus:ring-2 focus:ring-forest/50 focus:ring-offset-2 disabled:opacity-50 transition-all"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? 'Salvando...' : 'Salvar preferências'}
        </button>
      </div>
    </div>
  )
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="font-medium text-neutral-900 text-sm">{title}</p>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-forest' : 'bg-neutral-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
