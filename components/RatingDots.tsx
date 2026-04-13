interface RatingDotsProps {
  score: number; // 1–5
  max?: number;
}

export default function RatingDots({ score, max = 5 }: RatingDotsProps) {
  return (
    <span className="rating-dots">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`rating-dot${i < score ? "" : " empty"}`}
        />
      ))}
    </span>
  );
}
