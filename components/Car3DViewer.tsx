"use client";
import { useState } from "react";

export default function Car3DViewer({ sketchfabId, title }: { sketchfabId: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", background: "#0a0a0a", borderRadius: 20, overflow: "hidden" }}>
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 16, zIndex: 2,
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4L44 16V32L24 44L4 32V16L24 4Z" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M24 4L24 44M4 16L44 16M4 32L44 32M4 16L24 44M44 16L24 44M4 16L24 4M44 16L24 4" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
          </svg>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>CHARGEMENT DU MODÈLE 3D…</span>
        </div>
      )}
      <iframe
        title={`${title} — Vue 3D`}
        src={`https://sketchfab.com/models/${sketchfabId}/embed?autostart=1&preload=1&ui_controls=1&ui_infos=0&ui_watermark=1&ui_vr=0&ui_fullscreen=0&ui_help=0&ui_settings=0&ui_annotations=0`}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        style={{ width: "100%", height: "100%", border: "none", opacity: loaded ? 1 : 0, transition: "opacity .4s" }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
