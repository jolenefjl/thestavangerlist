import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery, latestReviewsQuery, allTopListsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReviewCard from "@/components/ReviewCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import RatingDots from "@/components/RatingDots";

function avgRating(review: Record<string, number>): number {
  const scores = [
    review.didItHitDifferent,
    review.wouldIPayAgain,
    review.worthTheHype,
    review.theRealDeal,
    review.didStaffCare,
  ].filter((s): s is number => s != null);
  if (!scores.length) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

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
          {(() => {
            const headline: string = settings?.heroHeadline ?? "The best places to eat in |Stavanger.";
            const [before, after] = headline.split("|");
            return after ? <>{before}<span className="text-italic">{after}</span></> : <>{before}</>;
          })()}
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
            Browse All Reviews
          </Link>
        </div>
      </section>

      <div className="divider" />

      {/* ── Featured Reviews ─────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section section-gap">
          <div className="section-header">
            <h2 className="section-title">Editor&apos;s Picks</h2>
            <Link href="/eats" className="section-link">See all →</Link>
          </div>

          <div className="featured-grid">
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
              <h2 className="section-title">Top Lists</h2>
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
              <h2 className="section-title">Latest Reviews</h2>
              <Link href="/eats" className="section-link">See all →</Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--color-border)", border: "0.5px solid var(--color-border)", borderRadius: 3, overflow: "hidden" }}>
              {latestReviews.map((review: Record<string, unknown>) => (
                <Link
                  key={review._id as string}
                  href={`/eats/${(review.slug as { current: string }).current}`}
                  style={{ textDecoration: "none", background: "var(--color-bg)", display: "flex", alignItems: "center", gap: 16, padding: "14px 16px" }}
                >
                  {review.heroImage ? (
                    <Image
                      src={urlFor(review.heroImage).width(80).height(80).url()}
                      alt={(review.heroImage as Record<string, unknown>).alt as string ?? review.name as string}
                      width={56}
                      height={56}
                      style={{ borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: 2, background: "var(--color-bg-image)", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="card-meta">
                      <span className="card-cuisine">{review.cuisine as string}</span>
                      <span className="card-price">{review.priceRange as string}</span>
                    </div>
                    <p className="card-name card-name-sm" style={{ marginBottom: 2 }}>{review.name as string}</p>
                    <p className="text-small text-hint">{review.area as string}</p>
                  </div>
                  {avgRating(review as Record<string, number>) > 0 && (
                    <RatingDots score={avgRating(review as Record<string, number>)} />
                  )}
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Newsletter ───────────────────────────────────────── */}
      <div className="divider" style={{ margin: "0 0 28px" }} />
      <NewsletterSignup ctaText={settings?.newsletterCtaText} />

      <Footer />
    </div>
  );
}
