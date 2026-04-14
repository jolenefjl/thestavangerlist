export const dynamic = "force-dynamic";

import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { allExperiencesQuery, experienceCategoryListQuery } from "@/sanity/lib/queries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ExperienceCard from "@/components/ExperienceCard";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function PlayPage({ searchParams }: PageProps) {
  const { category: activeCategory } = await searchParams;

  const [allExperiences, categories] = await Promise.all([
    client.fetch(allExperiencesQuery),
    client.fetch(experienceCategoryListQuery),
  ]);

  const filtered = activeCategory
    ? (allExperiences as Record<string, unknown>[]).filter(
        (e) => (e.category as string)?.toLowerCase() === activeCategory.toLowerCase()
      )
    : (allExperiences as Record<string, unknown>[]);

  return (
    <div className="page-bg">
      <Nav />

      {/* Page Header */}
      <div className="section" style={{ paddingTop: 40, paddingBottom: 24 }}>
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>Stavanger Play</p>
        <h1 className="text-h1">Things worth doing.</h1>
      </div>

      {/* Category Filter Tabs */}
      <div className="filter-bar">
        <Link
          href="/play"
          className={`filter-tab${!activeCategory ? " active" : ""}`}
        >
          All
        </Link>
        {(categories as string[]).filter(Boolean).sort().map((cat) => (
          <Link
            key={cat}
            href={`/play?category=${encodeURIComponent(cat)}`}
            className={`filter-tab${activeCategory?.toLowerCase() === cat.toLowerCase() ? " active" : ""}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Experiences Grid */}
      <section className="section section-gap" style={{ paddingTop: 28 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <p className="text-body text-muted">No experiences yet — check back soon.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 380px))",
              gap: 8,
            }}
          >
            {filtered.map((experience) => (
              <ExperienceCard
                key={experience._id as string}
                experience={experience as unknown as Parameters<typeof ExperienceCard>[0]["experience"]}
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
