"use client";

import { useRef, useState } from "react";
import { lahetaTapahtuma } from "@/lib/kohdeTapahtumaSelain";

/** Kopioi kohdesivun osoitteen ilman lisäparametreja ja kirjaa jaon (enintään 5 kertaa sivun latauksessa). */
export default function JakoPainike({ tunniste, teksti, kopioitu }: { tunniste: string; teksti: string; kopioitu: string }) {
  const [valmis, setValmis] = useState(false);
  const [osoiteNakyviin, setOsoiteNakyviin] = useState("");
  const kerrat = useRef(0);

  const jaa = async () => {
    const osoite = `${window.location.origin}${window.location.pathname}`;
    try {
      await navigator.clipboard.writeText(osoite);
    } catch {
      // Leikepöytä ei käytettävissä: näytetään osoite, jonka voi kopioida itse.
      setOsoiteNakyviin(osoite);
    }
    setValmis(true);
    window.setTimeout(() => setValmis(false), 2500);
    if (kerrat.current < 5) {
      kerrat.current += 1;
      lahetaTapahtuma(tunniste, "jako");
    }
  };

  return (
    <p className="jako">
      <button type="button" className="link" onClick={jaa} aria-live="polite">
        {valmis && !osoiteNakyviin ? kopioitu : teksti}
      </button>
      {osoiteNakyviin && <span className="jako-osoite">{osoiteNakyviin}</span>}
    </p>
  );
}
