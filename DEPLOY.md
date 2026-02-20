# 🚀 Guia de Deploy - Terravik Store

## Pré-requisitos

- [ ] Conta na Vercel (gratuita ou Pro)
- [ ] Loja Shopify configurada (plano Basic ou superior)
- [ ] Domínio customizado (opcional, mas recomendado)
- [ ] Produtos cadastrados no Shopify com imagens

## Checklist Pré-Deploy

### 1. Configuração do Shopify

- [ ] App headless criado no Shopify Admin
- [ ] Storefront API token obtido
- [ ] Produtos cadastrados com:
  - [ ] Títulos e descrições em português
  - [ ] Imagens de qualidade (min 1200x1200)
  - [ ] Variantes configuradas (400g, 900g, 2.7kg)
  - [ ] Preços em BRL
  - [ ] Handles amigáveis (gramado-novo, verde-rapido, resistencia-total)

### 2. Build Local

```bash
# 1. Instalar dependências
npm install

# 2. Criar .env.local com credenciais reais
cp .env.local.example .env.local
# Edite .env.local e preencha as variáveis

# 3. Testar build local
npm run build

# 4. Testar em modo produção
npm run start
```

Se o build passar sem erros, está pronto para deploy!

### 3. Validações Finais

- [ ] `npm run build` completa sem erros
- [ ] Todas as páginas carregam localmente
- [ ] Formulário de contato funciona
- [ ] Calculadora gera resultado correto
- [ ] Carrinho adiciona/remove produtos (se Shopify configurado)
- [ ] Links externos funcionam (WhatsApp, Google Maps, etc)

---

## Deploy na Vercel

### Opção 1: Deploy via CLI (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login na Vercel
vercel login

# 3. Deploy para preview (primeiro deploy)
vercel

# 4. Adicionar variáveis de ambiente via CLI
vercel env add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
vercel env add NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add REVALIDATE_SECRET

# 5. Deploy para produção
vercel --prod
```

### Opção 2: Deploy via Dashboard

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Add New → Project**
3. Importe o repositório do GitHub/GitLab
4. Configure as variáveis de ambiente:
   - Vá em **Settings → Environment Variables**
   - Adicione todas as variáveis do `.env.local.example`
5. Clique em **Deploy**

---

## Configurar Domínio Customizado

### Na Vercel

1. Vá no projeto → **Settings → Domains**
2. Clique em **Add Domain**
3. Digite `terravik.com.br` e `www.terravik.com.br`
4. Vercel fornecerá registros DNS

### No Registro.br (ou seu provedor de domínio)

Adicione os registros DNS fornecidos pela Vercel:

**Para `terravik.com.br`:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para `www.terravik.com.br`:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

⏱️ **Propagação DNS**: Pode levar de 15 minutos a 48 horas.

### Atualizar variável NEXT_PUBLIC_SITE_URL

Após domínio configurado:

```bash
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
# Digite: https://terravik.com.br
```

Ou via dashboard: **Settings → Environment Variables** → Edit

---

## Configurar Webhook do Shopify (Revalidação Automática)

Para que o site atualize automaticamente quando produtos mudarem no Shopify:

### 1. No Shopify Admin

1. Vá em **Settings → Notifications**
2. Role até **Webhooks** → **Create webhook**
3. Configure:

**Webhook 1: Product Update**
- Event: `Product update`
- Format: `JSON`
- URL: `https://terravik.com.br/api/revalidate?secret=SEU_REVALIDATE_SECRET`

**Webhook 2: Product Creation**
- Event: `Product creation`
- Format: `JSON`
- URL: `https://terravik.com.br/api/revalidate?secret=SEU_REVALIDATE_SECRET`

**Webhook 3: Product Deletion**
- Event: `Product deletion`
- Format: `JSON`
- URL: `https://terravik.com.br/api/revalidate?secret=SEU_REVALIDATE_SECRET`

### 2. Testar Webhook

No Shopify Admin:
1. Edite qualquer produto
2. Salve
3. Vá em **Settings → Notifications → Webhooks**
4. Clique no webhook criado
5. Role até o final e veja o status do último disparo

Deve aparecer `200 OK` se funcionou.

---

## Pós-Deploy

### 1. Validar Produção

- [ ] Acessar `https://terravik.com.br`
- [ ] SSL funcionando (cadeado verde)
- [ ] Todas as páginas carregam
- [ ] Imagens carregam
- [ ] Formulários funcionam
- [ ] Calculadora funciona
- [ ] Carrinho funciona (se Shopify configurado)

### 2. Testar Performance

```bash
# Lighthouse CLI
npm i -g lighthouse
lighthouse https://terravik.com.br --view
```

**Targets:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

### 3. Validar SEO

- [ ] Sitemap acessível: `https://terravik.com.br/sitemap.xml`
- [ ] Robots.txt acessível: `https://terravik.com.br/robots.txt`
- [ ] Google Search Console configurado
- [ ] Bing Webmaster Tools configurado
- [ ] Open Graph testado: [opengraph.xyz](https://www.opengraph.xyz/)

### 4. Monitoramento

**Vercel Analytics** (recomendado):
1. Vá no projeto → **Analytics**
2. Ative (gratuito no plano Pro)

**Google Search Console**:
1. Acesse [search.google.com/search-console](https://search.google.com/search-console)
2. Adicione a propriedade `https://terravik.com.br`
3. Verifique via DNS ou meta tag
4. Envie o sitemap: `https://terravik.com.br/sitemap.xml`

---

## Troubleshooting

### Build falha na Vercel

**Erro: "Module not found"**
```bash
# Localmente, limpe cache e reinstale
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Erro de TypeScript**
```bash
# Rode localmente para ver o erro completo
npm run build
```

### Imagens não carregam

Verifique se os domínios estão em `next.config.mjs`:

```js
images: {
  domains: ['cdn.shopify.com'],
}
```

### Carrinho não funciona

- [ ] Credenciais Shopify corretas?
- [ ] Produtos existem no Shopify?
- [ ] Variantes disponíveis?
- [ ] Console do navegador mostra erros?

### Webhook não funciona

- [ ] URL do webhook correta?
- [ ] Secret correto?
- [ ] Vercel não bloqueou a rota?
- [ ] Verifique logs: Vercel Dashboard → Functions → /api/revalidate

---

## Backups e Rollback

### Criar checkpoint antes de deploy importante

```bash
# Tag git antes do deploy
git tag -a v1.0.0 -m "Release 1.0.0 - Deploy inicial"
git push origin v1.0.0
```

### Rollback na Vercel

1. Vá no projeto → **Deployments**
2. Encontre o deployment anterior estável
3. Clique nos 3 pontos → **Promote to Production**

---

## Manutenção

### Atualizar dependências

```bash
# Ver dependências desatualizadas
npm outdated

# Atualizar Next.js
npm install next@latest react@latest react-dom@latest

# Atualizar todas (cuidado!)
npm update

# Testar após atualização
npm run build
```

### Logs de produção

Vercel Dashboard → **Functions** → Veja logs em tempo real

---

## Suporte

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Shopify**: [shopify.dev](https://shopify.dev)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Projeto pronto para produção! 🚀**
