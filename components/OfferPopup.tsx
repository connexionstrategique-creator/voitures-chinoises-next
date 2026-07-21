"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SESSION_KEY = "offer-cs55-jul26-seen";
const OFFER_URL = "/offres/cs55-plus-premium-juillet-2026";
const AFFICHE = "/affiche-cs55-juillet-2026.jpg";
const DELAY_MS = 3000;
const VISIBLE_MS = 3000;

export default function OfferPopup() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  const pathname = usePathname();
  const dismissedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setLeaving(true);
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
    setTimeout(() => setVisible(false), 360);
  };

  useEffect(() => {
    if (pathname?.startsWith("/offres") || pathname?.startsWith("/studio")) return;
    try { if (sessionStorage.getItem(SESSION_KEY)) return; } catch {}

    dismissedRef.current = false;

    const showTimer = setTimeout(() => {
      if (dismissedRef.current) return;
      setVisible(true);
      setLeaving(false);
      setProgress(100);

      const start = Date.now();
      intervalRef.current = setInterval(() => {
        const pct = Math.max(0, 100 - ((Date.now() - start) / VISIBLE_MS) * 100);
        setProgress(pct);
        if (pct <= 0) dismiss();
      }, 100);
    }, DELAY_MS);

    return () => {
      clearTimeout(showTimer);
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={dismiss}
        style={{
          position: "fixed", inset: 0, zIndex: 9988,
          background: "rgba(0,0,0,0.55)",
          animation: leaving ? "popup-fade-out 0.32s ease forwards" : "popup-fade-in 0.3s ease forwards",
        }}
      />

      {/* Affiche container */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9990,
          width: "min(360px, 90vw)",
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          animation: leaving
            ? "popup-sink 0.32s ease-in forwards"
            : "popup-rise 0.38s cubic-bezier(0.16,1,0.3,1) forwards",
        }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Fermer"
          style={{
            position: "absolute", top: 10, right: 10, zIndex: 2,
            width: 28, height: 28, borderRadius: "50%",
            background: "rgba(0,0,0,0.55)", border: "none",
            color: "#fff", fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          ✕
        </button>

        {/* Affiche cliquable */}
        <Link href={OFFER_URL} style={{ display: "block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AFFICHE}
            alt="Offre Changan CS55 PLUS PREMIUM — Juillet 2026"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        </Link>

        {/* Barre de progression — remplit de gauche à droite */}
        <div style={{ height: 4, background: "rgba(255,255,255,0.18)" }}>
          <div style={{
            height: "100%", background: "#fff",
            width: `${100 - progress}%`, transition: "width 0.1s linear",
          }} />
        </div>
      </div>
    </>
  );
}
