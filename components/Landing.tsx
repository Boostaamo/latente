import data from "@/content/landing.json";
import { site } from "@/lib/site";
import LeadForm from "@/components/LeadForm";

const Arrow = () => (
  <span className="ar" aria-hidden="true">→</span>
);

function Head({ label, title, text, dark }: { label: string; title: string; text?: string; dark?: boolean }) {
  return (
    <div className="head">
      <div className="stack">
        <span className="label">{label}</span>
        <h2>{title}</h2>
      </div>
      {text && <p className={dark ? "lead" : "lead muted"}>{text}</p>}
    </div>
  );
}

function HeroDiagram() {
  const d = data.hero.diagram;
  return (
    <svg viewBox="0 0 420 380" role="img" aria-label={d.alt}>
      <g fill="none" stroke="#2B2F37" strokeWidth="1">
        <line x1="110" y1="140" x2="310" y2="140" />
        <line x1="110" y1="200" x2="310" y2="200" />
        <line x1="110" y1="260" x2="310" y2="260" />
        <line x1="110" y1="320" x2="310" y2="320" />
      </g>
      <path d="M110 80 L310 80 L310 360 L110 360 Z" fill="none" stroke="#EEEBE4" strokeWidth="1.2" />
      <line x1="60" y1="360" x2="360" y2="360" stroke="#565A61" strokeWidth="1" />
      <rect x="186" y="52" width="48" height="28" fill="#C8743C" />
      <text x="210" y="72" textAnchor="middle" className="svg-h" fontWeight="800" fontSize="18" fill="#14171D">e</text>
      <path d="M210 352 L210 86" stroke="#A9AEB5" strokeWidth="1" strokeDasharray="3 6" fill="none" />
      <path d="M186 64 C 120 64, 96 100, 96 150 L 96 330 L 110 330" stroke="#C8743C" strokeWidth="2" fill="none" />
      <path d="M234 64 C 300 64, 324 100, 324 150 L 324 330 L 310 330" stroke="#8FB3C2" strokeWidth="2" fill="none" />
      <g fontSize="13" letterSpacing="1.6" className="svg-h">
        <text x="20" y="40" fill="#C8743C" fontWeight="700">{d.winter}</text>
        <text x="20" y="58" fill="#C9CDD2" className="svg-t" letterSpacing="0" fontSize="14" fontWeight="600">{d.winterText}</text>
        <text x="400" y="40" textAnchor="end" fill="#8FB3C2" fontWeight="700">{d.summer}</text>
        <text x="400" y="58" textAnchor="end" fill="#C9CDD2" className="svg-t" letterSpacing="0" fontSize="14" fontWeight="600">{d.summerText}</text>
        <text x="218" y="300" fill="#C9CDD2" className="svg-t" letterSpacing="0" fontSize="13" fontWeight="600">{d.inside}</text>
      </g>
    </svg>
  );
}

