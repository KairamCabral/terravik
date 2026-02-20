import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * POST /api/subscription/webhook
 * 
 * Recebe webhooks do Shopify sobre eventos de assinatura
 * 
 * Eventos suportados:
 * - SUBSCRIPTION_CONTRACTS_CREATE
 * - SUBSCRIPTION_CONTRACTS_UPDATE
 * - SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS
 * - SUBSCRIPTION_BILLING_ATTEMPTS_FAILURE
 * - SUBSCRIPTION_BILLING_ATTEMPTS_CHALLENGED
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar assinatura HMAC do Shopify
    const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');
    const topic = request.headers.get('X-Shopify-Topic');
    const shopDomain = request.headers.get('X-Shopify-Shop-Domain');
    
    if (!hmacHeader || !topic || !shopDomain) {
      return NextResponse.json(
        { error: 'Headers obrigatórios ausentes' },
        { status: 401 }
      );
    }
    
    // Obter body raw para validação
    const rawBody = await request.text();
    
    // Validar webhook (IMPORTANTE EM PRODUÇÃO)
    if (!verifyWebhook(rawBody, hmacHeader)) {
      console.error('Webhook inválido - HMAC não corresponde');
      return NextResponse.json(
        { error: 'Webhook não autorizado' },
        { status: 401 }
      );
    }
    
    // Parse do body
    const payload = JSON.parse(rawBody);
    
    // Log para debugging (remover em produção ou usar logger apropriado)
    console.log(`Webhook recebido: ${topic} de ${shopDomain}`);
    
    // Processar baseado no tópico
    switch (topic) {
      case 'SUBSCRIPTION_CONTRACTS_CREATE':
        return await handleSubscriptionCreated(payload);
        
      case 'SUBSCRIPTION_CONTRACTS_UPDATE':
        return await handleSubscriptionUpdated(payload);
        
      case 'SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS':
        return await handleBillingSuccess(payload);
        
      case 'SUBSCRIPTION_BILLING_ATTEMPTS_FAILURE':
        return await handleBillingFailure(payload);
        
      case 'SUBSCRIPTION_BILLING_ATTEMPTS_CHALLENGED':
        return await handleBillingChallenged(payload);
        
      default:
        console.log(`Tópico não tratado: ${topic}`);
        return NextResponse.json({ received: true });
    }
    
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    
    // Retornar 200 para evitar retry do Shopify em erros não recuperáveis
    return NextResponse.json(
      { error: 'Erro ao processar webhook', received: true },
      { status: 200 }
    );
  }
}

// ============================================================================
// HANDLERS DE EVENTOS
// ============================================================================

/**
 * Assinatura criada no Shopify
 */
async function handleSubscriptionCreated(payload: any) {
  console.log('Nova assinatura criada:', payload.admin_graphql_api_id);
  
  // TODO: Salvar no banco de dados
  // TODO: Enviar email de boas-vindas
  // TODO: Criar evento de analytics
  // TODO: Notificar equipe de sucesso
  
  return NextResponse.json({ 
    received: true,
    processed: 'subscription_created',
  });
}

/**
 * Assinatura atualizada (pausada, cancelada, reativada, etc)
 */
async function handleSubscriptionUpdated(payload: any) {
  console.log('Assinatura atualizada:', payload.admin_graphql_api_id);
  
  const status = payload.status; // ACTIVE, PAUSED, CANCELLED, etc
  
  // TODO: Atualizar no banco de dados
  // TODO: Enviar email contextual baseado no status
  // TODO: Se cancelada, iniciar flow de retenção
  // TODO: Analytics
  
  return NextResponse.json({ 
    received: true,
    processed: 'subscription_updated',
    status,
  });
}

/**
 * Cobrança bem-sucedida
 */
async function handleBillingSuccess(payload: any) {
  console.log('Cobrança bem-sucedida:', payload.admin_graphql_api_id);
  
  // TODO: Atualizar registro de pagamento
  // TODO: Enviar email de confirmação com NF
  // TODO: Agendar próxima entrega
  // TODO: Incrementar contador de fidelidade
  // TODO: Analytics
  
  return NextResponse.json({ 
    received: true,
    processed: 'billing_success',
  });
}

/**
 * Falha na cobrança
 */
async function handleBillingFailure(payload: any) {
  console.log('Falha na cobrança:', payload.admin_graphql_api_id);
  
  const errorCode = payload.error_code;
  const errorMessage = payload.error_message;
  
  // TODO: Registrar tentativa falhada
  // TODO: Enviar email pedindo para atualizar pagamento
  // TODO: Tentar novamente em X dias (conforme regra de negócio)
  // TODO: Se múltiplas falhas, pausar assinatura
  // TODO: Analytics
  
  return NextResponse.json({ 
    received: true,
    processed: 'billing_failure',
    errorCode,
  });
}

/**
 * Cobrança em revisão (3DS, análise de fraude, etc)
 */
async function handleBillingChallenged(payload: any) {
  console.log('Cobrança em revisão:', payload.admin_graphql_api_id);
  
  // TODO: Registrar status pendente
  // TODO: Enviar email informando
  // TODO: Monitorar resolução
  
  return NextResponse.json({ 
    received: true,
    processed: 'billing_challenged',
  });
}

// ============================================================================
// VALIDAÇÃO DE WEBHOOK
// ============================================================================

/**
 * Verifica se o webhook é realmente do Shopify
 * usando HMAC SHA256
 * 
 * IMPORTANTE: Em produção, usar variável de ambiente para secret
 */
function verifyWebhook(body: string, hmacHeader: string): boolean {
  // TODO: Usar variável de ambiente
  const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';
  
  if (!SHOPIFY_WEBHOOK_SECRET) {
    console.warn('SHOPIFY_WEBHOOK_SECRET não configurado - pulando validação');
    return true; // Em desenvolvimento, aceitar sem validar
  }
  
  const hash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');
  
  return hash === hmacHeader;
}

/**
 * GET - Health check do endpoint de webhook
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/subscription/webhook',
    message: 'Endpoint de webhooks Shopify ativo',
    supportedTopics: [
      'SUBSCRIPTION_CONTRACTS_CREATE',
      'SUBSCRIPTION_CONTRACTS_UPDATE',
      'SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS',
      'SUBSCRIPTION_BILLING_ATTEMPTS_FAILURE',
      'SUBSCRIPTION_BILLING_ATTEMPTS_CHALLENGED',
    ],
  });
}
