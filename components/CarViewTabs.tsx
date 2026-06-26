"use client";
import { useState } from "react";
import CarPhotoCarousel from "@/components/CarPhotoCarousel";
import Car3DViewer from "@/components/Car3DViewer";
import type { CarPhoto, CarColorGroup } from "@/data/types";

interface CarViewTabsProps {
  photos: CarPhoto[];
  color: string;
  alt: string;
  colorGroups?: CarColorGroup[];
  sketchfabId?: string;
  autohomeId?: string;
}

export default function CarViewTabs({ photos, color, alt, colorGroups, sketchfabId, autohomeId }: CarViewTabsProps) {
  const [tab, setTab] = useState<"photos" | "3d">("photos");
  const has3D = !!(autohomeId || sketchfabId);

  return (
    <div>
      {has3D && (
        <div style={{ display: "flex", gap: 0, marginBottom: 12, borderRadius: 100, background: "rgba(255,255,255,0.06)", padding: 4, width: "fit-content" }}>
          <button
            onClick={() => setTab("photos")}
            style={{
              padding: "7px 20px", borderRadius: 100, border: "none", cursor: "pointer",
              background: tab === "photos" ? "#fff" : "transparent",
              color: tab === "photos" ? "#0d0d0d" : "rgba(255,255,255,0.5)",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", transition: "all .2s",
            }}
          >
            PHOTOS
          </button>
          <button
            onClick={() => setTab("3d")}
            style={{
              padding: "7px 20px", borderRadius: 100, border: "none", cursor: "pointer",
              background: tab === "3d" ? "#fff" : "transparent",
              color: tab === "3d" ? "#0d0d0d" : "rgba(255,255,255,0.5)",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", transition: "all .2s",
            }}
          >
            VUE 360°
          </button>
        </div>
      )}

      {tab === "photos" ? (
        <CarPhotoCarousel photos={photos} color={color} alt={alt} colorGroups={colorGroups} />
      ) : (
        <Car3DViewer autohomeId={autohomeId} sketchfabId={sketchfabId} title={alt} />
      )}
    </div>
  );
}
