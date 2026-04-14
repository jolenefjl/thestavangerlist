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
        <li className="nav-dropdown">
          <Link href="/eats" className="nav-link" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Eats <span style={{ fontSize: 8, opacity: 0.5 }}>▾</span>
          </Link>
          <div className="nav-dropdown-menu">
            <Link href="/eats" className="nav-dropdown-item">Food Reviews</Link>
            <Link href="/lists" className="nav-dropdown-item">Top Lists</Link>
            <Link href="/eats/into-the-kitchen" className="nav-dropdown-item">Into the Kitchen</Link>
          </div>
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
