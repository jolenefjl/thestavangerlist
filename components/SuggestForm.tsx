"use client";

import { useState } from "react";

interface Props {
  type: "restaurant" | "experience" | "interview";
  nameLabel: string;
  locationLabel?: string;
  locationPlaceholder?: string;
  whyLabel: string;
  whyPlaceholder?: string;
  emailHint?: string;
  successMessage: string;
}

export default function SuggestForm({
  type,
  nameLabel,
  locationLabel,
  locationPlaceholder,
  whyLabel,
  whyPlaceholder,
  emailHint = "optional",
  successMessage,
}: Props) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [whyRecommend, setWhyRecommend] = useState("");
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);
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
          location: location || undefined,
          whyRecommend,
          submitterEmail: email || undefined,
          subscribeToNewsletter: subscribe,
          type,
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
      setSubscribe(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: 520, borderTop: "0.5px solid var(--color-border)", paddingTop: 28 }}>
        <p className="text-eyebrow" style={{ marginBottom: 10, color: "var(--color-accent)" }}>Sent</p>
        <p style={{ fontSize: 15, fontFamily: "var(--font-dm-sans)", fontWeight: 400, color: "var(--color-text-primary)", lineHeight: 1.75 }}>
          {successMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="suggest-form">
      <div className="suggest-field">
        <label className="suggest-label" htmlFor="suggest-name">{nameLabel}</label>
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

      {locationLabel && (
        <div className="suggest-field">
          <label className="suggest-label" htmlFor="suggest-location">{locationLabel}</label>
          <input
            id="suggest-location"
            className="suggest-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={locationPlaceholder}
            autoComplete="off"
          />
        </div>
      )}

      <div className="suggest-field">
        <label className="suggest-label" htmlFor="suggest-why">{whyLabel}</label>
        <textarea
          id="suggest-why"
          className="suggest-input suggest-textarea"
          value={whyRecommend}
          onChange={(e) => setWhyRecommend(e.target.value)}
          placeholder={whyPlaceholder}
          required
        />
      </div>

      <div className="suggest-field">
        <label className="suggest-label" htmlFor="suggest-email">
          Your email <span style={{ color: "#8C857F" }}>({emailHint})</span>
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

      {!!email && (
        <div style={{ marginBottom: 28, marginTop: -8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={subscribe}
              onChange={(e) => setSubscribe(e.target.checked)}
              style={{ width: 14, height: 14, accentColor: "var(--color-accent)", cursor: "pointer", flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, fontFamily: "var(--font-dm-sans)", color: "#6B6259", lineHeight: 1.5 }}>
              Also subscribe me to The Stavanger List newsletter
            </span>
          </label>
        </div>
      )}

      {!!error && (
        <p style={{ fontSize: 13, color: "#c0392b", fontFamily: "var(--font-dm-sans)", fontWeight: 400, marginBottom: 12, lineHeight: 1.5 }}>
          {error}
        </p>
      )}

      <button type="submit" className="suggest-submit" disabled={loading}>
        {loading ? "Sending..." : "Send suggestion"}
      </button>
    </form>
  );
}
