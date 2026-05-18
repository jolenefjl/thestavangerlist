export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import { allInterviewsQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import InterviewCard from "@/components/InterviewCard";
import NewsletterSignup from "@/components/NewsletterSignup";


export default async function IntoTheKitchenPage() {
  const [interviews, settings] = await Promise.all([
    client.fetch(allInterviewsQuery),
    client.fetch(siteSettingsQuery),
  ]);

  return (
    <div className="page-bg">
      <Nav />

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="section" style={{ paddingTop: 48, paddingBottom: 36, maxWidth: 680 }}>
        <p className="text-eyebrow" style={{ marginBottom: 12 }}>Stavanger Eats</p>
        <h1 className="text-hero" style={{ marginBottom: 16, fontSize: "clamp(32px, 6vw, 52px)" }}>
          Into the Kitchen
        </h1>
        <p className="text-body text-muted" style={{ maxWidth: 440, lineHeight: 1.75 }}>
          The people behind Stavanger&apos;s best plates — their stories, their food, and what drives them.
        </p>
      </div>

      <div className="divider" />

      {/* ── Interview Grid ───────────────────────────────────── */}
      <section className="section section-gap" style={{ paddingTop: 32 }}>
        {!interviews?.length ? (
          <div style={{ padding: "64px 0", textAlign: "center" }}>
            <p className="text-body text-muted">First interview coming soon.</p>
          </div>
        ) : (
          <div className="card-grid">
            {(interviews as Parameters<typeof InterviewCard>[0]["interview"][]).map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))}
          </div>
        )}
      </section>

      <div className="divider" style={{ margin: "0 0 28px" }} />
      <NewsletterSignup
        eyebrow={settings?.newsletterEyebrow}
        ctaText={settings?.newsletterCtaText}
        subtext={settings?.newsletterSubtext}
        buttonText={settings?.newsletterButtonText}
        successText={settings?.newsletterSuccessText}
      />
      <Footer />
    </div>
  );
}
