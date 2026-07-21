"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SESSION_KEY = "offer-cs55-jul26-seen";
const OFFER_URL = "/offres/cs55-plus-premium-juillet-2026";
const PHOTO_URL =
  "https://cdn.sanity.io/images/t3ow1rmc/production/fc236818725b96db52ac9948846e2e94520dcd39-1004x576.jpg?auto=format&w=480&q=82";
const DELAY_MS = 3000;
const VISIBLE_MS = 7000;

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
    setTimeout(() => setVisible(false), 380);
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

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date("2026-08-07").getTime() - Date.now()) / 86400000)
  );

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9990,
        width: 288,
        background: "#0D0D0D",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)",
        animation: leaving
          ? "popup-sink 0.35s ease-in forwards"
          : "popup-rise 0.38s cubic-bezier(0.16,1,0.3,1) forwards",
      }}
    >
      <button
        onClick={dismiss}
        aria-label="Fermer"
        style={{
          position: "absolute", top: 10, right: 10, zIndex: 2,
          width: 22, height: 22, borderRadius: "50%",
          background: "rgba(255,255,255,0.12)", border: "none",
          color: "#fff", fontSize: 11, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        ✕
      </button>

      <div style={{ height: 130, background: "#111", position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTO_URL}
          alt="Changan CS55 PLUS PREMIUM 2026"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.88 }}
        />
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: "#A01414", color: "#fff",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", padding: "4px 10px", borderRadius: 2,
        }}>
          Offre Groupage · Juillet 2026
        </div>
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>
          Changan
        </div>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>
          CS55 PLUS PREMIUM 2026
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 3 }}>
          <span style={{ color: "#fff", fontSize: 20, fontWeight: 800, fontVariantNumeric: "tabular-nums lining-nums", letterSpacing: "-0.02em" }}>
            12 500 000
          </span>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>FCFA TTC</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.04em", marginBottom: 14 }}>
          Bénin &amp; Togo &nbsp;·&nbsp; {daysLeft > 0 ? `J-${daysLeft}` : "Derniers jours"} &nbsp;·&nbsp; 03 véhicules
        </div>
        <Link
          href={OFFER_URL}
          onClick={dismiss}
          style={{
            display: "block", textAlign: "center",
            background: "#A01414", color: "#fff",
            padding: "10px 16px", borderRadius: 6,
            fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            textDecoration: "none", marginBottom: 14,
          }}
        >
          Voir l&apos;offre →
        </Link>
      </div>

      <div style={{ height: 2, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", background: "#A01414", width: `${progress}%`, transition: "width 0.1s linear" }} />
      </div>
    </div>
  );
}
