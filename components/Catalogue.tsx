"use client";
import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getColorHex } from "@/data/types";
import type { Car } from "@/data/types";
import { carSlug } from "@/lib/slug";

const WA_NUMBER = "8619587439774";

const BASE_COLORS = [
  { name: "Blanc",  hex: "#F5F5F0", border: "#ccc", keywords: ["blanc", "ivoire", "brillant", "nacré", "neige"] },
  { name: "Noir",   hex: "#111111", border: "#111", keywords: ["noir", "obsidien", "jais", "crystal", "cristal", "nuit", "noble"] },
  { name: "Gris",   hex: "#9B9B9B", border: "#999", keywords: ["gris", "graphène", "titanium", "acier", "anthracite", "atomique", "andes", "nebuleuse"] },
  { name: "Bleu",   hex: "#1565C0", border: "#1565C0", keywords: ["bleu", "cyan", "azure", "capri"] },
  { name: "Argent", hex: "#C8C8C8", border: "#aaa", keywords: ["argent", "superstar", "étoilé"] },
  { name: "Rouge",  hex: "#B71C1C", border: "#B71C1C", keywords: ["rouge"] },
  { name: "Vert",   hex: "#2E7D32", border: "#2E7D32", keywords: ["vert", "paysage", "lac"] },
  { name: "Sable",  hex: "#C2B280", border: "#a89060", keywords: ["sable", "or ", "aurore", "marron", "kaki", "beige", "highway"] },
] as const;

function getBaseColor(colorName: string): string | null {
  const lower = colorName.toLowerCase();
  for (const base of BASE_COLORS) {
    if (base.keywords.some(k => lower.includes(k))) return base.name;
  }
  return null;
}

function carBaseColors(colors: string[]): string[] {
  const found = new Set<string>();
  for (const col of colors) {
    const base = getBaseColor(col);
    if (base) found.add(base);
  }
  return Array.from(found);
}

function waLink(model: string) {
  const msg = encodeURIComponent(`Bonjour, je suis intéressé par la ${model}. Pouvez-vous me donner plus d'informations ?`);
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

function priceNum(priceStr: string) {
  return parseInt(priceStr.replace(/\s/g, ""));
}

function budgetMatch(c: Car, budget: string) {
  const p = priceNum(c.price) / 1_000_000;
  if (budget === "all") return true;
  if (budget === "0-10") return p < 10;
  if (budget === "10-20") return p >= 10 && p < 20;
  if (budget === "20-30") return p >= 20 && p < 30;
  if (budget === "30+") return p >= 30;
  return true;
}

function CarSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style={{ width: "82%", height: "82%", position: "relative", zIndex: 1 }}>
      <ellipse cx="300" cy="235" rx="240" ry="12" fill="rgba(0,0,0,0.3)" />
      <path d="M55 190 L90 140 L165 105 L275 92 L380 92 L460 108 L530 145 L555 185 L555 215 L55 215 Z" fill={color} />
      <path d="M130 190 L158 138 L230 110 L320 100 L410 102 L470 122 L498 155 L498 190 Z" fill="rgba(0,0,0,0.2)" />
      <circle cx="155" cy="212" r="33" fill="#0a0a0a" /><circle cx="155" cy="212" r="24" fill="#222" /><circle cx="155" cy="212" r="12" fill="#555" /><circle cx="155" cy="212" r="5" fill={color} />
      <circle cx="448" cy="212" r="33" fill="#0a0a0a" /><circle cx="448" cy="212" r="24" fill="#222" /><circle cx="448" cy="212" r="12" fill="#555" /><circle cx="448" cy="212" r="5" fill={color} />
    </svg>
  );
}

