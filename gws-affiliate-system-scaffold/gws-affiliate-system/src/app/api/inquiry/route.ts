import { NextResponse } from "next/server";
import { resolveAffiliate } from "@/lib/affiliates";
import {
  isValidEmail,
  isValidHttpUrl,
  normalizeStringArray,
  normalizeText,
  type LeadPayload,
} from "@/lib/lead";

type InquiryRequest = {
  firstName?: unknown;
  lastName?: unknown;
  businessName?: unknown;
  businessType?: unknown;
  teamSize?: unknown;
  serviceArea?: unknown;
  priority?: unknown;
  interests?: unknown;
  websiteUrl?: unknown;
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

  if (normalizeText(body.companyFax, 80)) {
    return NextResponse.json({ ok: true }, { status: 202 });
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

  const missing = [
    ["firstName", firstName],
    ["lastName", lastName],
    ["businessName", businessName],
    ["email", email],
  ]
    .filter(([, value]) => !value)
    .map(([field]) => field);

  if (missing.length) {
    return NextResponse.json(
      { ok: false, error: "missing_fields", fields: missing },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!isValidHttpUrl(websiteUrl)) {
    return NextResponse.json({ ok: false, error: "invalid_website_url" }, { status: 400 });
  }

  const requestedCode = normalizeText(body.attributionCode, 24) || "general";
  const resolved = resolveAffiliate(requestedCode === "general" ? null : requestedCode);

  const businessInformation = [
    businessName,
    businessType ? `Business type: ${businessType}` : "",
    priority ? `Priority: ${priority}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  const lead: LeadPayload = {
    businessInformation,
    websiteUrl,
    fullName: `${firstName} ${lastName}`.trim(),
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
    qualification: {
      businessName,
      businessType,
      teamSize,
      serviceArea,
      priority,
      interests,
    },
  };

  const handoffUrl = process.env.LEAD_HANDOFF_WEBHOOK_URL;
  const handoffSecret = process.env.LEAD_HANDOFF_WEBHOOK_SECRET;

  if (!handoffUrl) {
    if (process.env.NODE_ENV === "production") {
      console.error("LEAD_HANDOFF_WEBHOOK_URL is missing in production");
      return NextResponse.json(
        { ok: false, error: "handoff_not_configured" },
        { status: 503 },
      );
    }

    console.info("Lead captured in local development mode", lead);
    return NextResponse.json(
      { ok: true, attributionCode: lead.attributionCode },
      { status: 202 },
    );
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

  return NextResponse.json(
    { ok: true, attributionCode: lead.attributionCode },
    { status: 202 },
  );
}
