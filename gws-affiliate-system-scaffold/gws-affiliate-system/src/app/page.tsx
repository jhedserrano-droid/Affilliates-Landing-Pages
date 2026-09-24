import { LandingPage } from "@/components/landing-page";
import { claytonFallback } from "@/lib/affiliates";

export default function GenericLandingPage() {
  return (
    <LandingPage
      attributionCode={claytonFallback.code}
      routePath="/"
    />
  );
}
