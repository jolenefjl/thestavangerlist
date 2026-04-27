import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiSecret = process.env.KIT_API_SECRET;
  const formId = process.env.KIT_FORM_ID;

  if (!apiSecret || !formId) {
    console.error("KIT_API_SECRET or KIT_FORM_ID not set");
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 500 });
  }

  // Kit v3 (Legacy) API — create subscriber directly, bypasses opt-in
  const res = await fetch(`https://api.convertkit.com/v3/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_secret: apiSecret, email }),
  });

  const data = await res.json().catch(() => ({}));
  console.log("Kit API response:", res.status, JSON.stringify(data));

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
