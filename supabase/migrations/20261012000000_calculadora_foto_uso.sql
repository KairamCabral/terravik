-- Cota da análise de foto da calculadora.
--
-- Cada análise chama um serviço pago de IA. O limite em memória do middleware
-- não vale entre instâncias da Vercel, então a cota fica no banco: um contador
-- por visitante por dia e um contador geral por dia.
--
-- A tabela não guarda foto nem IP. A coluna `chave` é um HMAC do IP com um
-- segredo do servidor, calculado na rota: não dá para voltar ao IP a partir
-- dele. A linha '*' é o contador geral do dia.

create table if not exists public.calculadora_foto_uso (
  dia date not null,
  chave text not null,
  total integer not null default 0,
  primary key (dia, chave)
);

comment on table public.calculadora_foto_uso is
  'Contadores diários da análise de foto da calculadora. Sem foto e sem IP.';

-- RLS ligada e sem política: só a service role (rota do servidor) enxerga.
alter table public.calculadora_foto_uso enable row level security;

revoke all on table public.calculadora_foto_uso from anon, authenticated;
grant all on table public.calculadora_foto_uso to service_role;

-- Conta uma análise e diz se ela pode acontecer.
-- Devolve 'ok', 'pessoa' (o visitante passou do limite do dia) ou 'geral'
-- (o site passou do limite do dia). Incrementa e confere na mesma transação,
-- para duas requisições simultâneas não passarem juntas pelo limite.
create or replace function public.registrar_uso_da_foto(
  p_chave text,
  p_limite_pessoa integer,
  p_limite_geral integer
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dia date := (now() at time zone 'America/Sao_Paulo')::date;
  v_pessoa integer;
  v_geral integer;
begin
  if p_chave is null or length(p_chave) < 16 or p_chave = '*' then
    raise exception 'chave inválida';
  end if;

  insert into public.calculadora_foto_uso (dia, chave, total)
  values (v_dia, p_chave, 1)
  on conflict (dia, chave) do update set total = calculadora_foto_uso.total + 1
  returning total into v_pessoa;

  if v_pessoa > p_limite_pessoa then
    return 'pessoa';
  end if;

  insert into public.calculadora_foto_uso (dia, chave, total)
  values (v_dia, '*', 1)
  on conflict (dia, chave) do update set total = calculadora_foto_uso.total + 1
  returning total into v_geral;

  if v_geral > p_limite_geral then
    return 'geral';
  end if;

  -- Faxina: contadores com mais de 30 dias não servem para nada.
  delete from public.calculadora_foto_uso where dia < v_dia - 30;

  return 'ok';
end;
$$;

revoke all on function public.registrar_uso_da_foto(text, integer, integer) from public, anon, authenticated;
grant execute on function public.registrar_uso_da_foto(text, integer, integer) to service_role;
