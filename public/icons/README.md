# Ícones PWA - Instruções

## Gerar Ícones

Para criar todos os ícones PWA necessários a partir de um logo, use uma ferramenta online:

### Opção 1: Favicon.io (Recomendado)
1. Acesse: https://favicon.io/favicon-converter/
2. Upload do logo Terravik (PNG 512x512 ou maior)
3. Baixe o pacote gerado
4. Extraia todos os ícones para esta pasta `/public/icons/`

### Opção 2: RealFaviconGenerator
1. Acesse: https://realfavicongenerator.net/
2. Upload do logo
3. Configure:
   - iOS: Sim
   - Android: Sim (tema #093e28)
   - Windows: Sim
4. Baixe e extraia aqui

## Tamanhos Necessários

- `icon-72x72.png` - iOS Safari mínimo
- `icon-96x96.png` - Android pequeno
- `icon-128x128.png` - Android médio
- `icon-144x144.png` - Windows tile
- `icon-152x152.png` - iOS Safari
- `icon-192x192.png` - Android padrão
- `icon-384x384.png` - Android grande
- `icon-512x512.png` - PWA splash screen

## Favicon (Navegadores)

Além dos ícones PWA, crie também:
- `favicon.ico` (16x16, 32x32, 48x48 multi-resolução)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)

Coloque estes na pasta `/public/` (raiz).

## Cores da Marca

- **Verde principal**: #093e28
- **Verde claro**: #a9ac32
- **Dourado**: #b38c26
- **Creme**: #F5F0E8

Use estas cores como tema nos ícones e splash screens.
