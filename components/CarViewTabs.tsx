"use client";
import { useState } from "react";
import CarPhotoCarousel from "@/components/CarPhotoCarousel";
import Car3DViewer from "@/components/Car3DViewer";
import type { CarPhoto, CarColorGroup } from "@/data/types";

const AUTOHOME_BASE = "https://pano.autohome.com.cn/car/";
const SKETCHFAB_BASE = "https://sketchfab.com/models/";

interface CarViewTabsProps {
  photos: CarPhoto[];
  color: string;
  alt: string;
  colorGroups?: CarColorGroup[];
  sketchfabId?: string;
  autohomeId?: string;
  autohomeInteriorId?: string;
  defaultTab?: Tab;
}

type Tab = "photos" | "exterior" | "interior";

const TAB_STYLE = (active: boolean): React.CSSProperties => ({
  padding: "7px 20px",
  borderRadius: 100,
  border: "none",
  cursor: "pointer",
  background: active ? "#fff" : "transparent",
  color: active ? "#0d0d0d" : "rgba(255,255,255,0.5)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  transition: "all .2s",
  whiteSpace: "nowrap",
});

export default function CarViewTabs({
  photos, color, alt, colorGroups,
  sketchfabId, autohomeId, autohomeInteriorId, defaultTab,
}: CarViewTabsProps) {
  const [tab, setTab] = useState<Tab>(defaultTab ?? "photos");

  const extSrc = autohomeId
    ? `${AUTOHOME_BASE}${autohomeId}?bg=99&progress=1&spin=1&click=1&nocolor=1&carscale=1.2`
    : sketchfabId
    ? `${SKETCHFAB_BASE}${sketchfabId}/embed?autostart=1&preload=1&ui_controls=1&ui_infos=0&ui_watermark=1&ui_vr=0&ui_fullscreen=1&ui_help=0&ui_settings=0&ui_annotations=0`
    : null;

  const intSrc = autohomeInteriorId
    ? `${AUTOHOME_BASE}${autohomeInteriorId}?bg=99&click=1`
    : null;

  const hasExt = !!extSrc;
  const hasInt = !!intSrc;
  const hasTabs = hasExt || hasInt;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {hasTabs && (
        <div style={{ flexShrink: 0, display: "flex", gap: 0, marginBottom: 12, borderRadius: 100, background: "rgba(255,255,255,0.06)", padding: 4, width: "fit-content" }}>
          <button onClick={() => setTab("photos")} style={TAB_STYLE(tab === "photos")}>PHOTOS</button>
          {hasExt && <button onClick={() => setTab("exterior")} style={TAB_STYLE(tab === "exterior")}>EXTÉRIEUR</button>}
          {hasInt && <button onClick={() => setTab("interior")} style={TAB_STYLE(tab === "interior")}>INTÉRIEUR</button>}
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {tab === "photos" && (
          <CarPhotoCarousel photos={photos} color={color} alt={alt} colorGroups={colorGroups} />
        )}
        {tab === "exterior" && extSrc && (
          <Car3DViewer src={extSrc} title={`${alt} — Vue extérieure 360°`} />
        )}
        {tab === "interior" && intSrc && (
          <Car3DViewer src={intSrc} title={`${alt} — Vue intérieure 360°`} isInterior />
        )}
      </div>
    </div>
  );
}
