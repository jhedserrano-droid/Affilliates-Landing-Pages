import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";
import {
  affiliateCodes,
  buildAffiliateRoute,
  resolveAffiliate,
} from "@/lib/affiliates";

export const dynamicParams = true;

export function generateStaticParams() {
  return affiliateCodes.map((code) => ({ code }));
}

export const metadata: Metadata = {
  title: "GrowthWorks Systems",
  description: "GrowthWorks Systems inquiry and growth review.",
};

export default async function AffiliateLandingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const affiliate = resolveAffiliate(code);

  return (
    <LandingPage
      attributionCode={affiliate.code}
      routePath={buildAffiliateRoute(code)}
    />
  );
}
