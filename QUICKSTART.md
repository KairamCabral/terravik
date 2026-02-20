# 🚀 Início Rápido - Terravik Store

## ⚡ Setup em 5 Minutos

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Rodar em Desenvolvimento

```bash
npm run dev
```

Abra: http://localhost:3000

**Pronto!** O site está rodando com mock data. ✅

---

## 🌐 Testar Todas as Páginas

Acesse as URLs abaixo para validar:

- ✅ http://localhost:3000 (Home)
- ✅ http://localhost:3000/produtos (Catálogo)
- ✅ http://localhost:3000/produtos/gramado-novo (Produto)
- ✅ http://localhost:3000/calculadora (Quiz)
- ✅ http://localhost:3000/sobre (Institucional)
- ✅ http://localhost:3000/contato (Formulário)
- ✅ http://localhost:3000/blog (Blog)
- ✅ http://localhost:3000/blog/como-adubar-gramado (Artigo)
- ✅ http://localhost:3000/onde-encontrar (Pontos de venda)
- ✅ http://localhost:3000/representantes (Representantes)

---

## 🛒 Testar Fluxo de Compra

### Sem Shopify (Mock Data)

1. Vá em `/produtos`
2. Clique em um produto
3. Clique "Adicionar ao Carrinho"
4. Drawer abre automaticamente ✨
5. Altere quantidade (+/-)
6. Veja subtotal atualizar

**Nota:** Checkout não funciona sem Shopify (botão redireciona para URL vazia).

### Com Shopify

1. Configure `.env.local` (copie de `.env.local.example`)
2. Reinicie: `npm run dev`
3. Repita o fluxo acima
4. Checkout funciona! (redireciona para Shopify)

---

## 🧮 Testar Calculadora

1. Vá em `/calculadora`
2. Clique "Começar"
3. Responda as 8 perguntas
4. Veja resultado personalizado com:
   - Produtos recomendados
   - Dose por m²
   - Quantidade total
   - Embalagens ideais
   - Calendário
5. Clique "Adicionar ao Carrinho" → funciona! ✨

---

## 📧 Testar Formulário de Contato

1. Vá em `/contato`
2. Preencha o formulário
3. Clique "Enviar"
4. Veja no **terminal** (console):
   ```
   Nova mensagem de contato:
   {
     name: '...',
     email: '...',
     message: '...'
   }
   ```
5. Mensagem "Enviada!" aparece ✅

---

## 🔨 Build para Produção

```bash
npm run build
```

Se tudo estiver OK, você verá:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (21/21)
✅ [next-sitemap] Generation completed
```

**21 páginas geradas! Pronto para deploy!** 🎉

---

## 🚀 Deploy na Vercel

### Opção 1: CLI (Mais Rápido)

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel --prod
```

Siga as instruções no terminal.

### Opção 2: Dashboard

1. Acesse https://vercel.com
2. Clique "Add New → Project"
3. Importe o repositório
4. Adicione variáveis de ambiente
5. Deploy!

**Documentação completa:** Ver `DEPLOY.md`

---

## 🐛 Problemas Comuns

### "Cannot find module..."

```bash
npm run clean:full
```

### Port 3000 já em uso

```bash
# Windows
npx kill-port 3000

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Build falha

```bash
npm run type-check  # Ver erros TypeScript
npm run lint        # Ver erros ESLint
```

---

## 📚 Precisa de Ajuda?

- **Quick start:** Este arquivo (QUICKSTART.md)
- **Visão geral:** README.md
- **Deploy:** DEPLOY.md
- **Checklist:** CHECKLIST.md
- **Arquitetura:** ARCHITECTURE.md

---

## ✨ Comandos Úteis

```bash
npm run dev           # Dev server
npm run build         # Build produção
npm run start         # Produção local
npm run lint          # Linter
npm run type-check    # TypeScript
npm run verify        # Verificar projeto
npm run clean         # Limpar cache
npm run clean:full    # Limpar tudo e reinstalar
```

---

**Site pronto! Bom desenvolvimento! 🌱**
