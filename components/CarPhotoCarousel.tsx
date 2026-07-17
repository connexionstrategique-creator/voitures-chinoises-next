"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { CarPhoto, CarColorGroup } from "@/data/types";

function CarSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style={{ width: "70%", height: "70%" }}>
      <ellipse cx="300" cy="235" rx="240" ry="12" fill="rgba(0,0,0,0.3)" />
      <path d="M55 190 L90 140 L165 105 L275 92 L380 92 L460 108 L530 145 L555 185 L555 215 L55 215 Z" fill={color} />
      <path d="M130 190 L158 138 L230 110 L320 100 L410 102 L470 122 L498 155 L498 190 Z" fill="rgba(0,0,0,0.2)" />
      <circle cx="155" cy="212" r="33" fill="#0a0a0a" /><circle cx="155" cy="212" r="24" fill="#222" /><circle cx="155" cy="212" r="12" fill="#555" /><circle cx="155" cy="212" r="5" fill={color} />
      <circle cx="448" cy="212" r="33" fill="#0a0a0a" /><circle cx="448" cy="212" r="24" fill="#222" /><circle cx="448" cy="212" r="12" fill="#555" /><circle cx="448" cy="212" r="5" fill={color} />
    </svg>
  );
}

export default function CarPhotoCarousel({
  photos,
  color,
  alt,
  colorGroups,
}: {
  photos: CarPhoto[];
  color: string;
  alt: string;
  colorGroups?: CarColorGroup[];
}) {
  const hasGroups = colorGroups && colorGroups.length > 0;
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const displayedPhotos: CarPhoto[] = hasGroups
    ? selectedColor
      ? colorGroups!.find((g) => g.colorName === selectedColor)?.photos || []
      : colorGroups!.flatMap((g) => g.photos)
    : photos;

  useEffect(() => {
    if (!lightbox) return;
    const total = displayedPhotos.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setPhotoIdx((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setPhotoIdx((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, displayedPhotos.length]);

  function switchColor(c: string | null) {
    setSelectedColor(c);
    setPhotoIdx(0);
  }

  if (displayedPhotos.length === 0 && photos.length === 0) {
    return (
      <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a1a", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)" }}>
        <CarSVG color={color} />
      </div>
    );
  }

  return (
    <>
      {hasGroups && (
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => switchColor(null)}
            style={{
              padding: "6px 16px", borderRadius: 100,
              border: "1.5px solid rgba(255,255,255,0.18)",
              background: selectedColor === null ? "#fff" : "transparent",
              color: selectedColor === null ? "#0d0d0d" : "rgba(255,255,255,0.7)",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
              cursor: "pointer", transition: "all .15s",
            }}
          >
            TOUTES
          </button>
          {colorGroups!.map((g) => (
            <button
              key={g.colorName}
              onClick={() => switchColor(g.colorName)}
              style={{
                padding: "6px 16px", borderRadius: 100,
                border: "1.5px solid " + (selectedColor === g.colorName ? "#fff" : "rgba(255,255,255,0.18)"),
                background: selectedColor === g.colorName ? "#fff" : "transparent",
                color: selectedColor === g.colorName ? "#0d0d0d" : "rgba(255,255,255,0.7)",
                fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                cursor: "pointer", transition: "all .15s",
              }}
            >
              {g.colorName.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div
        style={{ position: "relative", background: "#111", overflow: "hidden", width: "100%", borderRadius: 20, aspectRatio: "4/3" }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = touchStartX.current - e.changedTouches[0].clientX;
          touchStartX.current = null;
          if (Math.abs(dx) < 40) return;
          if (dx > 0) setPhotoIdx((i) => (i + 1) % displayedPhotos.length);
          else setPhotoIdx((i) => (i - 1 + displayedPhotos.length) % displayedPhotos.length);
        }}
      >
        <div style={{ position: "absolute", inset: 0, display: "flex", transition: "transform .35s ease", transform: "translateX(-" + (photoIdx * 100) + "%)" }}>
          {displayedPhotos.map((p, i) => (
            <div
              key={i}
              onClick={() => setLightbox(true)}
              style={{ flex: "0 0 100%", height: "100%", cursor: "zoom-in", padding: "6px", boxSizing: "border-box" }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 16, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.15)" }}>
                <Image
                  src={p.src}
                  alt={p.label || alt}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 55vw"
                  loading="eager"
                  priority={i === 0}
                />
                {displayedPhotos.length > 1 && (
                  <span style={{ position: "absolute", top: 10, right: 14, fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>
                    {i + 1} / {displayedPhotos.length}
                  </span>
                )}
                <span style={{ position: "absolute", bottom: 10, right: 14, fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
                  🔍 CLIQUER POUR AGRANDIR
                </span>
              </div>
            </div>
          ))}
        </div>

        {displayedPhotos.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setPhotoIdx((photoIdx - 1 + displayedPhotos.length) % displayedPhotos.length); }} className="modal-carousel-prev">‹</button>
            <button onClick={(e) => { e.stopPropagation(); setPhotoIdx((photoIdx + 1) % displayedPhotos.length); }} className="modal-carousel-next">›</button>
            <div className="modal-carousel-dots">
              {displayedPhotos.map((_, i) => (
                <div key={i} className={"modal-carousel-dot" + (i === photoIdx ? " active" : "")} onClick={() => setPhotoIdx(i)} />
              ))}
            </div>
          </>
        )}
      </div>

      {lightbox && typeof document !== "undefined" && createPortal(
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(0,0,0,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          {/* Titre — haut gauche */}
          <span style={{ position: "fixed", top: "calc(18px + env(safe-area-inset-top, 0px))", left: 24, zIndex: 100000, fontFamily: "Syne, sans-serif", fontSize: "clamp(13px,2vw,18px)", fontWeight: 700, color: "rgba(255,255,255,0.75)", letterSpacing: "0.01em", pointerEvents: "none", maxWidth: "calc(100vw - 120px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {alt}
          </span>
          {/* Bouton fermer — haut droit, toujours visible */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(false); }}
            style={{ position: "fixed", top: "calc(14px + env(safe-area-inset-top, 0px))", right: 20, zIndex: 100000, background: "#fff", border: "none", color: "#111", fontSize: 20, fontWeight: 700, cursor: "pointer", lineHeight: 1, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", boxShadow: "0 2px 12px rgba(0,0,0,0.4)", transition: "background .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#eee"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
            aria-label="Fermer"
          >✕</button>

          {displayedPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setPhotoIdx((photoIdx - 1 + displayedPhotos.length) % displayedPhotos.length); }}
                style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", fontSize: 28, width: 48, height: 48, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >‹</button>
              <button
                onClick={(e) => { e.stopPropagation(); setPhotoIdx((photoIdx + 1) % displayedPhotos.length); }}
                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", fontSize: 28, width: 48, height: 48, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >›</button>
            </>
          )}

          <div style={{ position: "relative", width: "90vw", height: "85vh", borderRadius: 20, overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            <Image
              src={displayedPhotos[photoIdx]?.src || displayedPhotos[0].src}
              alt={displayedPhotos[photoIdx]?.label || alt}
              fill
              style={{ objectFit: "contain" }}
              sizes="95vw"
              priority
            />
          </div>

          {displayedPhotos.length > 1 && (
            <span style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,0.4)", fontSize: 13, letterSpacing: "0.15em" }}>
              {photoIdx + 1} / {displayedPhotos.length}
            </span>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
