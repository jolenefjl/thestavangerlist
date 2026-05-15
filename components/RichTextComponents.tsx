import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { PortableTextComponents } from "@portabletext/react";
import type React from "react";

interface ImageRef {
  asset: { _ref: string };
  alt?: string;
}

interface PhotoBlockValue {
  image1?: ImageRef;
  image2?: ImageRef;
  image3?: ImageRef;
  image4?: ImageRef;
  caption?: string;
}

function PhotoImg({
  img,
  sizes = "(max-width: 640px) 100vw, 50vw",
}: {
  img: ImageRef;
  sizes?: string;
}) {
  return (
    <div className="photo-block-img-wrap photo-block-img-wrap-portrait" style={{ position: "relative" }}>
      <Image
        src={urlFor(img).width(1400).quality(88).url()}
        alt={img.alt ?? ""}
        fill
        sizes={sizes}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

export const richTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p
        className="article-body-text"
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.9,
          marginBottom: "1.5em",
          color: "var(--color-text-primary)",
        }}
      >
        {children}
      </p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2
        style={{
          display: "block",
          maxWidth: "680px",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "64px",
          marginBottom: "20px",
          paddingLeft: "clamp(20px, 6vw, 48px)",
          paddingRight: "clamp(20px, 6vw, 48px)",
          fontFamily: "var(--font-spectral), serif",
          fontSize: "27px",
          fontWeight: 300,
          color: "var(--color-text-primary)",
          lineHeight: 1.15,
        }}
      >
        {children}
      </h2>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul
        className="article-body-text"
        style={{ marginBottom: "1.5em", lineHeight: 1.9 }}
      >
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li
        style={{
          marginBottom: 10,
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontWeight: 400,
          fontSize: 16,
        }}
      >
        {children}
      </li>
    ),
  },
  marks: {
    link: ({
      value,
      children,
    }: {
      value?: Record<string, unknown>;
      children?: React.ReactNode;
    }) => (
      <a
        href={value?.href as string}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "var(--color-accent)", textDecoration: "underline" }}
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ fontWeight: 600 }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
  },
  types: {
    // Legacy single inline image — keep for backward compat
    image: ({ value }: { value: Record<string, unknown> }) => (
      <figure className="photo-block">
        <Image
          src={urlFor(value).width(1600).quality(88).url()}
          alt={(value.alt as string) ?? ""}
          width={0}
          height={0}
          sizes="(max-width: 640px) 100vw, 80vw"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        {typeof value.caption === "string" && value.caption && (
          <figcaption className="photo-block-caption">{value.caption}</figcaption>
        )}
      </figure>
    ),

    photoBlockSingle: ({ value }: { value: PhotoBlockValue }) => (
      <figure className="photo-block">
        {value.image1 && (
          <Image
            src={urlFor(value.image1).width(1600).quality(88).url()}
            alt={value.image1.alt ?? ""}
            width={0}
            height={0}
            sizes="(max-width: 640px) 100vw, 80vw"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        )}
        {value.caption && (
          <figcaption className="photo-block-caption">{value.caption}</figcaption>
        )}
      </figure>
    ),

    photoBlockTwo: ({ value }: { value: PhotoBlockValue }) => (
      <figure className="photo-block">
        <div className="photo-block-grid-2">
          {value.image1 && <PhotoImg img={value.image1} sizes="(max-width: 640px) 100vw, 50vw" />}
          {value.image2 && <PhotoImg img={value.image2} sizes="(max-width: 640px) 100vw, 50vw" />}
        </div>
        {value.caption && (
          <figcaption className="photo-block-caption">{value.caption}</figcaption>
        )}
      </figure>
    ),

    photoBlockThree: ({ value }: { value: PhotoBlockValue }) => (
      <figure className="photo-block">
        <div className="photo-block-grid-3">
          {value.image1 && <PhotoImg img={value.image1} sizes="(max-width: 640px) 100vw, 33vw" />}
          {value.image2 && <PhotoImg img={value.image2} sizes="(max-width: 640px) 100vw, 33vw" />}
          {value.image3 && <PhotoImg img={value.image3} sizes="(max-width: 640px) 100vw, 33vw" />}
        </div>
        {value.caption && (
          <figcaption className="photo-block-caption">{value.caption}</figcaption>
        )}
      </figure>
    ),

    photoBlockFour: ({ value }: { value: PhotoBlockValue }) => (
      <figure className="photo-block">
        <div className="photo-block-grid-4">
          {value.image1 && <PhotoImg img={value.image1} sizes="(max-width: 640px) 100vw, 25vw" />}
          {value.image2 && <PhotoImg img={value.image2} sizes="(max-width: 640px) 100vw, 25vw" />}
          {value.image3 && <PhotoImg img={value.image3} sizes="(max-width: 640px) 100vw, 25vw" />}
          {value.image4 && <PhotoImg img={value.image4} sizes="(max-width: 640px) 100vw, 25vw" />}
        </div>
        {value.caption && (
          <figcaption className="photo-block-caption">{value.caption}</figcaption>
        )}
      </figure>
    ),

    // ── Interview block types ────────────────────────────────────
    qaBlock: ({ value }: { value: { question?: string; answer?: string } }) => (
      <div className="article-body-text qa-block">
        {value.question && <p className="qa-question">{value.question}</p>}
        {value.answer && (
          <div className="qa-answer">
            {value.answer.split("\n").filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}
      </div>
    ),

    pullQuote: ({ value }: { value: { text?: string } }) => (
      value.text ? (
        <blockquote className="article-body-text pull-quote">
          <span className="pull-quote-mark">&ldquo;</span>
          <p className="pull-quote-text">{value.text}</p>
        </blockquote>
      ) : null
    ),
  },
};
