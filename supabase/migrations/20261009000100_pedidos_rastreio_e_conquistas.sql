-- ============================================================
-- Migration: Rastreio, vínculo de pedidos e conquistas
-- Data: 2026-10-09
-- História: U-03 (docs/conciliacao-adds/04-conta-auth-email-avaliacoes.md)
-- Descrição: Colunas que o código já lia e nunca existiram, adoção de pedidos
--            de quem comprou antes de criar conta, e seed de achievements
-- ============================================================
--
-- Idempotente: pode rodar mais de uma vez. Depende de schema.sql e de
-- 20261009000000_travar_privilegio_profiles.sql (rodar DEPOIS dela).

-- ============================================================
-- 0. Pré-requisito comum: is_admin() e set_updated_at()
-- ============================================================
--
-- As próximas migrations (avaliações, log de e-mail) usam as duas. Entram aqui
-- porque esta é a primeira da fila que roda depois do schema.

-- SECURITY INVOKER: quem lê profiles sem acionar RLS é get_auth_user_role(),
-- que já é SECURITY DEFINER. Esta só dá nome à pergunta "é admin?".
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT coalesce(public.get_auth_user_role() IN ('admin', 'super_admin'), false)
$$;

COMMENT ON FUNCTION public.is_admin() IS
  'Verdadeiro quando o usuario autenticado tem role admin ou super_admin. Anonimo devolve false, nunca null.';

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_updated_at() IS
  'Funcao de trigger BEFORE UPDATE: carimba updated_at. Nao esta ligada a nenhuma tabela por esta migration.';

-- ============================================================
-- 1. orders_sync: e-mail do checkout, despacho, entrega e rastreio
-- ============================================================
--
-- src/lib/services/orders.ts lê tracking_number, tracking_url e
-- tracking_company com cast, e nenhuma migration criou essas colunas. O cast
-- fez o TypeScript aceitar, o Postgres devolveu undefined, e o botão
-- "Rastrear Pedido" de /conta/pedidos, que está atrás de `order.trackingUrl &&`,
-- nunca apareceu para ninguém.
--
-- customer_email: o webhook casava order.email com profiles.email e descartava
-- o e-mail em seguida. Quem cria conta DEPOIS de comprar (o caso comum, porque
-- o checkout é da Shopify e não exige conta no site) ficava com o pedido órfão
-- para sempre, porque o dado que faria a ligação não era guardado.
--
-- fulfilled_at e delivered_at são colunas diferentes de propósito: na Shopify
-- "fulfilled" quer dizer despachado. Entrega só chega em shipment_status, que
-- quase nunca vem preenchido com transportadora brasileira.
ALTER TABLE public.orders_sync
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS fulfilled_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS tracking_url text,
  ADD COLUMN IF NOT EXISTS tracking_company text;

COMMENT ON COLUMN public.orders_sync.customer_email IS
  'E-mail do checkout na Shopify. Permite vincular o pedido a um perfil criado depois da compra.';
COMMENT ON COLUMN public.orders_sync.fulfilled_at IS
  'Quando a Shopify marcou como despachado. NAO e a entrega.';
COMMENT ON COLUMN public.orders_sync.delivered_at IS
  'So preenchido quando shipment_status = delivered chega de verdade.';

CREATE INDEX IF NOT EXISTS idx_orders_sync_customer_email
  ON public.orders_sync (lower(customer_email))
  WHERE customer_email IS NOT NULL;

