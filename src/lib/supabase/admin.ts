// src/lib/supabase/admin.ts
// Cliente Supabase Admin para uso server-side (API Routes, Server Actions)
// ATENÇÃO: Nunca expor este client no browser

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL não configurada')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  // Em desenvolvimento, usar anon key como fallback
  console.warn('SUPABASE_SERVICE_ROLE_KEY não configurada, usando anon key como fallback')
}

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
