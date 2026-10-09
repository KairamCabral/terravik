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
    handle: 'gramado-novo',
    descricao: 'Rico em fósforo para enraizamento forte desde o início.',
    selo: null,
  },
  {
    handle: 'verde-rapido',
    descricao: 'Alta carga de nitrogênio para verde visível em dias.',
    selo: 'Mais vendido',
  },
  {
    handle: 'resistencia-total',
    descricao: 'NPK balanceado para gramados sob estresse e pisoteio.',
    selo: null,
  },
]
