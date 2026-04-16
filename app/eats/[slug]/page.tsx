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

      {/* ── Hero: Full bleed image with centred overlay text ──── */}
      <div className="article-hero">
        {review.heroImage && (
          <Image
            src={urlFor(review.heroImage).width(2400).height(1400).quality(90).url()}
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
          <h1 className="article-hero-title">{review.name}</h1>
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
            <iframe
              src={`https://www.tiktok.com/embed/v2/${videoId}`}
              style={{ width: "100%", height: 700, border: "none" }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
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
            {review.address && (
              <div className="quick-info-item">
                <p className="quick-info-label">Address</p>
                <p className="quick-info-value">{review.address}</p>
              </div>
            )}
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
        successText={settings?.newsletterSuccessText}
      />
      <Footer />
    </div>
  );
}
