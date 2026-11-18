Tila: luonnos | Versio: v1 | Pvm: 17.11.2026 (päivitetty 18.11.2026) | Lähde: Latenten Kohdesivusto-kansio | Tekijä: Claude Hannu Savelan pyynnöstä | Vastaanottaja: verkkosivujen kehittäjä

# Latente: käyntien kirjaus kiinnostuspisteisiin, ohje kehittäjälle

## Tiivistelmä

- Kohdesivut (`/taloyhtio/<tunniste>`) kirjaavat **taloyhtiön tasolla**, mitä sivulla tehdään: avaus, laskurin käyttö, sivun lukeminen loppuun, linkin kopiointi ja kartoituspyyntö.
- Sivusto **ei laske pisteitä**. Se tallentaa tapahtumat ja tarjoaa suojatun viennin. Latenten oma putki (`kiinnostus.py`, ei tässä repossa) laskee pisteet ja vie ne CRM:ään.
- **Ei evästeitä, ei selaimen muistia, ei IP-osoitetta, ei henkilötunnisteita, ei kolmansien osapuolten skriptejä.** Siksi evästebanneria ei tarvita.
- Työ tehdään repoon `Boostaamo/latente` omaan haaraan (`feature/kohdesivu-tapahtumat`) pull requestina. Pohjana on PR #3 (kohdesivut). Repon `CLAUDE.md`-ohjeita noudatetaan.
- Arvio: 1–1,5 työpäivää ilman laskuria. Bistek tekee interaktiivisen laskurin (Hannu 17.11.2026). Laskurin tapahtuma `laskelma` lisätään samalla.

## 1. Kokonaisuus

```
Kohdesivu (selain)                 Sivusto (Vercel)                         Latente
-------------------                ----------------                         -------
avaus / luettu / jako /  ── POST ─► /api/tapahtuma                          
laskelma                           tarkistaa ja tallentaa ──► tietokanta    
                                                                  │         
Kartoituslomake ───────── POST ─► /api/lead (olemassa)            │         
                                   + tapahtuma "yhteydenotto" ────┘         
                                                                  │         
                                   /api/tapahtuma/vienti ◄── GET ─┴── päivittäinen haku
                                   (API-avain)                         → kiinnostus.py → CRM
```

## 2. Tapahtumat

| Tapahtuma | Milloin sivu lähettää | Rajoitus selaimessa |
|---|---|---|
| `avaus` | Sivu on latautunut ja näkyvissä (`document.visibilityState === "visible"`) | kerran sivun latauksessa |
| `luettu` | Kävijä on vierittänyt lomakeosioon asti (IntersectionObserver lomakkeen otsikkoon) | kerran sivun latauksessa |
| `jako` | Kävijä kopioi sivun linkin jakopainikkeella | jokainen painallus, enintään 5 latauksessa |
| `laskelma` | Kävijä muuttaa laskurin arvoa (Bistekin laskuri) | kerran sivun latauksessa |
| `yhteydenotto` | Kartoituspyyntö on lähetetty onnistuneesti. **Palvelin kirjaa tämän**, ei selain. | – |

"Kerran sivun latauksessa" pidetään vain muuttujassa sivun muistissa. **Älä käytä `localStorage`-, `sessionStorage`- tai evästeitä**, koska sivulla luvataan, ettei evästeitä käytetä.

Pisteytyksen säännöt (vain tiedoksi, toteutetaan Latenten päässä): avaus 10, paluu 5/vrk, laskelma 10/vrk, luettu 5/vrk, jako 15, yhteydenotto 40, puoliintuminen 30 vrk, katto 100. Sama taloyhtiö saa ensimmäisestä avauksesta 10 pistettä ja seuraavista paluukäynneistä 5. Tämän vuoksi sivusto ei tarvitse kävijätunnistetta.

## 3. Selaimen puoli

Lisää kohdesivulle pieni asiakaskomponentti, esimerkiksi `components/KohdeTapahtumat.tsx`, jolle annetaan propsina tunniste.

