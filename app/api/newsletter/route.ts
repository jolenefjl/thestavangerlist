import { NextRequest, NextResponse } from "next/server";

async function sendNewsletterNotification(email: string, firstName?: string) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "The Stavanger List <onboarding@resend.dev>",
      to: ["jo@thestavangerlist.com"],
      subject: `[TSL] New subscriber: ${firstName ? `${firstName} — ` : ""}${email}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 0;">
          <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#8C857F;margin-bottom:8px;">
            The Stavanger List
          </p>
          <h1 style="font-size:22px;font-weight:400;color:#1F1B18;margin:0 0 24px;">
            New newsletter subscriber
          </h1>
          <table style="border-collapse:collapse;width:100%;">
            ${firstName ? `<tr>
              <td style="padding:8px 16px 8px 0;color:#8C857F;font-size:12px;white-space:nowrap;">First name</td>
              <td style="padding:8px 0;color:#1F1B18;font-size:14px;">${firstName}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:8px 16px 8px 0;color:#8C857F;font-size:12px;white-space:nowrap;">Email</td>
              <td style="padding:8px 0;color:#1F1B18;font-size:14px;">${email}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid #E8E4DF;margin:28px 0;" />
          <p style="font-size:11px;color:#B5AFA9;">
            Subscribed via thestavangerlist.com
          </p>
        </div>
      `,
    }),
  });
}

export async function POST(req: NextRequest) {
  const { email, firstName } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiSecret = process.env.KIT_API_SECRET;
  const formId = process.env.KIT_FORM_ID;

  if (!apiSecret || !formId) {
    console.error("KIT_API_SECRET or KIT_FORM_ID not set");
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 500 });
  }

  // Kit v3 (Legacy) API — subscribe via form using api_secret
  const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_secret: apiSecret, email, ...(firstName ? { first_name: firstName } : {}) }),
  });

  const data = await res.json().catch(() => ({}));
  console.log("Kit API response:", res.status, JSON.stringify(data));

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  // Fire-and-forget — don't let notification failure affect the subscriber
  sendNewsletterNotification(email, firstName).catch(console.error);

  return NextResponse.json({ ok: true });
}
