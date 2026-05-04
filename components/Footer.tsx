import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export default async function Footer() {
  const settings = await client.fetch(siteSettingsQuery);
  const siteName: string = settings?.siteName ?? "The Stavanger List";
  const footerTagline: string | null = settings?.footerTagline ?? null;
  const copyrightName: string = settings?.footerCopyrightName ?? siteName;
  const instagramUrl: string | null = settings?.instagramUrl ?? null;
  const tiktokUrl: string | null = settings?.tiktokUrl ?? null;

  return (
    <footer className="footer">
      <div className="footer-brand">
        <Link href="/" className="footer-logo">
          {siteName}
        </Link>
        {footerTagline && (
          <p className="footer-tagline">{footerTagline}</p>
        )}
      </div>

      {(instagramUrl || tiktokUrl) && (
        <div className="footer-social">
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
              </svg>
              <span>Instagram</span>
            </a>
          )}
          {tiktokUrl && (
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="TikTok">
              <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
              </svg>
              <span>TikTok</span>
            </a>
          )}
        </div>
      )}

      <span className="footer-sub">© {new Date().getFullYear()} {copyrightName}</span>
    </footer>
  );
}
