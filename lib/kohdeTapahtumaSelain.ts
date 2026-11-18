// Selaimen puolen lähetys kohdesivun tapahtumille. Ei evästeitä, ei local- tai sessionStoragea.
export type SelainTapahtuma = "avaus" | "luettu" | "jako" | "laskelma";

export function lahetaTapahtuma(kohde: string, tapahtuma: SelainTapahtuma) {
  try {
    if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true) return;
    const runko = JSON.stringify({ kohde, tapahtuma });
    // text/plain on CORS-turvallinen tyyppi, joten sendBeacon toimii kaikissa selaimissa. Palvelin lukee JSONin.
    if (navigator.sendBeacon?.("/api/tapahtuma", new Blob([runko], { type: "text/plain" }))) return;
    fetch("/api/tapahtuma", { method: "POST", body: runko, keepalive: true, credentials: "omit" }).catch(() => {});
  } catch {
    /* kirjaus ei saa koskaan estää sivun käyttöä */
  }
}
