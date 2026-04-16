"use client";

import { useState } from "react";

interface NewsletterSignupProps {
  eyebrow?: string;
  ctaText?: string;
  subtext?: string;
  successText?: string;
}

export default function NewsletterSignup({
  eyebrow = "Stay in the loop",
  ctaText = "The best of Stavanger, in your inbox.",
  subtext = "New reviews and curated lists — no spam, ever.",
  successText = "You're on the list. Talk soon.",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="newsletter">
      <p className="text-eyebrow" style={{ marginBottom: 12 }}>{eyebrow}</p>
      <h3 className="newsletter-title">{ctaText}</h3>
      <p className="newsletter-sub">{subtext}</p>

      {status === "success" ? (
        <p style={{ fontSize: 14, color: "var(--color-accent)", fontFamily: "var(--font-spectral)", fontWeight: 300, fontStyle: "italic" }}>
          {successText}
        </p>
      ) : (
        <form className="newsletter-row" onSubmit={handleSubmit}>
          <input
            type="email"
            className="newsletter-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
          />
          <button type="submit" className="newsletter-btn" disabled={status === "loading"}>
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p style={{ fontSize: 11, color: "rgba(247, 243, 238, 0.45)", marginTop: 10 }}>
          Something went wrong — please try again.
        </p>
      )}
    </div>
  );
}
