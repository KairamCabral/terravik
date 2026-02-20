# INTEGRAÇÃO SHOPIFY - SISTEMA DE ASSINATURAS

## 📋 VISÃO GERAL

Este documento detalha como integrar o sistema de assinaturas Terravik com a Shopify Subscription API (Selling Plans).

**Pré-requisitos**:
- Shopify Plus (necessário para Subscription API)
- App instalado na loja com permissões de `write_own_subscription_contracts`
- Storefront API com acesso a `@inContext(country: CA) @inContext(preferredLocationId: "...")` para subscriptions

---

## 🔧 CONFIGURAÇÃO INICIAL

### 1. Criar Selling Plan Groups no Shopify Admin

Selling Plans são a estrutura que define as opções de assinatura disponíveis.

**Acesse**: Shopify Admin > Products > Subscriptions > Create selling plan group

#### Grupo: "Assinatura Terravik"

**Selling Plans a criar**:

```javascript
// Plano 1: A cada 30 dias - 10% OFF
{
  name: "A cada 30 dias",
  options: "Assinatura",
  category: "SUBSCRIPTION",
  billingPolicy: {
    recurring: {
      interval: "DAY",
      intervalCount: 30
    }
  },
  deliveryPolicy: {
    recurring: {
      interval: "DAY",
      intervalCount: 30,
      anchors: []
    }
  },
  pricingPolicies: [
    {
      fixed: {
        adjustmentType: "PERCENTAGE",
        adjustmentValue: 10.0
      }
    }
  ]
}

// Plano 2: A cada 45 dias - 12% OFF (RECOMENDADO)
{
  name: "A cada 45 dias",
  options: "Assinatura",
  category: "SUBSCRIPTION",
  billingPolicy: {
    recurring: {
      interval: "DAY",
      intervalCount: 45
    }
  },
  deliveryPolicy: {
    recurring: {
      interval: "DAY",
      intervalCount: 45
    }
  },
  pricingPolicies: [
    {
      fixed: {
        adjustmentType: "PERCENTAGE",
        adjustmentValue: 12.0
      }
    }
  ]
}

// Plano 3: A cada 60 dias - 15% OFF
{
  name: "A cada 60 dias",
  options: "Assinatura",
  category: "SUBSCRIPTION",
  billingPolicy: {
    recurring: {
      interval: "DAY",
      intervalCount: 60
    }
  },
  deliveryPolicy: {
    recurring: {
      interval: "DAY",
      intervalCount: 60
    }
  },
  pricingPolicies: [
    {
      fixed: {
        adjustmentType: "PERCENTAGE",
        adjustmentValue: 15.0
      }
    }
  ]
}

// Plano 4: A cada 90 dias - 18% OFF
{
  name: "A cada 90 dias",
  options: "Assinatura",
  category: "SUBSCRIPTION",
  billingPolicy: {
    recurring: {
      interval: "DAY",
      intervalCount: 90
    }
  },
  deliveryPolicy: {
    recurring: {
      interval: "DAY",
      intervalCount: 90
    }
  },
  pricingPolicies: [
    {
      fixed: {
        adjustmentType: "PERCENTAGE",
        adjustmentValue: 18.0
      }
    }
  ]
}
```

### 2. Associar Produtos aos Selling Plans

Depois de criar os Selling Plans, associe os produtos Terravik:

1. Acesse cada produto (Nutrição, Recuperação, Implantação, Premium)
2. Na seção "Selling plans", adicione "Assinatura Terravik"
3. Salvar

**Via GraphQL Admin API**:

```graphql
mutation {
  sellingPlanGroupAddProducts(
    id: "gid://shopify/SellingPlanGroup/SEU_ID_AQUI"
    productIds: [
      "gid://shopify/Product/NUTRICAO_ID",
      "gid://shopify/Product/RECUPERACAO_ID",
      "gid://shopify/Product/IMPLANTACAO_ID",
      "gid://shopify/Product/PREMIUM_ID"
    ]
  ) {
    sellingPlanGroup {
      id
      name
    }
    userErrors {
      field
      message
    }
  }
}
```

---

## 🛒 CRIAR ASSINATURA VIA STOREFRONT API

### Query: Obter Selling Plans Disponíveis

```graphql
query GetProductWithSellingPlans($handle: String!) {
  product(handle: $handle) {
    id
    title
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    sellingPlanGroups(first: 1) {
      edges {
        node {
          name
          sellingPlans(first: 10) {
            edges {
              node {
                id
                name
                description
                options {
                  name
                  value
                }
                priceAdjustments {
                  adjustmentValue {
                    ... on SellingPlanPercentagePriceAdjustment {
                      adjustmentPercentage
                    }
                  }
                }
                recurringDeliveries
              }
            }
          }
        }
      }
    }
    variants(first: 1) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
}
```

