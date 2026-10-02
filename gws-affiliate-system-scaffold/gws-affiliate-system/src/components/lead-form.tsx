"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { landingContent } from "@/lib/content";

type Props = {
  attributionCode: string;
  routePath: string;
};

type TrackingContext = {
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};

type FormState = "idle" | "submitting" | "success" | "error";

const emptyTracking: TrackingContext = {
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
};

export function LeadForm({ attributionCode, routePath }: Props) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<FormState>("idle");
  const [tracking, setTracking] = useState<TrackingContext>(emptyTracking);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTracking({
      referrer: document.referrer,
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      utmTerm: params.get("utm_term") ?? "",
      utmContent: params.get("utm_content") ?? "",
    });
  }, []);

  const progress = useMemo(() => ((step - 1) / 2) * 100, [step]);

  function continueToQualification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    setState("idle");
    setStep(2);

    requestAnimationFrame(() => {
      document.getElementById("qualification-title")?.focus();
    });
  }

  async function submitQualification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const firstForm = document.getElementById("lead-contact-form") as HTMLFormElement | null;
    const qualificationForm = event.currentTarget;

    if (!firstForm || !firstForm.reportValidity()) {
      setStep(1);
      setState("error");
      return;
    }

    const contactData = Object.fromEntries(new FormData(firstForm).entries());
    const qualificationData = Object.fromEntries(new FormData(qualificationForm).entries());

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...contactData,
          ...qualificationData,
          interests: selectedInterests,
          attributionCode,
          routePath,
          ...tracking,
        }),
      });

      if (!response.ok) {
        setState("error");
        return;
      }

      firstForm.reset();
      qualificationForm.reset();
      setSelectedInterests([]);
      setState("success");
      setStep(3);
    } catch {
      setState("error");
    }
  }

  function toggleInterest(value: string) {
    setSelectedInterests((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  return (
    <div className="funnel-card">
      <div className="funnel-progress" aria-label={`Step ${step} of 3`}>
        <div className="progress-meta">
          <span>Business review</span>
          <span>{String(step).padStart(2, "0")} / 03</span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      {step === 1 ? (
        <form
          className="funnel-step"
          id="lead-contact-form"
          onSubmit={continueToQualification}
        >
          <div className="step-heading">
            <span>{landingContent.stepOne.kicker}</span>
            <h3>{landingContent.stepOne.title}</h3>
            <p>{landingContent.stepOne.body}</p>
          </div>

          <div className="field-grid">
            <label className="field-shell">
              <span>First name <b>*</b></span>
              <input
                name="firstName"
                autoComplete="given-name"
                required
                maxLength={80}
                placeholder="First name"
              />
            </label>

            <label className="field-shell">
              <span>Last name <b>*</b></span>
              <input
                name="lastName"
                autoComplete="family-name"
                required
                maxLength={80}
                placeholder="Last name"
              />
            </label>

            <label className="field-shell field-wide">
              <span>Business name <b>*</b></span>
              <input
                name="businessName"
                autoComplete="organization"
                required
                maxLength={180}
                placeholder="Business name"
              />
            </label>

            <label className="field-shell">
              <span>Email <b>*</b></span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@business.com"
              />
            </label>

            <label className="field-shell">
              <span>Phone <small>optional</small></span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={80}
                placeholder="+1 555 555 0100"
              />
            </label>

            <div className="honeypot" aria-hidden="true">
              <label htmlFor="companyFax">Company fax</label>
              <input
                id="companyFax"
                name="companyFax"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="consent-copy">
            <p>
              {landingContent.inquiryDisclosure} See our{" "}
              <a href="https://www.growthworks-systems.com/privacy">Privacy Policy</a> and{" "}
              <a href="https://www.growthworks-systems.com/terms">Terms &amp; Conditions</a>.
            </p>
            <small>Phone is optional. Leave it blank if you prefer not to share a phone number.</small>
          </div>

          {state === "error" ? (
            <p className="form-error" role="alert">{landingContent.captureError}</p>
          ) : null}

          <button className="form-submit" type="submit">
            <span>{landingContent.stepOne.submit}</span>
            <span className="submit-arrow" aria-hidden="true">→</span>
          </button>
        </form>
      ) : null}

      {step === 2 ? (
        <form className="funnel-step" onSubmit={submitQualification}>
          <div className="step-heading">
            <span>{landingContent.stepTwo.kicker}</span>
            <h3 id="qualification-title" tabIndex={-1}>{landingContent.stepTwo.title}</h3>
            <p>{landingContent.stepTwo.body}</p>
          </div>

          <div className="field-grid">
            <label className="field-shell">
              <span>Business type <small>optional</small></span>
              <input
                name="businessType"
                maxLength={160}
                placeholder="Industry or customers you serve"
              />
            </label>

            <label className="field-shell">
              <span>Team size <small>optional</small></span>
              <select name="teamSize" defaultValue="">
                <option value="">Choose an option</option>
                <option value="just_me">Just me</option>
                <option value="2_5">2 to 5</option>
                <option value="6_10">6 to 10</option>
                <option value="11_25">11 to 25</option>
                <option value="26_50">26 to 50</option>
                <option value="51_plus">51 or more</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </label>

            <label className="field-shell">
              <span>Service area <small>optional</small></span>
              <input
                name="serviceArea"
                maxLength={200}
                placeholder="City, region or wider market"
              />
            </label>

            <label className="field-shell">
              <span>Website <small>optional</small></span>
              <input
                name="websiteUrl"
                type="url"
                maxLength={300}
                placeholder="https://"
              />
            </label>

            <label className="field-shell field-wide">
              <span>What would you most like to improve? <small>optional</small></span>
              <textarea
                name="priority"
                maxLength={800}
                placeholder="Tell us the main goal or challenge in a sentence or two."
              />
            </label>
          </div>

          <fieldset className="interest-fieldset">
            <legend>Where would you like help?</legend>
            <p>{landingContent.stepTwo.helper}</p>
            <div className="interest-grid">
              {landingContent.interests.map((interest) => {
                const selected = selectedInterests.includes(interest.value);

                return (
                  <label
                    className={selected ? "interest-card is-selected" : "interest-card"}
                    key={interest.value}
                  >
                    <input
                      type="checkbox"
                      name="interest"
                      value={interest.value}
                      checked={selected}
                      onChange={() => toggleInterest(interest.value)}
                    />
                    <span className="interest-check" aria-hidden="true">
                      {selected ? "✓" : "+"}
                    </span>
                    <span>{interest.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <p className="qualification-note">{landingContent.stepTwoDisclosure}</p>

          {state === "error" ? (
            <p className="form-error" role="alert">{landingContent.qualificationError}</p>
          ) : null}

          <div className="form-actions">
            <button
              className="form-back"
              type="button"
              onClick={() => {
                setState("idle");
                setStep(1);
              }}
            >
              ← Back
            </button>

            <button className="form-submit" type="submit" disabled={state === "submitting"}>
              <span>
                {state === "submitting"
                  ? landingContent.stepTwo.submitting
                  : landingContent.stepTwo.submit}
              </span>
              <span className="submit-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      ) : null}

      {step === 3 && state === "success" ? (
        <div className="funnel-step success-step" role="status" aria-live="polite">
          <div className="success-mark" aria-hidden="true">
            <span>✓</span>
          </div>
          <div className="step-heading success-heading">
            <span>{landingContent.stepThree.kicker}</span>
            <h3>{landingContent.stepThree.title}</h3>
            <p>{landingContent.stepThree.body}</p>
          </div>
          <div className="success-signal">
            <span className="success-signal-line" aria-hidden="true" />
            <span>GrowthWorks Systems</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
