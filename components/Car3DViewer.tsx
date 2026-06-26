"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface Car3DViewerProps {
  title: string;
  src: string;
}

export default function Car3DViewer({ title, src }: Car3DViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const [fakeFS, setFakeFS] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const lockLandscape = () => {
    try {
      (screen.orientation as any)?.lock?.("landscape").catch?.(() => {});
    } catch {}
  };

  const unlockOrientation = () => {
    try {
      (screen.orientation as any)?.unlock?.();
    } catch {}
  };

  const exitFakeFS = useCallback(() => {
    setFakeFS(false);
    unlockOrientation();
    document.body.style.overflow = "";
  }, []);

  const enterFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    const tryNative = el.requestFullscreen
      ? el.requestFullscreen()
      : (el as any).webkitRequestFullscreen
      ? Promise.resolve((el as any).webkitRequestFullscreen())
      : null;

    if (tryNative) {
      tryNative.then(() => lockLandscape()).catch(() => {
        // Native fullscreen failed (iOS) — use CSS fallback
        setFakeFS(true);
        lockLandscape();
        document.body.style.overflow = "hidden";
      });
    } else {
      setFakeFS(true);
      lockLandscape();
      document.body.style.overflow = "hidden";
    }
  };

  // Unlock orientation when native fullscreen exits
  useEffect(() => {
    const onFSChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        unlockOrientation();
      }
    };
    document.addEventListener("fullscreenchange", onFSChange);
    document.addEventListener("webkitfullscreenchange", onFSChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFSChange);
      document.removeEventListener("webkitfullscreenchange", onFSChange);
    };
  }, []);

  // Escape key closes fake fullscreen
  useEffect(() => {
    if (!fakeFS) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") exitFakeFS(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fakeFS, exitFakeFS]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = ""; };
  }, []);

  const wrapStyle: React.CSSProperties = fakeFS
    ? { position: "fixed", inset: 0, zIndex: 9999, background: "#000", borderRadius: 0, overflow: "hidden" }
    : { position: "relative", width: "100%", aspectRatio: "16/9", background: "#0a0a0a", borderRadius: 20, overflow: "hidden" };

  return (
    <div ref={containerRef} style={wrapStyle}>

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

      {/* Fullscreen / Exit button */}
      {loaded && (
        <button
          onClick={fakeFS ? exitFakeFS : enterFullscreen}
          aria-label={fakeFS ? "Quitter le plein écran" : "Plein écran"}
          style={{
            position: "absolute",
            bottom: 14, right: 14, zIndex: 10,
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 8,
            padding: "7px 12px",
            color: "#fff",
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            transition: "background .2s",
          }}
        >
          {fakeFS ? (
            <>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 1L12 12M12 1L1 12" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              FERMER
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              PLEIN ÉCRAN
            </>
          )}
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