### Mutation: Adicionar Produto ao Carrinho com Selling Plan

```graphql
mutation AddToCartWithSellingPlan($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                }
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
            sellingPlanAllocation {
              sellingPlan {
                id
                name
              }
              priceAdjustments {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

**Variáveis**:
```json
{
  "cartId": "gid://shopify/Cart/abc123",
  "lines": [
    {
      "merchandiseId": "gid://shopify/ProductVariant/123456",
      "quantity": 1,
      "sellingPlanId": "gid://shopify/SellingPlan/789"
    }
  ]
}
```

---

## 🔄 GERENCIAR ASSINATURA VIA ADMIN API

### Query: Obter Assinatura do Cliente

```graphql
query GetCustomerSubscriptions($customerId: ID!) {
  customer(id: $customerId) {
    id
    email
    subscriptionContracts(first: 10) {
      edges {
        node {
          id
          status
          nextBillingDate
          originOrder {
            id
          }
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                title
                variantTitle
                currentPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          deliveryPolicy {
            interval
            intervalCount
          }
        }
      }
    }
  }
}
```

### Mutation: Pausar Assinatura

```graphql
mutation PauseSubscription($subscriptionContractId: ID!) {
  subscriptionContractPause(subscriptionContractId: $subscriptionContractId) {
    contract {
      id
      status
    }
    userErrors {
      field
      message
    }
  }
}
```

### Mutation: Reativar Assinatura

```graphql
mutation ActivateSubscription($subscriptionContractId: ID!) {
  subscriptionContractActivate(subscriptionContractId: $subscriptionContractId) {
    contract {
      id
      status
    }
    userErrors {
      field
      message
    }
  }
}
```

### Mutation: Cancelar Assinatura

```graphql
mutation CancelSubscription($subscriptionContractId: ID!) {
  subscriptionContractCancel(subscriptionContractId: $subscriptionContractId) {
    contract {
      id
      status
    }
    userErrors {
      field
      message
    }
  }
}
```

### Mutation: Atualizar Frequência

```graphql
mutation UpdateSubscription($subscriptionContractId: ID!, $input: SubscriptionDraftInput!) {
  subscriptionDraftUpdate(
    draftId: $subscriptionContractId
    input: $input
  ) {
    draft {
      id
    }
    userErrors {
      field
      message
    }
  }
  
  subscriptionDraftCommit(draftId: $subscriptionContractId) {
    contract {
      id
      status
    }
    userErrors {
      field
      message
    }
  }
}
```

---

## 🔔 CONFIGURAR WEBHOOKS

**Acesse**: Shopify Admin > Settings > Notifications > Webhooks

### Webhooks Necessários

#### 1. Subscription contracts/create
**URL**: `https://seu-dominio.com/api/subscription/webhook`  
**Format**: JSON  
**Evento**: Quando uma nova assinatura é criada

#### 2. Subscription contracts/update
**URL**: `https://seu-dominio.com/api/subscription/webhook`  
**Format**: JSON  
**Evento**: Quando assinatura é pausada, cancelada, reativada

#### 3. Subscription billing attempts/success
**URL**: `https://seu-dominio.com/api/subscription/webhook`  
**Format**: JSON  
**Evento**: Cobrança bem-sucedida

#### 4. Subscription billing attempts/failure
**URL**: `https://seu-dominio.com/api/subscription/webhook`  
**Format**: JSON  
**Evento**: Falha na cobrança

#### 5. Subscription billing attempts/challenged
**URL**: `https://seu-dominio.com/api/subscription/webhook`  
**Format**: JSON  
**Evento**: Cobrança em revisão (3DS, fraude)

### Verificação de Webhook (HMAC)

```typescript
import crypto from 'crypto';

function verifyWebhook(body: string, hmacHeader: string): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET!;
  
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');
  
  return hash === hmacHeader;
}
```

---

## 📊 FLUXO COMPLETO DE ASSINATURA

### 1. Cliente Escolhe Assinatura no Site

```typescript
// Frontend
const handleSubscribe = async () => {
  // 1. Adicionar ao carrinho com sellingPlanId
  const response = await fetch('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({
      variantId: 'gid://shopify/ProductVariant/123',
      quantity: 1,
      sellingPlanId: 'gid://shopify/SellingPlan/789', // 45 dias
    }),
  });
  
  // 2. Redirecionar para checkout
  window.location.href = cart.checkoutUrl;
};
```

