"use client";

import { FormEvent, useEffect, useState } from "react";
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

const emptyTracking: TrackingContext = {
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
};

export function LeadForm({ attributionCode, routePath }: Props) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [tracking, setTracking] = useState<TrackingContext>(emptyTracking);

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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          attributionCode,
          routePath,
          ...tracking,
        }),
      });

      if (!response.ok) {
        setState("error");
        return;
      }

      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="success" role="status" aria-live="polite">
        <strong>{landingContent.successTitle}</strong>
        <div>{landingContent.successBody}</div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate={false}>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="companyFax">Company fax</label>
        <input id="companyFax" name="companyFax" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="field">
        <label htmlFor="businessInformation">Business information</label>
        <textarea
          id="businessInformation"
          name="businessInformation"
          required
          maxLength={1200}
          placeholder="Tell us your business name and a little about what you do."
        />
      </div>

      <div className="field">
        <label htmlFor="websiteUrl">Website URL</label>
        <input id="websiteUrl" name="websiteUrl" type="url" required maxLength={300} placeholder="https://example.com" />
      </div>

      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" autoComplete="name" required maxLength={160} />
      </div>

      <div className="field">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" required maxLength={80} />
      </div>

      <p className="help">{landingContent.privacyDraft}</p>

      {state === "error" ? (
        <p className="error" role="alert">
          {landingContent.errorMessage}
        </p>
      ) : null}

      <button type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending..." : landingContent.primaryCta}
      </button>
    </form>
  );
}
