/**
 * Vídeo da seção de vídeo da home (o grânulo do fertilizante).
 *
 * Mora fora de VideoDeFundo.tsx porque aquele arquivo é 'use client', e
 * componente de servidor não lê VALOR exportado de módulo cliente: recebe uma
 * referência opaca no lugar da string.
 *
 * PARA DESLIGAR A SEÇÃO: troque o objeto por `null`.
 *
 * TROCOU O ARQUIVO, TROQUE O NOME. O Next guarda a imagem otimizada pelo nome
 * e o navegador guarda o vídeo: pôster ou vídeo novo com o nome antigo chega
 * a quem já visitou como o arquivo velho.
 */

export interface FontesDeVideo {
  /** H.264 em MP4. Obrigatório: é o formato que todo navegador toca. */
  mp4: string
  /** VP9 ou AV1 em WebM. Opcional; quando existe, vai primeiro por ser menor. */
  webm?: string
}

export interface VideoDaSecao {
  fontes: FontesDeVideo
  /**
   * Um quadro do vídeo, em JPG. É o que aparece antes de o vídeo carregar e
   * tudo o que aparece para quem pediu menos movimento ou economiza dados.
   * `null` deixa a caixa com um fundo liso da paleta.
   */
  poster: string | null
  /**
   * O que o vídeo mostra, em texto. Vira o `alt` do pôster: o vídeo é o
   * conteúdo da seção e não tem áudio, e a WCAG 1.2.1 pede alternativa em
   * texto nesse caso.
   */
  descricao: string
}

/**
 * Só existe MP4 (1280×720, 8 s, 1,3 MB, sem áudio). Quando houver uma versão
 * WebM, preencha `webm` e ela passa a ser tentada primeiro.
 *
 * O pôster é o primeiro quadro do próprio vídeo, tirado em 1280×720: como o
 * vídeo começa nele, a troca pôster → vídeo não pula.
 */
export const VIDEO_DA_SECAO: VideoDaSecao | null = {
  fontes: { mp4: '/video/fertilizante-terravik.mp4' },
  poster: '/video/fertilizante-terravik-poster.jpg',
  descricao:
    'Animação de um grânulo do fertilizante Terravik que se abre ao meio e mostra as camadas internas.',
}