```ts
function laheta(tapahtuma: "avaus" | "luettu" | "jako" | "laskelma") {
  const runko = JSON.stringify({ kohde: tunniste, tapahtuma });
  // sendBeacon toimii myös, kun sivu suljetaan. Ei evästeitä (credentials: "omit").
  if (!navigator.sendBeacon?.("/api/tapahtuma", new Blob([runko], { type: "application/json" }))) {
    fetch("/api/tapahtuma", { method: "POST", body: runko, headers: { "Content-Type": "application/json" },
      keepalive: true, credentials: "omit" }).catch(() => {});
  }
}
```

- Jos selain lähettää Global Privacy Control -signaalin (`navigator.globalPrivacyControl === true`), älä lähetä tapahtumia lainkaan.
- Virheet ohitetaan hiljaa. Kirjaus ei saa koskaan estää sivun käyttöä.
- Jakopainike: nykyinen sivu ei vielä sisällä jakopainiketta. Lisää se mallisivun mukaan (`malli/kohdesivu-prototyyppi.html`), ja se kopioi sivun osoitteen ilman lisäparametreja.

## 4. Palvelimen puoli: `app/api/tapahtuma/route.ts`

Pyyntö: `{ "kohde": "9y65eckm", "tapahtuma": "avaus" }`

Tarkistukset:
1. Rungon koko enintään 1 kt. Muuten 413.
2. `kohde` löytyy julkaistuista tunnisteista (`listTunnisteet()` tiedostosta `lib/taloyhtiot.ts`). Muuten 204 tallentamatta (ei virheviestiä, jotta tunnisteita ei voi kokeilla).
3. `tapahtuma` on listalla `avaus | luettu | jako | laskelma`. `yhteydenotto` ei kelpaa tästä reitistä.
4. `Origin`- tai `Sec-Fetch-Site`-otsake vastaa omaa sivustoa. Muuten 204 tallentamatta.
5. Hakukonerobotit ja esilataukset (`Purpose: prefetch`, `Sec-Purpose: prefetch`, tunnetut bot-merkkijonot User-Agentissa) ohitetaan. **User-Agentia ei tallenneta.**
6. Määrärajoitus **tunnisteen** mukaan, ei IP:n mukaan: enintään 300 tapahtumaa vuorokaudessa samalle kohteelle. Ylimenevät ohitetaan.

Tallennettava rivi, ei muuta:

```json
{ "kohde": "9y65eckm", "tapahtuma": "avaus", "aika": "2026-11-17T14:31:20Z", "oma": false }
```

- `aika` lisätään palvelimella (UTC, sekunnin tarkkuus).
- `oma` on `true`, kun `process.env.VERCEL_ENV !== "production"`. Esikatselut ja paikallinen kehitys merkitään siis omiksi käynneiksi. Latenten väki katsoo sivuja esikatselulinkistä, jolloin heidän käyntinsä eivät nosta pisteitä.
- **Älä tallenna IP-osoitetta, User-Agentia, Refereriä, maata tai mitään tunnistetta.** Älä kirjoita pyyntöjä sovelluslokiin (`console.log`).

Vastaus aina `204 No Content`.

### Kartoituspyyntö (`yhteydenotto`)

Lomake lähettää jo nyt reitille `app/api/lead/route.ts` kentän `source: "taloyhtio/<tunniste>"`. Lisää reittiin: kun liidi on välitetty onnistuneesti ja `source` alkaa `taloyhtio/` ja tunniste on julkaistu, tallenna tapahtuma `yhteydenotto` samalla funktiolla. **Lomakkeen henkilötiedot (nimi, rooli, sähköposti, puhelin, viesti) eivät tule tapahtumaan.** Ne kulkevat edelleen vain `LEAD_WEBHOOK_URL`-osoitteeseen.

## 5. Tallennus

- Käytä Vercelin Marketplacen tietokantaa: Upstash Redis tai Neon Postgres. Kumpikin käy. Lisää riippuvuus vain sen kirjastoon (`@upstash/redis` tai `@neondatabase/serverless`) ja kirjaa peruste PR:n kuvaukseen.
- Säilytysaika **12 kuukautta**. Redisissä: yksi lista kuukautta kohden (`tapahtumat:2026-11`) ja TTL 13 kk. Postgresissa: Vercel Cron kerran vuorokaudessa poistaa yli 12 kk vanhat rivit.
- Yhteystiedot tietokantaan ympäristömuuttujina (Vercelin integraatio lisää ne). Ei salaisuuksia repoon.
- Tuotantoympäristön tietokannan ja ympäristömuuttujien lisääminen Verceliin vaatii Hannun luvan (repon `CLAUDE.md`). Tee ensin esikatseluympäristöön.

