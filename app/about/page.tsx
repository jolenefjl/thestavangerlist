export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{ marginBottom: 20, lineHeight: 1.85 }}>{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{
        fontFamily: "var(--font-spectral), serif",
        fontWeight: 600,
        fontStyle: "normal",
        color: "var(--color-accent)",
      }}>{children}</strong>
    ),
  },
};

export default async function AboutPage() {
  const about = await client.fetch(aboutPageQuery);

  return (
    <div className="page-bg">
      <Nav />

      {/* ── Hero: Photo + Headline ────────────────────────────── */}
      <div className="about-hero">
        {/* Photo */}
        {about?.heroPhoto ? (
          <Image
            src={urlFor(about.heroPhoto).width(900).height(1100).url()}
            alt={about.heroPhoto.alt ?? "Jo"}
            width={900}
            height={1100}
            className="about-hero-img"
            priority
          />
        ) : (
          <div className="about-hero-img-placeholder">
            <span style={{
              fontFamily: "var(--font-spectral), serif",
              fontSize: 86,
              fontWeight: 300,
              fontStyle: "italic",
              color: "var(--color-accent-light)",
            }}>Jo</span>
          </div>
        )}

        {/* Headline + intro */}
        <div className="about-hero-text">
          <p className="text-eyebrow" style={{ marginBottom: 18 }}>About</p>
          <h1 className="about-headline">
            {about?.heroHeadline ?? "Hi, I'm Jo.\nAnd I eat everything."}
          </h1>
          <p className="about-intro">
            {about?.heroIntro ?? "Malaysian-born, Stavanger-based. 11 years in this city and I'm still finding places that surprise me."}
          </p>
        </div>
      </div>

      <div className="divider-full" />

      {/* ── My Story ─────────────────────────────────────────── */}
      <div className="about-section">
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>{about?.storyEyebrow ?? "My Story"}</p>
        <h2 className="text-h2" style={{ marginBottom: 28 }}>{about?.storyHeadline ?? "Growing up with food as a language."}</h2>
        <div className="about-prose">
          {about?.storyBlock1 ? (
            <PortableText value={about.storyBlock1} components={portableTextComponents} />
          ) : (
            <p>Growing up in Kuala Lumpur, food wasn&apos;t just something you ate — it was the architecture of every conversation, every celebration, every ordinary Tuesday. Mamak stalls open until 3am. Char kuey teow from the same uncle for twenty years. Nasi lemak that made you understand why people talk about their mum&apos;s cooking like it&apos;s a religion. I didn&apos;t know it then, but KL was calibrating my palate to expect a lot from food.</p>
          )}
          {about?.storyBlock2 ? (
            <PortableText value={about.storyBlock2} components={portableTextComponents} />
          ) : (
            <p>I moved to Stavanger eleven years ago and, I&apos;ll be honest — I expected to miss the food. What I didn&apos;t expect was to be surprised. The seafood was extraordinary. There were chefs doing genuinely interesting things. And underneath the surface of what looked like a quiet oil city, there was a food scene quietly growing, evolving, and mostly going undocumented.</p>
          )}
          {about?.storyBlock3 ? (
            <PortableText value={about.storyBlock3} components={portableTextComponents} />
          ) : (
            <p>After eleven years, I exist in a strange in-between. I&apos;m not a tourist who only finds the obvious places, and I&apos;m not so local that I&apos;ve stopped noticing things. I still walk into a restaurant with fresh eyes. I still ask the questions locals take for granted. That perspective — the outsider who stayed — is exactly what makes this list different.</p>
          )}
        </div>
      </div>

      <div className="divider-full" />

      {/* ── Why I Started ────────────────────────────────────── */}
      <div className="about-section">
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>{about?.whyEyebrow ?? "Why I Started This"}</p>
        <h2 className="text-h2" style={{ marginBottom: 28 }}>{about?.whyHeadline ?? "I built the thing I wished existed."}</h2>
        <div className="about-prose">
          {about?.whySection ? (
            <PortableText value={about.whySection} components={portableTextComponents} />
          ) : (
            <>
              <p>I couldn&apos;t find a single good resource for honest food reviews in Stavanger. Everything online was either three years out of date, suspiciously generic, or just a Google Maps dump with no real opinion attached. The travel blogs that covered Norway skipped Stavanger entirely, or mentioned one fjord restaurant and called it a day.</p>
              <p>So I built the thing I wished existed. The Stavanger List is the resource I needed when I moved here — and the one I still reach for when someone asks me where to eat.</p>
            </>
          )}
        </div>
      </div>

      <div className="divider-full" />

      {/* ── What You'll Find ─────────────────────────────────── */}
      <div className="about-section">
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>{about?.whatEyebrow ?? "What You'll Find Here"}</p>
        <h2 className="text-h2" style={{ marginBottom: 28 }}>{about?.whatHeadline ?? "Honest, tested, never sponsored."}</h2>
        <div className="about-prose">
          {about?.whatSection ? (
            <PortableText value={about.whatSection} components={portableTextComponents} />
          ) : (
            <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["Honest restaurant reviews", "Every place on this list I&apos;ve actually eaten at, paid for, and formed a real opinion on."],
                ["Curated top lists", "The best spots by cuisine, occasion, or neighbourhood — no filler."],
                ["More to come", "Experiences, things to do, and hidden gems that don&apos;t make the usual lists."],
              ].map(([title, desc]) => (
                <li key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ color: "var(--color-accent)", marginTop: 3, flexShrink: 0 }}>—</span>
                  <span>
                    <strong style={{ fontFamily: "var(--font-spectral), serif", fontWeight: 600, color: "var(--color-accent)" }}>{title}</strong>
                    <span style={{ color: "var(--color-text-muted)" }}> — </span>
                    <span style={{ color: "var(--color-text-muted)" }} dangerouslySetInnerHTML={{ __html: desc }} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="divider-full" />

      {/* ── Social CTA ───────────────────────────────────────── */}
      <div className="about-section">
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>{about?.socialEyebrow ?? "Come Find Me"}</p>
        <h2 className="text-h2" style={{ marginBottom: 28 }}>{about?.socialHeadline ?? "On TikTok and Instagram."}</h2>
        <p style={{ fontSize: 18, fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 300, lineHeight: 1.75, color: "var(--color-text-muted)", marginBottom: 28, maxWidth: 440 }}>
          {about?.socialBlurb ?? "I post food reviews, Stavanger spots, and the occasional overly enthusiastic take on a bowl of ramen."}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {(about?.tiktokUrl) ? (
            <a href={about.tiktokUrl} target="_blank" rel="noopener noreferrer" className="about-social-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z"/></svg>
              TikTok — Jo in Stavanger
            </a>
          ) : (
            <a href="https://www.tiktok.com/@joInstavanger" target="_blank" rel="noopener noreferrer" className="about-social-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z"/></svg>
              TikTok — Jo in Stavanger
            </a>
          )}
          {(about?.instagramUrl) ? (
            <a href={about.instagramUrl} target="_blank" rel="noopener noreferrer" className="about-social-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
              Instagram — slowlivingstavanger
            </a>
          ) : (
            <a href="https://www.instagram.com/slowlivingstavanger" target="_blank" rel="noopener noreferrer" className="about-social-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
              Instagram — slowlivingstavanger
            </a>
          )}
        </div>
      </div>

      <div className="divider-full" />
      <NewsletterSignup />
      <Footer />
    </div>
  );
}
