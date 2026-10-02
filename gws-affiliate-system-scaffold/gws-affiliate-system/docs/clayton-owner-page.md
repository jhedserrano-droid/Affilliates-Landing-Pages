# Clayton owner landing page

## Architecture and scope

`/Clayton` uses the existing `LandingPage` and `LeadForm`, with an optional server-rendered `heroSupplement` slot for Clayton's portrait. The root page and `/affiliate/01` through `/affiliate/08` do not pass this slot, so they do not display or request the portrait. Do not infer the portrait from `attributionCode=general`, since the generic landing page and invalid-affiliate fallback use that code too.

The owner route uses the existing `claytonFallback.code` (`general`) and submits `/Clayton` as `routePath`. It does not create a ninth affiliate, expose affiliate identity, or alter the affiliate registry, UTM handling, consent, receipt or webhook behavior. Lowercase/mixed-case owner links redirect to `/Clayton` with query parameters preserved. Other unrecognized single-segment paths return 404.

Verified existing Vercel domain: `gbp.growthworks-systems.com`. Intended dedicated URL: `https://gbp.growthworks-systems.com/Clayton`. No DNS, domain purchase, Mavis, CRM, workflow or unrelated production configuration change is included. Existing review/capture warnings remain visible. This UI change is not evidence of durable CRM capture or production approval for the wider migration.

## Portrait

The source is the portrait provided by Jhed in this conversation, SHA-256 `d9107cc9219b7becc1ab2ec9279d7e5bb65ce7cf71d78a9c52f1907f93cc5cda`.

`public/portraits/clayton.webp` is a 480 x 621 transparent, upper-body derivative (25,090 bytes). Only background segmentation, proportional crop/resize and WebP encoding were applied. Facial features, clothing, colors and proportions are not generated or retouched. The original upload remains unchanged. The page applies restrained maroon atmospheric light, a soft edge shadow and a bottom fade, with square borders matching the approved design. No orange palette, fabricated testimonials, performance claims, biography or new booking CTA is introduced.

## Review and rollback

Check `/Clayton`, lowercase `/clayton?utm_source=qa`, the root page, affiliate routes 01 and 08, the existing fallback route 99, and an unknown root slug. Check the owner page at 320, 390, 768 and 1440px, keyboard navigation, consent blocking and centered form behavior. Do not submit test information to a live CRM: mock the inquiry endpoint for submission tests. Verify the Vercel build and exact deployed commit before sharing a live URL.

The change is additive except for the optional `heroSupplement` slot in `LandingPage`. To roll it back, revert the owner-page commit rather than resetting or force-pushing the branch. Keep previous consent/animation/branding changes and unrelated work intact.
