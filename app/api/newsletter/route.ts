import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    console.error("Kit env vars not set");
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 500 });
  }

  // Kit v4 API (api.kit.com) — uses Bearer token auth
  const res = await fetch(`https://api.kit.com/v4/forms/${formId}/subscribers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ email_address: email }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error("Kit API error:", JSON.stringify(data));
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
