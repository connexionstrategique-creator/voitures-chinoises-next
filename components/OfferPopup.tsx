"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SESSION_KEY = "offer-cs55-jul26-seen";
const OFFER_URL = "/offres/cs55-plus-premium-juillet-2026";
const AFFICHE = "/affiche-cs55-juillet-2026.jpg";
const DELAY_MS = 3000;
const VISIBLE_MS = 3000;
const R = 13;
const CIRC = 2 * Math.PI * R; // ≈ 81.68

export default function OfferPopup() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const pathname = usePathname();
  const dismissedRef = useRef(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    if (dismissTimerRef.current) { clearTimeout(dismissTimerRef.current); dismissTimerRef.current = null; }
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
      dismissTimerRef.current = setTimeout(dismiss, VISIBLE_MS);
    }, DELAY_MS);

    return () => {
      clearTimeout(showTimer);
      if (dismissTimerRef.current) { clearTimeout(dismissTimerRef.current); dismissTimerRef.current = null; }
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

      {/* Popup */}
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
        {/* Bandeau : Publicité + barre décompte + bouton ✕ */}
        <div style={{ position: "relative", overflow: "hidden", background: "#fff", borderBottom: "1px solid #eee" }}>
          {/* Remplissage rouge animé de gauche à droite */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(160,20,20,0.1)",
            transformOrigin: "left",
            animation: `fill-header ${VISIBLE_MS}ms linear forwards`,
          }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px 7px 14px" }}>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "#aaa",
              fontFamily: "DM Sans, sans-serif",
            }}>
              Publicité
            </span>
            <button
              onClick={dismiss}
              aria-label="Fermer"
              style={{
                width: 24, height: 24, borderRadius: "50%",
                background: "rgba(0,0,0,0.08)", border: "none",
                color: "#888", fontSize: 11, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Affiche cliquable */}
        <Link href={OFFER_URL} style={{ display: "block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AFFICHE}
            alt="Offre Changan CS55 PLUS PREMIUM — Juillet 2026"
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        </Link>
      </div>
    </>
  );
}
