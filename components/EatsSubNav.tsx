import Link from "next/link";

type Section = "reviews" | "into-the-kitchen";

export default function EatsSubNav({ active }: { active: Section }) {
  return (
    <div className="eats-subnav">
      <Link
        href="/eats"
        className={`eats-subnav-link${active === "reviews" ? " active" : ""}`}
      >
        Reviews
      </Link>
      <Link
        href="/eats/into-the-kitchen"
        className={`eats-subnav-link${active === "into-the-kitchen" ? " active" : ""}`}
      >
        Into the Kitchen
      </Link>
    </div>
  );
}
