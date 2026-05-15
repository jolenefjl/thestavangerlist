import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const TYPE_LABELS: Record<string, string> = {
  restaurant: "Restaurant suggestion",
  experience: "Experience suggestion",
  interview:  "Into the Kitchen suggestion",
};

const LOCATION_LABELS: Record<string, string> = {
  restaurant: "Location",
  experience: "Location",
  interview:  "Restaurant / business",
};

const NAME_LABELS: Record<string, string> = {
  restaurant: "Restaurant name",
  experience: "Place or activity",
  interview:  "Person's name",
};

async function sendNotificationEmail(data: {
  type: string;
  suggestionName: string;
  location?: string;
  whyRecommend?: string;
  submitterEmail?: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const typeLabel    = TYPE_LABELS[data.type]    ?? "Suggestion";
  const nameLabel    = NAME_LABELS[data.type]    ?? "Name";
  const locationLabel = LOCATION_LABELS[data.type] ?? "Location";

  const rows = [
    ["Type",         typeLabel],
    [nameLabel,      data.suggestionName],
    [locationLabel,  data.location || "—"],
    ["Why",          data.whyRecommend || "—"],
    ["Submitted by", data.submitterEmail || "—"],
  ];

  const tableRows = rows
    .map(([label, value]) =>
      `<tr>
        <td style="padding:8px 16px 8px 0;color:#8C857F;font-size:12px;white-space:nowrap;vertical-align:top;">${label}</td>
        <td style="padding:8px 0;color:#1F1B18;font-size:14px;">${value}</td>
      </tr>`
    )
    .join("");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "The Stavanger List <onboarding@resend.dev>",
      to: ["jolene.fjl@gmail.com"],
      subject: `[TSL] New ${typeLabel.toLowerCase()}: ${data.suggestionName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 0;">
          <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#8C857F;margin-bottom:8px;">
            The Stavanger List
          </p>
          <h1 style="font-size:22px;font-weight:400;color:#1F1B18;margin:0 0 24px;">
            ${typeLabel}
          </h1>
          <table style="border-collapse:collapse;width:100%;">
            ${tableRows}
          </table>
          <hr style="border:none;border-top:1px solid #E8E4DF;margin:28px 0;" />
          <p style="font-size:11px;color:#B5AFA9;">
            Submitted via thestavangerlist.com
          </p>
        </div>
      `,
    }),
  });
}

async function subscribeToKit(email: string) {
  const apiSecret = process.env.KIT_API_SECRET;
  const formId = process.env.KIT_FORM_ID;
  if (!apiSecret || !formId) return;

  await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_secret: apiSecret, email }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { suggestionName, location, whyRecommend, submitterEmail, subscribeToNewsletter, type } = body;

  const docType = type ?? "experience";
  let savedToSanity = false;
  let emailSent = false;

  // ── Save to Sanity (requires SANITY_API_WRITE_TOKEN) ─────────
  if (process.env.SANITY_API_WRITE_TOKEN) {
    try {
      await writeClient.create({
        _type: "suggestion",
        type: docType,
        suggestionName,
        location,
        whyRecommend,
        submitterEmail: submitterEmail || undefined,
        submittedAt: new Date().toISOString(),
      });
      savedToSanity = true;
    } catch (err) {
      console.error("Suggest: Sanity save failed:", err);
    }
  }

  // ── Send email notification (requires RESEND_API_KEY) ────────
  try {
    await sendNotificationEmail({ type: docType, suggestionName, location, whyRecommend, submitterEmail });
    emailSent = true;
  } catch (err) {
    console.error("Suggest: email notification failed:", err);
  }

  // ── Kit newsletter opt-in ────────────────────────────────
  if (subscribeToNewsletter && submitterEmail) {
    subscribeToKit(submitterEmail).catch(console.error);
  }

  if (savedToSanity || emailSent) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: "Could not save your suggestion right now — please try again." },
    { status: 500 }
  );
}
