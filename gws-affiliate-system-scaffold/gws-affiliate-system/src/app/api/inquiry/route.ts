import { NextResponse } from "next/server";
import { resolveAffiliate } from "@/lib/affiliates";
import { isValidEmail, isValidHttpUrl, normalizeText, type LeadPayload } from "@/lib/lead";

type InquiryRequest = {
  businessInformation?: unknown;
  websiteUrl?: unknown;
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  attributionCode?: unknown;
  routePath?: unknown;
  referrer?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  utmTerm?: unknown;
  utmContent?: unknown;
  companyFax?: unknown;
};

export async function POST(request: Request) {
  let body: InquiryRequest;

  try {
    body = (await request.json()) as InquiryRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: bots commonly fill visually hidden fields.
  if (normalizeText(body.companyFax, 80)) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const businessInformation = normalizeText(body.businessInformation, 1200);
  const websiteUrl = normalizeText(body.websiteUrl, 300);
  const fullName = normalizeText(body.fullName, 160);
  const email = normalizeText(body.email, 254).toLowerCase();
  const phone = normalizeText(body.phone, 80);

  const missing = [
    ["businessInformation", businessInformation],
    ["websiteUrl", websiteUrl],
    ["fullName", fullName],
    ["email", email],
    ["phone", phone],
  ].filter(([, value]) => !value).map(([field]) => field);

  if (missing.length) {
    return NextResponse.json({ ok: false, error: "missing_fields", fields: missing }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!isValidHttpUrl(websiteUrl)) {
    return NextResponse.json({ ok: false, error: "invalid_website_url" }, { status: 400 });
  }

  const requestedCode = normalizeText(body.attributionCode, 24) || "general";
  const resolved = resolveAffiliate(requestedCode === "general" ? null : requestedCode);

  const lead: LeadPayload = {
    businessInformation,
    websiteUrl,
    fullName,
    email,
    phone,
    attributionCode: resolved.code,
    attributionOwner: resolved.attributionOwner,
    requestedRoute: normalizeText(body.routePath, 300) || "/",
    submittedAt: new Date().toISOString(),
    referrer: normalizeText(body.referrer, 600),
    utm: {
      source: normalizeText(body.utmSource, 160),
      medium: normalizeText(body.utmMedium, 160),
      campaign: normalizeText(body.utmCampaign, 200),
      term: normalizeText(body.utmTerm, 200),
      content: normalizeText(body.utmContent, 200),
    },
  };

  const handoffUrl = process.env.LEAD_HANDOFF_WEBHOOK_URL;
  const handoffSecret = process.env.LEAD_HANDOFF_WEBHOOK_SECRET;

  if (!handoffUrl) {
    if (process.env.NODE_ENV === "production") {
      console.error("LEAD_HANDOFF_WEBHOOK_URL is missing in production");
      return NextResponse.json({ ok: false, error: "handoff_not_configured" }, { status: 503 });
    }

    console.info("Lead captured in local development mode", lead);
    return NextResponse.json({ ok: true, attributionCode: lead.attributionCode }, { status: 202 });
  }

  let response: Response;
  try {
    response = await fetch(handoffUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(handoffSecret ? { authorization: `Bearer ${handoffSecret}` } : {}),
      },
      body: JSON.stringify(lead),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("Lead handoff request failed", error);
    return NextResponse.json({ ok: false, error: "handoff_unreachable" }, { status: 502 });
  }

  if (!response.ok) {
    console.error("Lead handoff rejected", response.status);
    return NextResponse.json({ ok: false, error: "handoff_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, attributionCode: lead.attributionCode }, { status: 202 });
}