function ProductPlate({ kind }: { kind: string }) {
  if (kind === "yard") {
    return (
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="320" height="200" fill="#14171D" />
        <path d="M150 200 L150 40 L300 40 L300 200" fill="none" stroke="#3A3F48" strokeWidth="1" />
        <rect x="30" y="120" width="96" height="44" fill="none" stroke="#C8743C" strokeWidth="1.5" />
        <path d="M42 120 L42 164 M54 120 L54 164 M66 120 L66 164 M78 120 L78 164 M90 120 L90 164 M102 120 L102 164 M114 120 L114 164" stroke="#5A3A22" strokeWidth="1" />
        <line x1="10" y1="164" x2="310" y2="164" stroke="#3A3F48" strokeWidth="1" />
        <path d="M126 142 L150 142" stroke="#C8743C" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="320" height="200" fill="#14171D" />
      <path d="M70 200 L70 90 L250 90 L250 200" fill="none" stroke="#3A3F48" strokeWidth="1" />
      <rect x="136" y="62" width="48" height="28" fill="#C8743C" />
      <path d="M120 90 L120 200 M200 90 L200 200" stroke="#2B2F37" strokeWidth="1" />
      <path d="M184 76 C 230 76, 262 96, 262 130 L262 200" stroke="#8FB3C2" strokeWidth="1.5" fill="none" />
      <path d="M136 76 C 90 76, 58 96, 58 130 L58 200" stroke="#C8743C" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default function Landing() {
  const { hero, problem, year, compare, products, services, audience, form, contact } = data;
  return (
    <>
      <section className="band dark hero">
        <div className="in">
          <div className="grid">
            <div className="stack">
              <h1>{hero.title}</h1>
              <p className="lead">{hero.lead}</p>
              <div className="row">
                <a className="link fill" href={hero.primary.href}>{hero.primary.label} <Arrow /></a>
                <a className="link line" href={hero.secondary.href}>{hero.secondary.label}</a>
              </div>
            </div>
            <div className="diagram"><HeroDiagram /></div>
          </div>
          <div className="facts">
            {hero.facts.map((f) => (
              <div key={f.value}><b>{f.value}</b><span>{f.text}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="band" id="ratkaisu">
        <div className="in problem">
          <div className="stack">
            <span className="label">{problem.label}</span>
            <h2>{problem.title}</h2>
            <p className="lead muted">{problem.text}</p>
          </div>
          <div className="bigfig">
            <b>{problem.figure}</b>
            <span>{problem.figureText}</span>
          </div>
        </div>
      </section>

      <section className="band year" id="vuosi">
        <div className="in">
          <Head label={year.label} title={year.title} text={year.text} />
          <div className="months" role="img" aria-label={year.chartAlt}>
            {year.months.map((m, i) => (
              <div key={m} className={year.coolingMonths.includes(i) ? "m c" : "m"}><i /><span>{m}</span></div>
            ))}
          </div>
          <div className="legend">
            <span><i className="sw-heat" />{year.legendHeating}</span>
            <span><i className="sw-cool" />{year.legendCooling}</span>
            <span>{year.legendNote}</span>
          </div>
          <div className="seasons">
            {[year.winter, year.summer].map((s, i) => (
              <div className="season" key={s.label}>
                <span className={i === 0 ? "k k-heat" : "k k-cool"}>{s.label}</span>
                <h3>{s.title}</h3>
                <ul>{s.items.map((t) => <li key={t}>{t}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band dark">
        <div className="in">
          <Head label={compare.label} title={compare.title} text={compare.text} dark />
          <div className="compare">
            <div className="crow h"><span>{compare.headNow}</span><span>{compare.headLatente}</span></div>
            {compare.rows.map(([now, later]) => (
              <div className="crow" key={now}><span>{now}</span><span>{later}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="band" id="tuotteet">
        <div className="in">
          <Head label={products.label} title={products.title} text={products.text} />
          <div className="products">
            {products.items.map((p) => (
              <article className="product" key={p.name}>
                <div className="plate"><ProductPlate kind={p.kind} /></div>
                <span className="meta">{p.tag}</span>
                <h3>{p.name}</h3>
                <p className="muted">{p.text}</p>
                <dl className="spec">
                  {p.spec.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band alt" id="palvelut">
        <div className="in">
          <Head label={services.label} title={services.title} text={services.text} />
          <ol className="path">
            {services.steps.map(([name, text]) => (
              <li key={name}><b>{name}</b><span>{text}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band">
        <div className="in">
          <Head label={audience.label} title={audience.title} />
          <div className="who">
            {audience.items.map(([name, text]) => (
              <div key={name}><h3>{name}</h3><p>{text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="band dark" id="taloyhtio">
        <div className="in formwrap">
          <div className="stack">
            <span className="label">{form.label}</span>
            <h2>{form.title}</h2>
            <p className="lead">{form.text}</p>
          </div>
          <LeadForm source="etusivu" title={form.formTitle} submit={form.submit} />
        </div>
      </section>

      <section className="band">
        <div className="in contact">
          <div className="stack">
            <span className="label">{contact.label}</span>
            <h2>{contact.title}</h2>
            <p className="lead muted">{contact.text}</p>
          </div>
          <div className="stack">
            {contact.people.map((p) => (
              <div className="card" key={p.name}>
                <h3>{p.name}</h3>
                {p.role && <p className="muted">{p.role}</p>}
                {p.email && <p><a href={`mailto:${p.email}`}>{p.email}</a></p>}
                {p.phone && <p><a href={`tel:+358${p.phone.replace(/\s/g, "").replace(/^0/, "")}`}>{p.phone}</a></p>}
              </div>
            ))}
            <div className="card">
              <h3>{site.legalName}</h3>
              <p className="muted">{site.address}<br />Y-tunnus {site.businessId}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
