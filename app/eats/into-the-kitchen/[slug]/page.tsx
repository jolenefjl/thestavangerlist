export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { interviewBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import EatsSubNav from "@/components/EatsSubNav";
import NewsletterSignup from "@/components/NewsletterSignup";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function extractText(blocks: unknown[], maxLength = 200): string {
  if (!Array.isArray(blocks) || !blocks.length) return "";
  const first = blocks.find((b: unknown) => (b as Record<string, unknown>)._type === "block") as Record<string, unknown> | undefined;
  if (!first) return "";
  const text = (first.children as { text?: string }[] ?? []).map((c) => c.text ?? "").join("");
  return text.length > maxLength ? text.slice(0, maxLength).trim() + "…" : text;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const interview = await client.fetch(interviewBySlugQuery, { slug });
  if (!interview) return {};

  const restaurant = (interview.linkedReview as Record<string, unknown> | null)?.name as string
    ?? interview.restaurantName as string ?? "";
  const title = `${interview.founderName as string}${restaurant ? ` of ${restaurant}` : ""} — Into the Kitchen`;
  const description = extractText(interview.introStory as unknown[]);

  return { title, description };
}

const proseComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ marginBottom: 22 }}>{children}</p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 style={{ fontFamily: "var(--font-spectral), serif", fontSize: 20, fontWeight: 300, margin: "32px 0 14px", color: "var(--color-text-primary)" }}>{children}</h3>
    ),
  },
};

const answerComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ marginBottom: 12, lineHeight: 1.85 }}>{children}</p>
    ),
  },
};

export default async function InterviewPage({ params }: PageProps) {
  const { slug } = await params;
  const interview = await client.fetch(interviewBySlugQuery, { slug });
  if (!interview) notFound();

  const linkedReview = interview.linkedReview as { name: string; slug: { current: string } } | null;
  const restaurantName = linkedReview?.name ?? interview.restaurantName as string ?? "";

  return (
    <div className="page-bg">
      <Nav />
      <EatsSubNav active="into-the-kitchen" />

      {/* ── Hero Photo ───────────────────────────────────────── */}
      {interview.heroPhoto ? (
        <Image
          src={urlFor(interview.heroPhoto).width(1400).height(800).url()}
          alt={(interview.heroPhoto as Record<string, unknown>).alt as string ?? interview.founderName as string}
          width={1400}
          height={800}
          className="interview-hero-img"
          priority
        />
      ) : (
        <div style={{ height: "clamp(320px, 55vw, 600px)", background: "var(--color-bg-image)" }} />
      )}

      {/* ── Header ───────────────────────────────────────────── */}
      <div style={{ padding: "40px 28px 0", maxWidth: 680, margin: "0 auto" }}>
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>Into the Kitchen</p>
        <h1 style={{
          fontFamily: "var(--font-spectral), serif",
          fontSize: "clamp(32px, 6vw, 52px)",
          fontWeight: 300,
          lineHeight: 1.12,
          color: "var(--color-text-primary)",
          marginBottom: 12,
        }}>
          {interview.founderName as string}
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 40 }}>
          {interview.founderRole && (
            <span style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 300 }}>
              {interview.founderRole as string}
            </span>
          )}
          {interview.founderRole && restaurantName && (
            <span style={{ color: "var(--color-border)", fontSize: 12 }}>·</span>
          )}
          {restaurantName && (
            linkedReview ? (
              <Link
                href={`/eats/${linkedReview.slug.current}`}
                style={{ fontSize: 13, color: "var(--color-accent)", textDecoration: "none", fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 400 }}
              >
                {restaurantName} →
              </Link>
            ) : (
              <span style={{ fontSize: 13, color: "var(--color-text-muted)", fontFamily: "var(--font-dm-sans), sans-serif" }}>
                {restaurantName}
              </span>
            )
          )}
        </div>
      </div>

      <div className="divider-full" />

      {/* ── Intro Story ──────────────────────────────────────── */}
      {interview.introStory && (
        <div className="interview-body" style={{ paddingTop: 48, paddingBottom: 16 }}>
          <div className="interview-prose">
            <PortableText value={interview.introStory as Parameters<typeof PortableText>[0]["value"]} components={proseComponents} />
          </div>
        </div>
      )}

      {/* ── Pull Quote ───────────────────────────────────────── */}
      {interview.pullQuote && (
        <div className="interview-body" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <blockquote className="pull-quote">
            <span className="pull-quote-mark">&ldquo;</span>
            <p className="pull-quote-text">{interview.pullQuote as string}</p>
          </blockquote>
        </div>
      )}

      {/* ── Q&A ──────────────────────────────────────────────── */}
      {(interview.qAndA as unknown[])?.length > 0 && (
        <div className="interview-body" style={{ paddingTop: 16, paddingBottom: 48 }}>
          <div className="divider-full" style={{ margin: "0 0 40px" }} />
          <div className="qa-section">
            {(interview.qAndA as Record<string, unknown>[]).map((qa, i) => (
              <div key={i} className="qa-block">
                <p className="qa-question">{qa.question as string}</p>
                <div className="qa-answer">
                  {!!qa.answer && (
                    <PortableText
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      value={qa.answer as any}
                      components={answerComponents}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Gallery ──────────────────────────────────────────── */}
      {(interview.gallery as unknown[])?.length > 0 && (
        <>
          <div className="divider-full" />
          <div className="section" style={{ paddingTop: 40, paddingBottom: 0 }}>
            <p className="text-eyebrow" style={{ marginBottom: 18 }}>More Photos</p>
          </div>
          <div style={{ padding: "0 28px" }}>
            <div className="interview-gallery">
              {(interview.gallery as Record<string, unknown>[]).map((img, i) => (
                <div key={i} className="interview-gallery-item">
                  <Image
                    src={urlFor(img).width(600).height(600).url()}
                    alt={(img.alt as string) ?? `${interview.founderName as string} photo ${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Review CTA ───────────────────────────────────────── */}
      <div className="divider-full" />
      <div style={{ padding: "40px 28px 48px", maxWidth: 680, margin: "0 auto" }}>
        {linkedReview ? (
          <>
            <p className="text-eyebrow" style={{ marginBottom: 10 }}>Read the review</p>
            <h3 style={{ fontFamily: "var(--font-spectral), serif", fontSize: 22, fontWeight: 300, marginBottom: 18, color: "var(--color-text-primary)" }}>
              My full review of {linkedReview.name}
            </h3>
            <Link
              href={`/eats/${linkedReview.slug.current}`}
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
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 500,
                marginBottom: 28,
              }}
            >
              Read the review →
            </Link>
          </>
        ) : null}
        <div style={{ marginTop: linkedReview ? 0 : 0, paddingTop: linkedReview ? 28 : 0, borderTop: linkedReview ? "0.5px solid var(--color-border)" : "none" }}>
          <p className="text-eyebrow" style={{ marginBottom: 8 }}>Know someone I should talk to?</p>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: 14, fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 300 }}>
            I&apos;m always looking for the next great story from Stavanger&apos;s food scene.
          </p>
          <Link href="/suggest" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent)", textDecoration: "none", fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 500 }}>
            Suggest someone for Into the Kitchen →
          </Link>
        </div>
      </div>

      <div className="divider-full" />
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
