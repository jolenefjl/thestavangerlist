"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function SuggestPage() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [whyRecommend, setWhyRecommend] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggestionName: name,
          location,
          whyRecommend,
          submitterEmail: email || undefined,
          type: "experience",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong.");
      }

      setSuccess(true);
      setName("");
      setLocation("");
      setWhyRecommend("");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-bg">
      <Nav />

      <div className="section" style={{ paddingTop: 40, paddingBottom: 56 }}>
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>Stavanger Play</p>
        <h1 className="text-h1" style={{ marginBottom: 28 }}>Suggest a place</h1>

        {success ? (
          <div style={{ maxWidth: 520 }}>
            <p style={{ fontSize: 18, fontFamily: "var(--font-dm-sans)", fontWeight: 300, color: "var(--color-text-primary)", lineHeight: 1.75 }}>
              Thanks for the suggestion. I will check it out.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="suggest-form">
            <div className="suggest-field">
              <label className="suggest-label" htmlFor="suggest-name">Experience or place name</label>
              <input
                id="suggest-name"
                className="suggest-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="off"
              />
            </div>

            <div className="suggest-field">
              <label className="suggest-label" htmlFor="suggest-location">Location</label>
              <input
                id="suggest-location"
                className="suggest-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Stavanger Sentrum, Sandnes"
                autoComplete="off"
              />
            </div>

            <div className="suggest-field">
              <label className="suggest-label" htmlFor="suggest-why">Why you recommend it</label>
              <textarea
                id="suggest-why"
                className="suggest-input suggest-textarea"
                value={whyRecommend}
                onChange={(e) => setWhyRecommend(e.target.value)}
                required
              />
            </div>

            <div className="suggest-field">
              <label className="suggest-label" htmlFor="suggest-email">Your email <span style={{ opacity: 0.5 }}>(optional)</span></label>
              <input
                id="suggest-email"
                className="suggest-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {!!error && (
              <p style={{ fontSize: 14, color: "var(--color-accent)", fontFamily: "var(--font-dm-sans)", fontWeight: 300 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="suggest-submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send suggestion"}
            </button>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}
