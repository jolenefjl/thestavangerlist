import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { navSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import NavMobileMenu from "./NavMobileMenu";

export default async function Nav() {
  const s = await client.fetch(navSettingsQuery) ?? {};

  const siteName: string       = s.siteName        ?? "The Stavanger List";
  const eatsLabel: string      = s.navEatsLabel     ?? "Eats";
  const eatsItem1: string      = s.navEatsItem1Label ?? "Food Reviews";
  const eatsItem2: string      = s.navEatsItem2Label ?? "Into the Kitchen";
  const playLabel: string      = s.navPlayLabel     ?? "Play";
  const listsLabel: string     = s.navListsLabel    ?? "Lists";
  const aboutLabel: string     = s.navAboutLabel    ?? "About";

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo" aria-label={siteName}>
        {s.logoImage ? (
          <Image
            src={urlFor(s.logoImage).height(88).url()}
            alt={siteName}
            width={0}
            height={0}
            priority
            className="nav-logo-img"
            style={{ height: "44px", width: "auto" }}
          />
        ) : (
          <Image
            src="/logo.svg"
            alt={siteName}
            width={391}
            height={62}
            priority
            className="nav-logo-img"
          />
        )}
      </Link>

      <ul className="nav-links">
        <li className="nav-dropdown">
          <Link href="/eats" className="nav-link">
            {eatsLabel} <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.7, display: "inline-block" }}>▾</span>
          </Link>
          <div className="nav-dropdown-menu">
            <Link href="/eats" className="nav-dropdown-item">{eatsItem1}</Link>
            <Link href="/eats/into-the-kitchen" className="nav-dropdown-item">{eatsItem2}</Link>
          </div>
        </li>
        <li>
          <Link href="/play" className="nav-link">{playLabel}</Link>
        </li>
        <li>
          <Link href="/lists" className="nav-link">{listsLabel}</Link>
        </li>
        <li>
          <Link href="/about" className="nav-link">{aboutLabel}</Link>
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

      <NavMobileMenu
        eatsLabel={eatsLabel}
        eatsItem1={eatsItem1}
        eatsItem2={eatsItem2}
        playLabel={playLabel}
        listsLabel={listsLabel}
        aboutLabel={aboutLabel}
      />
    </nav>
  );
}