### 2. Shopify Processa Pagamento

- Cliente completa checkout normalmente
- Shopify cria `Subscription Contract` automaticamente
- Webhook `subscription_contracts/create` é enviado

### 3. Backend Recebe Webhook

```typescript
// /api/subscription/webhook
async function handleSubscriptionCreated(payload) {
  // Salvar no banco de dados
  await db.subscription.create({
    shopifyId: payload.admin_graphql_api_id,
    customerId: payload.customer_id,
    status: 'active',
    frequency: payload.delivery_policy.interval_count,
    nextBillingDate: payload.next_billing_date,
  });
  
  // Enviar email de boas-vindas
  await sendWelcomeEmail(payload.customer);
  
  // Analytics
  analytics.track('subscription_created', {
    value: payload.line_items[0].price,
    frequency: payload.delivery_policy.interval_count,
  });
}
```

### 4. Shopify Cobra Automaticamente

- A cada X dias (conforme frequência)
- Webhook `subscription_billing_attempts/success` é enviado
- Backend registra pagamento e agenda entrega

### 5. Cliente Gerencia pelo Dashboard

```typescript
// Frontend - Dashboard do Cliente
const { subscription } = useCustomerSubscription();

// Pausar
await fetch('/api/subscription/update', {
  method: 'POST',
  body: JSON.stringify({
    subscriptionId: subscription.id,
    action: 'pause',
    pauseMonths: 2,
  }),
});

// Cancelar
await fetch('/api/subscription/update', {
  method: 'POST',
  body: JSON.stringify({
    subscriptionId: subscription.id,
    action: 'cancel',
    reason: 'price_high',
  }),
});
```

---

## 🔐 VARIÁVEIS DE AMBIENTE

Adicionar no `.env.local`:

```bash
# Shopify Store
SHOPIFY_STORE_DOMAIN=terravik.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu_token_aqui

# Shopify Admin API (para gerenciar assinaturas)
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_seu_token_aqui
SHOPIFY_API_VERSION=2024-01

# Webhooks
SHOPIFY_WEBHOOK_SECRET=seu_webhook_secret_aqui
```

---

## 🧪 TESTAR INTEGRAÇÃO

### 1. Teste Local com ngrok

```bash
# Instalar ngrok
npm install -g ngrok

# Expor localhost
ngrok http 3000

# Usar URL do ngrok nos webhooks Shopify
# Exemplo: https://abc123.ngrok.io/api/subscription/webhook
```

### 2. Criar Assinatura de Teste

```bash
# Via API
curl -X POST https://seu-dominio.com/api/subscription/create \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "gid://shopify/Customer/123",
    "products": [{
      "productId": "gid://shopify/Product/456",
      "variantId": "gid://shopify/ProductVariant/789",
      "quantity": 1
    }],
    "frequency": 45,
    "shippingAddress": {...},
    "paymentMethodId": "..."
  }'
```

### 3. Simular Webhook

```bash
curl -X POST http://localhost:3000/api/subscription/webhook \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Topic: subscription_contracts/create" \
  -H "X-Shopify-Shop-Domain: terravik.myshopify.com" \
  -H "X-Shopify-Hmac-Sha256: hash_aqui" \
  -d @webhook-payload.json
```

---

## 📚 RECURSOS ADICIONAIS

- [Shopify Subscription API Docs](https://shopify.dev/docs/api/admin-graphql/latest/objects/SubscriptionContract)
- [Selling Plans Guide](https://shopify.dev/docs/apps/selling-strategies/subscriptions)
- [Webhooks Reference](https://shopify.dev/docs/api/admin-rest/latest/resources/webhook)

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar Selling Plan Group "Assinatura Terravik"
- [ ] Criar 4 Selling Plans (30, 45, 60, 90 dias)
- [ ] Associar produtos aos Selling Plans
- [ ] Configurar 5 webhooks necessários
- [ ] Adicionar variáveis de ambiente
- [ ] Testar criação de assinatura
- [ ] Testar atualização (pausar/cancelar)
- [ ] Testar webhooks com ngrok
- [ ] Verificar emails transacionais
- [ ] Implementar retry logic para falhas de cobrança
- [ ] Configurar monitoramento de assinaturas

---

**Data**: 02/02/2026  
**Versão**: 1.0  
**Status**: Documentação completa, pronta para implementação
