export const dynamic = "force-dynamic";

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
import { richTextComponents } from "@/components/RichTextComponents";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const review = await client.fetch(reviewBySlugQuery, { slug });
  if (!review) return {};
  const name = review.name as string;
  let description = "";
  const body = review.body as unknown[] | null;
  if (body && Array.isArray(body)) {
    const firstBlock = body.find(
      (b): b is Record<string, unknown> =>
        typeof b === "object" && b !== null && (b as Record<string, unknown>)._type === "block"
    );
    if (firstBlock) {
      const children = firstBlock.children as Array<Record<string, unknown>> | undefined;
      if (children) {
        const text = children.map((c) => c.text ?? "").join("").trim();
        description = text.split(".")[0] + ".";
      }
    }
  }
  const ogImageUrl: string | null = review.ogImage
    ? urlFor(review.ogImage as Record<string, unknown>).width(1200).height(630).fit("crop").url()
    : review.heroImage
    ? urlFor(review.heroImage as Record<string, unknown>).width(1200).height(630).fit("crop").url()
    : null;
  const title = `${name} — The Stavanger List`;
  const desc = description || `Restaurant review: ${name}`;
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: name }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const [review, settings] = await Promise.all([
    client.fetch(reviewBySlugQuery, { slug }),
    client.fetch(siteSettingsQuery),
  ]);

  if (!review) notFound();

  const ratings = [
    { key: "didItHitDifferent", blurbKey: "didItHitDifferentBlurb", label: settings?.ratingCaloriesLabel ?? "Worth the Calories?", sub: settings?.ratingCaloriesSub ?? "Food quality" },
    { key: "wouldIPayAgain",    blurbKey: "wouldIPayAgainBlurb",    label: settings?.ratingBillLabel    ?? "Worth the Bill?",      sub: settings?.ratingBillSub    ?? "Value for money" },
    { key: "worthTheHype",      blurbKey: "worthTheHypeBlurb",      label: settings?.ratingHypeLabel    ?? "Worth the Hype?",      sub: settings?.ratingHypeSub    ?? "Does it live up to its reputation?" },
    { key: "theRealDeal",       blurbKey: "theRealDealBlurb",       label: settings?.ratingDetourLabel  ?? "Worth the Detour?",    sub: settings?.ratingDetourSub  ?? "How authentic is it?" },
    { key: "didStaffCare",      blurbKey: "didStaffCareBlurb",      label: settings?.ratingServiceLabel ?? "Worth Going Back For?", sub: settings?.ratingServiceSub ?? "Service" },
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

      {/* ── Hero: Full bleed image with centred overlay text ──── */}
      <div className="article-hero">
        {review.heroImage && (
          <Image
            src={urlFor(review.heroImage).quality(90).url()}
            alt={review.heroImage.alt ?? review.name}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        )}
        <div className="article-hero-overlay" />
        <div className="article-hero-content">
          <span className="article-hero-eyebrow">Stavanger Eats</span>
          <h1 className="article-hero-title" style={{ whiteSpace: "pre-line" }}>{review.heroTitle ?? review.name}</h1>
          {review.subtitle && (
            <h2 className="article-hero-subtitle">{review.subtitle}</h2>
          )}
          <p className="article-hero-meta">
            {[review.cuisine, review.area, review.priceRange].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      {/* ── Rating Panel ─────────────────────────────────────── */}
      <div style={{ background: "var(--color-bg-subtle)", borderBottom: "0.5px solid var(--color-border)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px clamp(20px, 6vw, 48px)" }}>
          <p className="text-eyebrow" style={{ marginBottom: 16 }}>{settings?.verdictTitle ?? "My Verdict"}</p>
          {ratings.map((r) => {
            const score = review[r.key] as number;
            const blurb = review[r.blurbKey] as string | null;
            if (!score) return null;
            return (
              <div key={r.key} className="verdict-item">
                <div className="verdict-left">
                  <span className="verdict-title">{r.label}</span>
                  {!!r.sub && <span className="verdict-sub">{r.sub}</span>}
                  {!!blurb && <p className="verdict-blurb">{blurb}</p>}
                </div>
                <RatingDots score={score} />
              </div>
            );
          })}
          {overallDisplay && (
            <div className="verdict-overall">
              <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: "var(--color-text-hint)" }}>Overall</span>
              <span style={{ fontSize: 18, fontFamily: "var(--font-spectral)", fontStyle: "italic", fontWeight: 300, color: "var(--color-accent)" }}>
                {overallDisplay}<span style={{ fontSize: 13, fontWeight: 300, color: "var(--color-text-muted)" }}>/5</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Article Body ─────────────────────────────────────── */}
      {review.body && (
        <div className="article-body">
          <PortableText value={review.body} components={richTextComponents} />
        </div>
      )}

      {/* ── TikTok Embed ─────────────────────────────────────── */}
      {review.tiktokUrl && (() => {
        const videoId = review.tiktokUrl.match(/\/video\/(\d+)/)?.[1];
        if (!videoId) return null;
        return (
          <div className="tiktok-embed-wrap article-body-text" style={{ maxWidth: 720, margin: "0 auto 48px", padding: "0 clamp(20px, 6vw, 48px)" }}>
            <p className="tiktok-label" style={{ padding: "12px 0 0" }}>{settings?.watchVideoLabel ?? "Watch the video"}</p>
            <div className="tiktok-frame-wrap">
              <iframe
                src={`https://www.tiktok.com/embed/v2/${videoId}`}
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                scrolling="no"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        );
      })()}

      {/* ── Quick Info Panel ─────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 clamp(20px, 6vw, 48px) 48px" }}>
        <div style={{ borderTop: "0.5px solid var(--color-border)", paddingTop: 32, marginBottom: 40 }}>
          <p className="text-eyebrow" style={{ marginBottom: 20 }}>Quick Info</p>
          <div className="quick-info">
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
            {review.bestFor?.length > 0 && (
              <div className="quick-info-item">
                <p className="quick-info-label">Best For</p>
                <p className="quick-info-value">{review.bestFor.join(", ")}</p>
              </div>
            )}
          </div>

          {/* ── Website + Map cards ─────────────────────────────── */}
          {(review.websiteUrl || review.address || review.googleMapsUrl) && (
            <div className="quick-info-cards">
              {review.websiteUrl && (() => {
                let domain = review.websiteUrl as string;
                try { domain = new URL(review.websiteUrl as string).hostname.replace(/^www\./, ""); } catch {}
                return (
                  <a href={review.websiteUrl as string} target="_blank" rel="noopener noreferrer" className="quick-info-map-card">
                    <svg className="quick-info-map-pin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <div className="quick-info-map-text">
                      <span className="quick-info-map-address">{domain}</span>
                      <span className="quick-info-map-cta">Visit website →</span>
                    </div>
                  </a>
                );
              })()}
              {(review.address || review.googleMapsUrl) && (
                <a
                  href={review.googleMapsUrl as string ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(review.address as string)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-info-map-card"
                >
                  <svg className="quick-info-map-pin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  <div className="quick-info-map-text">
                    {review.address && <span className="quick-info-map-address">{review.address as string}</span>}
                    <span className="quick-info-map-cta">Open in Google Maps →</span>
                  </div>
                </a>
              )}
            </div>
          )}

          {/* ── Reviewed By ─────────────────────────────────────── */}
          {review.author && (
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "var(--color-bg-subtle)", border: "0.5px solid var(--color-border)", borderRadius: 3 }}>
              {review.author.photo && (
                <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", overflow: "hidden", position: "relative" }}>
                  <Image
                    src={urlFor(review.author.photo as Record<string, unknown>).width(112).height(112).fit("crop").url()}
                    alt={(review.author.photo as Record<string, unknown>).alt as string ?? review.author.name as string}
                    fill
                    sizes="56px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: "var(--color-accent)", marginBottom: 3, lineHeight: 1 }}>Reviewed by</p>
                <p style={{ fontSize: 16, fontFamily: "var(--font-spectral)", fontWeight: 600, color: "var(--color-text)", marginBottom: 4, lineHeight: 1.2 }}>{review.author.name as string}</p>
                {review.author.bio && (
                  <p style={{ fontSize: 13, fontFamily: "var(--font-dm-sans)", color: "var(--color-text-muted)", lineHeight: 1.5, margin: 0 }}>{review.author.bio as string}</p>
                )}
              </div>
              {(review.author.instagramUrl || review.author.tiktokUrl || review.author.email) && (
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {review.author.instagramUrl && (
                    <a href={review.author.instagramUrl as string} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", border: "0.5px solid var(--color-border)", color: "var(--color-text-muted)", transition: "border-color 0.15s, color 0.15s" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </a>
                  )}
                  {review.author.tiktokUrl && (
                    <a href={review.author.tiktokUrl as string} target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", border: "0.5px solid var(--color-border)", color: "var(--color-text-muted)", transition: "border-color 0.15s, color 0.15s" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                      </svg>
                    </a>
                  )}
                  {review.author.email && (
                    <a href={`mailto:${review.author.email as string}`} aria-label="Email" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", border: "0.5px solid var(--color-border)", color: "var(--color-text-muted)", transition: "border-color 0.15s, color 0.15s" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Suggest CTA ────────────────────────────────────── */}
        <div style={{ borderTop: "0.5px solid var(--color-border)", paddingTop: 28 }}>
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
              fontWeight: 600,
            }}
          >
            {settings?.suggestCtaText ?? "Suggest a Place"}
          </Link>
        </div>
      </div>

      <div className="divider-full" />
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
