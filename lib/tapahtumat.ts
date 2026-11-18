// Kohdesivujen käyntitapahtumat (docs/kohdesivu-tapahtumat.md).
// Tallennus Supabaseen (EU) sen REST-rajapinnan kautta (ei erillistä kirjastoa), kuten muissakin sivustoissa.
// Taulu ja funktio: supabase/migrations/20261118_kohdesivu_tapahtumat.sql. Latenten tiedot omassa Supabase-projektissaan.
// Rivillä on vain kohde, tapahtuma, aika ja oma. Ei IP-osoitetta, User-Agentia, Refereriä eikä kävijätunnistetta.
// Älä lokita pyyntöjä: virheet ohitetaan hiljaa.

export const SELAIN_TAPAHTUMAT = ["avaus", "luettu", "jako", "laskelma"] as const;
export type Tapahtuma = (typeof SELAIN_TAPAHTUMAT)[number] | "yhteydenotto";
export type Rivi = { kohde: string; tapahtuma: Tapahtuma; aika: string; oma: boolean };

function yhteys(): { url: string; avain: string; skeema: string } | null {
  // Vercelin Supabase-integraatio lisää SUPABASE_URL- ja SUPABASE_SERVICE_ROLE_KEY-muuttujat.
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const avain = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Valinnainen: jos tapahtumat ovat yhteisen projektin omassa skeemassa, skeeman nimi (oletus public).
  const skeema = process.env.SUPABASE_TAPAHTUMA_SKEEMA || "public";
  return url && avain ? { url: url.replace(/\/$/, ""), avain, skeema } : null;
}

export const tallennusKaytossa = () => yhteys() !== null;

function otsakkeet(y: { avain: string; skeema: string }): Record<string, string> {
  return {
    apikey: y.avain,
    Authorization: `Bearer ${y.avain}`,
    "Content-Type": "application/json",
    "Accept-Profile": y.skeema,
    "Content-Profile": y.skeema,
  };
}

/** Tallentaa tapahtuma. Ei koskaan heitä virhettä: kirjaus ei saa estää sivun tai lomakkeen käyttöä. */
export async function tallenna(kohde: string, tapahtuma: Tapahtuma): Promise<void> {
  const y = yhteys();
  if (!y) return;
  try {
    await fetch(`${y.url}/rest/v1/rpc/kirjaa_kohdesivu_tapahtuma`, {
      method: "POST",
      headers: otsakkeet(y),
      body: JSON.stringify({ p_kohde: kohde, p_tapahtuma: tapahtuma, p_oma: process.env.VERCEL_ENV !== "production" }),
      cache: "no-store",
    });
  } catch {
    /* ohitetaan hiljaa */
  }
}

/** Palauttaa rivit annetusta hetkestä alkaen, vanhimmasta uusimpaan. Heittää virheen, jos tallennus ei vastaa. */
export async function vienti(alkaen: Date): Promise<Rivi[]> {
  const y = yhteys();
  if (!y) return [];
  const rivit: Rivi[] = [];
  const sivu = 1000;
  for (let alku = 0; alku < 200_000; alku += sivu) {
    const q = new URLSearchParams({
      select: "kohde,tapahtuma,aika,oma",
      aika: `gte.${alkaen.toISOString()}`,
      order: "aika.asc,id.asc",
    });
    const res = await fetch(`${y.url}/rest/v1/kohdesivu_tapahtumat?${q}`, {
      headers: { ...otsakkeet(y), Range: `${alku}-${alku + sivu - 1}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}`);
    const osa = (await res.json()) as Rivi[];
    for (const r of osa) {
      // Aika samaan muotoon kuin ohjeessa: UTC, sekunnin tarkkuus.
      rivit.push({ kohde: r.kohde, tapahtuma: r.tapahtuma, aika: new Date(r.aika).toISOString().replace(/\.\d{3}Z$/, "Z"), oma: r.oma });
    }
    if (osa.length < sivu) break;
  }
  return rivit;
}
