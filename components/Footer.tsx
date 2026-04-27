import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export default async function Footer() {
  const settings = await client.fetch(siteSettingsQuery);
  const siteName: string = settings?.siteName ?? "The Stavanger List";
  const instagramUrl: string | null = settings?.instagramUrl ?? null;
  const tiktokUrl: string | null = settings?.tiktokUrl ?? null;

  return (
    <footer className="footer">
      <Link href="/" className="footer-logo">
        {siteName}
      </Link>
      {(instagramUrl || tiktokUrl) && (
        <div className="footer-social">
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link">
              Instagram
            </a>
          )}
          {tiktokUrl && (
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="footer-social-link">
              TikTok
            </a>
          )}
        </div>
      )}
      <span className="footer-sub">© {new Date().getFullYear()}</span>
    </footer>
  );
}
