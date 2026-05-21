export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export async function GET() {
  const settings = await client.fetch(siteSettingsQuery);

  if (settings?.faviconImage) {
    const url = urlFor(settings.faviconImage)
      .width(512)
      .height(512)
      .fit("crop")
      .url();

    // Proxy the image directly — browsers don't follow redirects for favicons
    const upstream = await fetch(url);
    if (!upstream.ok) return new NextResponse(null, { status: 502 });

    const contentType = upstream.headers.get("content-type") ?? "image/png";
    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache for 1 hour — change takes effect within 60 min of updating in Sanity
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }

  return new NextResponse(null, { status: 404 });
}
