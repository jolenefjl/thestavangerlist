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
import { formatPrice } from "@/lib/formatPrice";
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
  return {
    title: `${name} — The Stavanger List`,
    description: description || `Experience review: ${name}`,
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
            src={urlFor(experience.heroImage as Record<string, unknown>).width(2400).height(1400).quality(90).url()}
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
          <h1 className="article-hero-title">{experience.name as string}</h1>
          <p className="article-hero-meta">
            {[experience.category, experience.area, formatPrice(experience.priceRange as string)].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      {/* ── Rating Panel ─────────────────────────────────────── */}
      <div style={{ background: "var(--color-bg-subtle)", borderBottom: "0.5px solid var(--color-border)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px clamp(20px, 6vw, 48px)" }}>
          <p className="text-eyebrow" style={{ marginBottom: 16 }}>My Verdict</p>
          {ratings.map((r) => {
            const score = experience[r.key] as number;
            const blurb = experience[r.blurbKey] as string | null;
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
          {!!overallDisplay && (
            <div className="verdict-overall">
              <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-dm-sans)", fontWeight: 500, color: "var(--color-text-hint)" }}>Overall</span>
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
          <div style={{ maxWidth: 720, margin: "0 auto 48px", padding: "0 clamp(20px, 6vw, 48px)" }}>
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
                <p className="quick-info-value">{formatPrice(experience.priceRange as string)}</p>
              </div>
            )}
            {!!websiteUrl && (
              <div className="quick-info-item">
                <p className="quick-info-label">Website</p>
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="quick-info-value" style={{ color: "var(--color-accent)", textDecoration: "none" }}>
                  Visit →
                </a>
              </div>
            )}
            {!!bookingUrl && bookingUrl !== websiteUrl && (
              <div className="quick-info-item">
                <p className="quick-info-label">Book</p>
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="quick-info-value" style={{ color: "var(--color-accent)", textDecoration: "none" }}>
                  Book →
                </a>
              </div>
            )}
          </div>
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
              fontWeight: 500,
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
        successText={settings?.newsletterSuccessText}
      />
      <Footer />
    </div>
  );
}
