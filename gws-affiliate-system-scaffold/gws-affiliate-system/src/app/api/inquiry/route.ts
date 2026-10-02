import { NextResponse } from "next/server";
import { resolveAffiliate } from "@/lib/affiliates";
import { isValidEmail, isValidHttpUrl, normalizeStringArray, normalizeText, type LeadPayload } from "@/lib/lead";
import { PRIVACY_POLICY_URL, TERMS_URL, POLICY_NOTICE_VERSION, INQUIRY_RECEIPT_COOKIE } from "@/lib/site";

type InquiryRequest = {
  firstName?: unknown; lastName?: unknown; businessName?: unknown; businessType?: unknown;
  teamSize?: unknown; serviceArea?: unknown; priority?: unknown; interests?: unknown;
  websiteUrl?: unknown; email?: unknown; phone?: unknown; attributionCode?: unknown;
  routePath?: unknown; referrer?: unknown; utmSource?: unknown; utmMedium?: unknown;
  utmCampaign?: unknown; utmTerm?: unknown; utmContent?: unknown; companyFax?: unknown;
  policyAccepted?: unknown;
};

export async function POST(request: Request) {
  let body: InquiryRequest;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
    }
    body = parsed as InquiryRequest;
  } catch { return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 }); }

  // Strict boolean validation prevents bypassing the disabled client button.
  if (body.policyAccepted !== true) {
    return NextResponse.json({ ok: false, error: "policy_consent_required" }, { status: 400 });
  }
  if (normalizeText(body.companyFax, 80)) {
    return NextResponse.json({ ok: true, accepted: false }, { status: 202 });
  }
  const firstName = normalizeText(body.firstName, 80);
  const lastName = normalizeText(body.lastName, 80);
  const businessName = normalizeText(body.businessName, 180);
  const email = normalizeText(body.email, 254).toLowerCase();
  const phone = normalizeText(body.phone, 80);
  const websiteUrl = normalizeText(body.websiteUrl, 300);
  const businessType = normalizeText(body.businessType, 160);
  const teamSize = normalizeText(body.teamSize, 80);
  const serviceArea = normalizeText(body.serviceArea, 200);
  const priority = normalizeText(body.priority, 800);
  const interests = normalizeStringArray(body.interests, 20, 120);
  const missing = [["firstName", firstName], ["lastName", lastName], ["businessName", businessName], ["email", email]]
    .filter(([, value]) => !value).map(([field]) => field);
  if (missing.length) return NextResponse.json({ ok: false, error: "missing_fields", fields: missing }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  if (!isValidHttpUrl(websiteUrl)) return NextResponse.json({ ok: false, error: "invalid_website_url" }, { status: 400 });
  const requestedCode = normalizeText(body.attributionCode, 24) || "general";
  const resolved = resolveAffiliate(requestedCode === "general" ? null : requestedCode);
  const submittedAt = new Date().toISOString();
  const lead: LeadPayload = {
    businessInformation: [businessName, businessType ? `Business type: ${businessType}` : "", priority ? `Priority: ${priority}` : ""].filter(Boolean).join(" | "),
    websiteUrl, fullName: `${firstName} ${lastName}`.trim(), email, phone,
    attributionCode: resolved.code, attributionOwner: resolved.attributionOwner,
    requestedRoute: normalizeText(body.routePath, 300) || "/", submittedAt,
    referrer: normalizeText(body.referrer, 600),
    consent: { policyAccepted: true, recordedAt: submittedAt, privacyPolicyUrl: PRIVACY_POLICY_URL, termsUrl: TERMS_URL, noticeVersion: POLICY_NOTICE_VERSION },
    utm: { source: normalizeText(body.utmSource, 160), medium: normalizeText(body.utmMedium, 160), campaign: normalizeText(body.utmCampaign, 200), term: normalizeText(body.utmTerm, 200), content: normalizeText(body.utmContent, 200) },
    qualification: { businessName, businessType, teamSize, serviceArea, priority, interests },
  };
  const handoffUrl = process.env.LEAD_HANDOFF_WEBHOOK_URL;
  const handoffSecret = process.env.LEAD_HANDOFF_WEBHOOK_SECRET;
  if (!handoffUrl) {
    if (process.env.NODE_ENV === "production") {
      console.error("LEAD_HANDOFF_WEBHOOK_URL is missing in production");
      return NextResponse.json({ ok: false, error: "handoff_not_configured" }, { status: 503 });
    }
    // Local validation is not a durable capture and must not create a receipt.
    return NextResponse.json({ ok: true, accepted: false, preview: true }, { status: 202 });
  }
  let response: Response;
  try {
    response = await fetch(handoffUrl, {
      method: "POST",
      headers: { "content-type": "application/json", ...(handoffSecret ? { authorization: `Bearer ${handoffSecret}` } : {}) },
      body: JSON.stringify(lead), cache: "no-store", signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error("Lead handoff request failed");
    return NextResponse.json({ ok: false, error: "handoff_unreachable" }, { status: 502 });
  }
  if (!response.ok) {
    console.error("Lead handoff rejected", response.status);
    return NextResponse.json({ ok: false, error: "handoff_failed" }, { status: 502 });
  }
  const result = NextResponse.json({ ok: true, accepted: true, attributionCode: lead.attributionCode }, { status: 202 });
  result.cookies.set(INQUIRY_RECEIPT_COOKIE, "received", {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/thank-you", maxAge: 300,
  });
  return result;
}
