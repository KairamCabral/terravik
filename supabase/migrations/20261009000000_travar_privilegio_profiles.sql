-- ============================================================
-- Migration: Travar colunas de privilégio em profiles
-- Data: 2026-10-09
-- História: S-01 (docs/conciliacao-adds/01-seguranca-e-base.md)
-- Descrição: Fecha a promoção a super_admin por PATCH no próprio perfil
-- ============================================================
--
-- O DEFEITO
--
-- A policy "profiles_update_own" (schema.sql) foi escrita só com USING:
--
--     CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
--
-- Policy de UPDATE sem WITH CHECK reaproveita o USING para validar a linha nova.
-- Como o id não muda, toda coluna fora do id é reescrevível pelo dono da linha,
-- inclusive role. Uma requisição com a chave anônima e o token de qualquer conta
-- criada no site basta:
--
--     PATCH /rest/v1/profiles?id=eq.<meu-uid>   {"role":"super_admin"}
--
-- Pela mesma porta: shopify_customer_id reescrito faz /api/shopify/customer
-- devolver os dados de outro cliente, e email reescrito troca a identidade do perfil.
--
-- POR QUE DUAS CAMADAS
--
-- O WITH CHECK sozinho não resolve: auth.uid() = id continua verdadeiro com o
-- role trocado. Ele entra porque policy de UPDATE sem WITH CHECK é armadilha
-- para quem ler depois. Quem fecha é o trigger.
--
-- O QUE NÃO PODE QUEBRAR
--
-- /conta/dados e /conta/preferencias atualizam full_name, phone, address,
-- preferences e notification_settings pelo navegador: nenhuma dessas colunas é
-- congelada. O XP entra pela RPC add_user_xp, que é SECURITY DEFINER: dentro
-- dela current_user é o dono da função, então o trigger deixa passar. A
-- sincronia com a Shopify grava pelo servidor com a chave de serviço.

-- 1. A policy, agora com WITH CHECK
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. O trigger que congela privilégio
--
-- SECURITY INVOKER de propósito (é o padrão, e está escrito aqui para ninguém
-- "melhorar" depois): a função precisa ver em current_user o papel de QUEM
-- chamou. Com SECURITY DEFINER, current_user viraria o dono da função e a
-- checagem liberaria todo mundo, sempre.
CREATE OR REPLACE FUNCTION public.trg_profiles_travar_privilegio()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  -- Servidor (service_role) e dono do banco passam: é por ali que a sincronia
  -- com a Shopify e o crédito de XP acontecem.
  IF current_user NOT IN ('anon', 'authenticated') THEN
    RETURN NEW;
  END IF;

  -- Admin de verdade pode mexer, inclusive em role de outra pessoa.
  IF public.get_auth_user_role() IN ('admin', 'super_admin') THEN
    RETURN NEW;
  END IF;

  -- Para o resto: devolve o valor antigo em vez de recusar a operação inteira.
  -- Recusar derrubaria também a parte legítima do mesmo UPDATE (trocar o
  -- próprio nome ou telefone junto).
  NEW.role := OLD.role;
  NEW.email := OLD.email;
  NEW.shopify_customer_id := OLD.shopify_customer_id;
  NEW.shopify_email := OLD.shopify_email;
  NEW.xp_total := OLD.xp_total;
  NEW.level := OLD.level;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.trg_profiles_travar_privilegio() IS
  'Congela role, email, ids da Shopify, xp_total e level quando o UPDATE vem de anon/authenticated sem ser admin. Fecha a promocao a super_admin por PATCH direto no PostgREST.';

DROP TRIGGER IF EXISTS trg_profiles_travar_privilegio ON public.profiles;
CREATE TRIGGER trg_profiles_travar_privilegio
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.trg_profiles_travar_privilegio();
