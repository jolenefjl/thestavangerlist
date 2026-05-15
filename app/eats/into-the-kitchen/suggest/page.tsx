"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function SuggestInterviewPage() {
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");
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
          location: restaurant,
          whyRecommend,
          submitterEmail: email || undefined,
          type: "interview",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong.");
      }

      setSuccess(true);
      setName("");
      setRestaurant("");
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
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>Into the Kitchen</p>
        <h1 className="text-h1" style={{ marginBottom: 8 }}>Suggest someone</h1>
        <p className="text-body text-muted" style={{ maxWidth: 480, marginBottom: 32, lineHeight: 1.75 }}>
          Know a chef, founder, or food person in Stavanger with a great story? Tell me who I should talk to.
        </p>

        {success ? (
          <div style={{ maxWidth: 520 }}>
            <p style={{ fontSize: 15, fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "var(--color-text-primary)", lineHeight: 1.75 }}>
              Thanks — I&apos;ll look into it.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="suggest-form">
            <div className="suggest-field">
              <label className="suggest-label" htmlFor="suggest-name">Their name</label>
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
              <label className="suggest-label" htmlFor="suggest-restaurant">
                Restaurant or business <span style={{ opacity: 0.5 }}>(optional)</span>
              </label>
              <input
                id="suggest-restaurant"
                className="suggest-input"
                type="text"
                value={restaurant}
                onChange={(e) => setRestaurant(e.target.value)}
                placeholder="e.g. Toko Bintang, Sandnes"
                autoComplete="off"
              />
            </div>

            <div className="suggest-field">
              <label className="suggest-label" htmlFor="suggest-why">Why they&apos;d make a great story</label>
              <textarea
                id="suggest-why"
                className="suggest-input suggest-textarea"
                value={whyRecommend}
                onChange={(e) => setWhyRecommend(e.target.value)}
                placeholder="What makes their story worth telling?"
                required
              />
            </div>

            <div className="suggest-field">
              <label className="suggest-label" htmlFor="suggest-email">
                Your email <span style={{ opacity: 0.5 }}>(optional — if you want to be kept in the loop)</span>
              </label>
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
              <p style={{ fontSize: 12, color: "var(--color-accent)", fontFamily: "var(--font-dm-sans)", fontWeight: 400 }}>
                {error}
              </p>
            )}

            <button type="submit" className="suggest-submit" disabled={loading}>
              {loading ? "Sending..." : "Send suggestion"}
            </button>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}
