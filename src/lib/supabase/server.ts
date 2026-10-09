// src/lib/supabase/server.ts
// Cliente Supabase para uso em Server Components e Route Handlers

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    // Placeholders para não lançar exceção sem credenciais (ver client.ts).
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Chamado de Server Component - sem acesso a escrita de cookies
          }
        },
      },
    }
  )
}
