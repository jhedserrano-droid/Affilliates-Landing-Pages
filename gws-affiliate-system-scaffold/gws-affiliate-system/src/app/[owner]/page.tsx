import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ClaytonIntroduction } from "@/components/clayton-introduction";
import { LeighIntroduction } from "@/components/leigh-introduction";
import { LandingPage } from "@/components/landing-page";
import { claytonFallback, leighOwner } from "@/lib/affiliates";

type Props = {
  params: Promise<{ owner: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const owners = {
  clayton: {
    canonicalName: "Clayton",
    canonicalPath: "/Clayton",
    attributionCode: claytonFallback.code,
    description:
      "Start a business growth conversation with Clayton at GrowthWorks Systems. Share your business needs through our focused business review.",
    portrait: <ClaytonIntroduction />,
  },
  leigh: {
    canonicalName: "Leigh",
    canonicalPath: "/Leigh",
    attributionCode: leighOwner.code,
    description:
      "Start a business growth conversation with Leigh at GrowthWorks Systems. Share your business needs through our focused business review.",
    portrait: <LeighIntroduction />,
  },
} as const;

type OwnerKey = keyof typeof owners;

function getOwner(value: string) {
  const key = value.toLowerCase() as OwnerKey;
  return owners[key] ?? null;
}

// Case-normalizing redirects read request-time query parameters.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { owner } = await params;
  const config = getOwner(owner);

  if (!config) {
    return {
      title: "GrowthWorks Systems",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${config.canonicalName} | GrowthWorks Systems`,
    description: config.description,
    alternates: {
      canonical: `https://gbp.growthworks-systems.com${config.canonicalPath}`,
    },
    robots: { index: false, follow: false },
  };
}

export default async function OwnerLandingPage({
  params,
  searchParams,
}: Props) {
  const { owner } = await params;
  const config = getOwner(owner);

  if (!config) notFound();

  if (owner !== config.canonicalName) {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(await searchParams)) {
      if (Array.isArray(value)) {
        value.forEach((item) => query.append(key, item));
      } else if (value !== undefined) {
        query.append(key, value);
      }
    }

    const suffix = query.toString();
    permanentRedirect(
      `${config.canonicalPath}${suffix ? `?${suffix}` : ""}`,
    );
  }

  return (
    <LandingPage
      attributionCode={config.attributionCode}
      routePath={config.canonicalPath}
      heroSupplement={config.portrait}
    />
  );
}
