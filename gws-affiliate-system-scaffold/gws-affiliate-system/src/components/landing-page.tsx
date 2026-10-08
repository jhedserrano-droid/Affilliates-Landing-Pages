import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { LeadForm } from "@/components/lead-form";
import { landingContent } from "@/lib/content";

type Props = { attributionCode: string; routePath: string; heroSupplement?: ReactNode };

const journey = [
  { number: "01", label: "Contact details", title: "Get introduced." },
  { number: "02", label: "Business context", title: "Tell us more." },
  { number: "03", label: "Confirmation", title: "Thank you." },
];

export function LandingPage({ attributionCode, routePath, heroSupplement }: Props) {
  const ending = "to grow.";
  const introduction = landingContent.headline.endsWith(ending)
    ? landingContent.headline.slice(0, -ending.length)
    : null;

  return (
    <div className="shell" id="top">
      <a className="skip-link" href="#inquiry">Skip to the inquiry form</a>
      <header className="site-header">
        <div className="container nav-shell">
          <a className="brand-lockup" href="#top" aria-label="GrowthWorks Systems">
            <BrandLogo />
          </a>
          <span className="header-label">Your business. <span>Our starting point.</span></span>
        </div>
      </header>

      <main className="hero">
        <div className="hero-atmosphere" aria-hidden="true">
          <span className="atmosphere-plane plane-one" />
          <span className="atmosphere-plane plane-two" />
          <span className="atmosphere-plane plane-three" />
        </div>

        <div className="container hero-layout">
          <section className="hero-copy" aria-labelledby="hero-title">
            <p className="eyebrow"><span aria-hidden="true" />{landingContent.eyebrow}</p>
            <h1 id="hero-title">
              {introduction === null ? landingContent.headline : (
                <>{introduction}<span className="headline-finish">{ending}</span></>
              )}
            </h1>
            <p className="hero-lede">{landingContent.supporting}</p>
            <p className="hero-trust">{landingContent.trustStatement}</p>

            {heroSupplement}

            <ol className="journey" aria-label="The three steps of your inquiry">
              {journey.map((item) => (
                <li className="journey-card" key={item.number}>
                  <div className="journey-meta"><span>{item.number}</span><span>{item.label}</span></div>
                  <p>{item.title}</p>
                  <span className="journey-joint" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </section>

          <section className="capture-panel" id="inquiry" aria-label="Business inquiry">
            <LeadForm attributionCode={attributionCode} routePath={routePath} />
            <div className="panel-caption" aria-hidden="true"><span>GrowthWorks Systems</span><span>Business inquiry</span></div>
          </section>
        </div>
      </main>

      <aside className="value-strip" aria-label="The GrowthWorks approach">
        <div className="container value-strip-inner">
          <span className="value-index" aria-hidden="true">GWS /</span>
          <p>{landingContent.valueStatement}</p>
        </div>
      </aside>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand-lockup" href="#top" aria-label="GrowthWorks Systems">
            <BrandLogo compact />
          </a>
          <span>&copy; 2026 GrowthWorks Systems LLC</span>
          <nav className="footer-links" aria-label="Legal">
            <a href="https://www.growthworks-systems.com/privacy">Privacy Policy</a>
            <a href="https://www.growthworks-systems.com/terms">Terms &amp; Conditions</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
