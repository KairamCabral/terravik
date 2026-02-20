// src/lib/services/profile.ts
// DONO: Supabase (100% Terravik)

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<ProfileUpdate, 'full_name' | 'phone' | 'avatar_url' | 'address' | 'notification_settings' | 'preferences'>>
): Promise<{ success: boolean; error?: string }> {
  console.log('[ProfileService] Iniciando atualização para userId:', userId)
  console.log('[ProfileService] Updates recebidos:', updates)

  const supabase = createClient()

  // Converter address para JSON se existir
  const updateData: any = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  if (updates.address) {
    updateData.address = JSON.parse(JSON.stringify(updates.address))
  }

  console.log('[ProfileService] Dados formatados:', updateData)

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()

  if (error) {
    console.error('[ProfileService] Erro ao atualizar:', error)
    return { success: false, error: error.message }
  }

  console.log('[ProfileService] Atualização bem-sucedida:', data)
  return { success: true }
}

export async function getProfileStats(userId: string) {
  const supabase = createClient()

  const [progressRes, achievementsRes, ordersRes] = await Promise.all([
    supabase
      .from('user_progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('completed_at', 'is', null),
    supabase
      .from('user_achievements')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('orders_sync')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
  ])

  return {
    lessonsCompleted: progressRes.count || 0,
    achievements: achievementsRes.count || 0,
    orders: ordersRes.count || 0,
  }
}
