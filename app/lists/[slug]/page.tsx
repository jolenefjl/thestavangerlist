export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { topListBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TopListPage({ params }: PageProps) {
  const { slug } = await params;
  const list = await client.fetch(topListBySlugQuery, { slug });
  if (!list) notFound();

  return (
    <div className="page-bg">
      <Nav />

      {/* ── Hero Image ───────────────────────────────────────── */}
      {list.heroImage && (
        <div style={{ width: "100%", height: "clamp(200px, 35vw, 400px)", position: "relative", background: "var(--color-bg-image)" }}>
          <Image
            src={urlFor(list.heroImage).width(2800).height(1120).quality(90).url()}
            alt={list.heroImage.alt ?? list.title}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="section" style={{ paddingTop: 36, paddingBottom: 0, maxWidth: 720 }}>
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>
          <Link href="/lists" style={{ color: "var(--color-accent)", textDecoration: "none" }}>Top Lists</Link>
        </p>
        <h1 className="text-h1" style={{ marginBottom: list.intro ? 20 : 36 }}>{list.title}</h1>

        {list.intro && (
          <div style={{
            fontSize: 15,
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontWeight: 300,
            lineHeight: 1.75,
            color: "var(--color-text-muted)",
            marginBottom: 32,
            maxWidth: 560,
          }}>
            <PortableText value={list.intro} />
          </div>
        )}
      </div>

      <div className="divider" />

      {/* ── List Items ───────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 8, maxWidth: 720, marginBottom: 48 }}>
        {list.items?.map((item: Record<string, unknown>, i: number) => {
          const review = item.review as Record<string, unknown> | null;
          const reviewSlug = (review?.slug as { current: string } | null)?.current;

          return (
            <div key={i} style={{
              display: "flex",
              gap: 20,
              padding: "24px 0",
              borderBottom: "0.5px solid var(--color-border-light)",
              alignItems: "flex-start",
            }}>
              {/* Number */}
              <span style={{
                fontFamily: "var(--font-spectral), serif",
                fontSize: 32,
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--color-accent-light)",
                lineHeight: 1,
                flexShrink: 0,
                width: 36,
                paddingTop: 2,
              }}>
                {i + 1}
              </span>

              {/* Review thumbnail if linked */}
              {!!review?.heroImage && (
                <Image
                  src={urlFor(review.heroImage).width(240).height(240).quality(85).url()}
                  alt={(review.heroImage as Record<string, unknown>).alt as string ?? item.placeName as string}
                  width={120}
                  height={120}
                  style={{ borderRadius: 3, objectFit: "cover", flexShrink: 0 }}
                />
              )}

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                  <p style={{
                    fontFamily: "var(--font-spectral), serif",
                    fontSize: 18,
                    fontWeight: 300,
                    color: "var(--color-text-primary)",
                    lineHeight: 1.25,
                  }}>
                    {item.placeName as string}
                  </p>
                  {!!review?.cuisine && (
                    <span style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-accent)" }}>
                      {review.cuisine as string}
                    </span>
                  )}
                </div>

                {!!item.description && (
                  <p style={{
                    fontSize: 13,
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 300,
                    color: "var(--color-text-muted)",
                    lineHeight: 1.7,
                    marginBottom: reviewSlug ? 10 : 0,
                  }}>
                    {item.description as string}
                  </p>
                )}

                {reviewSlug && (
                  <Link
                    href={`/eats/${reviewSlug}`}
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--color-accent)",
                      textDecoration: "none",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Read the review →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <div className="divider-full" />
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
