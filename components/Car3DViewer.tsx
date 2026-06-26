"use client";
import { useState, useRef } from "react";

interface Car3DViewerProps {
  title: string;
  src: string;
}

export default function Car3DViewer({ title, src }: Car3DViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    } else {
      window.open(src, "_blank");
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        background: "#0a0a0a",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      {/* Loading overlay */}
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 16, zIndex: 2,
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 4L44 16V32L24 44L4 32V16L24 4Z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M24 4L24 44M4 16L44 16M4 32L44 32M4 16L24 44M44 16L24 44M4 16L24 4M44 16L24 4" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
          </svg>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>CHARGEMENT…</span>
        </div>
      )}

      {/* Fullscreen button */}
      {loaded && (
        <button
          onClick={handleFullscreen}
          aria-label="Plein écran"
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            zIndex: 10,
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 8,
            padding: "7px 10px",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            transition: "background .2s",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          PLEIN ÉCRAN
        </button>
      )}

      <iframe
        title={title}
        src={src}
        allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; magnetometer"
        allowFullScreen
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity .5s",
        }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
