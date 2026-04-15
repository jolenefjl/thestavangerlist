export const dynamic = "force-dynamic";

import { client } from "@/sanity/lib/client";
import { allReviewsQuery, allExperiencesQuery, allTopListsQuery } from "@/sanity/lib/queries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SearchClient, { type SearchItem } from "@/components/SearchClient";

export default async function SearchPage() {
  const [reviews, experiences, lists] = await Promise.all([
    client.fetch(allReviewsQuery),
    client.fetch(allExperiencesQuery),
    client.fetch(allTopListsQuery),
  ]);

  const items: SearchItem[] = [
    ...(reviews ?? []).map((r: Record<string, unknown>) => ({
      _id: r._id as string,
      kind: "eats" as const,
      title: r.name as string,
      subtitle: [r.cuisine, r.area].filter(Boolean).join(" · ") as string,
      href: `/eats/${(r.slug as { current: string }).current}`,
    })),
    ...(experiences ?? []).map((e: Record<string, unknown>) => ({
      _id: e._id as string,
      kind: "play" as const,
      title: e.name as string,
      subtitle: [e.category, e.area].filter(Boolean).join(" · ") as string,
      href: `/play/${(e.slug as { current: string }).current}`,
    })),
    ...(lists ?? []).map((l: Record<string, unknown>) => ({
      _id: l._id as string,
      kind: "lists" as const,
      title: l.title as string,
      subtitle: (l.cardTeaser as string) ?? "",
      href: `/lists/${(l.slug as { current: string }).current}`,
    })),
  ];

  return (
    <div className="page-bg">
      <Nav />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px clamp(24px, 7.2vw, 58px) 96px" }}>
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>Search</p>
        <h1 className="text-h3" style={{ marginBottom: 24 }}>Find a place or a list</h1>
        <SearchClient items={items} />
      </main>
      <Footer />
    </div>
  );
}
