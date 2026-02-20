# 🖼️ Imagens para Calculadora

## Melhorias de UX Implementadas

A calculadora agora usa **ImageRadioCard** com emojis grandes e visuais para melhor experiência do usuário.

## Próximo Nível: Imagens Reais

Para elevar ainda mais a UX, você pode adicionar fotos reais de gramados nesta pasta:

### Condição do Gramado (`/images/grass/`)

1. **perfect.jpg** - Gramado verde, denso, perfeito
2. **good.jpg** - Gramado bom, com pequenas falhas
3. **weak.jpg** - Gramado fraco, amarelado
4. **bad.jpg** - Gramado ralo, com falhas

### Sol (`/images/grass/`)

5. **full-sun.jpg** - Gramado em sol pleno
6. **partial-shade.jpg** - Gramado com sombra parcial
7. **shade.jpg** - Gramado em sombra

### Clima (`/images/grass/`)

8. **hot-rainy.jpg** - Gramado molhado, clima quente
9. **hot-dry.jpg** - Gramado seco, sol forte
10. **mild.jpg** - Gramado em clima ameno
11. **cold.jpg** - Gramado em inverno/frio

### Tráfego (`/images/grass/`)

12. **low-traffic.jpg** - Gramado decorativo, pouco uso
13. **medium-traffic.jpg** - Gramado com uso normal
14. **high-traffic.jpg** - Gramado com crianças/pets

### Implantação (`/images/grass/`)

15. **new-grass.jpg** - Plantio de grama (tapete ou sementes)
16. **existing-grass.jpg** - Gramado estabelecido

## Especificações das Imagens

- **Formato**: WebP ou JPG
- **Dimensões**: 400x300 pixels (aspect ratio 4:3)
- **Peso**: Máximo 100 KB por imagem
- **Otimização**: Comprimir com TinyPNG ou Squoosh

## Como Substituir Emojis por Imagens

No arquivo `ImageRadioCard`, trocar:

```tsx
// De:
emoji="🌿"

// Para:
image="/images/grass/perfect.jpg"
```

## Onde Encontrar Fotos

- **Unsplash**: https://unsplash.com/s/photos/lawn
- **Pexels**: https://pexels.com/search/grass/
- **Banco de imagens Terravik** (se houver)

## Dica: IA para Gerar Imagens

Use Midjourney, DALL-E ou Stable Diffusion com prompts:
- "perfect green lawn, residential garden, top view, natural lighting"
- "dry yellow lawn with patches, residential, realistic photo"
- "lawn in full sun, bright day, green grass"

---

**Por enquanto, os emojis grandes já melhoram MUITO a UX! 🎨**
