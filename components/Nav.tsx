import Link from "next/link";

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        The Stavanger List
      </Link>
      <ul className="nav-links">
        <li>
          <Link href="/eats" className="nav-link">
            Eats
          </Link>
        </li>
      </ul>
    </nav>
  );
}
