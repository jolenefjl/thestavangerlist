export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { allInterviewsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";

function extractExcerpt(blocks: unknown[], maxLength = 160): string {
  if (!Array.isArray(blocks) || !blocks.length) return "";
  const first = blocks.find((b: unknown) => (b as Record<string, unknown>)._type === "block") as Record<string, unknown> | undefined;
  if (!first) return "";
  const text = (first.children as { text?: string }[] ?? []).map((c) => c.text ?? "").join("");
  return text.length > maxLength ? text.slice(0, maxLength).trim() + "…" : text;
}

export default async function IntoTheKitchenPage() {
  const interviews = await client.fetch(allInterviewsQuery);

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
            {interviews.map((interview: Record<string, unknown>) => {
              const slug = (interview.slug as { current: string }).current;
              const restaurant = (interview.linkedReview as Record<string, unknown> | null)?.name as string
                ?? interview.restaurantName as string
                ?? "";
              const excerpt = extractExcerpt(interview.introStory as unknown[]);

              return (
                <Link key={interview._id as string} href={`/eats/into-the-kitchen/${slug}`} className="interview-card">
                  {interview.heroPhoto ? (
                    <Image
                      src={urlFor(interview.heroPhoto).width(600).height(560).url()}
                      alt={(interview.heroPhoto as Record<string, unknown>).alt as string ?? interview.founderName as string}
                      width={600}
                      height={560}
                      className="interview-card-img"
                    />
                  ) : (
                    <div className="interview-card-img" />
                  )}
                  <div className="interview-card-body">
                    {restaurant && <p className="interview-card-restaurant">{restaurant}</p>}
                    <p className="interview-card-name">{interview.founderName as string}</p>
                    {!!interview.founderRole && (
                      <p className="interview-card-role">{String(interview.founderRole)}</p>
                    )}
                    {excerpt && <p className="interview-card-excerpt">{excerpt}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <div className="divider" style={{ margin: "0 0 28px" }} />
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
