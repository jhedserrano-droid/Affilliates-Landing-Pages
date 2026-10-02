import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";

export const metadata: Metadata = {
  title: "GrowthWorks Systems | Business Growth Review",
  description:
    "A focused GrowthWorks Systems business review for founder-led service businesses looking to strengthen visibility, lead capture, response, conversion, and follow-up.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
