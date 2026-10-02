import type { Metadata } from "next";
import { cookies } from "next/headers";
import { BrandLogo } from "@/components/brand-logo";
import { ThankYouRedirect } from "@/components/thank-you-redirect";
import { landingContent } from "@/lib/content";
import { GWS_WEBSITE, PRIVACY_POLICY_URL, TERMS_URL, INQUIRY_RECEIPT_COOKIE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thank you | GrowthWorks Systems",
  description: "Thank you for connecting with GrowthWorks Systems.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ThankYouPage() {
  // This cookie is issued only after a successful handoff and contains no lead data.
  const received = (await cookies()).get(INQUIRY_RECEIPT_COOKIE)?.value === "received";
  return (
    <div className="shell thank-you-shell">
      <header className="site-header"><div className="container nav-shell"><a className="brand-lockup" href={GWS_WEBSITE} aria-label="GrowthWorks Systems website"><BrandLogo /></a><span className="header-label">Your business. <span>Our starting point.</span></span></div></header>
      <main className="thank-you-main" id="main">
        <section className="thank-you-card" aria-labelledby="thank-you-title">
          <div className="success-mark" aria-hidden="true">{received ? "\u2713" : "\u2197"}</div>
          <p className="thank-you-kicker">{received ? "Step 3 of 3 / Complete" : "GrowthWorks Systems"}</p>
          <h1 id="thank-you-title">{received ? landingContent.stepThree.title : "Thank you for your interest."}</h1>
          <p className="thank-you-body">{received ? landingContent.stepThree.body : "Explore how GrowthWorks Systems helps businesses attract customers, strengthen follow-up and keep relationships moving."}</p>
          {!received ? <p className="thank-you-review-note">Viewing this page directly does not confirm a form submission. Return to the inquiry form to send your information.</p> : null}
          <ThankYouRedirect />
          <a className="thank-you-return" href="/">Return to the inquiry form</a>
        </section>
      </main>
      <footer className="footer"><div className="container footer-inner"><a className="brand-lockup" href={GWS_WEBSITE} aria-label="GrowthWorks Systems website"><BrandLogo compact /></a><span>&copy; 2026 GrowthWorks Systems LLC</span><nav className="footer-links" aria-label="Legal"><a href={PRIVACY_POLICY_URL}>Privacy Policy</a><a href={TERMS_URL}>Terms &amp; Conditions</a></nav></div></footer>
    </div>
  );
}
