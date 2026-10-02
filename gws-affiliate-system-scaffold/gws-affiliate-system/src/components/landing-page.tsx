import { LeadForm } from "@/components/lead-form";
import { landingContent } from "@/lib/content";

type Props = {
  attributionCode: string;
  routePath: string;
};

const outcomes = [
  {
    number: "01",
    title: "Get discovered",
    body: "Strengthen the places buyers use to find and understand your business, from search to AI-assisted discovery.",
  },
  {
    number: "02",
    title: "Capture intent",
    body: "Create a cleaner path from interest to inquiry without unnecessary friction or confusing handoffs.",
  },
  {
    number: "03",
    title: "Move faster",
    body: "Reduce the gap between a new inquiry and the next useful action for your team and your customer.",
  },
  {
    number: "04",
    title: "Keep momentum",
    body: "Connect follow-up, conversion and retention so opportunities do not disappear between disconnected systems.",
  },
];

export function LandingPage({ attributionCode, routePath }: Props) {
  return (
    <main className="shell">
      <header className="site-header">
        <div className="container nav-shell">
          <a className="brand-lockup" href="#top" aria-label="GrowthWorks Systems home">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-mark-core" />
            </span>
            <span className="brand-copy">
              <strong>GrowthWorks</strong>
              <span>Systems</span>
            </span>
          </a>

          <a className="header-cta" href="#inquiry">
            Start your review
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid-overlay" aria-hidden="true" />
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />

        <div className="container hero-layout">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              {landingContent.eyebrow}
            </div>

            <h1>
              Growth should feel
              <span className="headline-accent"> connected.</span>
            </h1>

            <p className="hero-lede">{landingContent.supporting}</p>

            <div className="hero-actions">
              <a className="button button-primary" href="#inquiry">
                Start with your business
                <span className="button-icon" aria-hidden="true">→</span>
              </a>
              <a className="text-link" href="#system">
                See the system
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="hero-trust">
              <span className="trust-line" aria-hidden="true" />
              <p>{landingContent.trustStatement}</p>
            </div>
          </div>

          <div className="system-visual" aria-label="Connected Revenue Infrastructure illustration">
            <div className="visual-orbit visual-orbit-large" />
            <div className="visual-orbit visual-orbit-medium" />
            <div className="visual-orbit visual-orbit-small" />

            <div className="visual-node node-top">
              <span className="node-index">01</span>
              <strong>Visibility</strong>
              <small>Be found</small>
            </div>

            <div className="visual-node node-right">
              <span className="node-index">02</span>
              <strong>Capture</strong>
              <small>Catch intent</small>
            </div>

            <div className="visual-node node-bottom">
              <span className="node-index">03</span>
              <strong>Response</strong>
              <small>Move faster</small>
            </div>

            <div className="visual-node node-left">
              <span className="node-index">04</span>
              <strong>Growth</strong>
              <small>Compound</small>
            </div>

            <div className="visual-core">
              <span className="visual-core-kicker">Revenue</span>
              <strong>Infrastructure</strong>
              <span className="visual-core-caption">Nine domains. One system.</span>
            </div>
          </div>
        </div>

        <div className="container signal-strip" aria-label="GrowthWorks Systems approach">
          <span>Visibility</span>
          <span>Lead Capture</span>
          <span>Response</span>
          <span>Conversion</span>
          <span>Retention</span>
          <span>AI Visibility</span>
        </div>
      </section>

      <section className="system-section" id="system">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" aria-hidden="true" />
                The business problem
              </div>
              <h2>Most growth leaks happen between the tools.</h2>
            </div>
            <p>
              {landingContent.valueStatement} The goal is not another isolated tactic. It is a
              stronger operating path from discovery through follow-up.
            </p>
          </div>

          <div className="outcome-grid">
            {outcomes.map((outcome) => (
              <article className="outcome-card" key={outcome.number}>
                <div className="outcome-topline">
                  <span>{outcome.number}</span>
                  <span className="outcome-arrow" aria-hidden="true">↗</span>
                </div>
                <h3>{outcome.title}</h3>
                <p>{outcome.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="diagnostic-section" id="inquiry">
        <div className="diagnostic-glow" aria-hidden="true" />
        <div className="container diagnostic-layout">
          <div className="diagnostic-copy">
            <div className="eyebrow eyebrow-light">
              <span className="eyebrow-dot" aria-hidden="true" />
              Start here
            </div>
            <h2>A diagnostic, not a pitch.</h2>
            <p>
              Give us the essentials first. Then tell us what is getting in the way of growth.
              The experience stays focused on your business, not a preselected service.
            </p>

            <div className="diagnostic-points">
              <div>
                <span className="diagnostic-point-index">01</span>
                <span>Share the essentials</span>
              </div>
              <div>
                <span className="diagnostic-point-index">02</span>
                <span>Tell us what matters</span>
              </div>
              <div>
                <span className="diagnostic-point-index">03</span>
                <span>We review the whole path</span>
              </div>
            </div>
          </div>

          <LeadForm attributionCode={attributionCode} routePath={routePath} />
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand-lockup footer-brand" href="#top" aria-label="GrowthWorks Systems">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-mark-core" />
            </span>
            <span className="brand-copy">
              <strong>GrowthWorks</strong>
              <span>Systems</span>
            </span>
          </a>

          <div className="footer-meta">
            <span>© 2026 GrowthWorks Systems LLC</span>
            <a href="https://www.growthworks-systems.com/privacy">Privacy</a>
            <a href="https://www.growthworks-systems.com/terms">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
