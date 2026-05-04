export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { experienceBySlugQuery, siteSettingsQuery } from "@/sanity/lib/queries";
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
  const experience = await client.fetch(experienceBySlugQuery, { slug });
  if (!experience) return {};
  const name = experience.name as string;
  let description = "";
  const body = experience.body as unknown[] | null;
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
  const ogImageUrl: string | null = experience.ogImage
    ? urlFor(experience.ogImage as Record<string, unknown>).width(1200).height(630).fit("crop").url()
    : experience.heroImage
    ? urlFor(experience.heroImage as Record<string, unknown>).width(1200).height(630).fit("crop").url()
    : null;
  const title = `${name} — The Stavanger List`;
  const desc = description || `Experience review: ${name}`;
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

export default async function ExperiencePage({ params }: PageProps) {
  const { slug } = await params;
  const [experience, settings] = await Promise.all([
    client.fetch(experienceBySlugQuery, { slug }),
    client.fetch(siteSettingsQuery),
  ]);

  if (!experience) notFound();

  const ratings = [
    { key: "worthYourTime",        blurbKey: "worthYourTimeBlurb",        label: "Worth your time?" },
    { key: "worthThePrice",        blurbKey: "worthThePriceBlurb",        label: "Worth the price?" },
    { key: "worthTheHype",         blurbKey: "worthTheHypeBlurb",         label: "Worth the hype?" },
    { key: "worthBringingAFriend", blurbKey: "worthBringingAFriendBlurb", label: "Worth bringing a friend?" },
    { key: "worthDoingAgain",      blurbKey: "worthDoingAgainBlurb",      label: "Worth doing again?" },
  ];

  const scores = ratings.map((r) => experience[r.key] as number).filter(Boolean);
  const overallAvg = scores.length
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
    : null;
  const overallDisplay = overallAvg !== null
    ? (Number.isInteger(overallAvg) ? `${overallAvg}.0` : String(overallAvg))
    : null;

  const websiteUrl = experience.websiteUrl as string | null;
  const bookingUrl = experience.bookingUrl as string | null;

  return (
    <div className="page-bg">
      <Nav />

      {/* ── Hero: Full bleed image with centred overlay text ──── */}
      <div className="article-hero">
        {!!experience.heroImage && (
          <Image
            src={urlFor(experience.heroImage as Record<string, unknown>).quality(90).url()}
            alt={(experience.heroImage as Record<string, unknown>).alt as string ?? experience.name as string}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        )}
        <div className="article-hero-overlay" />
        <div className="article-hero-content">
          <span className="article-hero-eyebrow">Stavanger Play</span>
          <h1 className="article-hero-title" style={{ whiteSpace: "pre-line" }}>{(experience.heroTitle ?? experience.name) as string}</h1>
          {!!(experience.subtitle as string) && (
            <h2 className="article-hero-subtitle">{experience.subtitle as string}</h2>
          )}
          <p className="article-hero-meta">
            {[experience.category, experience.area, experience.priceRange].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      {/* ── Rating Panel ─────────────────────────────────────── */}
      <div style={{ background: "var(--color-bg-subtle)", borderBottom: "0.5px solid var(--color-border)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px clamp(20px, 6vw, 48px)" }}>
          <p className="text-eyebrow" style={{ marginBottom: 16 }}>{settings?.verdictTitle ?? "My Verdict"}</p>
          {ratings.map((r) => {
            const score = experience[r.key] as number;
            const blurb = experience[r.blurbKey] as string | null;
            if (!score) return null;
            return (
              <div key={r.key} className="verdict-item">
                <div className="verdict-left">
                  <span className="verdict-title">{r.label}</span>
                  {!!blurb && <p className="verdict-blurb">{blurb}</p>}
                </div>
                <RatingDots score={score} />
              </div>
            );
          })}
          {!!overallDisplay && (
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
      {!!experience.body && (
        <div className="article-body">
          <PortableText
            value={experience.body as Parameters<typeof PortableText>[0]["value"]}
            components={richTextComponents}
          />
        </div>
      )}

      {/* ── TikTok Embed ─────────────────────────────────────── */}
      {!!(experience.tiktokUrl as string) && (() => {
        const videoId = (experience.tiktokUrl as string).match(/\/video\/(\d+)/)?.[1];
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
            {!!(experience.category as string) && (
              <div className="quick-info-item">
                <p className="quick-info-label">Category</p>
                <p className="quick-info-value">{experience.category as string}</p>
              </div>
            )}
            {!!(experience.area as string) && (
              <div className="quick-info-item">
                <p className="quick-info-label">Area</p>
                <p className="quick-info-value">{experience.area as string}</p>
              </div>
            )}
            {!!(experience.priceRange as string) && (
              <div className="quick-info-item">
                <p className="quick-info-label">Price</p>
                <p className="quick-info-value">{experience.priceRange as string}</p>
              </div>
            )}
            {!!bookingUrl && (
              <div className="quick-info-item">
                <p className="quick-info-label">Book</p>
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="quick-info-value" style={{ color: "var(--color-accent)", textDecoration: "none" }}>
                  Book →
                </a>
              </div>
            )}
          </div>

          {/* ── Website + Map cards ─────────────────────────────── */}
          {(websiteUrl || experience.address || experience.googleMapsUrl) && (
            <div className="quick-info-cards">
              {websiteUrl && (() => {
                let domain = websiteUrl;
                try { domain = new URL(websiteUrl).hostname.replace(/^www\./, ""); } catch {}
                return (
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="quick-info-map-card">
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
              {(experience.address || experience.googleMapsUrl) && (
                <a
                  href={experience.googleMapsUrl as string ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(experience.address as string)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-info-map-card"
                >
                  <svg className="quick-info-map-pin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  <div className="quick-info-map-text">
                    {experience.address && <span className="quick-info-map-address">{experience.address as string}</span>}
                    <span className="quick-info-map-cta">Open in Google Maps →</span>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── Suggest CTA ────────────────────────────────────── */}
        <div style={{ borderTop: "0.5px solid var(--color-border)", paddingTop: 28 }}>
          <p className="text-eyebrow" style={{ marginBottom: 8 }}>Know something worth doing?</p>
          <h3 className="text-h3" style={{ marginBottom: 8 }}>Suggest an experience</h3>
          <p className="text-body text-muted" style={{ marginBottom: 16 }}>
            Tell me about a place or activity worth adding to the list.
          </p>
          <Link
            href="/play/suggest"
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
            Suggest a Place
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
