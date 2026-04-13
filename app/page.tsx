export default function Home() {
  return (
    <div className="page-bg">
      <nav className="nav">
        <a href="/" className="nav-logo">The Stavanger List</a>
        <ul className="nav-links">
          <li><a href="/eats" className="nav-link active">Eats</a></li>
        </ul>
      </nav>

      <main className="section section-gap" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <p className="text-eyebrow" style={{ marginBottom: 12 }}>Stavanger Eats</p>
        <h1 className="text-hero">
          The best places<br />
          to eat in <span className="text-italic">Stavanger.</span>
        </h1>
        <p className="text-body text-muted" style={{ marginTop: 20, maxWidth: 480 }}>
          Honest restaurant reviews for the Stavanger region. Coming soon.
        </p>
      </main>

      <footer className="footer">
        <a href="/" className="footer-logo">The Stavanger List</a>
        <span className="footer-sub">© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
