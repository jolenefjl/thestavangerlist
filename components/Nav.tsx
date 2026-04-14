import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { siteNameQuery } from "@/sanity/lib/queries";

export default async function Nav() {
  const siteName: string = await client.fetch(siteNameQuery) ?? "The Stavanger List";

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        {siteName}
      </Link>
      <ul className="nav-links">
        <li>
          <Link href="/eats" className="nav-link">
            Eats
          </Link>
        </li>
        <li>
          <Link href="/about" className="nav-link">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
