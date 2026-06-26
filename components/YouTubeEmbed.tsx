"use client";
import { useState } from "react";
import Image from "next/image";

export default function YouTubeEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

  return (
    <div
      style={{
        borderRadius: 20,
        overflow: "hidden",
        background: "#111",
        aspectRatio: "16/9",
        position: "relative",
        cursor: playing ? "default" : "pointer",
        border: "1.5px solid rgba(255,255,255,0.08)",
      }}
      onClick={() => !playing && setPlaying(true)}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      ) : (
        <>
          <Image
            src={thumb}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 55vw"
            unoptimized
          />
          <div
            style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "var(--red, #A01414)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 32px rgba(160,20,20,0.55)",
                transition: "transform .15s, box-shadow .15s",
              }}
              className="yt-play-btn"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div
            style={{
              position: "absolute", bottom: 16, left: 16,
              background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
              color: "rgba(255,255,255,0.85)",
              borderRadius: 8, padding: "5px 12px",
              fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            ▶ Voir la vidéo
          </div>
        </>
      )}
    </div>
  );
}
