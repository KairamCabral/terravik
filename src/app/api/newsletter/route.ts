import { NextRequest, NextResponse } from 'next/server'

interface NewsletterData {
  email: string
}

export async function POST(request: NextRequest) {
  try {
    const data: NewsletterData = await request.json()

    // Validação
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        { success: false, message: 'E-mail inválido' },
        { status: 400 }
      )
    }

    // TODO: Integrar com serviço de email marketing
    // Opções: Mailchimp, ConvertKit, Resend, SendGrid, etc.

    // Por enquanto, apenas logar no console
    console.log('Nova inscrição na newsletter:')
    console.log({
      timestamp: new Date().toISOString(),
      email: data.email,
      source: 'website',
    })

    // Simular delay de processamento
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: 'Inscrição realizada com sucesso',
    })
  } catch (error) {
    console.error('Erro ao processar newsletter:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
      },
      { status: 500 }
    )
  }
}
