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

## Ei tässä vaiheessa
- Interaktiivinen säästölaskuri: Bistek toteuttaa (Hannu 17.11.2026).
- Käyntien kirjaus myyntiputkeen (kiinnostuspisteet): toteuttaja päättämättä. CLAUDE.md:n mukaan Bistek/AI Softarobotit -raja tarkistetaan ennen toteutusta.
- Säästöt näytetään arvioina (Hannu 17.11.2026).
