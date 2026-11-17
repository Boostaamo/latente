import Link from "next/link";
import { site } from "@/lib/site";

export function Logo() {
  // Tekstilogo, kunnes varsinainen logo valmistuu ("Latent E": korostettu e)
  const name = site.name.toLowerCase();
  return (
    <>
      {name.slice(0, -1)}
      <span className="e">{name.slice(-1)}</span>
    </>
  );
}

export default function Header() {
  return (
    <header className="site-header">
      <div className="in header-inner">
        <Link href="/" className="logo" aria-label={`${site.name}, etusivu`}>
          <Logo />
        </Link>
        <nav aria-label="Päävalikko">
          <ul className="nav main-nav">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="link fill small-cta" href={site.headerCta.href}>
          {site.headerCta.label} <span className="ar" aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  );
}
