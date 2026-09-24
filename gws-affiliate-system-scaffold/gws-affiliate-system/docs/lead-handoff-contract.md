# Lead Handoff Contract

The affiliate app sends a single JSON payload to `LEAD_HANDOFF_WEBHOOK_URL`.

```json
{
  "businessInformation": "Example Co - residential HVAC",
  "websiteUrl": "https://example.com",
  "fullName": "Example Person",
  "email": "person@example.com",
  "phone": "+1 555 555 0100",
  "attributionCode": "01",
  "attributionOwner": "affiliate-01",
  "requestedRoute": "/affiliate/01",
  "submittedAt": "2026-09-24T00:00:00.000Z",
  "referrer": "",
  "utm": {
    "source": "",
    "medium": "",
    "campaign": "",
    "term": "",
    "content": ""
  }
}
```

## Attribution rules

- `/affiliate/01` through `/affiliate/08` resolve to the corresponding launch slot.
- `/` resolves to `general` / `clayton`.
- Unknown or inactive affiliate codes resolve to `general` / `clayton`.
- Attribution is resolved again on the server. The client cannot force an arbitrary attribution owner.

## Production behavior

Production submissions fail closed if `LEAD_HANDOFF_WEBHOOK_URL` is missing. This prevents a successful-looking form submission from silently losing a lead.
