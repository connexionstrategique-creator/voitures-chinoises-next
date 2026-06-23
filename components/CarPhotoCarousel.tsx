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

  if (photos.length === 0) {
    return (
      <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a1a", borderRadius: 16 }}>
        <CarSVG color={color} />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", background: "#1a1a1a", borderRadius: 16, overflow: "hidden", minHeight: 300 }}>
      <div style={{ display: "flex", height: 300, transition: "transform .35s ease", transform: `translateX(-${photoIdx * 100}%)` }}>
        {photos.map((p, i) => (
          <div key={i} style={{ minWidth: "100%", height: 300, flexShrink: 0, position: "relative" }}>
            <Image src={p.src} alt={p.label || alt} fill style={{ objectFit: "cover", opacity: 0.9 }} unoptimized />
            {photos.length > 1 && (
              <span style={{ position: "absolute", top: 12, right: 16, fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>
                {i + 1} / {photos.length}
              </span>
            )}
          </div>
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <button onClick={() => setPhotoIdx((photoIdx - 1 + photos.length) % photos.length)} className="modal-carousel-prev">‹</button>
          <button onClick={() => setPhotoIdx((photoIdx + 1) % photos.length)} className="modal-carousel-next">›</button>
          <div className="modal-carousel-dots">
            {photos.map((_, i) => (
              <div key={i} className={`modal-carousel-dot${i === photoIdx ? " active" : ""}`} onClick={() => setPhotoIdx(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
