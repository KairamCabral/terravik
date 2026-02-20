# 📦 Configuração: Webhook de Rastreamento Shopify

## 🎯 Objetivo

Capturar automaticamente os dados de rastreamento (tracking number, URL, transportadora) quando um pedido é atualizado no Shopify e salvar na tabela `orders_sync` do Supabase.

---

## 🔧 Configuração do Webhook

### 1. Acessar Shopify Admin

```
Shopify Admin → Settings → Notifications → Webhooks
```

### 2. Criar Novo Webhook

**Topic:** `orders/updated`  
**Format:** JSON  
**URL:** `https://your-domain.com/api/webhooks/shopify`  
**API Version:** 2024-01

---

## 📋 Campos do Webhook

O webhook `orders/updated` envia dados como:

```json
{
  "id": 123456789,
  "order_number": 1234,
  "fulfillments": [
    {
      "tracking_number": "BR123456789BR",
      "tracking_url": "https://rastreamento.correios.com.br/...",
      "tracking_company": "Correios",
      "status": "success"
    }
  ],
  "financial_status": "paid",
  "fulfillment_status": "fulfilled"
}
```

---

## 🗄️ Atualizar Schema do Supabase

### Adicionar Colunas em `orders_sync`

```sql
-- Adicionar colunas de rastreamento
ALTER TABLE orders_sync 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS tracking_company TEXT;

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_orders_sync_tracking 
ON orders_sync(tracking_number) 
WHERE tracking_number IS NOT NULL;

-- Comentários
COMMENT ON COLUMN orders_sync.tracking_number IS 'Código de rastreamento (ex: BR123456789BR)';
COMMENT ON COLUMN orders_sync.tracking_url IS 'URL de rastreamento fornecida pelo Shopify';
COMMENT ON COLUMN orders_sync.tracking_company IS 'Transportadora (ex: Correios, Jadlog, etc)';
```

---

## 🔄 Atualizar API Route do Webhook

### Arquivo: `src/app/api/webhooks/shopify/route.ts`

Adicionar lógica para processar fulfillments:

```typescript
// Processar fulfillments (rastreamento)
const fulfillments = orderData.fulfillments || []
let trackingNumber = null
let trackingUrl = null
let trackingCompany = null

if (fulfillments.length > 0) {
  const firstFulfillment = fulfillments[0]
  trackingNumber = firstFulfillment.tracking_number || null
  trackingUrl = firstFulfillment.tracking_url || null
  trackingCompany = firstFulfillment.tracking_company || null
}

// Atualizar orders_sync
const { error } = await supabase
  .from('orders_sync')
  .upsert({
    id: orderId,
    // ... outros campos ...
    tracking_number: trackingNumber,
    tracking_url: trackingUrl,
    tracking_company: trackingCompany,
    fulfillment_status: orderData.fulfillment_status,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: 'shopify_order_id'
  })
```

---

## 🧪 Testar o Webhook

### 1. Criar Pedido de Teste

```
Shopify Admin → Orders → Create order
```

### 2. Adicionar Rastreamento

```
Pedido → Fulfill items → Add tracking information
  - Tracking number: BR123456789BR
  - Shipping carrier: Correios
  - Tracking URL: (gerado automaticamente)
```

### 3. Verificar no Supabase

```sql
SELECT 
  shopify_order_number,
  tracking_number,
  tracking_company,
  tracking_url,
  fulfillment_status
FROM orders_sync
WHERE shopify_order_number = '1234'
ORDER BY updated_at DESC;
```

### 4. Verificar na UI

```
1. Acesse /conta/pedidos
2. Procure o pedido #1234
3. Deve aparecer:
   - Card azul com "Rastreamento"
   - Código: BR123456789BR
   - Botão "Rastrear Pedido"
```

---

## 🔍 Debug do Webhook

### Verificar Logs do Shopify

```
Shopify Admin → Settings → Notifications → Webhooks
  → Clique no webhook
  → Tab "Recent deliveries"
```

**O que verificar:**
- ✅ Status: 200 OK
- ✅ Response time: < 5s
- ❌ Status: 4xx ou 5xx → Ver erro

