"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface SearchItem {
  _id: string;
  kind: "eats" | "play" | "lists";
  title: string;
  subtitle: string;
  href: string;
}

const KIND_LABEL: Record<SearchItem["kind"], string> = {
  eats: "Stavanger Eats",
  play: "Stavanger Play",
  lists: "Stavanger Lists",
};

export default function SearchClient({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(query) ||
        i.subtitle.toLowerCase().includes(query),
    );
  }, [items, query]);

  return (
    <div>
      <div style={{ position: "relative", marginBottom: 28 }}>
        <input
          type="search"
          autoFocus
          placeholder="Search restaurants, experiences, lists…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            fontSize: 19,
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontWeight: 300,
            color: "var(--color-text-primary)",
            background: "var(--color-bg)",
            border: "0.5px solid var(--color-border)",
            borderRadius: 4,
            outline: "none",
          }}
        />
      </div>

      {query && results.length === 0 && (
        <p className="text-body text-muted">No matches for &ldquo;{q}&rdquo;.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {results.map((r) => (
          <li key={r._id} style={{ borderTop: "0.5px solid var(--color-border)" }}>
            <Link
              href={r.href}
              style={{
                display: "block",
                padding: "18px 0",
                textDecoration: "none",
                color: "var(--color-text-primary)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  marginBottom: 4,
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 500,
                }}
              >
                {KIND_LABEL[r.kind]}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-spectral), serif",
                  fontSize: 24,
                  fontWeight: 300,
                  lineHeight: 1.3,
                }}
              >
                {r.title}
              </p>
              {!!r.subtitle && (
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 16,
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 300,
                  }}
                >
                  {r.subtitle}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
