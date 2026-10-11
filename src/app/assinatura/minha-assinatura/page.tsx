// src/app/assinatura/minha-assinatura/page.tsx

import { getCatalogo } from '@/lib/shopify/catalogo';
import { criarAssinaturaDeExemplo } from '@/lib/subscription/mock-data';
import { REVALIDATE } from '@/lib/utils/constants';
import { MinhaAssinaturaClient } from './MinhaAssinaturaClient';

export const revalidate = REVALIDATE.products;

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
