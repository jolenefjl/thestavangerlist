import type { Metadata } from "next";
import { Spectral, Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
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
  const description = "The go-to guide for eating and living well in Stavanger.";

  const icons: Metadata["icons"] = settings?.faviconImage
    ? { icon: urlFor(settings.faviconImage).width(512).url() }
    : { icon: "/favicon.ico" };

  const ogImageUrl: string | null = settings?.ogImage
    ? urlFor(settings.ogImage).width(1200).height(630).fit("crop").url()
    : null;

  return {
    title: siteName,
    description,
    icons,
    ...(ogImageUrl && {
      openGraph: {
        siteName,
        description,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: siteName }],
      },
      twitter: {
        card: "summary_large_image",
        images: [ogImageUrl],
      },
    }),
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
