-- ============================================================
-- Migration: email_log, o histórico de e-mails enviados pelo site
-- Data: 2026-10-11
-- História: U-04 (docs/conciliacao-adds/04-conta-auth-email-avaliacoes.md)
-- ============================================================
--
-- Cada e-mail que o site tenta enviar (confirmação de conta, recuperação de
-- senha, contato) grava uma linha aqui, tenha saído ou não. O webhook do
-- Resend atualiza o status depois (entregue, aberto, rejeitado).
--
-- É o que responde "o cliente recebeu?" sem abrir o painel do Resend, pelo
-- /admin/emails.
--
-- Quem grava é só o servidor, com a chave de serviço (que ignora a RLS). Não
-- há policy de INSERT nem de UPDATE: anon e authenticated não escrevem. A
-- leitura é só de admin.
--
-- Depende de public.is_admin(), criada em 20261009000100. Idempotente.

CREATE TABLE IF NOT EXISTS public.email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Categoria do disparo: 'contato', 'auth-recovery', 'auth-signup'...
  -- Texto livre de propósito: tipo novo de e-mail não deve exigir migration.
  tipo text NOT NULL,
  destinatario text NOT NULL,
  assunto text NOT NULL,
  -- id devolvido pelo Resend. Nulo quando a tentativa falhou antes do envio.
  resend_id text,
  status text NOT NULL DEFAULT 'enviado'
    CHECK (status IN ('enviado', 'entregue', 'aberto', 'clicado',
                      'rejeitado', 'reclamado', 'falhou')),
  -- Preenchido quando status = 'falhou' ou 'rejeitado'.
  erro text,
  -- Contexto de quem disparou, para cruzar com o perfil.
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  referencia text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_log_resend
  ON public.email_log (resend_id)
  WHERE resend_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_email_log_recente
  ON public.email_log (criado_em DESC);

CREATE INDEX IF NOT EXISTS idx_email_log_destinatario
  ON public.email_log (destinatario, criado_em DESC);

CREATE INDEX IF NOT EXISTS idx_email_log_status
  ON public.email_log (status, criado_em DESC);

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS email_log_admin_select ON public.email_log;
CREATE POLICY email_log_admin_select
  ON public.email_log
  FOR SELECT
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.set_email_log_atualizado()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_email_log_atualizado ON public.email_log;
CREATE TRIGGER trg_email_log_atualizado
  BEFORE UPDATE ON public.email_log
  FOR EACH ROW EXECUTE FUNCTION public.set_email_log_atualizado();
