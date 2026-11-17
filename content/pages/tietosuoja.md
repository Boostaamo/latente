---
title: "Tietosuojaseloste | {{SIVUSTO}}"
description: "Miten {{SIVUSTO}} käsittelee verkkosivuston lomakkeilla ja analytiikkaevästeillä kerättäviä tietoja."
noindex: true
updated: "{{PAIVITETTY_ISO}}"
---

<!--
  BOOSTAAMO-KONSERNIN TIETOSUOJASELOSTEPOHJA v0.1 (2026-11-12), LUONNOS
  Ei juristin tarkistama. Ohje ja parametrit: boostaamo-core/verkkosivut/tietosuoja.md

  1. Korvaa kaikki {{PARAMETRI}}-kohdat. Tarkistus: grep -n "{{" content/pages/tietosuoja.md
  2. Jokaisesta VALITSE-ryhmästä jätä vain sivustoa koskevat vaihtoehdot ja poista loput
     VAIHTOEHTO-merkintöineen. Tarkistus: grep -n "VALITSE\|VAIHTOEHTO" content/pages/tietosuoja.md
  3. Poista noindex, kun seloste on hyväksytty. Poista lopuksi myös tämä kommentti.
-->

# Tietosuojaseloste

Päivitetty: {{PAIVITETTY}}

## Rekisterinpitäjä

{{YHTIO}} ({{SIVUSTO}}), Y-tunnus {{Y_TUNNUS}}, {{OSOITE}}.

Yhteyshenkilö tietosuoja-asioissa: {{YHTEYSHENKILO}}, {{SAHKOPOSTI}}.

Tämä seloste koskee sivustoa {{DOMAIN}}.
<!-- VAIHTOEHTO: Boostaamo-konsernin yhtiö --> {{SIVUSTO}} on osa Boostaamo-yhtiöitä.

## Mitä tietoja keräämme ja miksi

<!-- VALITSE: jätä sivuston lomakkeita vastaavat kohdat (yksi tai useampi) -->

<!-- VAIHTOEHTO: yhteydenottolomake -->
- **Yhteydenottolomake:** nimi, sähköposti, yritys ja viesti{{LISAKENTAT}} sekä tieto siitä, miltä sivulta ja mistä markkinointikanavasta (UTM-tunnisteet) lomake lähetettiin. Käytämme tietoja yhteydenottoosi vastaamiseen ja mahdollisen yhteistyön valmisteluun.
<!-- VAIHTOEHTO: testi tai katsastus -->
- **{{TESTIN_NIMI}}:** yhteystietosi ja vastauksesi. Käytämme niitä tuloksen laatimiseen, sen toimittamiseen sinulle ja tuloksen läpikäyntiin kanssasi.
<!-- VAIHTOEHTO: tapahtuma tai webinaari -->
- **Tapahtumailmoittautuminen:** nimi, sähköposti ja yritys. Käytämme tietoja ilmoittautumisen hoitamiseen, tapahtumakutsuihin ja tallenteen lähettämiseen.
<!-- VAIHTOEHTO: uutiskirje -->
- **Uutiskirje:** sähköposti ja nimi. Lähetämme uutiskirjeen vain, jos olet tilannut sen. Voit perua tilauksen jokaisen viestin lopussa olevasta linkistä.
<!-- VAIHTOEHTO: analytiikka käytössä -->
- **Analytiikka:** kävijämäärät ja sivujen käyttö Google Analyticsilla, vain jos hyväksyt analytiikkaevästeet. Emme yhdistä analytiikkatietoja lomakkeella antamiisi tietoihin.

## Käsittelyn oikeusperuste

<!-- VALITSE: jätä edellistä kohtaa vastaavat rivit -->
- Yhteydenotot, testit ja tapahtumailmoittautumiset: oikeutettu etu. Kun otat meihin yhteyttä tai pyydät meiltä jotain, voimme perustellusti käsitellä tietojasi vastataksemme sinulle ja hoitaaksemme asiaa.
- Uutiskirje: suostumuksesi.
- Analytiikka: suostumuksesi.

