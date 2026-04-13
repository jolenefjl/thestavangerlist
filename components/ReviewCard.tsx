import Link from "next/link";
import Image from "next/image";
import RatingDots from "./RatingDots";
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

function avgRating(review: Review): number {
  const scores = [
    review.didItHitDifferent,
    review.wouldIPayAgain,
    review.worthTheHype,
    review.theRealDeal,
    review.didStaffCare,
  ].filter((s): s is number => s != null);
  if (!scores.length) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

interface ReviewCardProps {
  review: Review;
  size?: "main" | "small";
}

export default function ReviewCard({ review, size = "small" }: ReviewCardProps) {
  const isMain = size === "main";
  const avg = avgRating(review);

  return (
    <Link href={`/eats/${review.slug.current}`} style={{ textDecoration: "none" }}>
      <div className={isMain ? "card-main" : "card-small"}>
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
          {avg > 0 && <RatingDots score={avg} />}
        </div>
      </div>
    </Link>
  );
}
