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
          <Link href="/eats" className="nav-link">
            Eats <span style={{ fontSize: 7, opacity: 0.45 }}>▾</span>
          </Link>
          <div className="nav-dropdown-menu">
            <Link href="/eats" className="nav-dropdown-item">Food Reviews</Link>
            <Link href="/lists" className="nav-dropdown-item">Top Lists</Link>
            <Link href="/eats/into-the-kitchen" className="nav-dropdown-item">Into the Kitchen</Link>
          </div>
        </li>
        <li className="nav-dropdown">
          <Link href="/play" className="nav-link">
            Play <span style={{ fontSize: 7, opacity: 0.45 }}>▾</span>
          </Link>
          <div className="nav-dropdown-menu">
            <Link href="/play" className="nav-dropdown-item">All Experiences</Link>
            <Link href="/play/suggest" className="nav-dropdown-item">Suggest a Place</Link>
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
