-- ============================================================
-- Migration: handle_new_user com search_path fixo
-- Data: 2026-10-09
-- Descrição: Conserta a criação de conta, que falhava com
--            "Database error creating new user"
-- ============================================================
--
-- O DEFEITO
--
-- O trigger on_auth_user_created chama handle_new_user() a cada usuário novo.
-- A função fazia `INSERT INTO profiles` sem esquema e sem `SET search_path`.
-- Quem dispara o trigger é o serviço de Auth do Supabase, que roda como
-- supabase_auth_admin com search_path = auth: ali `profiles` não existe, o
-- INSERT lança "relation profiles does not exist", a transação inteira é
-- desfeita e o cadastro devolve erro 500. Nenhuma conta era criada.
--
-- SECURITY DEFINER troca o DONO da execução, não o search_path: por isso a
-- função passava em todo teste feito pelo SQL Editor (search_path com public)
-- e falhava só no cadastro de verdade.
--
-- O CONSERTO
--
-- search_path vazio e nome qualificado. É também a forma recomendada para
-- função SECURITY DEFINER: com search_path herdado de quem chama, um objeto
-- homônimo em outro esquema poderia ser usado no lugar do verdadeiro.
--
-- Idempotente. O trigger já existe e continua apontando para esta função.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

-- Usuários que por acaso existam em auth.users sem perfil (criados por fora
-- enquanto o trigger falhava) ganham o perfil que faltou.
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT u.id, u.email, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
WHERE u.email IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);
