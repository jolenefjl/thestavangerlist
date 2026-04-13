export const dynamic = "force-dynamic";

import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { allReviewsQuery, cuisineListQuery } from "@/sanity/lib/queries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReviewCard from "@/components/ReviewCard";

interface PageProps {
  searchParams: Promise<{ cuisine?: string }>;
}

export default async function EatsPage({ searchParams }: PageProps) {
  const { cuisine: activeCuisine } = await searchParams;

  const [allReviews, cuisines] = await Promise.all([
    client.fetch(allReviewsQuery),
    client.fetch(cuisineListQuery),
  ]);

  const filtered = activeCuisine
    ? allReviews.filter(
        (r: Record<string, unknown>) =>
          (r.cuisine as string)?.toLowerCase() === activeCuisine.toLowerCase()
      )
    : allReviews;

  return (
    <div className="page-bg">
      <Nav />

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="section" style={{ paddingTop: 40, paddingBottom: 24 }}>
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>🍽️ Stavanger Eats</p>
        <h1 className="text-h1">Restaurant Reviews</h1>
      </div>

      {/* ── Cuisine Filter Tabs ───────────────────────────────── */}
      <div className="filter-bar">
        <Link
          href="/eats"
          className={`filter-tab${!activeCuisine ? " active" : ""}`}
        >
          All
        </Link>
        {(cuisines as string[]).sort().map((cuisine) => (
          <Link
            key={cuisine}
            href={`/eats?cuisine=${encodeURIComponent(cuisine)}`}
            className={`filter-tab${activeCuisine?.toLowerCase() === cuisine.toLowerCase() ? " active" : ""}`}
          >
            {cuisine}
          </Link>
        ))}
      </div>

      {/* ── Reviews Grid ─────────────────────────────────────── */}
      <section className="section section-gap" style={{ paddingTop: 28 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <p className="text-body text-muted">No reviews yet — check back soon.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 4,
            }}
          >
            {filtered.map((review: Record<string, unknown>) => (
              <ReviewCard
                key={review._id as string}
                review={review as unknown as Parameters<typeof ReviewCard>[0]["review"]}
                size="small"
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
