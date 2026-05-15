export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { interviewBySlugQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { richTextComponents } from "@/components/RichTextComponents";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const interview = await client.fetch(interviewBySlugQuery, { slug });
  if (!interview) return {};

  const pageTitle = (interview.title as string | null)
    ?? (interview.founderName as string);
  const restaurant = (interview.linkedReview as Record<string, unknown> | null)?.name as string
    ?? interview.restaurantName as string ?? "";
  const title = `${pageTitle} — The Stavanger List`;
  const description = restaurant
    ? `Into the Kitchen with ${interview.founderName as string}${restaurant ? ` of ${restaurant}` : ""}.`
    : `Into the Kitchen with ${interview.founderName as string}.`;

  return { title, description };
}

export default async function InterviewPage({ params }: PageProps) {
  const { slug } = await params;
  const [interview, settings] = await Promise.all([
    client.fetch(interviewBySlugQuery, { slug }),
    client.fetch(siteSettingsQuery),
  ]);
  if (!interview) notFound();

  const linkedReview = interview.linkedReview as {
    name: string;
    slug: { current: string };
    cuisine?: string;
    area?: string;
    priceRange?: string;
    websiteUrl?: string;
    googleMapsUrl?: string;
    address?: string;
  } | null;

  const restaurantName = linkedReview?.name ?? interview.restaurantName as string ?? "";
  const heroTitle = (interview.title as string | null) ?? interview.founderName as string;
  const heroSubtitle = (interview.subtitle as string | null)
    ?? [interview.founderRole, restaurantName].filter(Boolean).join(" · ");

  return (
    <div className="page-bg">
      <Nav />

      {/* ── Hero: Full bleed image with centred overlay text ──── */}
      <div className="article-hero">
        {interview.heroPhoto && (
          <Image
            src={urlFor(interview.heroPhoto as Record<string, unknown>).quality(90).url()}
            alt={(interview.heroPhoto as Record<string, unknown>).alt as string ?? heroTitle}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        )}
        <div className="article-hero-overlay" />
        <div className="article-hero-content">
          <span className="article-hero-eyebrow">Into the Kitchen</span>
          <h1 className="article-hero-title" style={{ whiteSpace: "pre-line" }}>{heroTitle}</h1>
          {heroSubtitle && (
            <h2 className="article-hero-subtitle">{heroSubtitle}</h2>
          )}
        </div>
      </div>

      {/* ── Article Body ─────────────────────────────────────── */}
      {interview.introStory && (
        <div className="article-body">
          <PortableText
            value={(() => {
              let qaCount = 0;
              return (interview.introStory as Record<string, unknown>[]).map((block) =>
                block._type === "qaBlock"
                  ? { ...block, _questionNumber: ++qaCount }
                  : block
              );
            })() as unknown as Parameters<typeof PortableText>[0]["value"]}
            components={richTextComponents}
          />
        </div>
      )}

      {/* ── Quick Info ───────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 clamp(20px, 6vw, 48px) 48px" }}>
        <div style={{ borderTop: "0.5px solid var(--color-border)", paddingTop: 32, marginBottom: 40 }}>
          <p className="text-eyebrow" style={{ marginBottom: 20 }}>Quick Info</p>
          <div className="quick-info">
            {!!(interview.founderName as string) && (
              <div className="quick-info-item">
                <p className="quick-info-label">In the Kitchen With</p>
                <p className="quick-info-value">{interview.founderName as string}</p>
              </div>
            )}
            {!!(interview.founderRole as string) && (
              <div className="quick-info-item">
                <p className="quick-info-label">Role</p>
                <p className="quick-info-value">{interview.founderRole as string}</p>
              </div>
            )}
            {!!restaurantName && (
              <div className="quick-info-item">
                <p className="quick-info-label">Restaurant</p>
                <p className="quick-info-value">{restaurantName}</p>
              </div>
            )}
            {!!linkedReview?.cuisine && (
              <div className="quick-info-item">
                <p className="quick-info-label">Cuisine</p>
                <p className="quick-info-value">{linkedReview.cuisine}</p>
              </div>
            )}
            {!!linkedReview?.area && (
              <div className="quick-info-item">
                <p className="quick-info-label">Area</p>
                <p className="quick-info-value">{linkedReview.area}</p>
              </div>
            )}
            {!!linkedReview?.priceRange && (
              <div className="quick-info-item">
                <p className="quick-info-label">Price</p>
                <p className="quick-info-value">{linkedReview.priceRange}</p>
              </div>
            )}
          </div>

          {/* ── Review + Map cards ───────────────────────────── */}
          {linkedReview && (
            <div className="quick-info-cards" style={{ marginTop: 28 }}>
              <Link
                href={`/eats/${linkedReview.slug.current}`}
                className="quick-info-map-card"
              >
                <svg className="quick-info-map-pin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <div className="quick-info-map-text">
                  <span className="quick-info-map-address">{linkedReview.name}</span>
                  <span className="quick-info-map-cta">Read the review →</span>
                </div>
              </Link>
              {(linkedReview.address || linkedReview.googleMapsUrl) && (
                <a
                  href={linkedReview.googleMapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(linkedReview.address ?? linkedReview.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-info-map-card"
                >
                  <svg className="quick-info-map-pin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  <div className="quick-info-map-text">
                    {linkedReview.address && <span className="quick-info-map-address">{linkedReview.address}</span>}
                    <span className="quick-info-map-cta">Open in Google Maps →</span>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── Suggest CTA ──────────────────────────────────── */}
        <div style={{ borderTop: "0.5px solid var(--color-border)", paddingTop: 28 }}>
          <p className="text-eyebrow" style={{ marginBottom: 8 }}>Know someone I should talk to?</p>
          <h3 className="text-h3" style={{ marginBottom: 8 }}>Suggest someone for Into the Kitchen</h3>
          <p className="text-body text-muted" style={{ marginBottom: 16 }}>
            I&apos;m always looking for the next great story from Stavanger&apos;s food scene.
          </p>
          <Link
            href="/eats/into-the-kitchen/suggest"
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
            Suggest someone →
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
