import fs from "node:fs";
import path from "node:path";
import tekstit from "@/content/taloyhtio.json";

// Kohdesivut: content/taloyhtiot/<tunniste>.json. Tunniste on satunnainen koodi, jota ei voi arvata
// rakennustunnuksesta tai osoitteesta. Kooditaulukko (tunniste -> kohde) on vain Latentella, ei tässä repossa.
const DIR = path.join(process.cwd(), "content", "taloyhtiot");
const TUNNISTE = /^[a-z0-9]{6,16}$/;

export type Taloyhtio = {
  tunniste: string;
  nimi: string;
  alue: string;
  osoite: string;
  paivitetty: string;
  talo: {
    valmistunut: number;
    asunnot: number;
    kerroksia?: number;
    kerrosala_m2: number;
    asuinala_m2_arvio: number;
    lammitys: string;
    ilmanvaihto?: string;
    kulutus_mwh_v: number;
    kustannus_eur_v: number;
    lammitystarveluku?: number;
    hellepaivat_v?: number;
  };
  arvio: {
    nettosaasto_eur_v: number;
    hinta_alv0: number;
    alv: number;
    laina_v: number;
    korko: number;
    viilennys_eur_asunto_alv0?: number;
  };
  kuva?: { src: string; alt: string; teksti?: string; lahde: string };
  lahteet?: string;
};

export function listTunnisteet(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.slice(0, -5))
    .filter((t) => TUNNISTE.test(t));
}

export function getTaloyhtio(tunniste: string): Taloyhtio | null {
  if (!TUNNISTE.test(tunniste)) return null;
  const f = path.join(DIR, `${tunniste}.json`);
  if (!fs.existsSync(f)) return null;
  return JSON.parse(fs.readFileSync(f, "utf8")) as Taloyhtio;
}

export const kohdeTekstit = tekstit;

export function tayta(s: string, t: Taloyhtio): string {
  const arvot: Record<string, string> = { nimi: t.nimi, alue: t.alue, osoite: t.osoite };
  return s.replace(/\{(\w+)\}/g, (m, k: string) => arvot[k] ?? m);
}

// Laskelma: investointi verollisena taloyhtiön lainalla (annuiteetti), säästö ja laina jaetaan asuinpinta-alan mukaan.
export function laskelma(t: Taloyhtio) {
  const a = t.arvio;
  const hintaAlv = a.hinta_alv0 * (1 + a.alv);
  const af = a.korko / (1 - Math.pow(1 + a.korko, -a.laina_v));
  const era = hintaAlv * af;
  const asunnotKoot = [40, 60, 80];
  const rivit = asunnotKoot.map((m2) => {
    const osuus = m2 / t.talo.asuinala_m2_arvio;
    const hoito = (a.nettosaasto_eur_v * osuus) / 12;
    const rahoitus = (era * osuus) / 12;
    return { m2, hoito, rahoitus, lainanAikana: rahoitus - hoito, lainanJalkeen: -hoito };
  });
  const viilennysKk = a.viilennys_eur_asunto_alv0 ? (a.viilennys_eur_asunto_alv0 * (1 + a.alv) * af) / 12 : null;
  return {
    hintaAlv,
    takaisinmaksu: hintaAlv / a.nettosaasto_eur_v,
    saastoAsuntoKk: a.nettosaasto_eur_v / t.talo.asunnot / 12,
    rivit,
    viilennysKk,
    viilennysAlv: a.viilennys_eur_asunto_alv0 ? a.viilennys_eur_asunto_alv0 * (1 + a.alv) : null,
  };
}
