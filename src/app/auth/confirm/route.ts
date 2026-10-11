// src/app/auth/confirm/route.ts
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * GET /auth/confirm?token_hash=...&type=...&next=...
 *
 * Destino dos botões dos e-mails de conta (cadastro, recuperação de senha,
 * link de acesso, troca de e-mail, convite). Confere o token direto no
 * Supabase com verifyOtp e abre a sessão aqui, no servidor.
 *
 * Por que não o link /auth/v1/verify do Supabase: naquele caminho o Supabase
 * devolve um código que só pode ser trocado por sessão no MESMO navegador que
 * fez o pedido (PKCE). Quem pedia a senha no computador e abria o e-mail no
 * celular caía no login com erro. Com token_hash o link funciona em qualquer
 * aparelho, uma única vez.
 *
 * /auth/callback continua existindo para os links antigos que ainda estejam
 * em caixas de entrada.
 */

const TIPOS: EmailOtpType[] = ['signup', 'invite', 'magiclink', 'recovery', 'email_change', 'email']

/** Para onde ir depois de confirmar, quando o link não diz. */
const DESTINO_PADRAO: Record<string, string> = {
  recovery: '/redefinir-senha',
  invite: '/redefinir-senha',
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const tipo = searchParams.get('type') as EmailOtpType | null
  const pedido = searchParams.get('next')

  // Só caminho interno (mesma regra do login): nada de //site-externo.
  const next =
    pedido && /^\/(?![/\\])/.test(pedido) ? pedido : DESTINO_PADRAO[tipo ?? ''] ?? '/conta'

  // Link de senha que falha vai para a tela que explica e oferece pedir outro.
  const falha =
    tipo === 'recovery' || tipo === 'invite'
      ? `${origin}/redefinir-senha`
      : `${origin}/login?error=link`

  if (!tokenHash || !tipo || !TIPOS.includes(tipo)) {
    return NextResponse.redirect(falha)
  }

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  const { error } = await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash })

  if (error) {
    // Expirado, já usado ou inválido. Sem detalhe na URL.
    return NextResponse.redirect(falha)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
