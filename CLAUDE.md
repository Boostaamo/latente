# web-pohja: ohjeet Claudelle

Tämä on Dimman verkkosivustopohja (Next.js, App Router, TypeScript), jolla Dimma tuottaa asiakassivustot ja konsernin yhtiöiden sivustot. Projekti etenee Dimman verkkosivuprosessin mukaan (taito `dimma-verkkosivu-prosessi`, repo `dimma`). Sisältö on Markdown-tiedostoina, eikä sisällön muokkaus vaadi koodia.

## Säännöt
- Sisältö muokataan kansiossa `content/` (sivut: `content/pages/*.md`, asetukset: `content/site.json`). Älä kirjoita sisältöä koodiin.
- Tyylit ja värit ovat CSS-muuttujina tiedostossa `app/globals.css`. Vaihda design systemin arvot siellä.
- Älä lisää riippuvuuksia ilman perustetta. Pidä sivusto staattisena, kun mahdollista.
- Älä koskaan commitoi salaisuuksia tai henkilötietoja. Käytä `.env.local` (paikallinen) ja Vercelin ympäristömuuttujia. Vain `.env.example` on repossa.
- Lomakkeen liidit lähtevät reitille `app/api/lead/route.ts` ja sieltä `LEAD_WEBHOOK_URL`-osoitteeseen. Älä tallenna liidejä repoon.
- Analytiikka latautuu vain suostumuksen jälkeen. Älä lisää seurantaskriptejä ilman suostumuksen tarkistusta.
- Aja `npm run build` ennen jokaista pushia. Älä pushaa rikkinäistä koodia.
- Työskentele haarassa (`feature/...`), älä suoraan `main`-haaraan. `main` julkaistaan tuotantoon.
- Esikatselut eivät saa näkyä hakukoneissa (tämä on jo päällä: robots ja noindex).
- Tekstit: asiakassivustolla sävy ja sanasto hyväksytyn briefin mukaan; konsernin yhtiösivustolla yhtiön repon `context/tyyli.md` ja `context/sanasto.md`. Älä keksi asiakascaseja, lukuja tai referenssejä.

## Rajat
- Räätälöity taustajärjestelmä, kirjautuminen, maksut ja integraatiot tavallista lomaketta ja analytiikkaa laajemmin kuuluvat Bistekille. Pysäytä työ ja kerro, jos tarve ylittää nämä.

## Latenten sivusto: lisäohjeet

Sivusto: Latente Oy (asiakassivusto) | Domain: latente.fi (rekisteröinti <täydennä>) | Kirjaus: Latenten asiakaskortti, ei konsernin sivustorekisteriä
Tila: luonnos | Versio: v0.1 | Pvm: 2026-11-17 | Hyväksyjä: Hannu
Prosessi: Dimman verkkosivuprosessi (dimma-30…37), alkaen briefistä (Drive: Latenten asiakaskansio, 03 Toteutus ja projektityö/Verkkosivu/).

### Lähteet
- Sisältö: vain hyväksytyt tekstit (Verkkosivu/2026-11 Verkkosivun tekstit - Latente v1.docx). Jos teksti puuttuu, jätä <täydennä> ja kerro, mitä tarvitaan.
- Sävy: suomi, asukkaalle ymmärrettävä, ei teknistä jargonia, ei termiä "viileää vettä".
- Ulkoasu: Muste #14171D, Usva #EEEBE4, Kupari #C8743C, tumma kupari #9A5426, Kaste #8FB3C2. Schibsted Grotesk (600–800) otsikoihin, Source Sans 3 (vähintään 400) leipätekstiin. Tekstilogo, kunnes logo valmistuu.

### Säännöt
- Konversiopiste: kartoitus- ja yhteydenottopyyntö (analytiikassa `generate_lead`).
- Ei palvelunimiä (GFC, Grofi, Dimma ym.) sivulla. Ei "A Boostaamo Company" -merkkiä eikä ekosysteemilinkkejä: Latente ei kuulu konserniin (Hannu 17.11.2026).
- Lukuja vain todennettuina; pilotin 17 % ei käytetä, säästöväitteet tarkistetaan ennen julkaisua. Ei sanaa "ainoa", ei käyttövesilupausta.
- Tietosuoja: rekisterinpitäjä Latente Oy, tietosuoja- ja yhteysosoite hannu.savela@latente.fi (18.11.2026), liidien säilytys 24 kk, GA 14 kk.
- Ei henkilötietoja eikä liidilistan yhteystietoja repoon. Kohdesivuille (/taloyhtio/[tunniste]) vain rakennuksen julkiset tiedot ja säästöarvio.
- Kohdesivukäyntien kirjaus myyntiputkeen ja säästölaskuri: tarkista Bistek/AI Softarobotit -raja ennen toteutusta.
- Domainiin, DNS:ään ja Vercelin tuotantoasetuksiin ei kosketa ilman Hannun lupaa. Älä yhdistä main-haaraan: Hannu hyväksyy ja julkaisee.
