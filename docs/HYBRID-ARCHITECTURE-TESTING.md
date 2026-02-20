# 🧪 Guia de Teste - Arquitetura Híbrida "Meus Dados"

## 📋 Checklist Pré-Teste

### 1. Variáveis de Ambiente
Certifique-se de que o `.env.local` contém:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your-admin-token
```

### 2. Permissões da Shopify Admin API

O token precisa das seguintes permissões:
- ✅ `read_customers`
- ✅ `write_customers`

Para criar o token:
1. Shopify Admin → Settings → Apps and sales channels
2. Develop apps → Create an app
3. Configure → Admin API scopes → Marcar `read_customers` e `write_customers`
4. Install app → Copiar Admin API access token

---

## 🧪 Cenários de Teste

### **Cenário 1: Usuário SEM Shopify Customer ID**

**Situação:** Usuário cadastrou no site mas nunca fez pedido.

**Fluxo:**
1. Acesse `/conta/dados`
2. Verifique o Console (F12):
   ```
   [AuthProvider] 🚀 Inicializando...
   [AuthProvider] 📦 Sessão obtida: { userId: ..., email: ... }
   [AuthProvider] 👤 Buscando profile...
   [AuthProvider] ✅ Inicialização completa
   [MeusDados] Auth State: { hasUser: true, shopifyCustomerId: null }
   ```

**Resultado Esperado:**
- ✅ SEÇÃO 1 (Dados Comerciais): Card azul informando que dados não estão sincronizados
- ✅ SEÇÃO 2 (Personalização): Avatar editável + preferências funcionando
- ✅ SEÇÃO 3 (Gamificação): XP 0, Nível 1, Sequência 0

**Testes:**
- [ ] Upload de avatar funciona
- [ ] Remover avatar funciona
- [ ] Alterar preferências e salvar funciona
- [ ] Mensagem de sucesso aparece

---

### **Cenário 2: Usuário COM Shopify Customer ID**

**Situação:** Usuário já fez pelo menos 1 pedido no Shopify.

**Preparação:**
1. No banco de dados, atualize:
   ```sql
   UPDATE profiles 
   SET shopify_customer_id = 'gid://shopify/Customer/SEU_ID_AQUI'
   WHERE email = 'seu@email.com';
   ```
2. Ou faça um pedido de teste no Shopify

**Fluxo:**
1. Acesse `/conta/dados`
2. Verifique o Console:
   ```
   [MeusDados] Auth State: { shopifyCustomerId: 'gid://shopify/Customer/123' }
   [MeusDados] Buscando dados do Shopify...
   [ShopifyService] Buscando dados do cliente: gid://shopify/Customer/123
   [API] Buscando cliente Shopify: 123
   [API] Cliente encontrado: user@email.com
   [MeusDados] Dados do Shopify carregados: { firstName: ..., lastName: ... }
   ```

**Resultado Esperado:**
- ✅ SEÇÃO 1: Dados do Shopify exibidos (nome, telefone, endereço)
- ✅ Badge verde "Sincronizado com Shopify"
- ✅ Botão "Editar no Shopify" redireciona para `https://your-store.myshopify.com/account`
- ✅ Campos são readonly (não editáveis)

**Testes:**
- [ ] Nome completo aparece correto
- [ ] Telefone aparece correto
- [ ] Endereço completo aparece
- [ ] Link "Editar no Shopify" abre em nova aba
- [ ] Personalização (avatar) ainda é editável

---

### **Cenário 3: Erro ao Buscar Dados do Shopify**

**Situação:** Token inválido ou cliente não existe.

**Fluxo:**
1. Desative temporariamente o `SHOPIFY_ADMIN_ACCESS_TOKEN`
2. Acesse `/conta/dados`
3. Verifique o Console:
   ```
   [API] Erro do Shopify: Unauthorized
   [ShopifyService] Erro na resposta: ...
   [MeusDados] Erro ao carregar dados do Shopify
   ```

