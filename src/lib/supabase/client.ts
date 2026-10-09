// src/lib/supabase/client.ts
// Cliente Supabase para uso no browser (Client Components)

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** true quando as variáveis públicas do Supabase estão configuradas. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export function createClient() {
  // Placeholders para não lançar exceção sem credenciais: o AuthProvider cria
  // o cliente em toda página, e a exceção derrubava o site inteiro com 500.
  // Sem credenciais as chamadas de rede falham e o site segue sem sessão.
  return createBrowserClient<Database>(
    SUPABASE_URL || 'https://placeholder.supabase.co',
    SUPABASE_ANON_KEY || 'placeholder-anon-key'
  )
}
