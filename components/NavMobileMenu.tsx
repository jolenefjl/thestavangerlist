"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavMobileMenu() {
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
          <p className="nav-mobile-section-label">Eats</p>
          <Link href="/eats" className="nav-mobile-link">Food Reviews</Link>
          <Link href="/lists" className="nav-mobile-link">Top Lists</Link>
          <Link href="/eats/into-the-kitchen" className="nav-mobile-link">Into the Kitchen</Link>

          <p className="nav-mobile-section-label" style={{ marginTop: 28 }}>Play</p>
          <Link href="/play" className="nav-mobile-link">All Experiences</Link>
          <Link href="/play/suggest" className="nav-mobile-link">Suggest a Place</Link>

          <div className="nav-mobile-divider" />
          <Link href="/lists" className="nav-mobile-link">Lists</Link>
          <Link href="/about" className="nav-mobile-link">About</Link>
          <Link href="/search" className="nav-mobile-link">Search</Link>
        </nav>
      </div>
    </>
  );
}
