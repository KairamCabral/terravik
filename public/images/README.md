# 📸 Imagens - Instruções

Este projeto precisa de algumas imagens para estar completo. Aqui está o que você precisa adicionar:

## 🖼️ Imagens de Produtos (Shopify)

As imagens dos produtos devem ser cadastradas **diretamente no Shopify Admin**, não nesta pasta. O Shopify servirá as imagens otimizadas via CDN.

**Especificações:**
- Formato: JPG ou PNG
- Tamanho mínimo: 1200x1200 pixels
- Aspect ratio: 1:1 (quadrado)
- Fundo: Branco ou transparente
- Resolução: 72 DPI mínimo

**Produtos que precisam de fotos:**
1. **Gramado Novo (P1)** - Embalagens 400g e 900g
2. **Verde Rápido (P2)** - Embalagem 2,7kg
3. **Resistência Total (P3)** - Embalagens 400g e 900g

---

## 🎨 Open Graph Images

Para compartilhamento em redes sociais. Criar e colocar em `/public/images/og/`:

### `default.jpg` (1200x630)
Imagem padrão para páginas sem OG específica.

**Conteúdo sugerido:**
- Logo Terravik
- Tagline: "Fertilizantes Premium para Gramados"
- Fundo: Gradiente verde (#093e28 → #a9ac32)
- Ícone de grama/folha

### `calculadora.jpg` (1200x630)
Para quando alguém compartilhar `/calculadora`

**Conteúdo:**
- "Calcule a dose certa para o seu gramado"
- "Resultado em menos de 1 minuto"
- Visual de calculadora ou quiz

### `produtos.jpg` (1200x630)
Para `/produtos`

**Conteúdo:**
- "3 Produtos, 3 Objetivos"
- Fotos dos 3 produtos lado a lado

---

## 🔷 Favicons e PWA Icons

Gerar a partir do logo Terravik usando:

### Ferramentas Online
- https://favicon.io/favicon-converter/
- https://realfavicongenerator.net/

### Ícones necessários (colocar em `/public/`):
- `favicon.ico` (16x16, 32x32, 48x48 multi-resolução)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)

### PWA Icons (colocar em `/public/icons/`):
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

**Cores:**
- Fundo: Transparente ou #093e28 (verde Terravik)
- Logo: Branco ou #F5F0E8 (creme)

---

## 📷 Imagens Institucionais (Opcional)

Estas são opcionais mas melhoram muito a experiência:

### `/public/images/home/`
- `hero-bg.jpg` - Gramado bonito (hero da home)
- `benefits-bg.jpg` - Background da seção benefícios

### `/public/images/about/`
- `story.jpg` - Foto da equipe ou produto sendo aplicado

### `/public/images/blog/`
- Fotos ilustrativas para os artigos (opcional, por ora usa emoji 🌱)

---

## ⚡ Otimizações de Imagem

Quando adicionar imagens:

1. **Comprimir antes de usar:**
   - https://tinypng.com/
   - https://squoosh.app/

2. **Usar next/image sempre:**
   ```tsx
   <Image
     src="/images/hero.jpg"
     alt="Descrição"
     width={1200}
     height={800}
     priority // Se acima do fold
   />
   ```

3. **Adicionar domínios em `next.config.mjs`:**
   ```js
   images: {
     remotePatterns: [
       { protocol: 'https', hostname: 'cdn.shopify.com' },
       // Adicionar outros CDNs se necessário
     ],
   }
   ```

---

## 🎯 Prioridade

**Obrigatório antes do deploy:**
1. ✅ Favicons (mínimo: favicon.ico)
2. ✅ apple-touch-icon.png
3. ⚠️ OG image default (ou site aparece sem preview em redes sociais)

**Recomendado:**
4. PWA icons (para instalação como app)
5. Imagens de produtos (se não vier do Shopify)

**Opcional:**
6. Fotos institucionais
7. Fotos do blog

---

**Por enquanto, o site usa:**
- 🌱 Emoji de grama como placeholder
- Divs com bg colorido para imagens faltantes
- Tudo funciona visualmente mesmo sem imagens!
