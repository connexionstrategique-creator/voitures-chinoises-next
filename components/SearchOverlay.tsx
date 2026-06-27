"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface CarResult {
  brand: string;
  model: string;
  slug: string;
  price: string;
  cat: string;
  thumb: string | null;
}

const CAT_LABEL: Record<string, string> = {
  suv: "SUV",
  hybride: "Hybride",
  elec: "Électrique",
};

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState<CarResult[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((data) => { setCars(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const q = query.toLowerCase().trim();
  const filtered = q
    ? cars.filter((c) =>
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        `${c.brand} ${c.model}`.toLowerCase().includes(q) ||
        (c.cat && CAT_LABEL[c.cat]?.toLowerCase().includes(q))
      )
    : cars;

  return (
    <>
      <div className="search-backdrop" onClick={onClose} />
      <div className="search-overlay" role="dialog" aria-modal aria-label="Rechercher une voiture">
        {/* Input */}
        <div className="search-input-row">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="search-icon-svg">
            <circle cx="7.5" cy="7.5" r="5.5" stroke="#999" strokeWidth="1.6"/>
            <path d="M12 12l3.5 3.5" stroke="#999" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="BYD, Changan, Jetour, SUV, hybride…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            autoComplete="off"
          />
          {query && (
            <button className="search-clear-btn" onClick={() => setQuery("")} aria-label="Effacer">
              ×
            </button>
          )}
          <button className="search-esc-btn" onClick={onClose}>ESC</button>
        </div>

        {/* Results */}
        <div className="search-results-wrap">
          {loading && (
            <div className="search-state-msg">Chargement…</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="search-state-msg">
              {q ? `Aucun résultat pour « ${query} »` : "Aucune voiture disponible."}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <>
              {!q && (
                <div className="search-section-label">TOUS LES MODÈLES</div>
              )}
              {q && (
                <div className="search-section-label">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</div>
              )}
              <div className="search-results-list">
                {filtered.slice(0, 9).map((car) => (
                  <Link
                    key={car.slug}
                    href={`/voitures/${car.slug}`}
                    className="search-result-item"
                    onClick={onClose}
                  >
                    <div className="search-result-thumb-wrap">
                      {car.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={car.thumb} alt="" className="search-result-thumb" loading="lazy" />
                      ) : (
                        <div className="search-result-thumb-placeholder" />
                      )}
                    </div>
                    <div className="search-result-info">
                      <span className="search-result-brand">{car.brand}</span>
                      <span className="search-result-model">{car.model}</span>
                      <span className="search-result-price">{car.price} <span style={{opacity:.6}}>FCFA</span></span>
                    </div>
                    <span className={`search-result-cat search-cat-${car.cat}`}>
                      {CAT_LABEL[car.cat] ?? car.cat}
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
