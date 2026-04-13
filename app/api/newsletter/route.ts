import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // TODO Phase 3: connect Mailchimp API here
  // For now, log and return success so the form works
  console.log("Newsletter signup:", email);

  return NextResponse.json({ ok: true });
}
