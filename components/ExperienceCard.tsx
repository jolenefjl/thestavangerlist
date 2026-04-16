import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Experience {
  _id: string;
  name: string;
  slug: { current: string };
  cardTeaser?: string;
  category?: string;
  area?: string;
  priceRange?: string;
  heroImage?: { asset: { _ref: string }; alt?: string };
  worthYourTime?: number;
  worthThePrice?: number;
  worthTheHype?: number;
  worthBringingAFriend?: number;
  worthDoingAgain?: number;
}

function avgRating(experience: Experience): number | null {
  const scores = [
    experience.worthYourTime,
    experience.worthThePrice,
    experience.worthTheHype,
    experience.worthBringingAFriend,
    experience.worthDoingAgain,
  ].filter((s): s is number => s != null);
  if (!scores.length) return null;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100;
}

interface ExperienceCardProps {
  experience: Experience;
  size?: "main" | "small";
}

export default function ExperienceCard({ experience, size = "small" }: ExperienceCardProps) {
  const isMain = size === "main";
  const avg = avgRating(experience);
  const avgDisplay = avg !== null ? (Number.isInteger(avg) ? `${avg}.0` : String(avg)) : null;

  const hasCategory = !!experience.category;
  const hasPrice    = !!experience.priceRange;
  const hasArea     = !!experience.area;

  return (
    <Link
      href={`/play/${experience.slug.current}`}
      style={{ textDecoration: "none", display: "block", borderRadius: 4, overflow: "hidden" }}
    >
      {!!experience.heroImage && (
        <Image
          src={urlFor(experience.heroImage).width(isMain ? 1400 : 900).height(isMain ? 700 : 540).quality(85).url()}
          alt={experience.heroImage.alt ?? experience.name}
          width={isMain ? 1400 : 900}
          height={isMain ? 700 : 540}
          sizes={isMain ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className={isMain ? "card-img-main" : "card-img-small"}
          style={{ display: "block" }}
        />
      )}
      {!experience.heroImage && (
        <div className={isMain ? "card-img-main" : "card-img-small"} />
      )}

      <div className={isMain ? "card-body" : "card-body-sm"}>
        {/* Single metadata row: CATEGORY · LOCATION · PRICE */}
        {(hasCategory || hasPrice || hasArea) && (
          <div className="card-meta">
            {hasCategory && <span className="card-cuisine">{experience.category}</span>}
            {hasArea && (
              <>
                {hasCategory && <span className="card-meta-sep">·</span>}
                <span className="card-location">{experience.area}</span>
              </>
            )}
            {hasPrice && (
              <>
                {(hasCategory || hasArea) && <span className="card-meta-sep">·</span>}
                <span className="card-price">{experience.priceRange}</span>
              </>
            )}
          </div>
        )}

        <p className={`card-name${isMain ? "" : " card-name-sm"}`}>{experience.name}</p>

        {!!experience.cardTeaser && (
          <p className="card-teaser">{experience.cardTeaser}</p>
        )}

        {!!avgDisplay && (
          <p style={{ margin: 0, fontSize: 11, fontFamily: "var(--font-dm-sans)", fontWeight: 700, color: "var(--color-accent)", letterSpacing: "0.04em" }}>
            <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-text-hint)", marginRight: 8 }}>Honest rating</span>
            {avgDisplay}<span style={{ fontWeight: 400, color: "#8C857F" }}>/5</span>
          </p>
        )}
      </div>
    </Link>
  );
}
