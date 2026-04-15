import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface TopListCard {
  _id: string;
  title: string;
  slug: { current: string };
  cardTeaser?: string;
  heroImage?: { asset: { _ref: string }; alt?: string };
}

interface ListCardProps {
  list: TopListCard;
}

export default function ListCard({ list }: ListCardProps) {
  return (
    <Link
      href={`/lists/${list.slug.current}`}
      style={{
        textDecoration: "none",
        display: "block",
        borderRadius: 6,
        overflow: "hidden",
        border: "0.5px solid var(--color-border)",
        background: "var(--color-bg)",
      }}
    >
      {list.heroImage ? (
        <Image
          src={urlFor(list.heroImage).width(900).height(540).quality(85).url()}
          alt={list.heroImage.alt ?? list.title}
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
        <p className="list-card-eyebrow">Stavanger Lists</p>
        <p className="card-name card-name-sm">{list.title}</p>
        {!!list.cardTeaser && (
          <p className="card-teaser">{list.cardTeaser}</p>
        )}
      </div>
    </Link>
  );
}
