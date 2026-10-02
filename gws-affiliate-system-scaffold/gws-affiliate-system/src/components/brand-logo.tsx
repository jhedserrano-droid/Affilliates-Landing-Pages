"use client";

import { useState } from "react";

/** The approved GWS asset, with a text fallback when its origin is unavailable. */
export function BrandLogo() {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={loaded ? "brand-art is-loaded" : "brand-art"} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="brand-logo"
        src="https://app.growthworks-systems.com/uploads/migrated/e6c07b62-2010-4171-a776-2b3e304cd3e7.png"
        alt=""
        width={184}
        height={64}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
      <span className="brand-wordmark">GrowthWorks<small>Systems</small></span>
    </span>
  );
}
