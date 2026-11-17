import Link from "next/link";
import { site } from "@/lib/site";
import ConsentReopen from "@/components/ConsentReopen";
import { Logo } from "@/components/Header";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="in footer-row">
        <div className="col">
          <span className="logo footer-logo"><Logo /></span>
          <span>{site.tagline}</span>
        </div>
        <div className="col">
          <span>{site.legalName} · Y-tunnus {site.businessId}</span>
          <span>{site.address}</span>
          <ul className="nav">
            {site.footerLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            {process.env.NEXT_PUBLIC_GA_ID ? <li><ConsentReopen /></li> : null}
          </ul>
        </div>
      </div>
      {site.boostaamoBadge && site.ecosystem.length > 0 && (
        <div className="in ecosystem">
          <p><strong>A Boostaamo Company</strong></p>
          <ul className="nav">
            {site.ecosystem.map((e: { label: string; href: string }) => (
              <li key={e.href}>
                <a href={e.href} rel="noopener">{e.label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </footer>
  );
}
