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
    <Link href={`/eats/into-the-kitchen/${slug}`} className="interview-card">
      {interview.heroPhoto ? (
        <Image
          src={urlFor(interview.heroPhoto).width(600).height(560).url()}
          alt={(interview.heroPhoto.alt as string) ?? interview.founderName}
          width={600}
          height={560}
          className="interview-card-img"
        />
      ) : (
        <div className="interview-card-img" />
      )}
      <div className="interview-card-body">
        <p className="interview-card-name">{displayTitle}</p>
        {displaySubtitle && (
          <p className="interview-card-role">{displaySubtitle}</p>
        )}
      </div>
    </Link>
  );
}
