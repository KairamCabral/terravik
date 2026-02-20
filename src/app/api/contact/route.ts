import { NextRequest, NextResponse } from 'next/server'

interface ContactData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactData = await request.json()

    // Validação server-side
    const errors: string[] = []

    if (!data.name?.trim()) {
      errors.push('Nome é obrigatório')
    }

    if (!data.email?.trim()) {
      errors.push('E-mail é obrigatório')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('E-mail inválido')
    }

    if (!data.message?.trim()) {
      errors.push('Mensagem é obrigatória')
    } else if (data.message.trim().length < 10) {
      errors.push('Mensagem deve ter pelo menos 10 caracteres')
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Erro de validação',
          errors,
        },
        { status: 400 }
      )
    }

    // TODO: Integrar com serviço de email (Resend, SendGrid, etc.)
    // TODO: Integrar com CRM (HubSpot, Chatwoot, etc.)
    
    // Por enquanto, apenas logar no console
    console.log('Nova mensagem de contato:')
    console.log({
      timestamp: new Date().toISOString(),
      name: data.name,
      email: data.email,
      phone: data.phone || 'Não informado',
      subject: data.subject,
      message: data.message,
    })

    // Simular delay de processamento
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: 'Mensagem recebida com sucesso',
    })
  } catch (error) {
    console.error('Erro ao processar contato:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
      },
      { status: 500 }
    )
  }
}
