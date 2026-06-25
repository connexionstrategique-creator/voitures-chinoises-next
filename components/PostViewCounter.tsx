"use client";

import { useEffect, useState } from "react";

export default function PostViewCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Increment on mount, then display the new count
    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {
        // Fallback: just read
        fetch(`/api/views/${slug}`)
          .then((r) => r.json())
          .then((d) => setCount(d.count))
          .catch(() => {});
      });
  }, [slug]);

  if (count === null) return null;

  return (
    <span style={{
      fontFamily: "DM Sans, sans-serif",
      fontSize: 12,
      color: "rgba(255,255,255,0.45)",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      {count.toLocaleString("fr-FR")} {count === 1 ? "lecture" : "lectures"}
    </span>
  );
}
