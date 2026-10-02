"use client";
import { useEffect, useState } from "react";
import { GWS_WEBSITE } from "@/lib/site";

export function ThankYouRedirect() {
  const [remaining, setRemaining] = useState(10);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paused]);
  useEffect(() => { if (remaining === 0 && !paused) window.location.replace(GWS_WEBSITE); }, [remaining, paused]);
  return <>
    <div className="thank-you-actions">
      <a className="form-submit" href={GWS_WEBSITE} rel="noreferrer"><span>Visit GrowthWorks Systems</span><span className="submit-arrow" aria-hidden="true">&#8599;</span></a>
      <button className="form-back" type="button" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? "Resume redirect" : "Pause redirect"}</button>
    </div>
    <p className="redirect-note" role="timer" aria-live="off">{paused ? "Automatic redirect paused. Continue whenever you are ready." : `Continuing to our website in ${remaining} second${remaining === 1 ? "" : "s"}. You can pause the redirect.`}</p>
    <noscript><p className="redirect-note">Use the website button above to continue.</p></noscript>
  </>;
}
