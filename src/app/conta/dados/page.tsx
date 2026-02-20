'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  Store,
  Camera,
  X,
  ExternalLink,
  MapPin,
  Award,
  Zap,
  Bell,
  Lock,
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { updateProfile } from '@/lib/services/profile'
import { getShopifyCustomer, ShopifyCustomerData } from '@/lib/services/shopify-customer'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

/**
 * Meus Dados — Arquitetura Híbrida Inteligente
 * 
 * SEÇÃO 1: Dados Comerciais (Shopify) - Readonly + Link para editar
 * SEÇÃO 2: Personalização (Supabase) - Editável
 * SEÇÃO 3: Gamificação (Supabase) - Readonly
 */

interface PersonalizationData {
  avatar_url: string | null
  preferences: {
    emailNotifications: boolean
    whatsappNotifications: boolean
    newsletter: boolean
  }
}

export default function MeusDadosPage() {
  const { user, profile, isLoading: authLoading, refreshProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados para dados do Shopify
  const [shopifyData, setShopifyData] = useState<ShopifyCustomerData | null>(null)
  const [isLoadingShopify, setIsLoadingShopify] = useState(false)
  const [shopifyError, setShopifyError] = useState<string | null>(null)

  // Estados para personalização (Supabase)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    whatsappNotifications: false,
    newsletter: true,
  })

  // Estados de controle
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Debug: Log auth state
  useEffect(() => {
    console.log('[MeusDados] Auth State:', {
      hasUser: !!user,
      userId: user?.id,
      email: user?.email,
      hasProfile: !!profile,
      shopifyCustomerId: profile?.shopify_customer_id,
      authLoading,
    })
  }, [user, profile, authLoading])

  // Carregar dados do Shopify se tiver customer_id
  useEffect(() => {
    if (profile?.shopify_customer_id && !shopifyData && !isLoadingShopify) {
      loadShopifyData()
    }
  }, [profile?.shopify_customer_id])

  const loadShopifyData = async () => {
    if (!profile?.shopify_customer_id) return

    setIsLoadingShopify(true)
    setShopifyError(null)

    const { data, error } = await getShopifyCustomer(profile.shopify_customer_id)

    if (error || !data) {
      console.error('[MeusDados] Erro ao carregar dados do Shopify:', error)
      setShopifyError(error || 'Erro ao carregar dados')
    } else {
      console.log('[MeusDados] Dados do Shopify carregados:', data)
      setShopifyData(data)
    }

    setIsLoadingShopify(false)
  }

  // Preencher dados do perfil Supabase
  useEffect(() => {
    if (profile) {
      setAvatarPreview(profile.avatar_url || null)
      
      // Carregar preferências
      if (profile.preferences && typeof profile.preferences === 'object') {
        const prefs = profile.preferences as any
        setPreferences({
          emailNotifications: prefs.emailNotifications ?? true,
          whatsappNotifications: prefs.whatsappNotifications ?? false,
          newsletter: prefs.newsletter ?? true,
        })
      }
    }
  }, [profile])

  // Upload de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Apenas imagens são permitidas.' })
      setTimeout(() => setFeedback(null), 3000)
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Imagem deve ter no máximo 2MB.' })
      setTimeout(() => setFeedback(null), 3000)
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  // Salvar personalização
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      console.error('[MeusDados] Usuário não encontrado')
      setFeedback({ type: 'error', message: 'Sessão expirada. Faça login novamente.' })
      return
    }

    console.log('[MeusDados] Iniciando salvamento de personalização...')
    setIsSaving(true)
    setFeedback(null)

    try {
      const supabase = createClient()
      let avatarUrl = profile?.avatar_url || null

      // Remover avatar se solicitado
      if (avatarPreview === null && profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').slice(-2).join('/')
        await supabase.storage.from('banners').remove([oldPath])
        avatarUrl = null
      }

      // Upload de novo avatar
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        if (profile?.avatar_url) {
          const oldPath = profile.avatar_url.split('/').slice(-2).join('/')
          await supabase.storage.from('banners').remove([oldPath])
        }

        const { error: uploadError } = await supabase.storage
          .from('banners')
          .upload(filePath, avatarFile, { cacheControl: '3600', upsert: true })

        if (uploadError) {
          throw new Error(`Erro ao fazer upload: ${uploadError.message}`)
        }

        const { data: urlData } = supabase.storage.from('banners').getPublicUrl(filePath)
        avatarUrl = urlData.publicUrl
      }

      // Atualizar perfil
      const { success, error } = await updateProfile(user.id, {
        avatar_url: avatarUrl,
        preferences: preferences as any,
      })

      if (success) {
        setFeedback({ type: 'success', message: 'Personalização atualizada com sucesso!' })
        await refreshProfile()
        setAvatarFile(null)
        setTimeout(() => setFeedback(null), 5000)
      } else {
        throw new Error(error || 'Erro ao salvar')
      }
    } catch (error: any) {
      console.error('[MeusDados] Erro ao salvar:', error)
      setFeedback({ type: 'error', message: error.message || 'Erro ao salvar dados.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-forest animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Sessão Não Encontrada</h2>
        <p className="text-neutral-600 mb-6">Por favor, faça login novamente.</p>
        <a
          href="/login"
          className="px-6 py-3 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-all"
        >
          Fazer Login
        </a>
      </div>
    )
  }

  const fullName = shopifyData
    ? `${shopifyData.firstName || ''} ${shopifyData.lastName || ''}`.trim() || 'Não informado'
    : profile?.full_name || user?.email?.split('@')[0] || 'Usuário'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Meus Dados</h1>
        <p className="text-neutral-500">Gerencie suas informações pessoais e preferências</p>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 p-4 rounded-xl border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm">{feedback.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SEÇÃO 1: DADOS COMERCIAIS (SHOPIFY) */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl border border-neutral-100 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-forest" />
            <h2 className="text-lg font-semibold text-neutral-900">Dados Comerciais</h2>
          </div>
          {profile?.shopify_customer_id && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Sincronizado com Shopify
            </div>
          )}
        </div>

        {profile?.shopify_customer_id && shopifyData ? (
          // Dados do Shopify - Readonly
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Nome Completo
                </label>
                <div className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 flex items-center">
                  {fullName}
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1.5">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  Telefone
                </label>
                <div className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 flex items-center">
                  {shopifyData.phone || 'Não informado'}
                </div>
              </div>
            </div>

            {/* Endereço */}
            {shopifyData.defaultAddress && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-1.5">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  Endereço Principal
                </label>
                <div className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700">
                  <p>{shopifyData.defaultAddress.address1}</p>
                  {shopifyData.defaultAddress.address2 && <p>{shopifyData.defaultAddress.address2}</p>}
                  <p>
                    {shopifyData.defaultAddress.city}, {shopifyData.defaultAddress.province} -{' '}
                    {shopifyData.defaultAddress.zip}
                  </p>
                  <p>{shopifyData.defaultAddress.country}</p>
                </div>
              </div>
            )}

            {/* Botão para editar no Shopify */}
            <div className="pt-2 border-t border-neutral-100">
              <p className="text-sm text-neutral-600 mb-3">
                <Lock className="w-4 h-4 inline mr-1" />
                Seus dados comerciais são gerenciados pelo Shopify para garantir segurança nas compras.
              </p>
              <a
                href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/account`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-all text-sm"
              >
                Editar no Shopify
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </>
        ) : isLoadingShopify ? (
          // Loading
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-forest animate-spin mr-2" />
            <p className="text-sm text-neutral-500">Carregando dados do Shopify...</p>
          </div>
        ) : (
          // Sem dados do Shopify
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-1">
                  Dados Comerciais Não Sincronizados
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Faça seu primeiro pedido para sincronizar seus dados comerciais com o Shopify.
                </p>
                <div className="text-xs text-blue-600">
                  <p><strong>E-mail:</strong> {user.email}</p>
                  <p><strong>Nome:</strong> {profile?.full_name || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SEÇÃO 2: PERSONALIZAÇÃO (SUPABASE) - EDITÁVEL */}
      {/* ═══════════════════════════════════════════════════════ */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-100 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-forest" />
            <h2 className="text-lg font-semibold text-neutral-900">Personalização</h2>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {avatarPreview ? (
                <>
                  <Image
                    src={avatarPreview}
                    alt="Avatar"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover border-2 border-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute top-0 right-0 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                    title="Remover foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="w-24 h-24 rounded-full bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center">
                  <User className="w-10 h-10 text-neutral-400" />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-forest text-white rounded-full flex items-center justify-center hover:bg-forest/90 transition-colors shadow-md"
                title="Alterar foto"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-neutral-900 mb-1">Foto de Perfil</h3>
              <p className="text-sm text-neutral-500 mb-2">
                Personalize sua experiência com uma foto. Máximo 2MB.
              </p>
              {avatarFile && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Nova foto selecionada
                </p>
              )}
            </div>
          </div>

          {/* Preferências de Notificação */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-3">
              <Bell className="w-4 h-4 text-neutral-400" />
              Preferências de Comunicação
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) =>
                    setPreferences({ ...preferences, emailNotifications: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-neutral-300 text-forest focus:ring-forest"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Notificações por E-mail</p>
                  <p className="text-xs text-neutral-500">
                    Receba atualizações de pedidos e novidades
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.whatsappNotifications}
                  onChange={(e) =>
                    setPreferences({ ...preferences, whatsappNotifications: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-neutral-300 text-forest focus:ring-forest"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Notificações por WhatsApp</p>
                  <p className="text-xs text-neutral-500">Atualizações rápidas no seu celular</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.newsletter}
                  onChange={(e) =>
                    setPreferences({ ...preferences, newsletter: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-neutral-300 text-forest focus:ring-forest"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Newsletter</p>
                  <p className="text-xs text-neutral-500">
                    Dicas de especialistas e conteúdos exclusivos
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-end pt-2 border-t border-neutral-100">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 focus:outline-none focus:ring-2 focus:ring-forest/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-forest/20"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Personalização
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SEÇÃO 3: GAMIFICAÇÃO (SUPABASE) - READONLY */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-neutral-900">Seu Progresso</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* XP Total */}
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">XP Total</p>
                <p className="text-2xl font-bold text-neutral-900">{profile?.xp_total || 0}</p>
              </div>
            </div>
          </div>

          {/* Nível */}
          <div className="bg-white rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Nível Atual</p>
                <p className="text-2xl font-bold text-neutral-900">{profile?.level || 1}</p>
              </div>
            </div>
          </div>

          {/* Sequência */}
          <div className="bg-white rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Sequência</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {profile?.streak_days || 0} dias
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-neutral-600 mt-4 text-center">
          Continue usando a plataforma para ganhar mais XP e subir de nível!
        </p>
      </div>
    </div>
  )
}
