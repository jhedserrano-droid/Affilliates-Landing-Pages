import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ClaytonIntroduction } from "@/components/clayton-introduction";
import { LandingPage } from "@/components/landing-page";
import { claytonFallback } from "@/lib/affiliates";

type Props = {
  params: Promise<{ owner: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const canonicalPath = "/Clayton";

// Case-normalizing redirects read request-time query parameters. Keep this
// owner segment dynamic so fallback paths never switch from static to dynamic.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clayton | GrowthWorks Systems",
  description: "Start a business growth conversation with Clayton at GrowthWorks Systems. Share your business needs through our focused business review.",
  alternates: { canonical: `https://gbp.growthworks-systems.com${canonicalPath}` },
  robots: { index: false, follow: false },
};

export default async function OwnerLandingPage({ params, searchParams }: Props) {
  const { owner } = await params;
  if (owner.toLowerCase() !== "clayton") notFound();

  if (owner !== "Clayton") {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(await searchParams)) {
      if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
      else if (value !== undefined) query.append(key, value);
    }
    const suffix = query.toString();
    permanentRedirect(`${canonicalPath}${suffix ? `?${suffix}` : ""}`);
  }

  return (
    <LandingPage
      attributionCode={claytonFallback.code}
      routePath={canonicalPath}
      heroSupplement={<ClaytonIntroduction />}
    />
  );
}
