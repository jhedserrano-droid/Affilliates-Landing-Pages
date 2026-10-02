export type LeadPayload = {
  businessInformation: string;
  websiteUrl: string;
  fullName: string;
  email: string;
  phone: string;
  attributionCode: string;
  attributionOwner: string;
  requestedRoute: string;
  submittedAt: string;
  referrer: string;
  utm: {
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
  };
  qualification?: {
    businessName: string;
    businessType: string;
    teamSize: string;
    serviceArea: string;
    priority: string;
    interests: string[];
  };
};

export function normalizeText(value: unknown, maxLength = 500) {
  return String(value ?? "").trim().slice(0, maxLength);
}

export function normalizeStringArray(value: unknown, maxItems = 20, maxLength = 120) {
  if (!Array.isArray(value)) return [];

  return value
    .slice(0, maxItems)
    .map((item) => normalizeText(item, maxLength))
    .filter(Boolean);
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidHttpUrl(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
