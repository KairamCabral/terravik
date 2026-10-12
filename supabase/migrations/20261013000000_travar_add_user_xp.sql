-- Fecha a função add_user_xp.
--
-- Ela é SECURITY DEFINER e estava executável por qualquer um com a chave
-- pública do site: dava para somar (ou, com valor negativo, tirar) pontos de
-- qualquer usuário, sem login, só conhecendo o id dele.
--
-- Agora:
-- - visitante sem login não executa;
-- - usuário logado só mexe no PRÓPRIO perfil, com valor de 1 a 500 por vez;
-- - o servidor (service role, usado pelo webhook de pedidos) segue sem limite.

create or replace function public.add_user_xp(p_user_id uuid, p_xp_amount integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_xp integer;
  v_new_level integer;
begin
  -- auth.uid() é nulo nas chamadas do servidor (service role).
  if auth.uid() is not null then
    if auth.uid() <> p_user_id then
      raise exception 'sem permissão para alterar outro usuário' using errcode = '42501';
    end if;
    if p_xp_amount is null or p_xp_amount < 1 or p_xp_amount > 500 then
      raise exception 'valor de XP fora do permitido' using errcode = '22023';
    end if;
  end if;

  update public.profiles
  set xp_total = xp_total + p_xp_amount,
      updated_at = now()
  where id = p_user_id
  returning xp_total into v_new_xp;

  if v_new_xp is null then
    return;
  end if;

  -- level = floor(sqrt(xp / 100)) + 1
  v_new_level := floor(sqrt(greatest(v_new_xp, 0)::float / 100))::integer + 1;

  update public.profiles
  set level = v_new_level
  where id = p_user_id and level <> v_new_level;
end;
$$;

revoke all on function public.add_user_xp(uuid, integer) from public, anon;
grant execute on function public.add_user_xp(uuid, integer) to authenticated, service_role;