-- ============================================================
-- 2. Vínculo de pedido órfão a perfil
-- ============================================================
--
-- Casa SÓ por profiles.email, sem diferenciar maiúsculas. A ADDS também casa
-- por shopify_email; aqui não, porque não há ganho (o webhook de customers
-- grava shopify_email igual ao email do perfil) e cada coluna a mais que
-- decide dono de pedido é uma coluna a mais para proteger.
--
-- Só toca em linha com user_id NULL. Pedido já vinculado nunca muda de dono.
--
-- SECURITY DEFINER porque o UPDATE em orders_sync precisa passar pela RLS
-- (o dono do perfil não tem policy de UPDATE ali, e não deve ter). Por isso:
--   - search_path vazio e todo objeto qualificado;
--   - EXECUTE revogado de anon e authenticated logo abaixo. A função não
--     recebe e-mail, só um id, então chamá-la com o id de outro perfil daria
--     os pedidos ao dono certo. Mesmo assim, não há motivo para o navegador
--     alcançá-la por /rest/v1/rpc.
CREATE OR REPLACE FUNCTION public.vincular_pedidos_ao_perfil(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_atualizados integer;
BEGIN
  UPDATE public.orders_sync o
     SET user_id = p.id
    FROM public.profiles p
   WHERE p.id = p_user_id
     AND o.user_id IS NULL
     AND o.customer_email IS NOT NULL
     AND p.email IS NOT NULL
     AND lower(o.customer_email) = lower(p.email);

  GET DIAGNOSTICS v_atualizados = ROW_COUNT;
  RETURN v_atualizados;
END;
$$;

COMMENT ON FUNCTION public.vincular_pedidos_ao_perfil(uuid) IS
  'Adota pedidos orfaos (user_id NULL) cujo e-mail de checkout bate com o e-mail do perfil. Retorna quantos foram vinculados.';

-- Varredura completa. /api/sync/orders chama no fim de cada sincronização:
-- sem isso o e-mail entraria na tabela e o pedido de quem JÁ tem conta só
-- seria adotado se a busca exata por e-mail da rota tivesse acertado.
CREATE OR REPLACE FUNCTION public.vincular_pedidos_orfaos()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_atualizados integer;
BEGIN
  -- Se dois perfis tiverem o mesmo e-mail (profiles.email não é UNIQUE), o
  -- pedido NÃO é adotado por nenhum: escolher um deles seria chutar o dono.
  UPDATE public.orders_sync o
     SET user_id = p.id
    FROM public.profiles p
   WHERE o.user_id IS NULL
     AND o.customer_email IS NOT NULL
     AND p.email IS NOT NULL
     AND lower(o.customer_email) = lower(p.email)
     AND NOT EXISTS (
       SELECT 1 FROM public.profiles p2
        WHERE p2.id <> p.id
          AND lower(p2.email) = lower(p.email)
     );

  GET DIAGNOSTICS v_atualizados = ROW_COUNT;
  RETURN v_atualizados;
END;
$$;

COMMENT ON FUNCTION public.vincular_pedidos_orfaos() IS
  'Varre os pedidos orfaos e vincula os que tem um unico perfil com o mesmo e-mail. Idempotente.';

-- O Supabase concede EXECUTE a anon e authenticated em toda função nova de
-- public (default privileges), então revogar de PUBLIC não basta.
REVOKE ALL ON FUNCTION public.vincular_pedidos_ao_perfil(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.vincular_pedidos_orfaos() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.vincular_pedidos_ao_perfil(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.vincular_pedidos_orfaos() TO service_role;

CREATE OR REPLACE FUNCTION public.trg_vincular_pedidos()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.vincular_pedidos_ao_perfil(NEW.id);
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.trg_vincular_pedidos() FROM PUBLIC, anon, authenticated;

-- QUANDO O VÍNCULO DISPARA, E POR QUE NINGUÉM ADOTA PEDIDO TROCANDO O E-MAIL
--
-- 1. No INSERT do perfil. Quem insere é handle_new_user(), a partir de
--    auth.users: o e-mail é o que o Supabase Auth registrou, não um valor
--    digitado em /rest/v1/profiles. Cliente comum não tem policy de INSERT em
--    profiles (só profiles_admin_all).
--
-- 2. No UPDATE que MUDA o e-mail de verdade. Três travas, e qualquer uma
--    sozinha já fecha a porta:
--
--    a) É um trigger AFTER. Todo trigger BEFORE roda antes de qualquer AFTER,
--       então trg_profiles_travar_privilegio (BEFORE UPDATE, da migration
--       20261009000000) já devolveu NEW.email := OLD.email quando o UPDATE
--       veio de anon/authenticated sem ser admin.
--    b) A cláusula WHEN compara o e-mail antigo com o novo DEPOIS dessa
--       reversão. Para o cliente comum os dois são iguais, e o trigger nem
--       dispara. `UPDATE OF email` sozinho não serviria: ele dispara só por a
--       coluna estar no SET, mesmo com o valor revertido.
--    c) A função não confia em NEW: relê o e-mail GRAVADO na linha de profiles.
--
--    O nome trg_profiles_vincular_pedidos vem depois de
--    trg_profiles_travar_privilegio na ordem alfabética, que é a ordem em que
--    o Postgres dispara triggers do mesmo tipo. Hoje isso não decide nada (um
--    é BEFORE, o outro AFTER), e fica assim para continuar certo se alguém um
--    dia mudar o momento de um dos dois.
--
--    Quem consegue mudar o e-mail e disparar o vínculo: o servidor com a
--    chave de serviço e um admin. São os mesmos que já podem editar
--    orders_sync diretamente.
DROP TRIGGER IF EXISTS trg_profiles_vincular_pedidos_novo ON public.profiles;
CREATE TRIGGER trg_profiles_vincular_pedidos_novo
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.trg_vincular_pedidos();