### Logs da API Route

```typescript
// Adicionar no webhook route
console.log('[Webhook] Order updated:', {
  orderId: orderData.id,
  orderNumber: orderData.order_number,
  trackingNumber,
  trackingCompany,
  fulfillmentStatus: orderData.fulfillment_status
})
```

### Testar Manualmente

```bash
curl -X POST https://your-domain.com/api/webhooks/shopify \
  -H "Content-Type: application/json" \
  -H "X-Shopify-Topic: orders/updated" \
  -H "X-Shopify-Hmac-Sha256: YOUR_HMAC" \
  -d '{
    "id": 123456789,
    "order_number": 1234,
    "fulfillments": [{
      "tracking_number": "BR123456789BR",
      "tracking_url": "https://rastreamento.correios.com.br/...",
      "tracking_company": "Correios"
    }],
    "fulfillment_status": "fulfilled"
  }'
```

---

## 🚨 Tratamento de Erros

### Cenário 1: Webhook não dispara

**Causa:** URL incorreta ou domínio não acessível  
**Solução:**
1. Verificar se a URL está correta
2. Testar endpoint manualmente
3. Verificar firewall/CORS

### Cenário 2: Dados não aparecem no Supabase

**Causa:** Erro na lógica de processamento  
**Solução:**
1. Ver logs do webhook
2. Verificar estrutura do JSON recebido
3. Conferir mapeamento dos campos

### Cenário 3: Múltiplos fulfillments

**Causa:** Pedido enviado em várias entregas  
**Solução:**
```typescript
// Concatenar tracking numbers
const trackingNumbers = fulfillments
  .map(f => f.tracking_number)
  .filter(Boolean)
  .join(', ')
```

---

## 📊 Formato de Rastreamento por Transportadora

### Correios (Brasil)
```typescript
tracking_number: "BR123456789BR" // 13 caracteres
tracking_url: "https://rastreamento.correios.com.br/app/index.php"
tracking_company: "Correios"
```

### Jadlog
```typescript
tracking_number: "12345678901234" // 14 dígitos
tracking_url: "https://www.jadlog.com.br/tracking/consulta"
tracking_company: "Jadlog"
```

### Melhor Envio
```typescript
tracking_number: "ME123456789BR"
tracking_url: "https://melhorenvio.com.br/rastreio/ME123456789BR"
tracking_company: "Melhor Envio"
```

---

## ✅ Checklist de Implementação

- [ ] Webhook `orders/updated` criado no Shopify
- [ ] URL do webhook apontando para produção
- [ ] Colunas `tracking_*` adicionadas em `orders_sync`
- [ ] API Route atualizada para processar fulfillments
- [ ] Logs de debug adicionados
- [ ] Pedido de teste criado e rastreamento adicionado
- [ ] Dados apareceram no Supabase
- [ ] UI da página /conta/pedidos mostra rastreamento
- [ ] Botão "Rastrear Pedido" funciona
- [ ] Link abre em nova aba
- [ ] Empty state testado (pedido sem rastreamento)

---

## 🔐 Segurança

### Validar HMAC do Webhook

```typescript
import crypto from 'crypto'

function verifyShopifyWebhook(body: string, hmac: string, secret: string): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64')
  
  return hash === hmac
}

// Na API Route:
const hmac = request.headers.get('X-Shopify-Hmac-Sha256')
const isValid = verifyShopifyWebhook(rawBody, hmac, process.env.SHOPIFY_WEBHOOK_SECRET)

if (!isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
}
```

---

## 📈 Monitoramento

### Métricas a Acompanhar

1. **Taxa de sucesso do webhook:** > 95%
2. **Tempo de resposta:** < 3s
3. **Pedidos com rastreamento:** ~80% após 24h
4. **Cliques no botão "Rastrear":** Métrica de engajamento

### Alertas

Configurar alertas para:
- ❌ Webhook com erro 5xx (problema no servidor)
- ⚠️ Taxa de sucesso < 90%
- ⚠️ Tempo de resposta > 5s

---

**Última atualização:** 15/02/2026  
**Status:** Pronto para implementação
