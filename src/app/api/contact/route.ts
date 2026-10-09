import { NextRequest, NextResponse } from 'next/server'
import { enviarContato } from '@/lib/email/contato'

// Esta rota já respondeu "Mensagem recebida com sucesso" depois de um
// console.log, sem enviar nada a ninguém. Agora ela só responde sucesso
// quando o e-mail saiu de verdade. Sem provedor configurado, responde 503 e a
// tela mostra o erro.
export const dynamic = 'force-dynamic'

interface ContactData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

const NAO_ENVIADA =
  'Não conseguimos enviar sua mensagem agora. Escreva para contato@terravik.com.br ou fale com a gente pelo WhatsApp.'

export async function POST(request: NextRequest) {
  try {
    let corpo: unknown
    try {
      corpo = await request.json()
    } catch {
      corpo = null
    }

    if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) {
      return NextResponse.json(
        { success: false, message: 'Erro de validação', errors: ['Corpo da requisição inválido'] },
        { status: 400 }
      )
    }

    // Só texto entra. Um campo que chegue como número ou objeto é tratado
    // como ausente, em vez de derrubar a rota com 500.
    const bruto = corpo as Record<string, unknown>
    const texto = (valor: unknown) => (typeof valor === 'string' ? valor : '')
    const data: ContactData = {
      name: texto(bruto.name),
      email: texto(bruto.email),
      phone: texto(bruto.phone),
      subject: texto(bruto.subject),
      message: texto(bruto.message),
    }

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

    // Tetos de tamanho por campo.
    const TETOS: Array<[keyof ContactData, string, number]> = [
      ['name', 'Nome', 200],
      ['email', 'E-mail', 254],
      ['phone', 'Telefone', 30],
      ['subject', 'Assunto', 200],
      ['message', 'Mensagem', 5000],
    ]
    for (const [campo, rotulo, maximo] of TETOS) {
      const valor = data[campo]
      if (typeof valor === 'string' && valor.length > maximo) {
        errors.push(`${rotulo} passou do limite de ${maximo} caracteres`)
      }
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

    const resultado = await enviarContato(data)

    if (!resultado.ok) {
      // O motivo já foi para o log dentro de enviarContato(), sem nenhum
      // dado de quem escreveu. 503: serviço sem configuração. 502: o
      // provedor recusou ou não respondeu.
      return NextResponse.json(
        { success: false, message: NAO_ENVIADA },
        { status: resultado.motivo === 'nao_configurado' ? 503 : 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso',
    })
  } catch (error) {
    // Só o tipo do erro: o objeto inteiro pode carregar o corpo da requisição.
    console.error(
      '[contact] Erro ao processar contato:',
      error instanceof Error ? error.name : 'erro desconhecido'
    )
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
      },
      { status: 500 }
    )
  }
}