function CarModal({ car, onClose }: { car: Car; onClose: () => void }) {
  const photos = car.photos || [];
  const [photoIdx, setPhotoIdx] = useState(0);

  return (
    <div className="modal-overlay open" id="modalOverlay" onClick={(e) => { if ((e.target as HTMLElement).id === "modalOverlay") onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Photo carousel */}
        <div className="modal-carousel" style={{ position: "relative", background: "#111", height: "320px", overflow: "hidden" }}>
          {photos.length > 0 ? (
            <>
              <div style={{ display: "flex", height: "100%", transition: "transform .35s ease", transform: `translateX(-${photoIdx * 100}%)` }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ minWidth: "100%", height: "100%", flexShrink: 0, position: "relative" }}>
                    <Image src={p.src} alt={p.label} fill style={{ objectFit: "cover", opacity: 0.85 }} sizes="(max-width: 600px) 100vw, 600px" priority={i === 0} />
                    <span style={{ position: "absolute", top: 12, right: 16, fontFamily: "var(--font-dm-sans)", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>{i + 1} / {photos.length}</span>
                  </div>
                ))}
              </div>
              {photos.length > 1 && (
                <>
                  <button className="modal-carousel-prev" onClick={() => setPhotoIdx((photoIdx - 1 + photos.length) % photos.length)}>‹</button>
                  <button className="modal-carousel-next" onClick={() => setPhotoIdx((photoIdx + 1) % photos.length)}>›</button>
                  <div className="modal-carousel-dots">
                    {photos.map((_, i) => (
                      <div key={i} className={`modal-carousel-dot${i === photoIdx ? " active" : ""}`} onClick={() => setPhotoIdx(i)} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <CarSVG color={car.color} />
            </div>
          )}
          <div className="modal-hero-brand">{car.brand} · {car.year}</div>
          <div className="modal-cif-tag">💰 Prix CIF</div>
        </div>

        <div className="modal-body">
          <div className="modal-brand-tag">{car.brand}</div>
          <div className="modal-title">{car.model.split(" ").map((w, i) => i === 0 ? w : <em key={i}> {w}</em>)}</div>
          <div className="modal-meta">Millésime {car.year} · Neuf 0km · CIF tous ports</div>

          <div className="modal-price-block">
            <div>
              <div className="modal-price">{car.price} <span className="modal-price-fcfa">FCFA</span></div>
              <div style={{ fontSize: 13, color: "var(--mid)", marginTop: 6 }}>📦 Prix CIF inclus — livraison tous ports</div>
            </div>
            <div className="modal-price-info">
              <strong>Cotonou · Lomé · Abidjan · Dakar</strong>
              Même prix CIF vers tous les ports d&apos;Afrique francophone
            </div>
          </div>

          {/* Colors */}
          {car.colors && (
            <div className="modal-colors">
              <span className="modal-colors-label">Couleurs disponibles</span>
              <div className="modal-colors-row">
                {car.colors.map((col) => (
                  <div className="modal-color-item" key={col}>
                    <span className="modal-color-dot" style={{ background: getColorHex(col) }} />
                    <span className="modal-color-name">{col}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specs */}
          <div className="specs-section-title">Fiche technique</div>
          <div className="specs-full">
            {Object.entries(car.specs).map(([k, v]) => (
              <div className="spec-row" key={k}>
                <span className="spec-key">{k}</span>
                <span className="spec-val">{v}</span>
              </div>
            ))}
          </div>

          {car.reasons && car.reasons.length > 0 ? (
            <div className="modal-reasons">
              <div className="modal-reasons-title">Pourquoi choisir cette voiture ?</div>
              {car.reasons.map((r, i) => (
                <div className="modal-reason-item" key={i}>
                  <div className="modal-reason-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="modal-reason-content">
                    <div className="modal-reason-heading">{r.title}</div>
                    <div className="modal-reason-body">{r.body}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="modal-desc">{car.desc}</p>
          )}

          <div className="modal-actions">
            <a
              className="modal-cta-primary"
              href={waLink(`${car.brand} ${car.model}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              📱 Commander sur WhatsApp
            </a>
            <button className="modal-cta-secondary" onClick={onClose}>
              ← Retour au catalogue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Catalogue({ cars }: { cars: Car[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeBudget, setActiveBudget] = useState("all");
  const [activeColor, setActiveColor] = useState("all");
  const [search, setSearch] = useState(() => (searchParams.get("q") ?? "").toLowerCase().trim());
  const [page, setPage] = useState(1);

  const handleSearch = useCallback((val: string) => {
    const lower = val.toLowerCase().trim();
    setSearch(lower);
    const params = new URLSearchParams(searchParams.toString());
    if (lower) params.set("q", lower); else params.delete("q");
    router.replace(`/catalogue?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);
  const PAGE_SIZE = 9;

  // Compute which base colors actually appear across all cars
  const availableColors = useMemo(() => {
    const found = new Set<string>();
    for (const c of cars) {
      for (const base of carBaseColors(c.colors || [])) found.add(base);
    }
    return BASE_COLORS.filter(b => found.has(b.name));
  }, [cars]);

  const filtered = useMemo(() => {
    setPage(1);
    return cars.filter((c) => {
      const catOk =
        activeFilter === "all" ||
        c.cat === activeFilter ||
        (activeFilter === "7places" && c.specs.Places?.includes("7")) ||
        (activeFilter === "5places" && c.specs.Places?.includes("5") && !c.specs.Places?.includes("7"));
      const budOk = budgetMatch(c, activeBudget);
      const colorOk = activeColor === "all" || carBaseColors(c.colors || []).includes(activeColor);
      const srchOk = !search || c.brand.toLowerCase().includes(search) || c.model.toLowerCase().includes(search);
      return catOk && budOk && colorOk && srchOk;
    });
  }, [activeFilter, activeBudget, activeColor, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <section className="section catalogue-section" id="catalogue">
        <div className="section-inner">
          {/* Type filters */}
          <div className="catalogue-controls">
            <div>
              <span className="filter-label">Type de véhicule</span>
              <div className="filters">
                {["all", "suv", "hybride", "5places", "7places"].map((f) => (
                  <button
                    key={f}
                    className={`filter-btn${activeFilter === f ? " active" : ""}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f === "all" ? "Tous" : f === "suv" ? "SUV" : f === "hybride" ? "Hybrides" : f === "5places" ? "5 Places" : "7 Places"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search */}
          <div style={{ marginBottom: 16 }}>
            <div className="search-wrap">
              <input
                type="text"
                className="search-input"
                placeholder="Rechercher marque ou modèle…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Budget filters */}
          <div style={{ marginBottom: 28 }}>
            <span className="filter-label">Budget</span>
            <div className="budget-filters">
              {[
                { key: "all", label: "Tous les prix" },
                { key: "0-10", label: "0 – 10M FCFA" },
                { key: "10-20", label: "10M – 20M FCFA" },
                { key: "20-30", label: "20M – 30M FCFA" },
                { key: "30+", label: "30M+ FCFA" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`budget-btn${activeBudget === key ? " active" : ""}`}
                  onClick={() => setActiveBudget(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Cars grid */}
          <div className="cars-grid">
            {paginated.map((car) => {
              const photos = car.photos || [];
              return (
                <div
                  key={car.id}
                  className={`car-card${car.featured ? " featured" : ""}`}
                  onClick={() => router.push(`/voitures/${carSlug(car.brand, car.model)}`)}
                >
                  <div className="car-img-wrap">
                    {photos.length > 0 ? (
                      <Image
                        src={photos[0].src}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        style={{ objectFit: "cover", opacity: 0.85 }}
                        sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 400px"
                      />
                    ) : (
                      <CarSVG color={car.color} />
                    )}
                    <div className={`car-badge badge-${car.badge}`}>{car.badgeText}</div>
                    <div className="brand-strip">{car.brand} · {car.year} · 0km</div>
                  </div>

                  <div className="car-info">
                    <div className="car-brand-label">{car.brand}</div>
                    <div className="car-name">
                      {car.model.split(" ").map((w, i) => i === 0 ? <span key={i}>{w} </span> : <em key={i}>{w} </em>)}
                    </div>
                    <div className="car-meta">Millésime {car.year} · Neuf 0km · CIF tous ports</div>

                    {car.colors && (
                      <div className="car-colors">
                        <span className="colors-label">Couleurs :</span>
                        {car.colors.map((col) => (
                          <span key={col} className="color-dot" title={col} style={{ background: getColorHex(col) }} />
                        ))}
                        <span className="colors-list">{car.colors.join(" · ")}</span>
                      </div>
                    )}

                    <div className="specs-mini">
                      <div className="spec-mini-item">
                        <span className="spec-mini-val">{car.mini.v1}</span>
                        <span className="spec-mini-key">{car.mini.k1}</span>
                      </div>
                      <div className="spec-mini-item">
                        <span className="spec-mini-val">{car.mini.v2}</span>
                        <span className="spec-mini-key">{car.mini.k2}</span>
                      </div>
                      <div className="spec-mini-item">
                        <span className="spec-mini-val">{car.mini.v3}</span>
                        <span className="spec-mini-key">{car.mini.k3}</span>
                      </div>
                    </div>

                    <div className="car-price-row">
                      <div>
                        <div className="car-price">{car.price} <sup>FCFA</sup></div>
                        <div className="price-cif">Prix CIF inclus · Neuf 0km</div>
                      </div>
                    </div>

                    <div className="price-cities">
                      <span className="price-city-item">🇧🇯 Cotonou</span>
                      <span className="price-city-sep">·</span>
                      <span className="price-city-item">🇹🇬 Lomé</span>
                      <span className="price-city-sep">·</span>
                      <span className="price-city-item">🇨🇮 Abidjan</span>
                      <span className="price-city-sep">·</span>
                      <span className="price-city-item">🇸🇳 Dakar</span>
                      <span className="price-city-same">Même prix</span>
                    </div>

                    <div className="card-actions">
                      <a
                        className="card-cta-wa"
                        href={waLink(`${car.brand} ${car.model}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.526 5.854L0 24l6.335-1.509A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.88 9.88 0 01-5.031-1.373l-.36-.214-3.762.896.957-3.665-.235-.376A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.467 0 9.882 4.415 9.882 9.882 0 5.467-4.415 9.882-9.882 9.882z" />
                        </svg>
                        Commander
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 48, paddingBottom: 8 }}>
              <button
                onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === 1}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "1px solid #E0E0E0",
                  background: page === 1 ? "#F5F5F5" : "#fff",
                  color: page === 1 ? "#ccc" : "#0D0D0D",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, cursor: page === 1 ? "not-allowed" : "pointer",
                  transition: "all .2s",
                }}
              >‹</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  style={{
                    width: 40, height: 40, borderRadius: "50%",
                    border: p === page ? "1px solid #A01414" : "1px solid #E0E0E0",
                    background: p === page ? "#A01414" : "#fff",
                    color: p === page ? "#fff" : "#555",
                    fontFamily: "DM Sans, sans-serif", fontWeight: p === page ? 700 : 500,
                    fontSize: 13, cursor: "pointer", transition: "all .2s",
                  }}
                >{p}</button>
              ))}

              <button
                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={page === totalPages}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "1px solid #E0E0E0",
                  background: page === totalPages ? "#F5F5F5" : "#fff",
                  color: page === totalPages ? "#ccc" : "#0D0D0D",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, cursor: page === totalPages ? "not-allowed" : "pointer",
                  transition: "all .2s",
                }}
              >›</button>
            </div>
          )}
        </div>
      </section>

    </>
  );
}
