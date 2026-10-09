import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { iguaisEmTempoConstante } from '@/lib/seguranca/comparar'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  // Falha explícita sem a variável, em vez de depender de `null !== undefined`.
  const esperado = process.env.REVALIDATE_SECRET
  if (!esperado) {
    console.error('[revalidate] REVALIDATE_SECRET não configurado. Rota desabilitada.')
    return NextResponse.json({ message: 'Revalidation not configured' }, { status: 503 })
  }

  if (!secret || !iguaisEmTempoConstante(secret, esperado)) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { path, tag } = body

    if (path) {
      revalidatePath(path)
      return NextResponse.json({ revalidated: true, path })
    }

    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({ revalidated: true, tag })
    }

    return NextResponse.json(
      { message: 'Missing path or tag parameter' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    )
  }
}
