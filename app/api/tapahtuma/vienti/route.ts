import { timingSafeEqual } from "node:crypto";
import { tallennusKaytossa, vienti } from "@/lib/tapahtumat";

// Latenten päivittäinen haku (docs/kohdesivu-tapahtumat.md, kohta 6).
// GET /api/tapahtuma/vienti?alkaen=2026-11-01, otsake Authorization: Bearer <VIENTI_AVAIN>.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const otsakkeet = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

function avainOk(req: Request): boolean {
  const oikea = process.env.VIENTI_AVAIN ?? "";
  if (oikea.length < 32) return false;
  const annettu = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(annettu);
  const b = Buffer.from(oikea);
  // Pituusvertailu ensin, koska timingSafeEqual vaatii saman pituuden; verrataan silti aina.
  return timingSafeEqual(a.length === b.length ? a : b, b) && a.length === b.length;
}

export async function GET(req: Request) {
  if (!avainOk(req)) return Response.json({ virhe: "Ei oikeutta." }, { status: 401, headers: otsakkeet });

  const p = new URL(req.url).searchParams.get("alkaen");
  const alkaen = p && /^\d{4}-\d{2}-\d{2}$/.test(p) ? new Date(`${p}T00:00:00Z`) : new Date(Date.now() - 30 * 864e5);
  if (Number.isNaN(alkaen.getTime())) return Response.json({ virhe: "Tarkista alkaen-päivä." }, { status: 400, headers: otsakkeet });
  if (!tallennusKaytossa()) return Response.json({ virhe: "Tallennus ei ole käytössä." }, { status: 503, headers: otsakkeet });

  try {
    return Response.json(await vienti(alkaen), { headers: otsakkeet });
  } catch {
    return Response.json({ virhe: "Tallennus ei vastaa." }, { status: 503, headers: otsakkeet });
  }
}
