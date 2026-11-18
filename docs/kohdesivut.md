# Kohdesivut (/taloyhtio/[tunniste])

Jokaisella myyntikohteella (taloyhtiö) on oma sivu osoitteessa `/taloyhtio/<tunniste>`. Tunniste on satunnainen kahdeksan merkin koodi, joten sivuja ei voi arvata rakennustunnuksesta tai osoitteesta. Kooditaulukko (tunniste → kohde) on vain Latentella, **ei tässä repossa**.

## Data
- `content/taloyhtiot/<tunniste>.json`: yksi tiedosto kohdetta kohden. Vain rakennuksen julkiset tiedot ja säästöarvio. Ei rakennustunnusta, Y-tunnusta, henkilöitä eikä yhteystietoja.
- `content/taloyhtio.json`: kaikkien kohdesivujen yhteiset tekstit (`{nimi}`, `{alue}`, `{osoite}` korvataan).
- `public/taloyhtio/kuvat/<tunniste>.jpg`: rakennuksen kuva (valinnainen, `kuva`-kenttä). Lähde ja lisenssi merkitään `kuva.lahde`-kenttään.

Datan tuottaa Latenten skripti `Kiinteistöhaku/skriptit/taloyhtio_json.py` Drive-kansioon `03 Toteutus ja projektityö/Kohdesivusto/julkaistava/taloyhtio/`. Uusi kohde lisätään kopioimalla tiedosto tänne omassa haarassaan ja pull requestina.

## Laskelma
`lib/taloyhtiot.ts`: investointi verollisena (alv 25,5 %) taloyhtiön lainalla (annuiteetti), säästö ja lainaerä jaetaan asuinpinta-alan mukaan (arvio 80 % kerrosalasta). Taulukko 40, 60 ja 80 m² asunnoille lasketaan buildissa, eikä sivulla ole interaktiivista laskuria.

## Tietosuoja
- Ei evästeitä, analytiikkaa eikä evästebanneria kohdesivuilla (`components/Analytics.tsx`).
- `noindex` (meta ja `X-Robots-Tag`), `robots.txt` estää `/taloyhtio/`, ei sitemapissa, `Referrer-Policy: no-referrer`.
- Tuntematon tunniste antaa tavallisen 404-sivun (`dynamicParams = false`).
- Kartoituspyyntö kulkee sivuston tavallisen liidilomakkeen kautta (`source = taloyhtio/<tunniste>`).

## Käyntien kirjaus
Ohje: [`docs/kohdesivu-tapahtumat.md`](kohdesivu-tapahtumat.md). Toteutus:
- `components/KohdeTapahtumat.tsx` (avaus, luettu, laskelma) ja `components/JakoPainike.tsx` (jako), lähetys `lib/kohdeTapahtumaSelain.ts`. Laskuri ilmoittaa käytöstä `window.dispatchEvent(new Event("kohde:laskelma"))`.
- `app/api/tapahtuma/route.ts` tarkistaa ja tallentaa, `app/api/lead/route.ts` kirjaa `yhteydenotto`.
- `lib/tapahtumat.ts`: Upstash Redis REST (ei kirjastoa), lista `tapahtumat:YYYY-MM`, vanhenee 13 kk. Raja 300 tapahtumaa/kohde/vrk.
- `GET /api/tapahtuma/vienti?alkaen=YYYY-MM-DD` ja `Authorization: Bearer <VIENTI_AVAIN>`.
- Ilman Redis-muuttujia tapahtumia ei tallenneta (sivu toimii normaalisti).

## Ei tässä vaiheessa
- Interaktiivinen säästölaskuri: Bistek toteuttaa (Hannu 17.11.2026).
- Säästöt näytetään arvioina (Hannu 17.11.2026).
