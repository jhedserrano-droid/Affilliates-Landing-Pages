# Deployment Checklist

## Can proceed before DNS propagation

- [x] Dedicated GitHub repository created by Jhed.
- [x] Dedicated Vercel project created from that repository.
- [x] Affiliate app remains isolated from the existing GWS website project.
- [x] Eight numbered affiliate routes are defined.
- [x] Generic Clayton-attributed route is defined.
- [x] Invalid/inactive affiliate route falls back to Clayton attribution.
- [x] Confirmed lead form fields are implemented.
- [x] Affiliate/route/UTM/referrer attribution payload is implemented.
- [x] CRM-specific handoff is abstracted behind a webhook contract.

## Before production lead capture

- [ ] Confirm GHL vs Mavis/Votel and whether Supabase is still required.
- [ ] Configure `LEAD_HANDOFF_WEBHOOK_URL` in Vercel.
- [ ] Optionally configure `LEAD_HANDOFF_WEBHOOK_SECRET`.
- [ ] Verify one successful submission end-to-end in Preview.
- [ ] Verify invalid/inactive code routes attribute to Clayton.
- [ ] Confirm final CTA, privacy/disclosure copy, and confirmation experience.
- [ ] Confirm final page sections/proof assets.
- [ ] Confirm affiliate reassignment operating rule.

## DNS / custom domain

- [ ] Wait for GBP DNS record to propagate.
- [ ] Verify custom domain is attached to the new affiliate Vercel project, not `gws-website`.
- [ ] Confirm HTTPS certificate issuance.
- [ ] Test `/`, `/affiliate/01`, `/affiliate/08`, and an invalid route on the custom domain.
- [ ] Verify QR destination format only after the production hostname is confirmed.
