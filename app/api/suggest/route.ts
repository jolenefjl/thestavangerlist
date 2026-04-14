import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { suggestionName, location, whyRecommend, submitterEmail, type } = body;

  try {
    await writeClient.create({
      _type: "suggestion",
      type: type ?? "experience",
      suggestionName,
      location,
      whyRecommend,
      submitterEmail: submitterEmail || undefined,
      submittedAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Suggest API error:", err);
    return NextResponse.json({ error: "Failed to save suggestion" }, { status: 500 });
  }
}
