"use client";
import { useState } from "react";
import Image from "next/image";
import type { CarPhoto } from "@/data/types";

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

export default function CarPhotoCarousel({ photos, color, alt }: { photos: CarPhoto[]; color: string; alt: string }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (photos.length === 0) {
    return (
      <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a1a", borderRadius: 16 }}>
        <CarSVG color={color} />
      </div>
    );
  }

  return (
    <>
      {/* Carousel */}
      <div style={{ position: "relative", background: "#111", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ display: "flex", transition: "transform .35s ease", transform: `translateX(-${photoIdx * 100}%)` }}>
          {photos.map((p, i) => (
            <div
              key={i}
              onClick={() => setLightbox(true)}
              style={{ minWidth: "100%", flexShrink: 0, position: "relative", aspectRatio: "16/10", cursor: "zoom-in" }}
            >
              <Image
                src={p.src}
                alt={p.label || alt}
                fill
                style={{ objectFit: "contain", padding: "12px" }}
                unoptimized
              />
              {photos.length > 1 && (
                <span style={{ position: "absolute", top: 12, right: 16, fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>
                  {i + 1} / {photos.length}
                </span>
              )}
              <span style={{ position: "absolute", bottom: 12, right: 16, fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
                🔍 CLIQUER POUR AGRANDIR
              </span>
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setPhotoIdx((photoIdx - 1 + photos.length) % photos.length); }} className="modal-carousel-prev">‹</button>
            <button onClick={(e) => { e.stopPropagation(); setPhotoIdx((photoIdx + 1) % photos.length); }} className="modal-carousel-next">›</button>
            <div className="modal-carousel-dots">
              {photos.map((_, i) => (
                <div key={i} className={`modal-carousel-dot${i === photoIdx ? " active" : ""}`} onClick={() => setPhotoIdx(i)} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <button
            onClick={() => setLightbox(false)}
            style={{ position: "absolute", top: 20, right: 28, background: "none", border: "none", color: "#fff", fontSize: 32, cursor: "pointer", lineHeight: 1 }}
          >✕</button>

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setPhotoIdx((photoIdx - 1 + photos.length) % photos.length); }}
                style={{ position: "absolute", left: 20, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 40, width: 56, height: 56, borderRadius: "50%", cursor: "pointer" }}
              >‹</button>
              <button
                onClick={(e) => { e.stopPropagation(); setPhotoIdx((photoIdx + 1) % photos.length); }}
                style={{ position: "absolute", right: 20, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 40, width: 56, height: 56, borderRadius: "50%", cursor: "pointer" }}
              >›</button>
            </>
          )}

          <div style={{ position: "relative", width: "90vw", height: "85vh" }} onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[photoIdx].src}
              alt={photos[photoIdx].label || alt}
              fill
              style={{ objectFit: "contain" }}
              unoptimized
            />
          </div>

          {photos.length > 1 && (
            <span style={{ position: "absolute", bottom: 20, color: "rgba(255,255,255,0.4)", fontSize: 13, letterSpacing: "0.15em" }}>
              {photoIdx + 1} / {photos.length}
            </span>
          )}
        </div>
      )}
    </>
  );
}
