# Especificações dos Banners

## Dimensões das Imagens

### Desktop
- **Resolução**: 1920x800 pixels
- **Proporção**: 2.4:1 (widescreen)
- **Formato**: JPG
- **Localização**: `public/images/Banner/`

### Mobile
- **Resolução**: 1080x1350 pixels
- **Proporção**: 4:5 (vertical)
- **Formato**: JPG
- **Localização**: `public/images/Banner/`

## Arquivos Atuais

### Banner 1 - Gramado Novo
- **Desktop**: `Gramadonovo.jpg` (1920x800)
- **Mobile**: `mobile-gramadonovo.jpg` (1080x1350)
- **Produto**: Plantio e Enraizamento

### Banner 2 - Verde Rápido
- **Desktop**: `verderapido.jpg` (1920x800)
- **Mobile**: `mobile-verderapido.jpg` (1080x1350)
- **Produto**: Crescimento Acelerado

### Banner 3 - Resistência Total
- **Desktop**: `resistenciatotal.jpg` (1920x800)
- **Mobile**: `mobile-resistenciatotal.jpg` (1080x1350)
- **Produto**: Proteção Completa

## Comportamento Responsivo

### Desktop
- Aspect ratio: `1920/800` (2.4:1)
- A imagem preenche toda a largura da tela
- Altura ajusta-se proporcionalmente
- `object-fit: cover` para preencher sem bordas

### Mobile
- Aspect ratio: `1080/1350` (4:5)
- A imagem preenche toda a largura da tela
- Altura ajusta-se proporcionalmente
- `object-fit: cover` para preencher sem bordas

## Funcionalidades do Carousel

- ✅ Auto-play com intervalo de 5 segundos
- ✅ Pausa ao passar o mouse (hover)
- ✅ Navegação manual com setas laterais
- ✅ Indicadores de slide (dots)
- ✅ Contador de slides no canto superior direito
- ✅ Navegação por teclado (setas esquerda/direita)
- ✅ Transições suaves com Framer Motion
- ✅ Responsivo com aspect ratio correto
- ✅ Sem bordas ou espaços em branco
- ✅ Lazy loading para performance
- ✅ Versões otimizadas para mobile e desktop

## Como Adicionar Novos Banners

1. **Prepare as imagens**:
   - Desktop: 1920x800 pixels
   - Mobile: 1080x1350 pixels
   - Formato: JPG (otimizado para web)

2. Adicione as imagens na pasta `public/images/Banner/`
   - **Desktop**: nome do produto (ex: `nomedoproduto.jpg`)
   - **Mobile**: prefixo `mobile-` + nome do produto (ex: `mobile-nomedoproduto.jpg`)

3. Edite o arquivo `src/components/home/BannerSection.tsx`
4. Adicione o novo objeto no array `BANNERS`:

```typescript
{
  id: 4,
  desktop: '/images/Banner/nomedoproduto.jpg',
  mobile: '/images/Banner/mobile-nomedoproduto.jpg',
  alt: 'Terravik Nome do Produto - Descrição',
}
```

## Otimização de Performance

- ✅ Formato JPG reduz significativamente o tamanho dos arquivos
- ✅ Aspect ratio CSS evita layout shift
- ✅ Next.js Image para otimização automática
- ✅ Priority loading no primeiro banner
- ✅ Quality: 90% para balanço entre qualidade e tamanho
- ✅ Object-fit: cover para preencher sem distorção

## Acessibilidade

- ✅ Labels ARIA em todos os botões
- ✅ Navegação por teclado
- ✅ Alt text descritivos em todas as imagens
- ✅ Controles visíveis e interativos