## 6. Vienti Latentelle: `app/api/tapahtuma/vienti/route.ts`

- `GET /api/tapahtuma/vienti?alkaen=2026-11-01` ja otsake `Authorization: Bearer <VIENTI_AVAIN>`.
- `VIENTI_AVAIN` on ympäristömuuttuja (vähintään 32 satunnaista merkkiä). Väärä tai puuttuva avain: 401. Vertailu vakioajassa (`crypto.timingSafeEqual`).
- Palauttaa JSON-listan rivejä täsmälleen tallennetussa muodossa: `[{ "kohde", "tapahtuma", "aika", "oma" }]`, vanhimmasta uusimpaan.
- `Cache-Control: no-store`. Reitti ei saa näkyä hakukoneissa (`/api/` on jo kielletty `robots.ts`-tiedostossa).

Latente hakee viennin päivittäin. `kiinnostus.py` lukee juuri tämän muodon, muuttaa tunnisteen kohteeksi Latenten omalla koodilistalla (ei sivustolla eikä repossa) ja laskee pisteet CRM:n `kiinnostus.json`-tiedostoon. Kehittäjän ei tarvitse tietää, mitä taloyhtiötä tunniste vastaa.

Lisää `.env.example`-tiedostoon tyhjinä: `VIENTI_AVAIN=` ja tietokannan muuttujien nimet.

## 7. Sivun tietosuojateksti päivitetään

Nykyinen teksti (`content/taloyhtio.json`, kenttä `tietosuoja`) sanoo, ettei sivu käytä seurantaa. Se ei pidä paikkaansa kirjauksen jälkeen. Ehdotettu uusi teksti, **Hannu hyväksyy ennen julkaisua**:

> Tämä sivu on tehty taloyhtiönne käyttöön. Sivu ei käytä evästeitä, eikä se näy hakukoneissa. Kirjaamme taloyhtiön tasolla, kuinka sivua on käytetty (esimerkiksi avaukset ja kartoituspyynnöt), jotta osaamme ottaa yhteyttä oikeaan aikaan. Emme kirjaa IP-osoitetta emmekä tunnista yksittäistä kävijää. Tiedot säilytetään 12 kuukautta. Arvio perustuu julkisiin tietoihin eikä ole sitova tarjous. Lisätietoja ja yhteydenottojen kielto: hannu.savela@latente.fi.

Tietosuojaselosteeseen lisätään sama kuvaus (rekisterinpitäjä Latente Oy, peruste oikeutettu etu B2B-myynnissä).

## 8. Hyväksymiskriteerit

- [ ] Avaus, luettu, jako ja laskelma tallentuvat kerran sivun latauksessa (jako painalluksittain). Sivun uudelleenlataus tuottaa uuden avauksen.
- [ ] Kartoituspyyntö tuottaa tapahtuman `yhteydenotto` ilman lomakkeen henkilötietoja.
- [ ] Selaimen kehitystyökaluissa ei näy evästeitä eikä local- tai sessionStorage-merkintöjä kohdesivulla.
- [ ] Tietokannan riveillä on vain `kohde`, `tapahtuma`, `aika` ja `oma`.
- [ ] Tuntematon tunniste, väärä tapahtuma, väärä Origin ja botti eivät tallennu.
- [ ] GPC-signaali estää lähetyksen.
- [ ] Vienti ilman avainta palauttaa 401 ja avaimella listan oikeassa muodossa.
- [ ] Esikatselun tapahtumilla `oma: true`, tuotannon tapahtumilla `false`.
- [ ] 12 kk säilytys on toteutettu (TTL tai ajastettu poisto).
- [ ] `npm run build` menee läpi, ja muutos on PR:ssä. Hannu yhdistää ja julkaisee.

## 9. Avoimet

1. Tietokannan valinta (Upstash Redis vai Neon Postgres): kehittäjä ehdottaa, Hannu hyväksyy Vercelin tuotantoasetukset.
2. Tietosuojatekstin hyväksyntä (kohta 7).
3. Vercelin omien palvelinlokien säilytysaika tarkistetaan. Lokit voivat sisältää IP-osoitteen, vaikka sovellus ei tallenna sitä.
