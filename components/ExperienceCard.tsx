import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Experience {
  _id: string;
  name: string;
  slug: { current: string };
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

  return (
    <Link
      href={`/play/${experience.slug.current}`}
      style={{
        textDecoration: "none",
        display: "block",
        borderRadius: 6,
        overflow: "hidden",
        border: "0.5px solid var(--color-border)",
        background: "var(--color-bg)",
      }}
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
        <div className="card-meta">
          {!!experience.category && <span className="card-cuisine">{experience.category}</span>}
          {!!experience.priceRange && <span className="card-price">{experience.priceRange}</span>}
        </div>
        <p className={`card-name${isMain ? "" : " card-name-sm"}`}>{experience.name}</p>
        {!!experience.area && <p className="card-desc">{experience.area}</p>}
        {!!avgDisplay && (
          <p style={{ margin: 0, fontSize: 11, fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: "var(--color-accent)", letterSpacing: "0.04em" }}>
            {avgDisplay}<span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>/5</span>
          </p>
        )}
      </div>
    </Link>
  );
}
