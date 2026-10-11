/**
 * Curadoria da vitrine da home.
 *
 * Diz QUAIS produtos aparecem, em que ordem, e o texto curto de cada um.
 * Nome, foto, variantes e preços vêm do catálogo (servidor), nunca daqui.
 * Handle que não existir no catálogo é ignorado.
 */
export interface CuradoriaDaVitrine {
  handle: string
  descricao: string
  selo: string | null
}

export const CURADORIA_DA_VITRINE: CuradoriaDaVitrine[] = [
  {
    handle: 'raiz-forte',
    descricao: 'Fósforo e cálcio para firmar a raiz no plantio e na reforma.',
    selo: null,
  },
  {
    handle: 'verde-rapido',
    descricao: 'Nitrogênio e enxofre para devolver a cor ao gramado amarelado.',
    selo: null,
  },
  {
    handle: 'resistencia-total',
    descricao: 'Potássio para a grama resistir à seca, ao sol e ao pisoteio.',
    selo: null,
  },
]
