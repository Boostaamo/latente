"use client";

import { useEffect } from "react";
import { lahetaTapahtuma } from "@/lib/kohdeTapahtumaSelain";

/**
 * Kirjaa kohdesivulla avauksen, lukemisen loppuun (lomakkeen otsikko näkyviin) ja laskurin käytön,
 * kunkin kerran sivun latauksessa. Laskuri (Bistek) ilmoittaa käytöstä: window.dispatchEvent(new Event("kohde:laskelma")).
 */
export default function KohdeTapahtumat({ tunniste }: { tunniste: string }) {
  useEffect(() => {
    const lahetetty = new Set<string>();
    const kerran = (t: "avaus" | "luettu" | "laskelma") => {
      if (lahetetty.has(t)) return;
      lahetetty.add(t);
      lahetaTapahtuma(tunniste, t);
    };

    const naky = () => document.visibilityState === "visible" && kerran("avaus");
    naky();
    document.addEventListener("visibilitychange", naky);

    let havainnoija: IntersectionObserver | undefined;
    const kohde = document.querySelector("#kartoitus h2");
    if (kohde && "IntersectionObserver" in window) {
      havainnoija = new IntersectionObserver((e) => {
        if (e.some((x) => x.isIntersecting)) {
          kerran("luettu");
          havainnoija?.disconnect();
        }
      });
      havainnoija.observe(kohde);
    }

    const laskelma = () => kerran("laskelma");
    window.addEventListener("kohde:laskelma", laskelma);

    return () => {
      document.removeEventListener("visibilitychange", naky);
      window.removeEventListener("kohde:laskelma", laskelma);
      havainnoija?.disconnect();
    };
  }, [tunniste]);

  return null;
}