DROP TRIGGER IF EXISTS trg_profiles_vincular_pedidos ON public.profiles;
CREATE TRIGGER trg_profiles_vincular_pedidos
  AFTER UPDATE OF email ON public.profiles
  FOR EACH ROW
  WHEN (lower(OLD.email) IS DISTINCT FROM lower(NEW.email))
  EXECUTE FUNCTION public.trg_vincular_pedidos();

-- Backfill: não há. customer_email nasce NULL em toda linha existente, porque
-- o dado nunca foi gravado. Depois de aplicar esta migration e publicar o
-- código, rode POST /api/sync/orders como admin: ela preenche o e-mail por
-- upsert e chama vincular_pedidos_orfaos() no fim.

-- ============================================================
-- 3. Seed de achievements
-- ============================================================
--
-- A tabela está vazia desde que foi criada. O webhook da Shopify chama
-- grantAchievement(user, 'first_purchase'), busca o code numa tabela vazia e
-- retorna em silêncio: a conquista de primeira compra nunca foi concedida.
--
-- As três da Academia usam os tipos de unlock_condition que
-- src/hooks/useProgress.ts já avalia (lessons_completed e quiz_perfect, com
-- "count"). Efeito esperado: a partir daqui o código existente passa a
-- conceder essas conquistas e creditar o XP.
--
-- ON CONFLICT (code) DO NOTHING: rodar de novo não duplica nem sobrescreve
-- ajuste feito à mão no painel.
INSERT INTO public.achievements (code, title, description, icon, color, rarity, xp_reward, unlock_condition)
VALUES
  (
    'first_purchase',
    'Primeira compra',
    'Você fez seu primeiro pedido de fertilizante na Terravik. Seu gramado agradece.',
    'ShoppingBag',
    '#093E28',
    'common',
    100,
    NULL
  ),
  (
    'primeira_licao',
    'Primeiro passo no gramado',
    'Você concluiu a primeira lição da Academia Terravik.',
    'Sprout',
    '#093E28',
    'common',
    100,
    '{"type": "lessons_completed", "count": 1}'::jsonb
  ),
  (
    'dez_licoes',
    'Jardineiro dedicado',
    'Dez lições concluídas na Academia. Você já sabe ler o que o gramado pede.',
    'BookOpen',
    '#B38B25',
    'rare',
    300,
    '{"type": "lessons_completed", "count": 10}'::jsonb
  ),
  (
    'quiz_perfeito',
    'Adubação na medida',
    'Você acertou todas as perguntas de um quiz da Academia.',
    'Target',
    '#B38B25',
    'rare',
    200,
    '{"type": "quiz_perfect", "count": 1}'::jsonb
  )
ON CONFLICT (code) DO NOTHING;
