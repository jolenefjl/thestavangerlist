import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { siteNameQuery } from "@/sanity/lib/queries";

export default async function Footer() {
  const siteName: string = await client.fetch(siteNameQuery) ?? "The Stavanger List";

  return (
    <footer className="footer">
      <Link href="/" className="footer-logo">
        {siteName}
      </Link>
      <span className="footer-sub">© {new Date().getFullYear()}</span>
    </footer>
  );
}
