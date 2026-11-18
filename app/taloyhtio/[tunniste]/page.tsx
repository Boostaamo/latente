import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JakoPainike from "@/components/JakoPainike";
import KohdeTapahtumat from "@/components/KohdeTapahtumat";
import LeadForm from "@/components/LeadForm";
import { getTaloyhtio, kohdeTekstit as T, laskelma, listTunnisteet, tayta } from "@/lib/taloyhtiot";

// Vain repossa olevat kohteet; tuntematon tunniste antaa tavallisen 404-sivun.
export const dynamicParams = false;

export function generateStaticParams() {
  return listTunnisteet().map((tunniste) => ({ tunniste }));
}

type Props = { params: Promise<{ tunniste: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tunniste } = await params;
  const t = getTaloyhtio(tunniste);
  if (!t) return {};
  // Kohdesivut eivät näy hakukoneissa eikä niitä jaeta somessa esikatseluna (ei OG-tietoja).
  return { title: t.nimi, robots: { index: false, follow: false, nocache: true } };
}

const nf = new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("fi-FI", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const eur = (v: number, pyor = 1) => `${nf.format(Math.round(v / pyor) * pyor)} €`;
const kk = (v: number) => `${v > 0.5 ? "+" : v < -0.5 ? "−" : ""}${nf.format(Math.abs(Math.round(v)))} €/kk`;

export default async function TaloyhtioPage({ params }: Props) {
  const { tunniste } = await params;
  const t = getTaloyhtio(tunniste);
  if (!t) notFound();
  const l = laskelma(t);
  const r60 = l.rivit.find((r) => r.m2 === 60) ?? l.rivit[0];

  const fakta: [string, string][] = [
    ["Valmistunut", String(t.talo.valmistunut)],
    ["Asuntoja", nf.format(t.talo.asunnot)],
    ...(t.talo.kerroksia ? [["Kerroksia", String(t.talo.kerroksia)] as [string, string]] : []),
    ["Kerrosala", `${nf.format(t.talo.kerrosala_m2)} m²`],
    ["Lämmitys", t.talo.lammitys],
    ...(t.talo.ilmanvaihto ? [["Ilmanvaihto", t.talo.ilmanvaihto] as [string, string]] : []),
    ["Lämmönkulutus, arvio", `${nf.format(t.talo.kulutus_mwh_v)} MWh/v`],
    ["Lämmityskustannus, arvio", `${eur(t.talo.kustannus_eur_v, 100)}/v`],
    ...(t.talo.hellepaivat_v ? [["Hellepäiviä", `${nf1.format(t.talo.hellepaivat_v)} vuodessa`] as [string, string]] : []),
  ];

  return (
    <div className="kohde">
      <KohdeTapahtumat tunniste={t.tunniste} />
      <section className="band dark kohde-hero">
        <div className="in kohde-hero-grid">
          <div className="kohde-hero-teksti">
            <p className="label">{tayta(T.eyebrow, t)}</p>
            <h1>{tayta(T.otsikko, t)}</h1>
            <p className="lead">{tayta(T.ingressi, t)}</p>
            <dl className="kohde-luvut">
              <div><dt>Säästö kaukolämmössä</dt><dd>noin {eur(t.arvio.nettosaasto_eur_v, 100)}/v</dd></div>
              <div><dt>Takaisinmaksuaika</dt><dd>noin {nf1.format(l.takaisinmaksu)} v</dd></div>
              <div><dt>60 m²:n asunnon vastike</dt><dd>noin {kk(r60.lainanAikana)}</dd></div>
            </dl>
            <p className="muted kohde-pieni">
              Hinta-arvio {eur(l.hintaAlv, 1000)} (sis. alv 25,5 %). Vastike lainan aikana ({t.arvio.laina_v} v, korko {nf1.format(t.arvio.korko * 100)} %), lainan jälkeen {kk(r60.lainanJalkeen)}.
            </p>
            <JakoPainike tunniste={t.tunniste} teksti={T.jako_nappi} kopioitu={T.jako_kopioitu} />
          </div>
          {t.kuva && (
            <figure className="kohde-kuva">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.kuva.src} alt={t.kuva.alt} width={900} height={700} />
              <figcaption>
                {t.kuva.teksti} <span>Lähde: {t.kuva.lahde}.</span>
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <section className="band">
        <div className="in kohde-osio">
          <h2>{T.talo_otsikko}</h2>
          <dl className="spec kohde-spec">
            {fakta.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          {t.lahteet && <p className="muted kohde-pieni">Lähteet: {t.lahteet}</p>}
        </div>
      </section>

      <section className="band alt">
        <div className="in kohde-osio">
          <h2>{T.asukas_otsikko}</h2>
          <p>{T.asukas_teksti}</p>
          <div className="kohde-taulukko">
            <table>
              <thead>
                <tr><th scope="col">Asunnon koko</th><th scope="col">Hoitovastike</th><th scope="col">Rahoitusvastike</th><th scope="col">Yhteensä lainan aikana</th><th scope="col">Lainan jälkeen</th></tr>
              </thead>
              <tbody>
                {l.rivit.map((r) => (
                  <tr key={r.m2}>
                    <th scope="row">{r.m2} m²</th>
                    <td>{kk(-r.hoito)}</td>
                    <td>{kk(r.rahoitus)}</td>
                    <td><b>{kk(r.lainanAikana)}</b></td>
                    <td><b>{kk(r.lainanJalkeen)}</b></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {l.viilennysKk !== null && l.viilennysAlv !== null && (
            <p>
              <b>Kesäviilennys</b> on lisävaruste: noin {eur(l.viilennysAlv, 100)} asuntoa kohden, samalla lainalla noin {kk(l.viilennysKk)}.
            </p>
          )}
          <p className="muted kohde-pieni">{T.asukas_huomio}</p>
        </div>
      </section>

      <section className="band">
        <div className="in kohde-osio">
          <h2>{T.miten_otsikko}</h2>
          <div className="kohde-kaksi">
            <div className="card"><h3>Talvella</h3><p>{T.talvi}</p></div>
            <div className="card"><h3>Kesällä</h3><p>{T.kesa}</p></div>
          </div>
          <p>{T.asennus}</p>
        </div>
      </section>

      <section className="band alt">
        <div className="in kohde-osio">
          <h2>{T.polku_otsikko}</h2>
          <ol className="path">
            {T.polku.map((p) => (
              <li key={p.otsikko}><b>{p.otsikko}</b><span>{p.teksti}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band dark" id="kartoitus">
        <div className="in formwrap">
          <div className="kohde-osio">
            <h2>{T.lomake_otsikko}</h2>
            <p>{T.lomake_teksti}</p>
          </div>
          <LeadForm
            source={`taloyhtio/${t.tunniste}`}
            submit={T.lomake_nappi}
            defaults={{ housingCompany: t.nimi, address: t.osoite }}
          />
        </div>
      </section>

      <section className="band">
        <div className="in kohde-osio">
          <p className="muted kohde-pieni">{T.tietosuoja} Tiedot päivitetty {t.paivitetty.split("-").reverse().map(Number).join(".")}.</p>
        </div>
      </section>
    </div>
  );
}
