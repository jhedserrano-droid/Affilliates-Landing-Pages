"use client";

import { useLayoutEffect, useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { landingContent } from "@/lib/content";
import { PRIVACY_POLICY_URL, TERMS_URL } from "@/lib/site";

type Props = { attributionCode: string; routePath: string };
type FormState = "idle" | "submitting" | "error";
type TrackingContext = {
  referrer: string; utmSource: string; utmMedium: string;
  utmCampaign: string; utmTerm: string; utmContent: string;
};
const emptyTracking: TrackingContext = {
  referrer: "", utmSource: "", utmMedium: "", utmCampaign: "", utmTerm: "", utmContent: "",
};
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Progress({ step }: { step: number }) {
  return (
    <div className="funnel-progress" aria-label={`Step ${step} of 3`}>
      <div className="progress-meta"><span>Business review</span><span>{String(step).padStart(2, "0")} / 03</span></div>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${((step - 1) / 2) * 100}%` }} /></div>
    </div>
  );
}

function formValues(form: HTMLFormElement) {
  return Object.fromEntries(Array.from(new FormData(form).entries()).map(([key, value]) => [key, String(value)]));
}

export function LeadForm({ attributionCode, routePath }: Props) {
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const [anchorHeight, setAnchorHeight] = useState(0);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState<TrackingContext>(emptyTracking);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const anchorRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contactFormRef = useRef<HTMLFormElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const originRef = useRef<DOMRect | null>(null);
  const contactData = useRef<Record<string, string>>({});
  const animating = useRef(false);
  const submitting = useRef(false);
  const motion = useRef<Animation | null>(null);
  const pendingRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTracking({
      referrer: document.referrer,
      utmSource: params.get("utm_source") ?? "", utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "", utmTerm: params.get("utm_term") ?? "",
      utmContent: params.get("utm_content") ?? "",
    });
    return () => { pendingRequest.current?.abort(); motion.current?.cancel(); };
  }, []);

  useLayoutEffect(() => {
    if (!focused) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    let cancelled = false;
    const oldOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    dialog.scrollTop = 0;
    const from = originRef.current;
    const to = dialog.getBoundingClientRect();
    animating.current = true;
    const finish = () => {
      if (cancelled) return;
      animating.current = false;
      dialog.querySelector<HTMLElement>("#qualification-title")?.focus({ preventScroll: true });
    };
    if (from && !reduceMotion() && typeof dialog.animate === "function") {
      motion.current = dialog.animate([
        { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})` },
        { transform: "none" },
      ], { duration: 520, easing: "cubic-bezier(.22,.8,.2,1)" });
      void motion.current.finished.then(finish).catch(() => {});
    } else finish();
    return () => {
      cancelled = true;
      motion.current?.cancel();
      animating.current = false;
      dialog.close();
      document.documentElement.style.overflow = oldOverflow;
    };
  }, [focused]);

  function continueToQualification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (animating.current || submitting.current || !policyAccepted) return;
    const form = event.currentTarget;
    // Native required/email checks plus rejection of whitespace-only names.
    form.querySelectorAll<HTMLInputElement>('input[required]:not([type="checkbox"])').forEach((input) => {
      input.setCustomValidity(input.value.trim() ? "" : "Please complete this required field.");
    });
    if (!form.reportValidity()) return;
    if (!dialogRef.current || typeof dialogRef.current.showModal !== "function") {
      setError("Please use an up-to-date browser to continue with this form.");
      setState("error");
      return;
    }
    contactData.current = formValues(form);
    originRef.current = cardRef.current?.getBoundingClientRect() ?? null;
    setAnchorHeight(originRef.current?.height ?? 0);
    setState("idle"); setError(""); setFocused(true);
  }

  async function returnToContact() {
    if (animating.current || submitting.current) return;
    const dialog = dialogRef.current;
    const anchor = anchorRef.current;
    if (dialog && anchor && !reduceMotion() && typeof dialog.animate === "function") {
      animating.current = true;
      dialog.scrollTop = 0;
      const from = dialog.getBoundingClientRect();
      const to = anchor.getBoundingClientRect();
      motion.current = dialog.animate([
        { transform: "none" },
        { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width}, ${to.height / from.height})` },
      ], { duration: 320, easing: "cubic-bezier(.4,0,.2,1)" });
      try { await motion.current.finished; } catch { return; }
    }
    setFocused(false); setState("idle"); setError("");
    requestAnimationFrame(() => continueRef.current?.focus({ preventScroll: true }));
  }

  async function submitQualification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || animating.current) return;
    const form = event.currentTarget;
    // Recheck consent and required details at the final submission boundary.
    if (!policyAccepted || !contactFormRef.current?.checkValidity()) {
      void returnToContact(); return;
    }
    if (!form.reportValidity()) return;
    const qualificationData = formValues(form);
    submitting.current = true; setState("submitting"); setError("");
    const controller = new AbortController();
    pendingRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST", headers: { "content-type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ ...contactData.current, ...qualificationData,
          interests: selectedInterests, attributionCode, routePath, ...tracking, policyAccepted: true }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true || result?.accepted !== true) {
        setError(result?.error === "handoff_not_configured" || result?.preview
          ? "This review build is not connected to lead capture yet. Your information has not been sent."
          : "We couldn't confirm your submission. Your details are still here so you can try again.");
        setState("error"); submitting.current = false; return;
      }
      // The API sets a short-lived receipt cookie only after an accepted handoff.
      // No personal information is included in the destination URL.
      router.replace("/thank-you");
    } catch {
      setError("We couldn't confirm your submission. Your details are still here so you can try again.");
      setState("error"); submitting.current = false;
    } finally { window.clearTimeout(timeout); pendingRequest.current = null; }
  }

  function toggleInterest(value: string) {
    setSelectedInterests((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <div className="funnel-anchor" ref={anchorRef} style={focused ? { height: anchorHeight } : undefined}>
      <div className="funnel-card" ref={cardRef} hidden={focused}>
        <Progress step={1} />
        <form className="funnel-step" id="lead-contact-form" ref={contactFormRef} onSubmit={continueToQualification}
          onInput={(event) => { if (event.target instanceof HTMLInputElement) event.target.setCustomValidity(""); }}>
          <div className="step-heading"><span>{landingContent.stepOne.kicker}</span><h3>{landingContent.stepOne.title}</h3><p>{landingContent.stepOne.body}</p></div>
          <div className="field-grid">
            <label className="field-shell"><span>First name <b>*</b></span><input name="firstName" autoComplete="given-name" required maxLength={80} placeholder="First name" /></label>
            <label className="field-shell"><span>Last name <b>*</b></span><input name="lastName" autoComplete="family-name" required maxLength={80} placeholder="Last name" /></label>
            <label className="field-shell field-wide"><span>Business name <b>*</b></span><input name="businessName" autoComplete="organization" required maxLength={180} placeholder="Business name" /></label>
            <label className="field-shell"><span>Email <b>*</b></span><input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@business.com" /></label>
            <label className="field-shell"><span>Phone <small>optional</small></span><input name="phone" type="tel" autoComplete="tel" maxLength={80} placeholder="+1 555 555 0100" /></label>
            <div className="honeypot" aria-hidden="true"><label htmlFor="companyFax">Company fax</label><input id="companyFax" name="companyFax" type="text" tabIndex={-1} autoComplete="off" /></div>
          </div>
          <div className="consent-copy">
            <p>{landingContent.inquiryDisclosure}</p>
            <div className="policy-consent">
              <input id="policy-accepted" name="policyAccepted" type="checkbox" required checked={policyAccepted}
                onChange={(event) => setPolicyAccepted(event.target.checked)} aria-describedby="policy-help" />
              <label htmlFor="policy-accepted">I agree to the <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href={TERMS_URL} target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>.</label>
            </div>
            <small id="policy-help">Required to continue. Phone is optional. This is not consent to marketing text messages.</small>
          </div>
          {state === "error" && !focused ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="form-submit" type="submit" ref={continueRef} disabled={!policyAccepted} aria-describedby="policy-help"><span>{landingContent.stepOne.submit}</span><span className="submit-arrow" aria-hidden="true">&#8594;</span></button>
        </form>
      </div>
      <dialog ref={dialogRef} className="funnel-dialog" aria-labelledby="qualification-title"
        onCancel={(event) => { event.preventDefault(); void returnToContact(); }}>
        <div className="funnel-card">
          <div className="focus-toolbar"><span>Your business, in focus</span><button type="button" disabled={state === "submitting"} onClick={() => void returnToContact()} aria-label="Back to contact details">Back to contact details <span aria-hidden="true">&#8599;</span></button></div>
          <Progress step={2} />
          <form className="funnel-step" id="lead-qualification-form" onSubmit={submitQualification} aria-busy={state === "submitting"}>
            <div className="step-heading"><span>{landingContent.stepTwo.kicker}</span><h3 id="qualification-title" tabIndex={-1}>{landingContent.stepTwo.title}</h3><p>{landingContent.stepTwo.body}</p></div>
            <fieldset className="qualification-fields" disabled={state === "submitting"}>
              <legend className="sr-only">Business details</legend>
              <div className="field-grid">
                <label className="field-shell"><span>Business type <small>optional</small></span><input name="businessType" maxLength={160} placeholder="Industry or customers you serve" /></label>
                <label className="field-shell"><span>Team size <small>optional</small></span><select name="teamSize" defaultValue=""><option value="">Choose an option</option><option value="just_me">Just me</option><option value="2_5">2 to 5</option><option value="6_10">6 to 10</option><option value="11_25">11 to 25</option><option value="26_50">26 to 50</option><option value="51_plus">51 or more</option><option value="prefer_not_to_say">Prefer not to say</option></select></label>
                <label className="field-shell"><span>Service area <small>optional</small></span><input name="serviceArea" maxLength={200} placeholder="City, region or wider market" /></label>
                <label className="field-shell"><span>Website <small>optional</small></span><input name="websiteUrl" type="url" pattern="https?://.+" title="Enter a complete http:// or https:// website address." maxLength={300} placeholder="https://" /></label>
                <label className="field-shell field-wide"><span>What would you most like to improve? <small>optional</small></span><textarea name="priority" maxLength={800} placeholder="Tell us the main goal or challenge in a sentence or two." /></label>
              </div>
              <fieldset className="interest-fieldset"><legend>Where would you like help?</legend><p>{landingContent.stepTwo.helper}</p><div className="interest-grid">
                {landingContent.interests.map((interest) => {
                  const selected = selectedInterests.includes(interest.value);
                  return <label className={selected ? "interest-card is-selected" : "interest-card"} key={interest.value}><input type="checkbox" name="interest" value={interest.value} checked={selected} onChange={() => toggleInterest(interest.value)} /><span className="interest-check" aria-hidden="true">{selected ? "\u2713" : "+"}</span><span>{interest.label}</span></label>;
                })}
              </div></fieldset>
              <p className="qualification-note">{landingContent.stepTwoDisclosure}</p>
              {state === "error" ? <p className="form-error" role="alert">{error}</p> : null}
              <div className="form-actions"><button className="form-back" type="button" onClick={() => void returnToContact()}>&#8592; Back</button><button className="form-submit" type="submit" disabled={state === "submitting" || !policyAccepted}><span>{state === "submitting" ? "Sending..." : landingContent.stepTwo.submit}</span><span className="submit-arrow" aria-hidden="true">&#8594;</span></button></div>
            </fieldset>
          </form>
        </div>
      </dialog>
    </div>
  );
}