**Resultado Esperado:**
- ✅ Mensagem de erro amigável
- ✅ Seção de personalização continua funcionando
- ✅ Não trava a página

---

### **Cenário 4: Usuário NÃO Logado**

**Fluxo:**
1. Faça logout
2. Tente acessar `/conta/dados` diretamente
3. Verifique o Console:
   ```
   [AuthProvider] ⚠️ Nenhum usuário logado
   ```

**Resultado Esperado:**
- ✅ Card de erro "Sessão Não Encontrada"
- ✅ Botão "Fazer Login" redireciona para `/login`
- ✅ Ou middleware redireciona automaticamente para `/login`

---

## 🐛 Debug: Problemas Comuns

### **Problema 1: "Usuário não encontrado"**

**Diagnóstico:**
```bash
# Console mostra:
[MeusDados] Auth State: { hasUser: false, userId: undefined }
```

**Solução:**
1. Verifique se está logado: `localStorage` deve ter chaves do Supabase
2. Limpe cache: `Ctrl + Shift + R`
3. Faça login novamente
4. Verifique middleware: `/conta` deve estar protegido

---

### **Problema 2: Dados do Shopify não carregam**

**Diagnóstico:**
```bash
# Console mostra:
[API] Erro do Shopify: 401 Unauthorized
```

**Solução:**
1. Verifique `SHOPIFY_ADMIN_ACCESS_TOKEN` no `.env.local`
2. Confirme que o token tem permissões `read_customers`
3. Teste a API diretamente:
   ```bash
   curl -X POST http://localhost:3000/api/shopify/customer \
     -H "Content-Type: application/json" \
     -d '{"customerId":"gid://shopify/Customer/123"}'
   ```

---

### **Problema 3: Upload de avatar falha**

**Diagnóstico:**
```bash
# Console mostra:
[Upload] Erro: storage/unauthorized
```

**Solução:**
1. Verifique se o bucket `banners` existe no Supabase Storage
2. Confirme que a pasta `avatars/` está permitida
3. Verifique RLS policies do storage:
   ```sql
   -- Policy de upload (authenticated users)
   CREATE POLICY "Users can upload avatars"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'banners' AND (storage.foldername(name))[1] = 'avatars');
   ```

---

## ✅ Checklist Final

Antes de marcar como completo, teste:

- [ ] Login funciona e `user` não é null
- [ ] Usuário SEM Shopify ID vê mensagem adequada
- [ ] Usuário COM Shopify ID vê dados corretos
- [ ] Upload de avatar funciona
- [ ] Remover avatar funciona
- [ ] Preferências salvam corretamente
- [ ] Link "Editar no Shopify" funciona
- [ ] Seção de gamificação exibe XP/Nível
- [ ] Página não quebra com erros de API
- [ ] Console não tem erros críticos

---

## 📊 Métricas de Sucesso

### Latência Esperada
- Carregamento inicial (sem Shopify): **< 1s**
- Carregamento com Shopify API: **< 3s**
- Upload de avatar: **< 5s**

### UX
- ✅ Usuário entende que dados comerciais estão no Shopify
- ✅ Usuário consegue personalizar avatar/preferências
- ✅ Feedback visual claro em todas as ações

---

## 🚀 Próximos Passos (Futuro)

### Curto Prazo
- [ ] Webhook `customers/update` para atualizar dados em tempo real
- [ ] Cache de dados do Shopify no Supabase (evitar API calls repetidas)
- [ ] Sincronização bidirecional: editar no site → atualiza Shopify

### Médio Prazo
- [ ] Shopify Multipass para SSO
- [ ] Histórico de alterações de dados
- [ ] Exportação de dados (LGPD)

### Longo Prazo
- [ ] Unificar conta Terravik + Shopify em uma única interface
- [ ] Dashboard de privacidade e consentimentos
- [ ] Integração com CRM (HubSpot, Salesforce)
