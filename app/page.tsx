export const dynamic = "force-dynamic";

import Link from "next/link";
import { client } from "@/sanity/lib/client";
import {
  siteSettingsQuery,
  latestReviewsQuery,
  featuredExperiencesQuery,
  latestListsQuery,
} from "@/sanity/lib/queries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReviewCard from "@/components/ReviewCard";
import ExperienceCard from "@/components/ExperienceCard";
import ListCard from "@/components/ListCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import HeroCarousel from "@/components/HeroCarousel";
import type { CarouselItem } from "@/components/HeroCarousel";

export default async function Home() {
  const [settings, latestReviews, featuredExperiencesFallback, latestListsFallback] =
    await Promise.all([
      client.fetch(siteSettingsQuery),
      client.fetch(latestReviewsQuery),
      client.fetch(featuredExperiencesQuery),
      client.fetch(latestListsQuery),
    ]);

  // Carousel items from Site Settings (or empty)
  const carouselItems: CarouselItem[] = settings?.featuredCarouselItems ?? [];

  // Featured experiences — pinned or featured:true fallback
  const featuredExperiences: unknown[] =
    settings?.featuredExperiences?.length > 0
      ? settings.featuredExperiences
      : (featuredExperiencesFallback ?? []);

  // Lists section — pinned or latest 3 fallback
  const listsItems: unknown[] =
    settings?.homepageListsItems?.length > 0
      ? settings.homepageListsItems
      : (latestListsFallback ?? []);

  return (
    <div className="page-bg">
      <Nav />

      {/* ── Hero Carousel ────────────────────────────────────── */}
      {carouselItems.length > 0 && (
        <HeroCarousel items={carouselItems} />
      )}

      {/* ── Editorial bridge — separates hero from content ───── */}
      {carouselItems.length > 0 && (
        <div className="hero-bridge">
          <span>Stavanger, Norway</span>
          <span className="hero-bridge-sep">·</span>
          <span>Independent editorial city guide</span>
        </div>
      )}

      {/* ── Stavanger Eats — Latest Reviews ──────────────────── */}
      {latestReviews?.length > 0 && (
        <section className="hp-section hp-section-padded">
          <p className="text-eyebrow" style={{ marginBottom: 10 }}>Stavanger Eats</p>
          <div className="section-header">
            <h2 className="section-title">
              {settings?.homepageLatestTitle ?? "Latest food reviews"}
            </h2>
            <Link href="/eats" className="section-link">View all →</Link>
          </div>
          <div className="card-grid">
            {latestReviews.map((review: Record<string, unknown>) => (
              <ReviewCard
                key={review._id as string}
                review={review as unknown as Parameters<typeof ReviewCard>[0]["review"]}
                size="small"
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Stavanger Play — Featured Experiences ─────────────── */}
      {featuredExperiences.length > 0 && (
        <div className="section-band">
          <section className="hp-section hp-section-padded">
            <p className="text-eyebrow" style={{ marginBottom: 10 }}>Stavanger Play</p>
            <div className="section-header">
              <h2 className="section-title">
                {settings?.homepagePlayTitle ?? "Experiences in and around Stavanger"}
              </h2>
              <Link href="/play" className="section-link">View all →</Link>
            </div>
            <div className="card-grid">
              {(featuredExperiences as Record<string, unknown>[]).slice(0, 3).map((experience) => (
                <ExperienceCard
                  key={experience._id as string}
                  experience={experience as unknown as Parameters<typeof ExperienceCard>[0]["experience"]}
                  size="small"
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── Stavanger Lists ───────────────────────────────────── */}
      {listsItems.length > 0 && (
        <section className="hp-section hp-section-padded">
          <p className="text-eyebrow" style={{ marginBottom: 10 }}>Stavanger Lists</p>
          <div className="section-header">
            <h2 className="section-title">
              {settings?.homepageListsTitle ?? "Curated food and experiences around the city"}
            </h2>
            <Link href="/lists" className="section-link">View all lists →</Link>
          </div>
          <div className="card-grid">
            {(listsItems as Record<string, unknown>[]).slice(0, 3).map((list) => (
              <ListCard
                key={list._id as string}
                list={list as unknown as Parameters<typeof ListCard>[0]["list"]}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Newsletter ────────────────────────────────────────── */}
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
