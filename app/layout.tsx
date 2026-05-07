import type { Metadata } from "next";
import { Spectral, Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image"; // still used for ogImage
import { siteSettingsQuery } from "@/sanity/lib/queries";
import "./globals.css";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
});

const dmSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(siteSettingsQuery);
  const siteName: string = settings?.siteName ?? "The Stavanger List";
  const description: string = settings?.siteDescription ?? "The go-to guide for eating and living well in Stavanger.";

  // /api/icon dynamically redirects to the Sanity favicon (or 404 if none set).
  // Pointing to a stable URL means the <link rel="icon"> in the HTML never goes stale.
  const icons: Metadata["icons"] = {
    icon: [{ url: "/api/icon", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/api/icon", type: "image/png", sizes: "512x512" }],
  };

  const ogImageUrl: string | null = settings?.ogImage
    ? urlFor(settings.ogImage).width(1200).height(630).fit("crop").url()
    : null;

  return {
    title: siteName,
    description,
    icons,
    openGraph: {
      siteName,
      title: siteName,
      description,
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: siteName }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spectral.variable} ${dmSans.variable}`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
