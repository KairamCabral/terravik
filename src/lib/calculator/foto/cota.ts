// Cota diária da análise de foto. Só no servidor.
import 'server-only'

import { createHmac } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

/** Análises por visitante por dia. */
export const LIMITE_POR_PESSOA = 5
/** Análises do site inteiro por dia: teto de gasto, mesmo sob abuso. */
export const LIMITE_GERAL = 300

export type ResultadoDaCota = 'ok' | 'pessoa' | 'geral' | 'indisponivel'

export function cotaConfigurada(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/**
 * O banco nunca recebe o IP: recebe um HMAC dele, com a chave de serviço como
 * segredo. Sem o segredo não dá para voltar ao IP nem testar um IP conhecido.
 */
function chaveDoVisitante(ip: string): string {
  return createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY ?? '')
    .update(`foto:${ip}`)
    .digest('hex')
}

/**
 * Conta a análise e diz se ela pode acontecer. Qualquer falha (banco fora do
 * ar, migration não aplicada) FECHA a porta: sem cota conferida não há chamada
 * paga.
 */
export async function registrarUso(ip: string): Promise<ResultadoDaCota> {
  if (!cotaConfigurada()) return 'indisponivel'
  try {
    // A função não está nos tipos gerados do banco.
    const banco = getSupabaseAdmin() as unknown as SupabaseClient
    const { data, error } = await banco.rpc('registrar_uso_da_foto', {
      p_chave: chaveDoVisitante(ip),
      p_limite_pessoa: LIMITE_POR_PESSOA,
      p_limite_geral: LIMITE_GERAL,
    })
    if (error) {
      console.error('[foto] cota indisponível:', error.code ?? error.message)
      return 'indisponivel'
    }
    return data === 'ok' || data === 'pessoa' || data === 'geral' ? data : 'indisponivel'
  } catch {
    console.error('[foto] cota indisponível: falha ao consultar o banco')
    return 'indisponivel'
  }
}
