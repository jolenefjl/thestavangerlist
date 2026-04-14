export const dynamic = "force-dynamic";

import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery, latestReviewsQuery, allTopListsQuery } from "@/sanity/lib/queries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReviewCard from "@/components/ReviewCard";
import NewsletterSignup from "@/components/NewsletterSignup";

export default async function Home() {
  const [settings, latestReviews, topLists] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(latestReviewsQuery),
    client.fetch(allTopListsQuery),
  ]);

  const featured: unknown[] = settings?.featuredReviews ?? [];
  const mainFeatured = featured[0] as Record<string, unknown> | undefined;
  const secondaryFeatured = (featured.slice(1, 3) ?? []) as Record<string, unknown>[];

  return (
    <div className="page-bg">
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="section section-gap" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <p className="text-eyebrow" style={{ marginBottom: 14 }}>
          {settings?.heroEyebrow ?? "🍽️ Stavanger Eats"}
        </p>
        <h1 className="text-hero">
          {(settings?.heroHeadline ?? "The best places to eat in")
            .split("\n")
            .map((line: string, i: number, arr: string[]) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}{" "}
          <span className="text-italic">
            {settings?.heroHeadlineAccent ?? "Stavanger."}
          </span>
        </h1>
        <p className="text-body text-muted" style={{ marginTop: 18, maxWidth: 460 }}>
          {settings?.heroSubheading ?? "Honest reviews for the Stavanger region — every place tested, never sponsored."}
        </p>
        <div style={{ marginTop: 28, display: "flex", gap: 16, alignItems: "center" }}>
          <Link
            href="/eats"
            style={{
              display: "inline-block",
              background: "var(--color-dark)",
              color: "var(--color-light)",
              padding: "10px 20px",
              borderRadius: 3,
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
            }}
          >
            {settings?.homepageCtaText ?? "Browse All Reviews"}
          </Link>
        </div>
      </section>

      <div className="divider" />

      {/* ── Featured Reviews ─────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section section-gap">
          <div className="section-header">
            <h2 className="section-title">{settings?.homepageFeaturedTitle ?? "Editor's Picks"}</h2>
            <Link href="/eats" className="section-link">See all →</Link>
          </div>

          <div className="featured-grid" style={{ gap: 4, borderRadius: 6 }}>
            {mainFeatured && (
              <ReviewCard review={mainFeatured as unknown as Parameters<typeof ReviewCard>[0]["review"]} size="main" />
            )}
            {secondaryFeatured.map((r) => (
              <ReviewCard
                key={r._id as string}
                review={r as unknown as Parameters<typeof ReviewCard>[0]["review"]}
                size="small"
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Top Lists ────────────────────────────────────────── */}
      {topLists?.length > 0 && (
        <>
          <div className="divider" />
          <section className="section section-gap">
            <div className="section-header">
              <h2 className="section-title">{settings?.homepageTopListsTitle ?? "Top Lists"}</h2>
              <Link href="/lists" className="section-link">See all →</Link>
            </div>

            <div>
              {topLists.slice(0, 4).map((list: Record<string, unknown>, i: number) => (
                <Link
                  key={list._id as string}
                  href={`/lists/${(list.slug as { current: string }).current}`}
                  className="list-item"
                >
                  <div className="list-item-left">
                    <span className="list-num">{i + 1}</span>
                    <div>
                      <p className="list-name">{list.title as string}</p>
                      <p className="list-tag">{list.itemCount as number} places</p>
                    </div>
                  </div>
                  <span className="list-arrow">→</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Latest Reviews ───────────────────────────────────── */}
      {latestReviews?.length > 0 && (
        <>
          <div className="divider" />
          <section className="section section-gap">
            <div className="section-header">
              <h2 className="section-title">{settings?.homepageLatestTitle ?? "Latest Reviews"}</h2>
              <Link href="/eats" className="section-link">See all →</Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
              {latestReviews.map((review: Record<string, unknown>) => (
                <ReviewCard
                  key={review._id as string}
                  review={review as unknown as Parameters<typeof ReviewCard>[0]["review"]}
                  size="small"
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Newsletter ───────────────────────────────────────── */}
      <div className="divider" style={{ margin: "0 0 28px" }} />
      <NewsletterSignup
        eyebrow={settings?.newsletterEyebrow}
        ctaText={settings?.newsletterCtaText}
        subtext={settings?.newsletterSubtext}
        successText={settings?.newsletterSuccessText}
      />

      <Footer />
    </div>
  );
}
