import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface InterviewCardProps {
  interview: {
    _id: string;
    title?: string;
    subtitle?: string;
    founderName: string;
    founderRole?: string;
    restaurantName?: string;
    linkedReview?: { name: string; slug: { current: string } } | null;
    slug: { current: string };
    heroPhoto?: Record<string, unknown>;
  };
}

export default function InterviewCard({ interview }: InterviewCardProps) {
  const slug = interview.slug.current;
  const displayTitle = interview.title || interview.founderName;
  const displaySubtitle = interview.subtitle || interview.founderRole || null;

  return (
    <Link
      href={`/eats/into-the-kitchen/${slug}`}
      style={{ textDecoration: "none", display: "block", borderRadius: 4, overflow: "hidden" }}
    >
      {interview.heroPhoto ? (
        <Image
          src={urlFor(interview.heroPhoto).width(900).height(540).quality(85).url()}
          alt={(interview.heroPhoto.alt as string) ?? interview.founderName}
          width={900}
          height={540}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="card-img-small"
          style={{ display: "block" }}
        />
      ) : (
        <div className="card-img-small" />
      )}
      <div className="card-body-sm">
        <p className="card-name card-name-sm">{displayTitle}</p>
        {displaySubtitle && (
          <p className="card-subtitle">{displaySubtitle}</p>
        )}
      </div>
    </Link>
  );
}
