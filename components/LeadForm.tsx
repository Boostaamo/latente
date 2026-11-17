"use client";

import { FormEvent, useState } from "react";
import { track } from "@/lib/analytics";

type Status = "idle" | "sending" | "ok" | "error";

export default function LeadForm({ source }: { source: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const params = new URLSearchParams(window.location.search);

    const payload = {
      housingCompany: data.get("housingCompany"),
      address: data.get("address"),
      role: data.get("role"),
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: data.get("message"),
      marketingConsent: data.get("marketingConsent") === "on",
      website: data.get("website"), // honeypot
      source,
      page: window.location.pathname,
      referrer: document.referrer,
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      utm_term: params.get("utm_term") ?? "",
      utm_content: params.get("utm_content") ?? "",
    };

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error || "Lähetys epäonnistui. Yritä uudelleen.");
        return;
      }
      setStatus("ok");
      form.reset();
      track("generate_lead", { form_source: source });
    } catch {
      setStatus("error");
      setError("Verkkovirhe. Yritä uudelleen.");
    }
  }

  if (status === "ok") {
    return (
      <p className="notice" role="status">
        Kiitos! Olemme sinuun yhteydessä pian.
      </p>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="housingCompany">Taloyhtiö</label>
        <input id="housingCompany" name="housingCompany" type="text" placeholder="Esim. As Oy Esimerkkitalo" autoComplete="organization" maxLength={200} />
      </div>
      <div className="field">
        <label htmlFor="address">Osoite</label>
        <input id="address" name="address" type="text" placeholder="Katuosoite ja postinumero" autoComplete="street-address" maxLength={300} />
      </div>
      <div className="field">
        <label htmlFor="role">Roolisi</label>
        <select id="role" name="role" defaultValue="">
          <option value="">Valitse</option>
          <option>Hallituksen puheenjohtaja</option>
          <option>Hallituksen jäsen</option>
          <option>Isännöitsijä</option>
          <option>Osakas tai asukas</option>
          <option>Kiinteistöjohtaja tai omistaja</option>
          <option>Muu</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="name">Nimi</label>
        <input id="name" name="name" type="text" autoComplete="name" maxLength={200} />
      </div>
      <div className="field">
        <label htmlFor="email">Sähköposti *</label>
        <input id="email" name="email" type="email" placeholder="nimi@esimerkki.fi" autoComplete="email" required maxLength={200} />
      </div>
      <div className="field">
        <label htmlFor="phone">Puhelin</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={50} />
      </div>
      <div className="field">
        <label htmlFor="message">Viesti</label>
        <textarea id="message" name="message" rows={5} maxLength={4000} />
      </div>
      {/* Honeypot: piilotettu oikeilta käyttäjiltä */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Älä täytä tätä kenttää</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field checkbox">
        <input id="marketingConsent" name="marketingConsent" type="checkbox" />
        <label htmlFor="marketingConsent">
          Latente saa lähettää minulle tietoa ratkaisusta. Voin perua luvan milloin tahansa.
        </label>
      </div>
      <p className="small">
        Kerro taloyhtiön nimi tai osoite. Käsittelemme tietoja <a href="/tietosuoja">tietosuojaselosteen</a> mukaisesti.
      </p>
      <button className="button" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Lähetetään…" : "Lähetä"}
      </button>
      {status === "error" && (
        <p className="error" role="alert">{error}</p>
      )}
    </form>
  );
}
