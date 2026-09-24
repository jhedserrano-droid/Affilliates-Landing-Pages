export type AffiliateStatus = "active" | "inactive";

export type AffiliateSlot = {
  code: string;
  status: AffiliateStatus;
  attributionOwner: string;
};

// Clayton confirmed eight launch slots. No representative details are exposed publicly.
export const affiliateSlots: Record<string, AffiliateSlot> = Object.fromEntries(
  Array.from({ length: 8 }, (_, index) => {
    const code = String(index + 1).padStart(2, "0");
    return [
      code,
      {
        code,
        status: "active" as const,
        attributionOwner: `affiliate-${code}`,
      },
    ];
  }),
);

export const claytonFallback = {
  code: "general",
  status: "active" as const,
  attributionOwner: "clayton",
};

export function resolveAffiliate(code?: string | null) {
  if (!code) return claytonFallback;

  const slot = affiliateSlots[code];

  // Clayton's direction: if an affiliate route is invalid/inactive, capture the lead
  // but attribute future routing to Clayton rather than failing the experience.
  if (!slot || slot.status !== "active") return claytonFallback;

  return slot;
}
