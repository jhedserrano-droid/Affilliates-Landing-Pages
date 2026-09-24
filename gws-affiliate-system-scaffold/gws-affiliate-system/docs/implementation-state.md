# GWS Affiliate System - Implementation State

## Confirmed by Clayton

- High-level isolated affiliate-system approach: **approved**.
- Initial launch capacity: **8 affiliate/business-card slots**.
- Public affiliate routes should be stable numbered codes, not personal-name routes.
- Landing pages are customer-facing.
- Public representative details on the landing page: **none**.
- Each affiliate can have a personalized physical business card with their name and the route QR code.
- Form fields required:
  - Business information
  - Website URL
  - Full name
  - Email address
  - Phone number
- Generic/non-affiliate traffic should attribute to Clayton.
- Leads arriving through an invalid/inactive/former affiliate route should still be captured and attributed to Clayton.
- Production approval begins with Clayton and may later be delegated.
- Dedicated GBP subdomain is being configured.

## Implemented in this scaffold

- `/` generic route, attributed to Clayton.
- `/affiliate/01` through `/affiliate/08`.
- Unknown/inactive affiliate route fallback to Clayton attribution.
- Reusable customer-facing landing page with no public representative details.
- Inquiry form with all confirmed fields.
- Hidden route/source/UTM/referrer attribution payload.
- Server-side re-resolution of affiliate attribution so the browser cannot choose an arbitrary owner.
- Basic server-side validation and input length limits.
- Honeypot bot field.
- In-page confirmation state as a reversible implementation default.
- Abstract handoff webhook (`LEAD_HANDOFF_WEBHOOK_URL`) so CRM selection can change without rewriting the form.
- Optional bearer secret for the handoff endpoint.
- Production fails closed if the handoff is not configured, preventing silent lead loss.
- Responsive GWS-aligned visual foundation.
- Deployment checklist and lead handoff contract documentation.

## Pending Clayton / system decisions

- Final page sections, proof/credibility assets, and exact messaging.
- Final primary CTA wording and whether a secondary CTA is needed.
- GHL vs Mavis/Votel as the downstream system.
- Whether Supabase remains necessary if CRM custom fields can persist sales-associate attribution.
- Final analytics/reporting scope.
- Final reassignment policy for numbered codes.
- Final confirmation experience (in-page vs dedicated route and copy).
- Final privacy/consent/disclosure language.
- Final design asset/component selection.

## DNS / Vercel

DNS propagation does not block application development. Use the new Vercel project's preview/production hostname for QA until the GBP custom domain resolves.

## Validation limitation in this environment

The scaffold-level checks pass, but `npm install` could not complete because this execution environment could not reach/install npm dependencies within the available execution window. A real `next build` must be run in the actual GitHub/Vercel project or a normal local development environment before deployment approval.
