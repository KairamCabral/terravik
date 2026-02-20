// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Auth Callback Route
 * 
 * Processa callbacks do Supabase Auth:
 * - Confirmação de e-mail após cadastro
 * - Reset de senha (recovery)
 * - Magic links (futuro)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')

  if (code) {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
              // Server component — sem acesso a escrita
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Se for recovery (reset de senha), redirecionar para a página de redefinir senha
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/redefinir-senha`)
      }

      // Confirmação de e-mail ou outro — redirecionar para conta
      return NextResponse.redirect(`${origin}/conta`)
    }
  }

  // Erro ou sem código — redirecionar para login com erro
  return NextResponse.redirect(`${origin}/login?error=callback`)
}
