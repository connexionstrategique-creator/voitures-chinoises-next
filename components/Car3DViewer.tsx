"use client";
import { useState } from "react";

interface Car3DViewerProps {
  title: string;
  autohomeId?: string;
  sketchfabId?: string;
}

export default function Car3DViewer({ title, autohomeId, sketchfabId }: Car3DViewerProps) {
  const [loaded, setLoaded] = useState(false);

  const src = autohomeId
    ? `https://pano.autohome.com.cn/car/${autohomeId}?bg=99&spin=1&click=1&noswitch=1&nocolor=1`
    : `https://sketchfab.com/models/${sketchfabId}/embed?autostart=1&preload=1&ui_controls=1&ui_infos=0&ui_watermark=1&ui_vr=0&ui_fullscreen=1&ui_help=0&ui_settings=0&ui_annotations=0`;

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
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>CHARGEMENT…</span>
        </div>
      )}
      <iframe
        title={`${title} — Vue 360°`}
        src={src}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        style={{ width: "100%", height: "100%", border: "none", opacity: loaded ? 1 : 0, transition: "opacity .4s" }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
