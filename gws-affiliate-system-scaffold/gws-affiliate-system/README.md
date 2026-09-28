# GWS Affiliate System

Isolated Next.js application for GrowthWorks Systems affiliate/business-card traffic.

## Governing requirements

The [revised Task 04 description and Clayton's latest comments](https://app.clickup.com/t/86bc70469) replace the earlier GBP-focused content direction for this funnel. Use one generic GWS experience, not a service-specific campaign or three independent landing pages:

1. **Capture:** first name, last name, business name and email are required; phone is optional. Confirm durable lead storage before opening Step 2.
2. **Qualify:** collect concise business context and plain-English interests, updating the same captured lead. Abandoning qualification must not erase the initial lead.
3. **Thank:** show receipt, thanks and an appropriate follow-up expectation only. No booking CTA, calendar, service sale or further conversion action.

Backend follow-up uses the saved responses. An AI Receptionist is a future enhancement, not part of the current specification. No affiliate/representative details appear publicly; original attribution persists across both saves and handoff.

The [content specification](https://docs.google.com/document/d/1hz5ohRfS9p2oTkI4PT0Fp8wLLpsCiRBZrnLyIwJQJ0A/edit), [planning document](https://docs.google.com/document/d/1DYstcLlI3s-TzChmHGaC6fkratiZ6Q5FTebdGbPRE1o/edit) and [visual proposal](https://docs.google.com/presentation/d/1NJpHlwAh6BagZzYkB5baUNpfN47-sCiZDxx7QQGehSI/edit) describe the revised requirements. Proposed wording and qualification choices still require approval.

## Current code versus required changes

This documentation revision does **not** implement the progressive funnel. The existing scaffold still uses one combined form requiring business information, website URL, full name, email and phone, followed by a single webhook handoff. Its public copy is provisional. Do not mistake that legacy field list for the revised requirements above.

Reusable code includes the landing-page shell, numeric affiliate configuration, server-side owner lookup, UTM/referrer capture, honeypot, basic validation and provisional confirmation. The API returns a production error when `LEAD_HANDOFF_WEBHOOK_URL` is missing. These foundations do not prove durable storage, secure multi-step continuation or end-to-end lead capture.

Implement the revised form/API schema, verified first save, same-lead qualification update and corresponding attribution, compliance and QA requirements in their existing tasks after the relevant approvals.

## Existing routes and infrastructure

- `/`: generic traffic; attribution resolves to Clayton.
- `/affiliate/01` through `/affiliate/08`: initial affiliate slots.
- The scaffold resolves unknown/inactive codes to Clayton; final fallback operating rules and code-lifecycle decisions remain with Task 09.
- Retain the existing GitHub repository, Vercel project `gws-affiliate-system`, and connected `gbp.growthworks-systems.com` hostname. A hostname change is a separate approval/redirect decision.

This app belongs in the **new affiliate Vercel project** established during setup, not the main GWS website project. That dedicated project now exists: reuse it rather than create another. Keep the main GWS website repository and deployment untouched.

## Local setup

Run from this application's directory:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Use approved non-production destinations for test submissions. Never commit environment secrets or real lead data. The current scaffold uses `LEAD_HANDOFF_WEBHOOK_URL` and optional `LEAD_HANDOFF_WEBHOOK_SECRET`; setting these does not by itself implement the new create/enrich contract.

## Review and deployment boundary

This branch changes documentation only. Do not merge or publish revised application behavior as part of this documentation update. Keep final copy approval, implementation validation and Clayton's production approval separate. A successful build is not proof that forms, routes and lead persistence have passed QA.

## Implementation references

- [Current state and gaps](docs/implementation-state.md)
- [Deployment and acceptance checklist](docs/deployment-checklist.md)
- [Current interface and proposed handoff contract](docs/lead-handoff-contract.md)
