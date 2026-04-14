import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { reviewBySlugQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RatingDots from "@/components/RatingDots";
import NewsletterSignup from "@/components/NewsletterSignup";

// Always render on demand so new reviews appear without a redeploy
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const [review, settings] = await Promise.all([
    client.fetch(reviewBySlugQuery, { slug }),
    client.fetch(siteSettingsQuery),
  ]);

  if (!review) notFound();

  const ratings = [
    { key: "didItHitDifferent", blurbKey: "didItHitDifferentBlurb", label: settings?.ratingCaloriesLabel ?? "Worth the Calories?" },
    { key: "wouldIPayAgain",    blurbKey: "wouldIPayAgainBlurb",    label: settings?.ratingBillLabel    ?? "Worth the Bill?" },
    { key: "worthTheHype",      blurbKey: "worthTheHypeBlurb",      label: settings?.ratingHypeLabel    ?? "Worth the Hype?" },
    { key: "theRealDeal",       blurbKey: "theRealDealBlurb",       label: settings?.ratingDetourLabel  ?? "Worth the Detour?" },
    { key: "didStaffCare",      blurbKey: "didStaffCareBlurb",      label: settings?.ratingServiceLabel ?? "Worth Going Back For?" },
  ];

  const scores = ratings.map((r) => review[r.key] as number).filter(Boolean);
  const overallAvg = scores.length
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
    : null;
  const overallDisplay = overallAvg !== null
    ? (Number.isInteger(overallAvg) ? `${overallAvg}.0` : String(overallAvg))
    : null;

  return (
    <div className="page-bg">
      <Nav />

      {/* ── Hero Image ───────────────────────────────────────── */}
      {review.heroImage && (
        <div style={{ width: "100%", height: "clamp(240px, 45vw, 520px)", position: "relative", background: "var(--color-bg-image)" }}>
          <Image
            src={urlFor(review.heroImage).width(2800).height(1400).quality(90).url()}
            alt={review.heroImage.alt ?? review.name}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────────── */}
      <article className="section" style={{ paddingTop: 36, maxWidth: 720, marginBottom: 48 }}>

        {/* Eyebrow + title */}
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>{review.cuisine}</p>
        <h1 className="text-h1" style={{ marginBottom: 6 }}>{review.name}</h1>
        <p className="text-small text-muted" style={{ marginBottom: 28 }}>
          {review.area} · {review.priceRange}
          {review.bestFor?.length > 0 && ` · ${review.bestFor.join(", ")}`}
        </p>

        {/* Quick Info Panel */}
        <div className="quick-info" style={{ marginBottom: 32 }}>
          <div className="quick-info-item">
            <p className="quick-info-label">Cuisine</p>
            <p className="quick-info-value">{review.cuisine}</p>
          </div>
          <div className="quick-info-item">
            <p className="quick-info-label">Area</p>
            <p className="quick-info-value">{review.area}</p>
          </div>
          <div className="quick-info-item">
            <p className="quick-info-label">Price</p>
            <p className="quick-info-value">{review.priceRange}</p>
          </div>
          {review.websiteUrl && (
            <div className="quick-info-item">
              <p className="quick-info-label">Website</p>
              <a
                href={review.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-info-value"
                style={{ color: "var(--color-accent)", textDecoration: "none" }}
              >
                Visit →
              </a>
            </div>
          )}
        </div>

        {/* Rating Panel */}
        <div className="rating-panel">
          <p className="text-eyebrow" style={{ marginBottom: 16 }}>{settings?.verdictTitle ?? "My Verdict"}</p>
          {ratings.map((r) => {
            const score = review[r.key] as number;
            const blurb = review[r.blurbKey] as string | null;
            if (!score) return null;
            return (
              <div key={r.key} className="verdict-item">
                <div className="verdict-header">
                  <span className="verdict-title">{r.label}</span>
                  <RatingDots score={score} />
                </div>
                {!!blurb && <p className="verdict-blurb">{blurb}</p>}
              </div>
            );
          })}
          {overallDisplay && (
            <div className="verdict-overall">
              <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-dm-sans)", fontWeight: 500, color: "var(--color-text-hint)" }}>Overall</span>
              <span style={{ fontSize: 18, fontFamily: "var(--font-spectral)", fontStyle: "italic", fontWeight: 300, color: "var(--color-accent)" }}>
                {overallDisplay}<span style={{ fontSize: 13, fontWeight: 300, color: "var(--color-text-muted)" }}>/5</span>
              </span>
            </div>
          )}
        </div>

        {/* Review Body */}
        {review.body && (
          <div
            style={{
              fontSize: 15,
              lineHeight: 1.75,
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              margin: "32px 0",
            }}
          >
            <PortableText
              value={review.body}
              components={{
                block: {
                  normal: ({ children }) => <p style={{ marginBottom: 20, lineHeight: 1.75 }}>{children}</p>,
                  h2: ({ children }) => <h2 style={{ fontFamily: "var(--font-spectral), serif", fontSize: 22, fontWeight: 300, margin: "36px 0 12px", color: "var(--color-text-primary)" }}>{children}</h2>,
                },
                list: {
                  bullet: ({ children }) => <ul style={{ paddingLeft: 20, marginBottom: 20, lineHeight: 1.75 }}>{children}</ul>,
                },
                listItem: {
                  bullet: ({ children }) => <li style={{ marginBottom: 6, color: "var(--color-text-primary)", fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 300, fontSize: 15 }}>{children}</li>,
                },
                marks: {
                  link: ({ value, children }: { value?: Record<string, unknown>; children?: React.ReactNode }) => <a href={value?.href as string} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)", textDecoration: "underline" }}>{children}</a>,
                  strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
                  em: ({ children }) => <em>{children}</em>,
                },
                types: {
                  image: ({ value }: { value: Record<string, unknown> }) => (
                    <figure style={{ margin: "32px 0" }}>
                      <Image
                        src={urlFor(value).width(800).url()}
                        alt={(value.alt as string) ?? ""}
                        width={800}
                        height={500}
                        style={{ width: "100%", height: "auto", borderRadius: 3, objectFit: "cover" }}
                      />
                      {typeof value.caption === "string" && value.caption && (
                        <figcaption style={{ fontSize: 11, color: "var(--color-text-hint)", marginTop: 8, textAlign: "center", letterSpacing: "0.04em" }}>
                          {value.caption}
                        </figcaption>
                      )}
                    </figure>
                  ),
                },
              }}
            />
          </div>
        )}

        {/* TikTok Embed */}
        {review.tiktokUrl && (() => {
          const videoId = review.tiktokUrl.match(/\/video\/(\d+)/)?.[1];
          if (!videoId) return null;
          const embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
          return (
          <div className="tiktok-embed-wrap">
            <p className="tiktok-label" style={{ padding: "12px 16px 0" }}>{settings?.watchVideoLabel ?? "Watch the video"}</p>
            <iframe
              src={embedUrl}
              style={{ width: "100%", height: 700, border: "none" }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
          );
        })()}

        {/* Photo Gallery */}
        {review.gallery?.length > 0 && (
          <div style={{ margin: "32px 0" }}>
            <p className="text-eyebrow" style={{ marginBottom: 14 }}>{settings?.morePhotosLabel ?? "More Photos"}</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 4,
              }}
            >
              {review.gallery.map((img: Record<string, unknown>, i: number) => (
                <div key={i} style={{ position: "relative", aspectRatio: "1", background: "var(--color-bg-image)", borderRadius: 2, overflow: "hidden" }}>
                  <Image
                    src={urlFor(img).width(900).height(900).quality(85).url()}
                    alt={(img.alt as string) ?? `${review.name} photo ${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggest a Restaurant CTA */}
        <div
          style={{
            borderTop: "0.5px solid var(--color-border)",
            paddingTop: 28,
            marginTop: 40,
          }}
        >
          <p className="text-eyebrow" style={{ marginBottom: 8 }}>{settings?.suggestEyebrow ?? "Know a great spot?"}</p>
          <h3 className="text-h3" style={{ marginBottom: 8 }}>{settings?.suggestHeading ?? "Suggest a restaurant"}</h3>
          <p className="text-body text-muted" style={{ marginBottom: 16 }}>
            {settings?.suggestBody ?? "I eat everywhere so you don't have to. Tell me where to go next."}
          </p>
          <Link
            href="/suggest"
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
            {settings?.suggestCtaText ?? "Suggest a Place"}
          </Link>
        </div>
      </article>

      <div className="divider-full" />
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
