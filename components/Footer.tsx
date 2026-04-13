import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <Link href="/" className="footer-logo">
        The Stavanger List
      </Link>
      <span className="footer-sub">© {new Date().getFullYear()}</span>
    </footer>
  );
}
