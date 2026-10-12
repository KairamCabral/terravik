// src/app/assinatura/minha-assinatura/page.tsx

import { getCatalogo } from '@/lib/shopify/catalogo';
import { criarAssinaturaDeExemplo } from '@/lib/subscription/mock-data';
import { MinhaAssinaturaClient } from './MinhaAssinaturaClient';

// Literal de propósito: o Next 15 só aceita valor escrito direto aqui.
// É o mesmo de REVALIDATE.products (src/lib/utils/constants.ts).
export const revalidate = 60

/**
 * Painel do assinante.
 *
 * Ainda mostra uma assinatura de exemplo (ver TODO no client). O servidor
 * monta o exemplo com o catálogo, para que produto, peso e preço sejam os
 * reais: client component não enxerga as credenciais da Shopify.
 */
export default async function MinhaAssinaturaPage() {
  const catalogo = await getCatalogo('minha-assinatura');

  return <MinhaAssinaturaClient assinaturaInicial={criarAssinaturaDeExemplo(catalogo)} />;
}
