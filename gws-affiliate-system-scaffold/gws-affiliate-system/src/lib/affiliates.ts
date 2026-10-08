export const AFFILIATE_ROUTE_PREFIX = "/affiliate" as const;

export type AffiliateStatus = "active" | "inactive";

export type AffiliateSlot = {
  code: string;
  status: AffiliateStatus;
  attributionOwner: string;
};

// Clayton confirmed eight launch slots. Public routes use stable numeric codes only.
export const affiliateCodes = Array.from({ length: 8 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);

export const affiliateSlots: Record<string, AffiliateSlot> = Object.fromEntries(
  affiliateCodes.map((code) => [
    code,
    {
      code,
      status: "active" as const,
      attributionOwner: `affiliate-${code}`,
    },
  ]),
);

export function buildAffiliateRoute(code: string) {
  return `${AFFILIATE_ROUTE_PREFIX}/${code}`;
}

export function getAffiliateSlot(code?: string | null) {
  if (!code) return null;
  return affiliateSlots[code] ?? null;
}

export const claytonFallback = {
  code: "general",
  status: "active" as const,
  attributionOwner: "clayton",
};

export const leighOwner = {
  code: "leigh",
  status: "active" as const,
  attributionOwner: "leigh",
};

export function resolveAffiliate(code?: string | null) {
  if (code === leighOwner.code) return leighOwner;

  const slot = getAffiliateSlot(code);

  // Existing scaffold fallback behavior is intentionally retained.
  // Generic/invalid/inactive/former-affiliate operating rules are finalized in Task 09.
  if (!slot || slot.status !== "active") return claytonFallback;

  return slot;
}
