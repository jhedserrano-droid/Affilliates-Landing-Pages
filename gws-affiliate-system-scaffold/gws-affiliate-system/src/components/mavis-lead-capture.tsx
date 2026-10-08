"use client";

import { useEffect, useRef, useState } from "react";

const MAVIS_FORM_ID = "eu7y";
const MAVIS_FORM_URL = "https://app.growthworks-systems.com/f/eu7y";
const MAVIS_EMBED_SRC = "https://app.growthworks-systems.com/form-embed/v1.js";

export function MavisLeadCapture() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    setFailed(false);
    const script = document.createElement("script");
    script.src = MAVIS_EMBED_SRC;
    script.async = true;
    script.dataset.formId = MAVIS_FORM_ID;
    script.dataset.transparent = "1";
    script.onerror = () => setFailed(true);
    mount.appendChild(script);

    return () => {
      script.onerror = null;
      mount.replaceChildren();
    };
  }, []);

  return (
    <div className="mavis-capture">
      <div className="mavis-form-embed" ref={mountRef} aria-label="GrowthWorks Systems business inquiry form" />
      {failed ? (
        <p className="form-error" role="alert">
          The inquiry form could not load. <a href={MAVIS_FORM_URL}>Open the secure GrowthWorks Systems form</a>.
        </p>
      ) : null}
    </div>
  );
}
