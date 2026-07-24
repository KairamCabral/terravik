// src/lib/supabase/admin.ts
// Cliente Supabase Admin para uso server-side (API Routes, Server Actions)
// ATENÇÃO: Nunca expor este client no browser

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

let _supabaseAdmin: SupabaseClient<Database> | null = null

export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (_supabaseAdmin) return _supabaseAdmin

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL não configurada')
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada')

  _supabaseAdmin = createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return _supabaseAdmin
}

// Retrocompatibilidade: exporta como supabaseAdmin para não quebrar imports existentes
export const supabaseAdmin = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop]
  },
})
