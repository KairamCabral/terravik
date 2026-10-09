/**
 * Política única de fallback para mock quando uma chamada à Shopify falha.
 *
 * Existe por causa de um bug que passou despercebido por meses: as páginas de
 * produto chamavam `normalizeProduct()` sobre o retorno de `getProducts()` e
 * `getProductByHandle()`, que JÁ devolvem `Product` normalizado. A segunda
 * normalização lançava `TypeError: Cannot read properties of undefined
 * (reading 'map')`, porque num `Product` normalizado `images` é array e
 * `images.edges` não existe.
 *
 * Dois mecanismos escondiam isso:
 *   1. `as any` na chamada, que cegava o compilador
 *   2. `catch` mudo, que trocava o erro pelos produtos mock em silêncio
 *
 * Resultado: com a Shopify perfeitamente configurada, respondendo 200, o site
 * servia catálogo mock e o build passava verde.
 *
 * A regra agora: em desenvolvimento, falha alto. Em produção, degrada para o
 * mock em vez de derrubar a página, mas sempre com o erro real no log.
 */

/**
 * Sentinela lançado de propósito por `shouldUseMock()` em client.ts quando o
 * modo mock está ligado. Não é falha: é o fluxo normal de desenvolvimento sem
 * credencial, e por isso nunca é relançado.
 */
const MOCK_MODE = 'MOCK_MODE_ACTIVE'

function ehModoMock(erro: unknown): boolean {
  return erro instanceof Error && erro.message === MOCK_MODE
}

/**
 * Registra a falha e decide se relança.
 *
 * @param contexto  de onde veio, para o log ser rastreável
 * @throws o erro original, quando não é modo mock e não é produção
 */
export function reportarFalhaShopify(contexto: string, erro: unknown): void {
  if (ehModoMock(erro)) {
    // Modo mock ligado de propósito. Silencioso: não é falha.
    return
  }

  console.error(
    `[Shopify] Falha em ${contexto}. Caindo para o catálogo mock.`,
    erro
  )

  if (process.env.NODE_ENV !== 'production') {
    // Em dev, degradar em silêncio é o que fez este bug sobreviver.
    throw erro
  }
}
