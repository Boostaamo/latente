/**
 * Latente: lomakkeen yhteydenotot sähköpostiin (Google Apps Script).
 * Pohjana Liekki Partnersin toimiva skripti (11.11.2026).
 *
 * Käyttöönotto:
 * 1. script.google.com: New project, liitä tämä koodi. Tee skripti sillä Google-tilillä,
 *    jolta posti halutaan lähettää (nyt hannu@dimma.fi, myöhemmin Latenten oma tili).
 * 2. Project Settings, Script properties: lisää SECRET (sama arvo kuin Vercelin LEAD_WEBHOOK_SECRET).
 *    Valinnainen: SHEET_ID = Google Sheets -taulukon tunniste, jos yhteydenotot halutaan myös taulukkoon.
 * 3. Aja kerran funktio testi() editorista ja hyväksy käyttöoikeudet. Tarkista, että testiviesti tuli perille.
 * 4. Deploy, New deployment, Web app. Execute as: Me. Who has access: Anyone.
 * 5. Kopioi Web app -osoite Vercelin muuttujaan LEAD_WEBHOOK_URL (Sensitive) ja julkaise uusi deployment.
 * Muutosten jälkeen: Deploy, Manage deployments, Edit, Version: New version (muuten vanha koodi jää käyttöön).
 * Salaisuutta ei kirjoiteta koodiin. Säilytys: poista yli 24 kk vanhat yhteydenotot postista ja taulukosta.
 */
// Väliaikaisesti hannu@dimma.fi, kunnes latente.fi-sähköposti toimii (Hannu 17.11.2026). Vaihda sitten hannu.savela@latente.fi.
const TO = "hannu@dimma.fi";
const SENDER_NAME = "Latente-lomake";
const SUBJECT = "Latente: uusi yhteydenotto";

// Poistaa rivinvaihdot ja muuttaa linkit tekstiksi (ei http-alkuja), jotta runko ei sisällä klikattavia linkkejä.
function clean(v) {
  return String(v || "-").replace(/[\r\n]+/g, " ").replace(/https?:\/\//gi, "").trim() || "-";
}

function doPost(e) {
  let lead;
  try {
    lead = JSON.parse(e.postData.contents);
  } catch (err) {
    return out({ ok: false });
  }
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty("SECRET");
  if (!secret || lead.secret !== secret) return out({ ok: false });

  send(lead);

  const sheetId = props.getProperty("SHEET_ID");
  if (sheetId) {
    const u = lead.utm || {};
    SpreadsheetApp.openById(sheetId).getSheets()[0].appendRow([
      lead.receivedAt, lead.housingCompany, lead.address, lead.role, lead.name, lead.email,
      lead.phone, lead.message, lead.marketingConsent ? "kyllä" : "ei", lead.page, lead.source,
      lead.referrer, [u.source, u.medium, u.campaign, u.term, u.content].join(" / "),
    ].map(function (v) { return String(v || ""); }));
  }
  return out({ ok: true });
}

function send(lead) {
  const u = lead.utm || {};
  const body = [
    "Uusi yhteydenotto latente.fi-sivulta",
    "",
    "Taloyhtiö: " + clean(lead.housingCompany),
    "Osoite: " + clean(lead.address),
    "Rooli: " + clean(lead.role),
    "Nimi: " + clean(lead.name),
    "Sähköposti: " + clean(lead.email),
    "Puhelin: " + clean(lead.phone),
    "Markkinointilupa: " + (lead.marketingConsent ? "kyllä" : "ei"),
    "Viesti: " + String(lead.message || "-").replace(/https?:\/\//gi, ""),
    "",
    "Sivu: " + clean(lead.page) + " (" + clean(lead.source) + ")",
    "Viittaaja: " + clean(lead.referrer),
    "UTM: " + [u.source, u.medium, u.campaign, u.term, u.content].map(clean).join(" / "),
    "Vastaanotettu: " + clean(lead.receivedAt),
  ].join("\n");

  MailApp.sendEmail({
    to: TO,
    name: SENDER_NAME,
    replyTo: clean(lead.email),
    subject: SUBJECT,
    body: body,
  });
}

// Aja editorista: lähettää testiviestin ilman verkkopyyntöä.
function testi() {
  send({
    housingCompany: "Testi", address: "-", role: "Muu", name: "Testi", email: TO, phone: "",
    message: "Testiviesti Apps Scriptin editorista.", marketingConsent: false,
    page: "/", source: "testi", referrer: "", utm: {}, receivedAt: new Date().toISOString(),
  });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
