"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Car } from "@/data/types";
import { carSlug } from "@/lib/slug";
import Link from "next/link";

function AnimatedCarPlaceholder({ color, brand }: { color: string; brand: string }) {
  const c = color || "#A01414";
  const dark = "#0D0D0D";
  const glass = "rgba(200,220,255,0.18)";

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #f0f0f0 0%, #e8e8e8 100%)",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes carFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes wheelSpin {
          from { transform-origin: center; transform: rotate(0deg); }
          to   { transform-origin: center; transform: rotate(360deg); }
        }
        @keyframes speedLine {
          0%   { opacity: 0; transform: translateX(0px); }
          20%  { opacity: 0.7; }
          80%  { opacity: 0.5; }
          100% { opacity: 0; transform: translateX(-80px); }
        }
        @keyframes groundPulse {
          0%,100% { transform: scaleX(1); opacity: 0.18; }
          50%     { transform: scaleX(0.92); opacity: 0.12; }
        }
        @keyframes headlightGlow {
          0%,100% { opacity: 0.5; }
          50%     { opacity: 1; }
        }
        .car-body-anim { animation: carFloat 2.8s ease-in-out infinite; }
        .wheel-fl { animation: wheelSpin 1.2s linear infinite; transform-box: fill-box; transform-origin: center; }
        .wheel-rl { animation: wheelSpin 1.2s linear infinite; transform-box: fill-box; transform-origin: center; }
        .speed-l1 { animation: speedLine 1.6s ease-in-out infinite 0s; }
        .speed-l2 { animation: speedLine 1.6s ease-in-out infinite 0.3s; }
        .speed-l3 { animation: speedLine 1.6s ease-in-out infinite 0.6s; }
        .speed-l4 { animation: speedLine 1.6s ease-in-out infinite 0.9s; }
        .ground-shadow { animation: groundPulse 2.8s ease-in-out infinite; transform-origin: center; }
        .headlight-glow { animation: headlightGlow 2s ease-in-out infinite; }
      `}</style>

      {/* Speed lines */}
      <svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" style={{ width: "90%", maxWidth: 520 }}>

        {/* Ground shadow */}
        <ellipse className="ground-shadow" cx="280" cy="270" rx="210" ry="14" fill={dark} />

        {/* Speed lines (behind car) */}
        <line className="speed-l1" x1="80" y1="195" x2="155" y2="195" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <line className="speed-l2" x1="60" y1="210" x2="150" y2="210" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        <line className="speed-l3" x1="90" y1="220" x2="145" y2="220" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
        <line className="speed-l4" x1="50" y1="232" x2="140" y2="232" stroke="#ccc" strokeWidth="1" strokeLinecap="round" />

        {/* Car body group — floating */}
        <g className="car-body-anim">

          {/* Body lower */}
          <path
            d="M110 245 L110 210 L135 195 L185 170 L285 160 L385 162 L440 178 L460 200 L462 245 Z"
            fill={c}
          />
          {/* Body upper (cabin) */}
          <path
            d="M175 210 L195 175 L240 158 L330 154 L390 158 L420 178 L440 200 L175 200 Z"
            fill={c}
            style={{ filter: "brightness(0.88)" }}
          />
          {/* Roof highlight */}
          <path
            d="M200 198 L210 172 L245 157 L325 153 L385 158 L410 175 L415 198 Z"
            fill={c}
            style={{ filter: "brightness(1.12)" }}
          />

          {/* Windshield */}
          <path
            d="M205 197 L218 170 L248 157 L320 153 L320 197 Z"
            fill={glass}
            stroke="rgba(255,255,255,0.25)" strokeWidth="1"
          />
          {/* Rear window */}
          <path
            d="M325 153 L385 157 L408 174 L408 197 L325 197 Z"
            fill={glass}
            stroke="rgba(255,255,255,0.2)" strokeWidth="1"
          />

          {/* Door lines */}
          <line x1="322" y1="200" x2="322" y2="245" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
          <line x1="240" y1="200" x2="240" y2="245" stroke="rgba(0,0,0,0.10)" strokeWidth="1" />

          {/* Door handles */}
          <rect x="270" y="218" width="28" height="5" rx="2.5" fill="rgba(0,0,0,0.18)" />
          <rect x="345" y="218" width="28" height="5" rx="2.5" fill="rgba(0,0,0,0.18)" />

          {/* Headlight (front) */}
          <path d="M455 200 L462 200 L462 218 L455 218 Z" fill="#FFF9C4" />
          <path className="headlight-glow" d="M462 205 L485 198 L488 212 L462 215 Z" fill="rgba(255,248,180,0.5)" />

          {/* Tail light */}
          <rect x="108" y="205" width="8" height="20" rx="2" fill="#FF3030" opacity="0.9" />

          {/* Bumpers */}
          <path d="M108 240 L118 237 L118 248 L108 248 Z" fill={c} style={{ filter: "brightness(0.8)" }} />
          <path d="M462 240 L452 237 L452 248 L462 248 Z" fill={c} style={{ filter: "brightness(0.8)" }} />

          {/* Underbody */}
          <rect x="115" y="242" width="335" height="6" rx="2" fill={dark} opacity="0.35" />

          {/* Wheel wells */}
          <ellipse cx="185" cy="248" rx="52" ry="18" fill={dark} opacity="0.5" />
          <ellipse cx="390" cy="248" rx="52" ry="18" fill={dark} opacity="0.5" />

          {/* Rear wheel */}
          <g>
            <circle cx="185" cy="248" r="36" fill="#1a1a1a" />
            <circle cx="185" cy="248" r="28" fill="#2d2d2d" />
            <g className="wheel-rl">
              <line x1="185" y1="220" x2="185" y2="276" stroke="#555" strokeWidth="4" strokeLinecap="round" />
              <line x1="157" y1="248" x2="213" y2="248" stroke="#555" strokeWidth="4" strokeLinecap="round" />
              <line x1="165" y1="228" x2="205" y2="268" stroke="#444" strokeWidth="3" strokeLinecap="round" />
              <line x1="205" y1="228" x2="165" y2="268" stroke="#444" strokeWidth="3" strokeLinecap="round" />
            </g>
            <circle cx="185" cy="248" r="10" fill="#888" />
            <circle cx="185" cy="248" r="5" fill={c} />
            <circle cx="185" cy="248" r="28" fill="none" stroke="#555" strokeWidth="1.5" />
          </g>

          {/* Front wheel */}
          <g>
            <circle cx="390" cy="248" r="36" fill="#1a1a1a" />
            <circle cx="390" cy="248" r="28" fill="#2d2d2d" />
            <g className="wheel-fl">
              <line x1="390" y1="220" x2="390" y2="276" stroke="#555" strokeWidth="4" strokeLinecap="round" />
              <line x1="362" y1="248" x2="418" y2="248" stroke="#555" strokeWidth="4" strokeLinecap="round" />
              <line x1="370" y1="228" x2="410" y2="268" stroke="#444" strokeWidth="3" strokeLinecap="round" />
              <line x1="410" y1="228" x2="370" y2="268" stroke="#444" strokeWidth="3" strokeLinecap="round" />
            </g>
            <circle cx="390" cy="248" r="10" fill="#888" />
            <circle cx="390" cy="248" r="5" fill={c} />
            <circle cx="390" cy="248" r="28" fill="none" stroke="#555" strokeWidth="1.5" />
          </g>

        </g>
      </svg>

      {/* Brand label */}
      <div style={{
        position: "absolute", bottom: 28,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10, letterSpacing: "0.28em",
        textTransform: "uppercase", color: "#aaa",
        fontWeight: 600,
      }}>
        {brand} · Photo bientôt disponible
      </div>
    </div>
  );
}

interface Props {
  cars: Car[];
  waNumber?: string;
}

const INTERVAL = 5000;

export default function FeaturedCarousel({ cars, waNumber }: Props) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wa = waNumber ?? "8619587439774";

  const goTo = useCallback(
    (next: number, dir: "next" | "prev" = "next") => {
      if (animating || next === index) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setIndex(next);
        setAnimating(false);
      }, 420);
    },
    [animating, index]
  );

  const goNext = useCallback(() => {
    goTo((index + 1) % cars.length, "next");
  }, [goTo, index, cars.length]);

  const goPrev = useCallback(() => {
    goTo((index - 1 + cars.length) % cars.length, "prev");
  }, [goTo, index, cars.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);

    let p = 0;
    progressRef.current = setInterval(() => {
      p += 100 / (INTERVAL / 50);
      setProgress(Math.min(p, 100));
    }, 50);

    timerRef.current = setTimeout(() => {
      goNext();
    }, INTERVAL);
  }, [goNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [index, resetTimer]);

  const car = cars[index];
  const slug = carSlug(car.brand, car.model);
  const photo = car.photos?.[0]?.src || "";
  const carUrl = `https://www.voitureschinoises.com/voitures/${slug}`;
  const waMsg = encodeURIComponent(
    `Bonjour, je suis intéressé par la ${car.brand} ${car.model}.\n\n🔗 ${carUrl}\n\nPouvez-vous me donner plus d'informations ?`
  );

  const mini = [
    { v: car.mini.v1, k: car.mini.k1 },
    { v: car.mini.v2, k: car.mini.k2 },
    { v: car.mini.v3, k: car.mini.k3 },
  ].filter((m) => m.v);

  const modelMatch = car.model.match(/^(.*?)(\s*\d[\w\s]*)$/);
  const modelText = modelMatch ? modelMatch[1] : car.model;
  const modelNum = modelMatch ? modelMatch[2] : "";

  const slideOut =
    animating && direction === "next"
      ? "fdm-slide-out-left"
      : animating && direction === "prev"
      ? "fdm-slide-out-right"
      : "";

  const slideIn =
    !animating && direction === "next"
      ? "fdm-slide-in-right"
      : !animating && direction === "prev"
      ? "fdm-slide-in-left"
      : "";

  return (
    <section className="fdm-section">
      {/* Top bar */}
      <div className="fdm-topbar">
        <div className="fdm-topbar-left">
          <span className="fdm-topbar-line" />
          <span className="fdm-topbar-label">Notre offre du moment</span>
        </div>
        <div className="fdm-topbar-right-group">
          <span className="fdm-topbar-right">
            {index + 1} / {cars.length}
          </span>
          <div className="fdm-carousel-arrows">
            <button className="fdm-arrow" onClick={goPrev} aria-label="Précédent">
              ←
            </button>
            <button className="fdm-arrow" onClick={goNext} aria-label="Suivant">
              →
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="fdm-progress-track">
        <div className="fdm-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Main grid */}
      <div className={`fdm-grid fdm-carousel-slide ${slideOut || slideIn}`} key={index}>
        {/* Left — photo */}
        <div className="fdm-photo-col">
          <div className="fdm-photo-box">
            <span className="fdm-badge">En vedette</span>
            {photo ? (
              <img
                src={photo}
                alt={`${car.brand} ${car.model} ${car.year}`}
                className="fdm-car-photo-anim"
                loading="eager"
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  objectFit: "contain",
                  objectPosition: "center bottom",
                  padding: "20px",
                }}
              />
            ) : (
              <AnimatedCarPlaceholder color={car.color || "#A01414"} brand={car.brand} />
            )}
            <div className="fdm-photo-caption">
              {car.brand} · {car.year} · 0km
            </div>
          </div>
        </div>

        {/* Right — info */}
        <div className="fdm-info-col">
          <div className="fdm-car-brand">{car.brand}</div>
          <h2 className="fdm-car-model">
            {modelText}
            {modelNum && <em className="fdm-model-num">{modelNum}</em>}
          </h2>
          <div className="fdm-pills">
            <span className="fdm-pill">Millésime {car.year}</span>
            <span className="fdm-pill">Neuf · 0 km</span>
            <span className="fdm-pill">CIF livré</span>
          </div>
          {mini.length > 0 && (
            <div className="fdm-specs-row">
              {mini.map((m, i) => (
                <div key={i} className="fdm-spec-cell">
                  <span className="fdm-spec-val">{m.v}</span>
                  <span className="fdm-spec-lbl">{m.k}</span>
                </div>
              ))}
            </div>
          )}
          <div className="fdm-price-label">Prix CIF · Livré à votre port</div>
          <div className="fdm-price-amount">
            {car.price} <span className="fdm-price-unit">FCFA</span>
          </div>
          <div className="fdm-actions">
            <a
              href={`https://wa.me/${wa}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="fdm-btn-wa"
            >
              Commander sur WhatsApp
            </a>
            <Link href={`/voitures/${slug}`} className="fdm-btn-fiche">
              Voir la fiche complète →
            </Link>
          </div>

          {/* Dots */}
          <div className="fdm-dots">
            {cars.map((_, i) => (
              <button
                key={i}
                className={`fdm-dot${i === index ? " fdm-dot-active" : ""}`}
                onClick={() => goTo(i, i > index ? "next" : "prev")}
                aria-label={`Voiture ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
