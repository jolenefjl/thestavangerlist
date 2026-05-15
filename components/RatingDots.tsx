interface RatingDotsProps {
  score: number; // 1–5, decimals supported (e.g. 4.5)
  max?: number;
}

export default function RatingDots({ score, max = 5 }: RatingDotsProps) {
  return (
    <span className="rating-dots">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= score;          // whole star
        const half   = !filled && i < score;    // partial star

        if (half) {
          // Clip left half of the star to show as filled, right half as empty
          return (
            <span key={i} className="rating-dot rating-dot-half" aria-hidden="true">
              <span className="rating-dot-half-fill">★</span>
              <span className="rating-dot-half-empty">★</span>
            </span>
          );
        }

        return (
          <span
            key={i}
            className={`rating-dot${filled ? "" : " empty"}`}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}
