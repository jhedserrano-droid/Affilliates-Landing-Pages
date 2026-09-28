# GWS Affiliate System - Implementation State

## Governing direction

Use the [current Task 04 description and Clayton's latest comments](https://app.clickup.com/t/86bc70469), together with the [content specification](https://docs.google.com/document/d/1hz5ohRfS9p2oTkI4PT0Fp8wLLpsCiRBZrnLyIwJQJ0A/edit). The earlier GBP-first draft and old combined field list no longer govern the required funnel.

Established requirements:
- One reusable, generic GWS business-card/referral funnel, not a service-specific campaign or three independent landing pages.
- Step 1 requires first name, last name, business name and email. Phone is optional. Do not require a website or qualification before initial capture.
- Durably record the lead before revealing Step 2.
- Step 2 collects concise business context and plain-English interests and updates the same captured lead.
- Step 3 is thank-you/confirmation only. No booking CTA, calendar, service-selection action or additional conversion.
- Keep representative details hidden and original affiliate attribution intact through both saves and backend handoff.
- Backend follow-up uses saved information; an AI Receptionist is a possible future enhancement, not current scope.

## Completed foundation, retained

Tasks 01, 02 and 03 record completed infrastructure, first deployment and route-configuration work. Retain:
- Repository `jhedserrano-droid/Affilliates-Landing-Pages`.
- Dedicated Vercel project `gws-affiliate-system`, separate from the main GWS website.
- Connected hostname `gbp.growthworks-systems.com`.
- `/` for generic traffic and `/affiliate/01` through `/affiliate/08` for the eight initial affiliate slots.

At this documentation review, `main` and the production deployment point to `a867bea5bc631b480dca71feeb1c545f9b21cccb`. Vercel reports that deployment READY with the custom-domain alias attached. That proves deployment metadata, not functional form, DNS/HTTPS, route or persistence QA. No replacement repository, project or DNS setup is required by the revised positioning.

## Current code, not the revised funnel

The scaffold still has one combined form and `/api/inquiry` handoff. It requires `businessInformation`, `websiteUrl`, `fullName`, `email` and `phone`. These are legacy implementation fields, not the current Step 1 specification. Changing the documentation does not update browser or server validation.

Reusable code includes the shared landing shell, numbered slot registry and route builder, server-side attribution lookup, UTM/referrer context, basic validation, honeypot and provisional in-page confirmation. It sends one payload to `LEAD_HANDOFF_WEBHOOK_URL`, optionally authenticated with `LEAD_HANDOFF_WEBHOOK_SECRET`. Missing production handoff configuration returns an error rather than normal lead success. This does not establish that a receiving system durably stores a lead.

The current code does not yet implement the required two-stage create/enrich flow, authorized continuation between steps, or verified original-attribution continuity across those updates. Existing fallback code is not equivalent to completed fallback operating-policy validation.

## Remaining implementation and approvals

- Task 04: approve final generic wording, proposed qualification questions, interest options and validation choices.
- Task 05: approve pre-capture privacy/consent, contact preferences and incomplete-lead handling.
- Tasks 06 and 07: adapt the existing UI and API to the approved progressive flow, optional phone and separate save/error states.
- Task 08: preserve the capture-time source/assignment and distinguish initial capture from qualification events.
- Task 09: finalize fallback behavior and unresolved permanent code-lifecycle policy. New generic and former-affiliate leads go to Clayton; previously captured attribution must not be rewritten.
- Task 10: confirm the authoritative CRM/store, access, backend owner, durable acknowledgements, same-lead update authorization, retries and appropriate handling of Step 1-only leads. Supabase, Zapier, GHL and Mavis are not automatically selected or configured by this documentation.
- Tasks 11 through 14: validate QR destinations, run implementation QA, obtain explicit production approval and finish release/handoff.

Contract planning can happen early while UI work is prepared; final integration completion depends on implemented forms and attribution. Do not create circular task dependencies or equate pending copy approval with production approval.

## Verification boundary

This review changes documentation only on `docs/generic-funnel-alignment`. It does not merge to `main`, modify application code, change DNS/Vercel settings, or release the revised funnel. Earlier local dependency-install limitations are historical scaffold notes, not evidence that the subsequently READY deployment failed. Conversely, a successful deployment does not close the remaining application tests.

Use [deployment-checklist.md](deployment-checklist.md) for the outstanding acceptance gates and [lead-handoff-contract.md](lead-handoff-contract.md) for the current interface versus required next contract.
