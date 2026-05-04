"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavMobileMenuProps {
  eatsLabel: string;
  eatsItem1: string;
  eatsItem2: string;
  playLabel: string;
  listsLabel: string;
  aboutLabel: string;
}

export default function NavMobileMenu({
  eatsLabel,
  eatsItem1,
  eatsItem2,
  playLabel,
  listsLabel,
  aboutLabel,
}: NavMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger — visible on mobile only */}
      <button
        className="nav-mobile-btn"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
      >
        <span className="nav-hamburger-bar" />
        <span className="nav-hamburger-bar" />
        <span className="nav-hamburger-bar" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="nav-mobile-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div className={`nav-mobile-drawer${open ? " open" : ""}`} aria-modal="true">
        <div className="nav-mobile-drawer-header">
          <button
            className="nav-mobile-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="nav-mobile-nav">
          <p className="nav-mobile-section-label">{eatsLabel}</p>
          <Link href="/eats" className="nav-mobile-link">{eatsItem1}</Link>
          <Link href="/eats/into-the-kitchen" className="nav-mobile-link">{eatsItem2}</Link>

          <div className="nav-mobile-divider" />
          <Link href="/play" className="nav-mobile-link">{playLabel}</Link>
          <Link href="/lists" className="nav-mobile-link">{listsLabel}</Link>
          <Link href="/about" className="nav-mobile-link">{aboutLabel}</Link>
          <Link href="/search" className="nav-mobile-link">Search</Link>
        </nav>
      </div>
    </>
  );
}
