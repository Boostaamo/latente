import type { Metadata } from "next";
import "./globals.css";
import { Schibsted_Grotesk, Source_Sans_3 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { isProduction, site } from "@/lib/site";

// Fontit ladataan buildissa ja tarjoillaan omalta palvelimelta (ei pyyntöjä Googlelle kävijän selaimesta).
const heading = Schibsted_Grotesk({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-heading", display: "swap" });
const body = Source_Sans_3({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-body-src", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.tagline,
  openGraph: { siteName: site.name, locale: site.locale, type: "website" },
  // Esikatselut ja kehitysympäristö pidetään pois hakukoneista
  robots: isProduction ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    url: site.url,
  };
  return (
    <html lang="fi" className={`${heading.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#sisalto">Siirry sisältöön</a>
        <Header />
        <main id="sisalto">{children}</main>
        <Footer />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
