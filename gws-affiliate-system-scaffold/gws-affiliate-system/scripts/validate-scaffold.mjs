import { existsSync, readFileSync } from 'node:fs';

const required = [
  'src/app/page.tsx',
  'src/app/affiliate/[code]/page.tsx',
  'src/app/api/inquiry/route.ts',
  'src/components/landing-page.tsx',
  'src/components/lead-form.tsx',
  'src/lib/affiliates.ts',
  'src/lib/content.ts',
  'src/lib/lead.ts',
  'docs/deployment-checklist.md',
  'docs/lead-handoff-contract.md',
  '.env.example',
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error('Missing required files:', missing.join(', '));
  process.exit(1);
}

const affiliates = readFileSync('src/lib/affiliates.ts', 'utf8');
const affiliateRoute = readFileSync('src/app/affiliate/[code]/page.tsx', 'utf8');
const api = readFileSync('src/app/api/inquiry/route.ts', 'utf8');
const form = readFileSync('src/components/lead-form.tsx', 'utf8');
const readme = readFileSync('README.md', 'utf8');

const assertions = [
  [affiliates.includes('length: 8'), 'eight affiliate launch slots are configured'],
  [affiliates.includes('AFFILIATE_ROUTE_PREFIX = "/affiliate"'), 'stable affiliate route prefix is configured'],
  [affiliates.includes('buildAffiliateRoute'), 'affiliate routes use a centralized route builder'],
  [affiliates.includes('getAffiliateSlot'), 'affiliate ownership/configuration lookup is separated from route rendering'],
  [affiliateRoute.includes('affiliateCodes.map'), 'static params are generated from the affiliate slot registry'],
  [affiliateRoute.includes('buildAffiliateRoute(code)'), 'affiliate page uses the stable route convention'],
  [affiliates.includes('attributionOwner: "clayton"'), 'Clayton fallback attribution exists'],
  [api.includes('resolveAffiliate'), 'server resolves affiliate attribution'],
  [!api.includes('attributionOwner?: unknown'), 'browser cannot provide an attribution owner'],
  [api.includes('attributionOwner: resolved.attributionOwner'), 'server writes the resolved attribution owner'],
  [api.includes('handoff_not_configured'), 'production fails closed when handoff is missing'],
  [api.includes('LEAD_HANDOFF_WEBHOOK_SECRET'), 'optional webhook secret is supported'],
  [form.includes('companyFax'), 'honeypot field is present'],
  [form.includes('utmSource'), 'UTM attribution is captured'],
  [readme.includes('new affiliate Vercel project'), 'deployment boundary is documented'],
];

const failed = assertions.filter(([ok]) => !ok);
for (const [ok, label] of assertions) console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}`);
if (failed.length) process.exit(1);

console.log('Scaffold configuration checks passed.');
