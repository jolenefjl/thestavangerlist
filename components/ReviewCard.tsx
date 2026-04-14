import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface Review {
  _id: string;
  name: string;
  slug: { current: string };
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
          src={urlFor(review.heroImage).width(isMain ? 800 : 400).height(isMain ? 400 : 240).url()}
          alt={review.heroImage.alt ?? review.name}
          width={isMain ? 800 : 400}
          height={isMain ? 400 : 240}
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
        {avgDisplay && (
          <p style={{ margin: 0, fontSize: 11, fontFamily: "var(--font-dm-sans)", fontWeight: 600, color: "var(--color-accent)", letterSpacing: "0.04em" }}>
            {avgDisplay}<span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>/5</span>
          </p>
        )}
      </div>
    </Link>
  );
}
