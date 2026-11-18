import { listTunnisteet } from "@/lib/taloyhtiot";
import { SELAIN_TAPAHTUMAT, tallenna, type Tapahtuma } from "@/lib/tapahtumat";

// Kohdesivun käyntitapahtuma (docs/kohdesivu-tapahtumat.md, kohta 4). Vastaus on aina 204,
// jotta tunnisteita ei voi kokeilla. Pyyntöjä ei lokiteta, eikä IP-osoitetta tai User-Agentia tallenneta.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 1024;
const BOTIT = /bot|crawl|spider|slurp|preview|fetch|curl|wget|python|headless|lighthouse|monitor|facebookexternalhit|embedly|whatsapp|skype|teams/i;

const tyhja = (status = 204) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });

function omaSivusto(req: Request): boolean {
  const site = req.headers.get("sec-fetch-site");
  if (site) return site === "same-origin";
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  try {
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}

function esilatausTaiBotti(req: Request): boolean {
  const purpose = `${req.headers.get("purpose") ?? ""} ${req.headers.get("sec-purpose") ?? ""}`;
  if (/prefetch|prerender/i.test(purpose)) return true;
  return BOTIT.test(req.headers.get("user-agent") ?? "");
}

export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES) return tyhja(413);
  const teksti = await req.text().catch(() => "");
  if (new TextEncoder().encode(teksti).length > MAX_BYTES) return tyhja(413);
  if (!omaSivusto(req) || esilatausTaiBotti(req)) return tyhja();

  let runko: { kohde?: unknown; tapahtuma?: unknown };
  try {
    runko = JSON.parse(teksti);
  } catch {
    return tyhja();
  }
  const { kohde, tapahtuma } = runko;
  if (typeof kohde !== "string" || typeof tapahtuma !== "string") return tyhja();
  if (!(SELAIN_TAPAHTUMAT as readonly string[]).includes(tapahtuma)) return tyhja();
  if (!listTunnisteet().includes(kohde)) return tyhja();

  await tallenna(kohde, tapahtuma as Tapahtuma);
  return tyhja();
}
