"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export interface CarouselItem {
  _id: string;
  _type: string;
  title: string;
  slug: { current: string };
  heroImage?: { asset: { _ref: string }; alt?: string };
  tag: string;
}

function getHref(item: CarouselItem): string {
  if (item._type === "review") return `/eats/${item.slug.current}`;
  if (item._type === "experience") return `/play/${item.slug.current}`;
  if (item._type === "topList") return `/lists/${item.slug.current}`;
  return "/";
}

export default function HeroCarousel({ items }: { items: CarouselItem[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next, items.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (!items.length) return null;

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((item, i) => (
        <Link
          key={item._id}
          href={getHref(item)}
          className={`hero-carousel-slide${i === current ? " active" : ""}`}
          tabIndex={i === current ? 0 : -1}
          style={{ textDecoration: "none" }}
        >
          {item.heroImage ? (
            <Image
              src={urlFor(item.heroImage).width(2400).height(1200).quality(85).url()}
              alt={item.heroImage.alt ?? item.title}
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority={i === 0}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "var(--color-bg-image)" }} />
          )}
          <div className="hero-carousel-overlay" />
          <div className="hero-carousel-content">
            <span className="hero-carousel-tag">{item.tag}</span>
            <p className="hero-carousel-title">{item.title}</p>
          </div>
        </Link>
      ))}

      {items.length > 1 && (
        <div className="hero-carousel-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`hero-carousel-dot${i === current ? " active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
