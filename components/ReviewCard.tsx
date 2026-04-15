import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Review {
  _id: string;
  name: string;
  slug: { current: string };
  cardTeaser?: string;
  cuisine: string;
  area: string;
  priceRange: string;
  heroImage?: { asset: { _ref: string }; alt?: string };
  didItHitDifferent?: number;
  wouldIPayAgain?: number;
  worthTheHype?: number;
  theRealDeal?: number;
  didStaffCare?: number;
}

function avgRating(review: Review): number | null {
  const scores = [
    review.didItHitDifferent,
    review.wouldIPayAgain,
    review.worthTheHype,
    review.theRealDeal,
    review.didStaffCare,
  ].filter((s): s is number => s != null);
  if (!scores.length) return null;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100;
}

interface ReviewCardProps {
  review: Review;
  size?: "main" | "small";
}

export default function ReviewCard({ review, size = "small" }: ReviewCardProps) {
  const isMain = size === "main";
  const avg = avgRating(review);
  const avgDisplay = avg !== null ? (Number.isInteger(avg) ? `${avg}.0` : String(avg)) : null;

  return (
    <Link
      href={`/eats/${review.slug.current}`}
      style={{
        textDecoration: "none",
        display: "block",
        borderRadius: 6,
        overflow: "hidden",
        border: "0.5px solid var(--color-border)",
        background: "var(--color-bg)",
      }}
    >
      {review.heroImage ? (
        <Image
          src={urlFor(review.heroImage).width(isMain ? 1400 : 900).height(isMain ? 700 : 540).quality(85).url()}
          alt={review.heroImage.alt ?? review.name}
          width={isMain ? 1400 : 900}
          height={isMain ? 700 : 540}
          sizes={isMain ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className={isMain ? "card-img-main" : "card-img-small"}
          style={{ display: "block" }}
        />
      ) : (
        <div className={isMain ? "card-img-main" : "card-img-small"} />
      )}
      <div className={isMain ? "card-body" : "card-body-sm"}>
        <div className="card-meta">
          <span className="card-cuisine">{review.cuisine}</span>
          <span className="card-price">{review.priceRange}</span>
        </div>
        <p className={`card-name${isMain ? "" : " card-name-sm"}`}>{review.name}</p>
        <p className="card-desc">{review.area}</p>
        {!!review.cardTeaser && (
          <p className="card-teaser">{review.cardTeaser}</p>
        )}
        {avgDisplay && (
          <p style={{ margin: 0, fontSize: 11, fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: "var(--color-accent)", letterSpacing: "0.04em" }}>
            <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-text-hint)", marginRight: 8 }}>My rating</span>
            {avgDisplay}<span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>/5</span>
          </p>
        )}
      </div>
    </Link>
  );
}
