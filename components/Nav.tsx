import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { siteNameQuery } from "@/sanity/lib/queries";
import NavMobileMenu from "./NavMobileMenu";

export default async function Nav() {
  const siteName: string = await client.fetch(siteNameQuery) ?? "The Stavanger List";

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo" aria-label={siteName}>
        <Image
          src="/logo.svg"
          alt={siteName}
          width={391}
          height={62}
          priority
          className="nav-logo-img"
        />
      </Link>
      <ul className="nav-links">
        <li className="nav-dropdown">
          <Link href="/eats" className="nav-link">
            Eats <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.7, display: "inline-block" }}>▾</span>
          </Link>
          <div className="nav-dropdown-menu">
            <Link href="/eats" className="nav-dropdown-item">Food Reviews</Link>
            <Link href="/lists" className="nav-dropdown-item">Top Lists</Link>
            <Link href="/eats/into-the-kitchen" className="nav-dropdown-item">Into the Kitchen</Link>
          </div>
        </li>
        <li className="nav-dropdown">
          <Link href="/play" className="nav-link">
            Play <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.7, display: "inline-block" }}>▾</span>
          </Link>
          <div className="nav-dropdown-menu">
            <Link href="/play" className="nav-dropdown-item">All Experiences</Link>
            <Link href="/play/suggest" className="nav-dropdown-item">Suggest a Place</Link>
          </div>
        </li>
        <li>
          <Link href="/lists" className="nav-link">Lists</Link>
        </li>
        <li>
          <Link href="/about" className="nav-link">About</Link>
        </li>
        <li>
          <Link href="/search" className="nav-link nav-search" aria-label="Search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
        </li>
      </ul>
      <NavMobileMenu />
    </nav>
  );
}
