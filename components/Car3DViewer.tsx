"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface Car3DViewerProps {
  title: string;
  src: string;
}

export default function Car3DViewer({ title, src }: Car3DViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const [fakeFS, setFakeFS] = useState(false);
  const [nativeFS, setNativeFS] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);

  const isFullscreen = fakeFS || nativeFS;

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

  const exitNativeFS = useCallback(() => {
    try {
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
    } catch {}
  }, []);

  const exitFullscreen = useCallback(() => {
    if (fakeFS) exitFakeFS();
    else if (nativeFS) exitNativeFS();
  }, [fakeFS, nativeFS, exitFakeFS, exitNativeFS]);

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

  // Track native fullscreen state
  useEffect(() => {
    const onFSChange = () => {
      const active = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setNativeFS(active);
      if (!active) unlockOrientation();
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

  // Countdown while loading
  useEffect(() => {
    if (loaded) return;
    const t = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [loaded]);

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
          alignItems: "center", justifyContent: "center", gap: 12, zIndex: 2,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/daol8mzeg/image/upload/v1772665987/LOGO_VOITURES_CHINOISE_ROUGE_600x_pfafuh.png"
            alt="Voitures Chinoises"
            style={{ width: 52, height: 52, objectFit: "contain" }}
          />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: "0.18em", fontWeight: 700 }}>VOITURES CHINOISES</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", marginTop: 2 }}>BY CONNEXION STRATÉGIQUE</div>
          </div>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: 4,
          }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: countdown > 0 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)", fontVariantNumeric: "tabular-nums", fontFamily: "DM Sans, sans-serif" }}>
              {countdown > 0 ? countdown : "…"}
            </span>
          </div>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>VUE 3D EN COURS…</span>
        </div>
      )}

      {/* Chinese UI masks — mobile only (desktop proportions differ, masks cut into 3D car) */}
      <div className="viewer-mask-top" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "24%",
        background: "#0a0a0a", zIndex: 5, pointerEvents: "all",
        borderRadius: isFullscreen ? 0 : "20px 20px 0 0",
      }} />
      <div className="viewer-mask-right" style={{
        position: "absolute", top: "24%", right: 0, width: "62%", height: "9%",
        background: "#0a0a0a", zIndex: 5, pointerEvents: "all",
      }} />
      <div className="viewer-mask-left" style={{
        position: "absolute", top: "18%", left: 0, width: "38%", height: "60%",
        background: "#0a0a0a", zIndex: 5, pointerEvents: "all",
      }} />
      <div className="viewer-mask-bl" style={{
        position: "absolute", bottom: 0, left: 0, width: "38%", height: "22%",
        background: "#0a0a0a", zIndex: 5, pointerEvents: "all",
        borderRadius: isFullscreen ? 0 : "0 0 0 20px",
      }} />

      {/* Fullscreen / Exit button */}
      {loaded && (
        <button
          onClick={isFullscreen ? exitFullscreen : enterFullscreen}
          aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
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
          {isFullscreen ? (
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
