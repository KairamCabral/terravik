// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { checkRateLimit, getPathPrefix } from '@/lib/rate-limit'

/**
 * Middleware de Autenticação e Rate Limiting
 *
 * - Rate limit por IP, só em requisição que grava (POST, PUT, PATCH, DELETE):
 *   /api/upload (20/min), /api/contact (5/min).
 *   /login e /cadastro ficaram de fora: o limite contava a abertura da página,
 *   o Next pré-carrega /login a cada página visitada e o cliente levava 429 ao
 *   clicar em Entrar. Login e cadastro falam direto com o Supabase, que tem
 *   limite próprio.
 * - Rotas protegidas (/conta/*, /admin/*): redireciona para /login se não autenticado
 * - Rotas de auth (/login, /cadastro): redireciona para /conta se já autenticado
 * - Atualiza cookies de sessão a cada request
 */

const RATE_LIMIT_PATHS = ['/api/upload', '/api/contact']
const METODOS_QUE_GRAVAM = ['POST', 'PUT', 'PATCH', 'DELETE']

// Rotas que exigem autenticação
const PROTECTED_ROUTES = ['/conta', '/admin']

// Rotas que redirecionam se já logado
const AUTH_ROUTES = ['/login', '/cadastro', '/recuperar-senha']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limiting para APIs e rotas de auth
  const pathPrefix = getPathPrefix(request)
  if (RATE_LIMIT_PATHS.includes(pathPrefix) && METODOS_QUE_GRAVAM.includes(request.method)) {
    const { allowed, retryAfter } = checkRateLimit(request)
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Muitas requisições. Tente novamente mais tarde.' }),
        { status: 429, headers: { 'Retry-After': String(retryAfter), 'Content-Type': 'application/json' } }
      )
    }
  }

  // Criar response mutável para atualizar cookies
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Sem credenciais do Supabase não dá para autenticar ninguém. O middleware
  // roda nas rotas do matcher a cada requisição: deixar o createServerClient
  // estourar responde 500. Degrada em vez de quebrar: segue sem sessão, e as
  // rotas protegidas continuam protegidas.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Atualizar sessão (importante para manter cookies frescos)
  const { data: { user } } = await supabase.auth.getUser()

  // Rotas protegidas — redirecionar se NÃO logado
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Rotas admin — verificar role (admin ou super_admin)
  if (pathname.startsWith('/admin') && user) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('[Middleware] Erro ao verificar role:', error)
        // Em caso de erro, bloquear acesso ao admin por segurança
        return NextResponse.redirect(new URL('/conta', request.url))
      }

      if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/conta', request.url))
      }
    } catch (err) {
      console.error('[Middleware] Exceção ao verificar role:', err)
      return NextResponse.redirect(new URL('/conta', request.url))
    }
  }

  // Rotas de auth — redirecionar se JÁ logado
  const isAuthRoute = AUTH_ROUTES.some(route => pathname === route)
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/conta', request.url))
  }

  return response
}

export const config = {
  matcher: [
    // Rate limit
    '/api/upload',
    '/api/contact',
    // Rotas protegidas
    '/conta/:path*',
    '/admin/:path*',
    // Rotas de auth
    '/login',
    '/cadastro',
    '/recuperar-senha',
  ],
}
