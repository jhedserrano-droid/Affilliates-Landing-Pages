# GWS Affiliate System

Isolated Next.js application for GrowthWorks Systems affiliate landing pages.

## Launch routes

- `/` - generic / Clayton-attributed traffic
- `/affiliate/01` ... `/affiliate/08` - initial affiliate slots
- Any invalid/inactive `/affiliate/:code` route keeps the customer experience available but resolves attribution to Clayton.

## Current implementation

- Reusable customer-facing landing-page shell with no public representative details.
- Confirmed lead fields: business information, website URL, full name, email, phone.
- Server-validated affiliate attribution.
- UTM/referrer context capture.
- Honeypot bot field.
- Safe provisional in-page confirmation state.
- Abstract webhook handoff so GHL vs Mavis/Votel can be decided without rewriting the UI.
- Production fails closed if the lead handoff is not configured, preventing silent lead loss.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Vercel

This app belongs in the **new affiliate Vercel project**, not the existing GWS website project.

1. Connect this repository to the dedicated affiliate Vercel project.
2. Keep the `gws-website` project untouched.
3. Use the Vercel preview URL while DNS propagates.
4. Add the GBP custom domain when DNS is available.
5. Set `LEAD_HANDOFF_WEBHOOK_URL` before production lead capture.

## Docs

- `docs/implementation-state.md`
- `docs/deployment-checklist.md`
- `docs/lead-handoff-contract.md`
