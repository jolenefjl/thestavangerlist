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

const portableComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ marginBottom: 20, lineHeight: 1.75 }}>{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 style={{ fontFamily: "var(--font-spectral), serif", fontSize: 22, fontWeight: 300, margin: "36px 0 12px", color: "var(--color-text-primary)" }}>{children}</h2>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul style={{ paddingLeft: 20, marginBottom: 20, lineHeight: 1.75 }}>{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li style={{ marginBottom: 6, color: "var(--color-text-primary)", fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 300, fontSize: 15 }}>{children}</li>
    ),
  },
  marks: {
    link: ({ value, children }: { value?: Record<string, unknown>; children?: React.ReactNode }) => (
      <a href={value?.href as string} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-accent)", textDecoration: "underline" }}>{children}</a>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ fontWeight: 600 }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
  },
  types: {
    image: ({ value }: { value: Record<string, unknown> }) => (
      <figure style={{ margin: "32px 0" }}>
        <Image
          src={urlFor(value).width(800).url()}
          alt={(value.alt as string) ?? ""}
          width={800}
          height={500}
          style={{ width: "100%", height: "auto", borderRadius: 3 }}
        />
        {!!(value.caption as string) && (
          <figcaption style={{ fontSize: 11, color: "var(--color-text-hint)", marginTop: 8, textAlign: "center", letterSpacing: "0.04em" }}>
            {value.caption as string}
          </figcaption>
        )}
      </figure>
    ),
  },
};

export default async function ExperiencePage({ params }: PageProps) {
  const { slug } = await params;
  const [experience, settings] = await Promise.all([
    client.fetch(experienceBySlugQuery, { slug }),
    client.fetch(siteSettingsQuery),
  ]);

  if (!experience) notFound();

  const ratings = [
    { key: "worthYourTime",         blurbKey: "worthYourTimeBlurb",         label: "Worth your time?" },
    { key: "worthThePrice",         blurbKey: "worthThePriceBlurb",         label: "Worth the price?" },
    { key: "worthTheHype",          blurbKey: "worthTheHypeBlurb",          label: "Worth the hype?" },
    { key: "worthBringingAFriend",  blurbKey: "worthBringingAFriendBlurb",  label: "Worth bringing a friend?" },
    { key: "worthDoingAgain",       blurbKey: "worthDoingAgainBlurb",       label: "Worth doing again?" },
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

      {/* Hero Image */}
      {!!experience.heroImage && (
        <div style={{ width: "100%", height: "clamp(240px, 45vw, 520px)", position: "relative", background: "var(--color-bg-image)" }}>
          <Image
            src={urlFor(experience.heroImage).width(2800).height(1400).quality(90).url()}
            alt={(experience.heroImage as Record<string, unknown>).alt as string ?? experience.name as string}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}

      {/* Main Content */}
      <article className="section" style={{ paddingTop: 36, maxWidth: 720, marginBottom: 48 }}>

        {/* Eyebrow + title */}
        {!!(experience.category as string) && (
          <p className="text-eyebrow" style={{ marginBottom: 10 }}>{experience.category as string}</p>
        )}
        <h1 className="text-h1" style={{ marginBottom: 6 }}>{experience.name as string}</h1>
        <p className="text-small text-muted" style={{ marginBottom: 28 }}>
          {[experience.area, experience.priceRange].filter(Boolean).join(" · ")}
        </p>

        {/* Quick Info Panel */}
        <div className="quick-info" style={{ marginBottom: 32 }}>
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
          {!!websiteUrl && (
            <div className="quick-info-item">
              <p className="quick-info-label">Website</p>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-info-value"
                style={{ color: "var(--color-accent)", textDecoration: "none" }}
              >
                Visit →
              </a>
            </div>
          )}
          {!!bookingUrl && bookingUrl !== websiteUrl && (
            <div className="quick-info-item">
              <p className="quick-info-label">Book</p>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-info-value"
                style={{ color: "var(--color-accent)", textDecoration: "none" }}
              >
                Book →
              </a>
            </div>
          )}
        </div>

        {/* Rating Panel */}
        <div className="rating-panel">
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

        {/* Experience Body */}
        {!!experience.body && (
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
              value={experience.body as Parameters<typeof PortableText>[0]["value"]}
              components={portableComponents}
            />
          </div>
        )}

        {/* TikTok Embed */}
        {!!(experience.tiktokUrl as string) && (() => {
          const videoId = (experience.tiktokUrl as string).match(/\/video\/(\d+)/)?.[1];
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
        {!!(experience.gallery as unknown[])?.length && (
          <div style={{ margin: "32px 0" }}>
            <p className="text-eyebrow" style={{ marginBottom: 14 }}>{settings?.morePhotosLabel ?? "More Photos"}</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 4,
              }}
            >
              {(experience.gallery as Record<string, unknown>[]).map((img, i: number) => (
                <div key={i} style={{ position: "relative", aspectRatio: "1", background: "var(--color-bg-image)", borderRadius: 2, overflow: "hidden" }}>
                  <Image
                    src={urlFor(img).width(900).height(900).quality(85).url()}
                    alt={(img.alt as string) ?? `${experience.name as string} photo ${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggest CTA */}
        <div
          style={{
            borderTop: "0.5px solid var(--color-border)",
            paddingTop: 28,
            marginTop: 40,
          }}
        >
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
