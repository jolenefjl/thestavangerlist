export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { allTopListsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";

export default async function ListsPage() {
  const lists = await client.fetch(allTopListsQuery);

  return (
    <div className="page-bg">
      <Nav />

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="section" style={{ paddingTop: 40, paddingBottom: 32 }}>
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>Stavanger Eats</p>
        <h1 className="text-h1">Top Lists</h1>
      </div>

      <div className="divider" />

      {/* ── Lists ────────────────────────────────────────────── */}
      <section className="section section-gap" style={{ paddingTop: 8 }}>
        {!lists?.length ? (
          <div style={{ padding: "64px 0", textAlign: "center" }}>
            <p className="text-body text-muted">No lists yet — check back soon.</p>
          </div>
        ) : (
          <div>
            {lists.map((list: Record<string, unknown>, i: number) => (
              <Link
                key={list._id as string}
                href={`/lists/${(list.slug as { current: string }).current}`}
                className="list-row"
              >
                  {/* Number */}
                  <span className="list-row-num">
                    {i + 1}
                  </span>

                  {/* Thumbnail */}
                  {list.heroImage ? (
                    <Image
                      src={urlFor(list.heroImage).width(200).height(140).url()}
                      alt={(list.heroImage as Record<string, unknown>).alt as string ?? list.title as string}
                      width={200}
                      height={140}
                      className="list-row-thumb"
                    />
                  ) : (
                    <div className="list-row-thumb list-row-thumb-placeholder" />
                  )}

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "var(--font-spectral), serif",
                      fontSize: 18,
                      fontWeight: 300,
                      color: "var(--color-text-primary)",
                      marginBottom: 4,
                      lineHeight: 1.25,
                    }}>
                      {list.title as string}
                    </p>
                    <p style={{ fontSize: 10, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--color-text-hint)" }}>
                      {list.itemCount as number} {(list.itemCount as number) === 1 ? "place" : "places"}
                    </p>
                  </div>

                  <span style={{ fontSize: 14, color: "var(--color-accent-light)", flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="divider" style={{ marginTop: 16 }} />
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
