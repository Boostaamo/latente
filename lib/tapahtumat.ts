// Kohdesivujen käyntitapahtumat (docs/kohdesivu-tapahtumat.md).
// Tallennus Upstash Redisiin sen REST-rajapinnan kautta (ei erillistä kirjastoa).
// Rivillä on vain kohde, tapahtuma, aika ja oma. Ei IP-osoitetta, User-Agentia, Refereriä eikä kävijätunnistetta.
// Älä lokita pyyntöjä: virheet ohitetaan hiljaa.

export const SELAIN_TAPAHTUMAT = ["avaus", "luettu", "jako", "laskelma"] as const;
export type Tapahtuma = (typeof SELAIN_TAPAHTUMAT)[number] | "yhteydenotto";
export type Rivi = { kohde: string; tapahtuma: Tapahtuma; aika: string; oma: boolean };

const SAILYTYS_S = 13 * 31 * 24 * 60 * 60; // kuukausilista vanhenee 13 kk jälkeen (säilytys 12 kk)
const RAJA_VRK = 300; // tapahtumia vuorokaudessa samalle kohteelle

function yhteys(): { url: string; token: string } | null {
  // Vercelin Upstash-integraatio lisää KV_REST_API_*-muuttujat; suoraan Upstashista UPSTASH_REDIS_REST_*.
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export const tallennusKaytossa = () => yhteys() !== null;

async function pipeline(komennot: (string | number)[][]): Promise<{ result?: unknown; error?: string }[]> {
  const y = yhteys();
  if (!y) return [];
  const res = await fetch(`${y.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${y.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(komennot),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${res.status}`);
  return (await res.json()) as { result?: unknown; error?: string }[];
}

const kuukausi = (d: Date) => d.toISOString().slice(0, 7);

/** Tallentaa tapahtuman. Ei koskaan heitä virhettä: kirjaus ei saa estää sivun tai lomakkeen käyttöä. */
export async function tallenna(kohde: string, tapahtuma: Tapahtuma): Promise<void> {
  try {
    const nyt = new Date();
    const raja = `raja:${kohde}:${nyt.toISOString().slice(0, 10)}`;
    const [maara] = await pipeline([
      ["INCR", raja],
      ["EXPIRE", raja, 2 * 24 * 60 * 60],
    ]);
    if (typeof maara?.result !== "number" || maara.result > RAJA_VRK) return;
    const rivi: Rivi = {
      kohde,
      tapahtuma,
      aika: nyt.toISOString().replace(/\.\d{3}Z$/, "Z"),
      oma: process.env.VERCEL_ENV !== "production",
    };
    const avain = `tapahtumat:${kuukausi(nyt)}`;
    await pipeline([
      ["RPUSH", avain, JSON.stringify(rivi)],
      ["EXPIRE", avain, SAILYTYS_S],
    ]);
  } catch {
    /* ohitetaan hiljaa */
  }
}

/** Palauttaa rivit annetusta päivästä alkaen, vanhimmasta uusimpaan. Heittää virheen, jos tallennus ei vastaa. */
export async function vienti(alkaen: Date): Promise<Rivi[]> {
  const nyt = new Date();
  const kuukaudet: string[] = [];
  const d = new Date(Date.UTC(alkaen.getUTCFullYear(), alkaen.getUTCMonth(), 1));
  while (d <= nyt && kuukaudet.length < 14) {
    kuukaudet.push(kuukausi(d));
    d.setUTCMonth(d.getUTCMonth() + 1);
  }
  if (!kuukaudet.length) return [];
  const tulokset = await pipeline(kuukaudet.map((k) => ["LRANGE", `tapahtumat:${k}`, 0, -1]));
  const raja = alkaen.toISOString();
  const rivit: Rivi[] = [];
  for (const t of tulokset) {
    if (t.error) throw new Error("Redis");
    for (const s of (t.result as string[] | null) ?? []) {
      try {
        const r = JSON.parse(s) as Rivi;
        if (r.aika >= raja) rivit.push({ kohde: r.kohde, tapahtuma: r.tapahtuma, aika: r.aika, oma: r.oma });
      } catch {
        /* rikkinäinen rivi ohitetaan */
      }
    }
  }
  return rivit.sort((a, b) => (a.aika < b.aika ? -1 : a.aika > b.aika ? 1 : 0));
}