Voit peruuttaa suostumuksesi milloin tahansa. Peruutus ei vaikuta ennen sitä tehtyyn käsittelyyn.

## Mihin tiedot tallennetaan ja kuka niitä käsittelee

<!-- VALITSE YKSI: lomakkeen käsittely -->

<!-- VAIHTOEHTO: sähköposti (Google Apps Script) -->
Lomakkeella lähetetyt tiedot välitetään sähköpostina yhteydenottoja käsittelevälle henkilölle. Niitä käsittelevät vain yhteydenottoja hoitavat henkilöt.
<!-- VAIHTOEHTO: liidirekisteri (taulukko, CRM tai muu järjestelmä) -->
Lomakkeella lähetetyt tiedot tallennetaan liidirekisteriin ({{LIIDIREKISTERI}}), ja niistä lähtee ilmoitus yhteydenottoja käsittelevälle henkilölle. Niitä käsittelevät vain yhteydenottoja hoitavat henkilöt.

<!-- VALITSE YKSI (vain Boostaamo-konsernin sivustot; asiakassivustolta poista koko ryhmä): tietojen käyttö Boostaamo-yhtiöissä -->

<!-- VAIHTOEHTO: ei muille yhtiöille (oletus) -->
Emme luovuta tietojasi muille Boostaamo-yhtiöille ilman pyyntöäsi.
<!-- VAIHTOEHTO: konsernin sivusto tai yhteinen palvelu -->
Jos pyydät jonkin Boostaamo-yhtiön palvelua, välitämme tarvittavat tiedot sille yhtiölle, joka palvelun tuottaa. Muuten emme luovuta tietoja muille yhtiöille.

Emme myy tietoja emmekä luovuta niitä kolmansille osapuolille markkinointiin.

Käytämme seuraavia palveluntarjoajia, jotka käsittelevät tietoja puolestamme:

- Vercel Inc. (sivuston ylläpito)
- {{PALVELUNTARJOAJAT}}

Palveluntarjoajat voivat käsitellä tietoja myös EU:n ja ETA:n ulkopuolella, erityisesti Yhdysvalloissa. Siirrot perustuvat EU:n ja Yhdysvaltojen väliseen tietosuojakehykseen (EU-U.S. Data Privacy Framework) tai Euroopan komission hyväksymiin vakiosopimuslausekkeisiin.

## Säilytysaika

Säilytämme yhteydenoton tiedot enintään {{SAILYTYSAIKA_KK}} kuukautta viimeisestä yhteydenotosta, ellei niistä synny asiakassuhdetta. Asiakassuhteen tietoja säilytetään sopimuksen ja lain edellyttämän ajan.
<!-- VAIHTOEHTO: uutiskirje --> Uutiskirjeen tilaajan tiedot säilytetään, kunnes tilaus perutaan.
<!-- VAIHTOEHTO: analytiikka käytössä --> Google Analyticsin tiedot säilyvät {{GA_SAILYTYS_KK}} kuukautta.

## Oikeutesi

Sinulla on oikeus tarkastaa, oikaista ja poistaa tietosi, rajoittaa ja vastustaa niiden käsittelyä sekä siirtää tiedot järjestelmästä toiseen. Voit myös peruuttaa suostumuksesi. Ota yhteyttä: {{SAHKOPOSTI}}.

Jos katsot, että tietojesi käsittely rikkoo tietosuojalainsäädäntöä, voit tehdä valituksen tietosuojavaltuutetun toimistolle ([tietosuoja.fi](https://tietosuoja.fi)).

## Evästeet

<!-- VALITSE YKSI -->
<!-- VAIHTOEHTO: analytiikka käytössä -->
Käytämme analytiikkaevästeitä vain, jos hyväksyt ne. Voit muuttaa valintaasi milloin tahansa sivun alalaidan kohdasta "Evästeasetukset".
<!-- VAIHTOEHTO: ei analytiikkaa -->
Sivusto ei käytä analytiikka- eikä markkinointievästeitä.

## Selosteen muutokset

Päivitämme selostetta, kun tietojen käsittely muuttuu. Voimassa oleva versio on aina tällä sivulla.
