import { LeadForm } from "@/components/lead-form";
import { landingContent } from "@/lib/content";

type Props = {
  attributionCode: string;
  routePath: string;
};

export function LandingPage({ attributionCode, routePath }: Props) {
  return (
    <main className="shell">
      <header className="header">
        <div className="container brand">
          GrowthWorks <span>Systems</span>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">{landingContent.eyebrow}</div>
            <h1>{landingContent.headline}</h1>
            <p className="lead">{landingContent.supporting}</p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#inquiry">
                {landingContent.primaryCta}
              </a>
              <a className="btn btn-secondary" href="#how-it-works">
                See how it works
              </a>
            </div>
          </div>

          <aside className="panel" aria-label="GrowthWorks approach">
            <h2>A connected growth system</h2>
            <p>Focus on the gaps between being discovered, receiving an inquiry, responding, converting, and following up.</p>
            <div className="metric">
              <strong>Visibility</strong>
              <span>Help the right prospects find and understand you.</span>
            </div>
            <div className="metric">
              <strong>Response</strong>
              <span>Reduce the friction between interest and follow-up.</span>
            </div>
            <div className="metric">
              <strong>Conversion</strong>
              <span>Create a more consistent path from inquiry to opportunity.</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <div className="eyebrow">Where GWS helps</div>
          <h2 className="section-title">Strengthen the path prospects already take.</h2>
          <p className="section-copy">
            The goal is not another disconnected tactic. It is a cleaner operating path from discovery through follow-up.
          </p>
          <div className="cards">
            {landingContent.outcomes.map((outcome) => (
              <article className="card" key={outcome.title}>
                <h3>{outcome.title}</h3>
                <p>{outcome.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="inquiry">
        <div className="container form-wrap">
          <div>
            <div className="eyebrow">Start here</div>
            <h2 className="section-title">Tell us about your business.</h2>
            <p className="section-copy">
              Share the basics below. We will use the information to understand your current setup and coordinate the appropriate next step.
            </p>
          </div>
          <LeadForm
            attributionCode={attributionCode}
            routePath={routePath}
          />
        </div>
      </section>

      <footer className="footer">
        <div className="container">© GrowthWorks Systems</div>
      </footer>
    </main>
  );
}
