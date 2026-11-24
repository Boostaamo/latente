-- Latente: kohdesivujen käyntitapahtumat (docs/kohdesivu-tapahtumat.md).
-- Aja Latenten omassa Supabase-projektissa (EU-alue): SQL Editor -> liitä -> Run.
-- Rivillä on vain kohde, tapahtuma, aika ja oma. Ei IP-osoitetta, User-Agentia eikä kävijätunnistetta.

create table if not exists public.kohdesivu_tapahtumat (
  id bigint generated always as identity primary key,
  kohde text not null check (kohde ~ '^[a-z0-9]{6,16}$'),
  tapahtuma text not null check (tapahtuma in ('avaus', 'luettu', 'jako', 'laskelma', 'yhteydenotto')),
  aika timestamptz not null default date_trunc('second', now()),
  oma boolean not null default false
);

create index if not exists kohdesivu_tapahtumat_aika on public.kohdesivu_tapahtumat (aika);
create index if not exists kohdesivu_tapahtumat_kohde_aika on public.kohdesivu_tapahtumat (kohde, aika);

-- Vain palvelinavain (service_role) pääsee tauluun. Julkinen anon-avain ei näe eikä kirjoita mitään.
alter table public.kohdesivu_tapahtumat enable row level security;
revoke all on public.kohdesivu_tapahtumat from anon, authenticated;

-- Kirjaus ja määrärajoitus (300 tapahtumaa / kohde / vuorokausi) yhdellä kutsulla.
create or replace function public.kirjaa_kohdesivu_tapahtuma(p_kohde text, p_tapahtuma text, p_oma boolean)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
begin
  if (select count(*) from public.kohdesivu_tapahtumat
      where kohde = p_kohde and aika >= date_trunc('day', now())) >= 300 then
    return false;
  end if;
  insert into public.kohdesivu_tapahtumat (kohde, tapahtuma, oma) values (p_kohde, p_tapahtuma, p_oma);
  return true;
end;
$$;

revoke all on function public.kirjaa_kohdesivu_tapahtuma(text, text, boolean) from public, anon, authenticated;
grant execute on function public.kirjaa_kohdesivu_tapahtuma(text, text, boolean) to service_role;

-- Säilytys 12 kk: pg_cron poistaa vanhat rivit joka yö klo 3 (UTC).
-- Ota ensin käyttöön: Database -> Extensions -> pg_cron.
create extension if not exists pg_cron;
select cron.schedule(
  'kohdesivu-tapahtumat-sailytys',
  '0 3 * * *',
  $$delete from public.kohdesivu_tapahtumat where aika < now() - interval '12 months'$$
);
