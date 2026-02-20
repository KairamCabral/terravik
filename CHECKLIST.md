# ✅ Checklist de Deploy - Terravik Store

Use este checklist antes de fazer deploy para produção.

## 📋 Pré-Deploy

### Configuração do Projeto

- [ ] `.env.local` configurado com credenciais reais
- [ ] `NEXT_PUBLIC_SITE_URL` aponta para domínio de produção
- [ ] Todas as credenciais Shopify válidas e testadas
- [ ] `REVALIDATE_SECRET` gerado (64 caracteres aleatórios)

### Conteúdo

- [ ] Todos os produtos cadastrados no Shopify
- [ ] Imagens de produtos em alta qualidade (min 1200x1200)
- [ ] Preços em BRL configurados
- [ ] Handles de produtos corretos (gramado-novo, verde-rapido, resistencia-total)
- [ ] Artigos do blog revisados (ortografia, links)
- [ ] Informações de contato atualizadas (telefone, WhatsApp, email)

### Testes Locais

- [ ] `npm run build` completa sem erros
- [ ] `npm run start` funciona corretamente
- [ ] Todas as páginas carregam (/, /produtos, /blog, /calculadora, etc)
- [ ] Calculadora gera resultado correto
- [ ] Formulário de contato envia (ver console/logs)
- [ ] Carrinho adiciona/remove produtos (se Shopify configurado)
- [ ] Links externos funcionam (WhatsApp, Google Maps, redes sociais)
- [ ] Navegação mobile funciona (menu hambúrguer)

### SEO

- [ ] robots.txt existe em `/public/robots.txt`
- [ ] manifest.json existe em `/public/manifest.json`
- [ ] Favicon e ícones PWA existem
- [ ] Meta tags em todas as páginas
- [ ] Open Graph images configuradas
- [ ] JSON-LD schemas em páginas relevantes

---

## 🚀 Deploy

### Vercel

- [ ] Projeto conectado ao repositório Git
- [ ] Variáveis de ambiente configuradas:
  - [ ] `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
  - [ ] `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
  - [ ] `NEXT_PUBLIC_SITE_URL`
  - [ ] `REVALIDATE_SECRET`
  - [ ] `SHOPIFY_ADMIN_ACCESS_TOKEN` (opcional)
- [ ] Deploy executado com sucesso
- [ ] Build passou sem erros
- [ ] Domínio customizado configurado (se aplicável)

---

## ✅ Pós-Deploy

### Validação Básica

- [ ] Site acessível em produção
- [ ] SSL funcionando (cadeado verde)
- [ ] Todas as páginas carregam sem erro 404
- [ ] Imagens carregam corretamente
- [ ] Fontes carregam corretamente
- [ ] CSS aplicado corretamente

### Funcionalidades

- [ ] Header e Footer aparecem em todas as páginas
- [ ] Navegação funciona (todos os links)
- [ ] Menu mobile abre e fecha
- [ ] Calculadora funciona e gera resultado
- [ ] Formulário de contato envia (testar com email real)
- [ ] Carrinho funciona (adicionar, remover, atualizar quantidade)
- [ ] Botões de compartilhamento social funcionam
- [ ] Links para WhatsApp funcionam
- [ ] Links para Google Maps funcionam

### Performance

- [ ] Lighthouse rodado em 3 páginas principais
  - [ ] Home: Performance 90+
  - [ ] /produtos: Performance 90+
  - [ ] /calculadora: Performance 90+
- [ ] TTI (Time to Interactive) < 3s
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] CLS (Cumulative Layout Shift) < 0.1

### SEO

- [ ] Sitemap acessível: `https://terravik.com.br/sitemap.xml`
- [ ] Sitemap tem todas as páginas
- [ ] Robots.txt acessível: `https://terravik.com.br/robots.txt`
- [ ] Meta tags corretas (usar View Page Source)
- [ ] Open Graph testado: https://www.opengraph.xyz/
- [ ] JSON-LD válido: https://validator.schema.org/
- [ ] Google Search Console configurado
- [ ] Sitemap enviado ao GSC
- [ ] Bing Webmaster Tools configurado (opcional)

### PWA

- [ ] Manifest.json acessível: `https://terravik.com.br/manifest.json`
- [ ] Ícones PWA existem e carregam
- [ ] Theme color aplicada no mobile
- [ ] Site pode ser instalado como app (testar no Chrome mobile)

### Shopify Integration

- [ ] Produtos aparecem corretamente em `/produtos`
- [ ] Página individual de produto carrega
- [ ] Imagens dos produtos carregam
- [ ] Preços corretos (BRL)
- [ ] Adicionar ao carrinho funciona
- [ ] Checkout redireciona para Shopify
- [ ] Webhook configurado (opcional)
- [ ] Webhook testado (editar produto e ver revalidação)

### Analytics

- [ ] Vercel Analytics ativo (se Pro)
- [ ] Google Analytics configurado (se implementado)
- [ ] Events de conversão configurados (se implementado)

---

## 📊 Monitoramento

### Primeiras 24h

- [ ] Verificar logs na Vercel (erros?)
- [ ] Testar site em diferentes dispositivos
- [ ] Testar site em diferentes navegadores
- [ ] Pedir feedback de usuários beta
- [ ] Monitorar Web Vitals no Vercel Analytics

### Primeira Semana

- [ ] Verificar Google Search Console (erros de rastreamento?)
- [ ] Verificar se páginas estão sendo indexadas
- [ ] Monitorar performance (degradação?)
- [ ] Verificar formulários (mensagens chegando?)

---

## 🐛 Troubleshooting Rápido

### Site não carrega

1. Verificar variáveis de ambiente na Vercel
2. Verificar logs na Vercel: Functions
3. Verificar se domínio está apontando corretamente (DNS)

### Imagens não carregam

1. Verificar `next.config.mjs` → domains incluem Shopify CDN
2. Verificar console do navegador (CORS?)
3. Verificar se URLs das imagens são válidas

### Carrinho não funciona

1. Verificar credenciais Shopify
2. Verificar se produtos existem no Shopify
3. Verificar console do navegador (erros de API?)
4. Verificar Network tab (requests falhando?)

### Performance baixa

1. Verificar Lighthouse (identificar gargalos)
2. Verificar imagens otimizadas (next/image?)
3. Verificar bundles grandes (Bundle Analyzer)
4. Verificar se ISR está funcionando

---

## 📝 Notas

**Data do deploy:** ___/___/______  
**Versão:** v_____  
**Deployed by:** _______________  
**Issues conhecidas:** 

_______________________________________________
_______________________________________________
_______________________________________________

---

**Deploy checklist completo! ✅**
