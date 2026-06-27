"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface CarResult {
  type: "car";
  brand: string;
  model: string;
  slug: string;
  price: string;
  cat: string;
  thumb: string | null;
}

interface PostResult {
  type: "post";
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  thumb: string | null;
}

const CAT_LABEL: Record<string, string> = {
  suv: "SUV",
  hybride: "Hybride",
  elec: "Électrique",
  "SUV hybride": "Hybride",
  "Berline hybride": "Hybride",
  "Citadine électrique": "Électrique",
  "SUV électrique": "Électrique",
};

const POST_CAT_LABEL: Record<string, string> = {
  actualites: "Actualités",
  guides: "Guide",
  modeles: "Modèles",
  marche: "Marché",
};

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState<CarResult[]>([]);
  const [posts, setPosts] = useState<PostResult[]>([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((data) => {
        setCars(data.cars ?? []);
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const q = query.toLowerCase().trim();

  const filteredCars = q
    ? cars.filter((c) =>
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        `${c.brand} ${c.model}`.toLowerCase().includes(q) ||
        (c.cat && (CAT_LABEL[c.cat]?.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q)))
      )
    : cars;

  const filteredPosts = q
    ? posts.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        POST_CAT_LABEL[p.category]?.toLowerCase().includes(q)
      )
    : [];

  const totalResults = filteredCars.length + filteredPosts.length;

  return (
    <>
      <div className="search-backdrop" onClick={onClose} />
      <div className="search-overlay" role="dialog" aria-modal aria-label="Rechercher">
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
            <button className="search-clear-btn" onClick={() => setQuery("")} aria-label="Effacer">×</button>
          )}
          <button className="search-esc-btn" onClick={onClose}>ESC</button>
        </div>

        {/* Results */}
        <div className="search-results-wrap">
          {loading && <div className="search-state-msg">Chargement…</div>}

          {!loading && q && totalResults === 0 && (
            <div className="search-state-msg">Aucun résultat pour « {query} »</div>
          )}

          {/* Cars section */}
          {!loading && filteredCars.length > 0 && (
            <>
              <div className="search-section-label">
                {q ? `VOITURES — ${filteredCars.length} résultat${filteredCars.length > 1 ? "s" : ""}` : "TOUS LES MODÈLES"}
              </div>
              <div className="search-results-list">
                {filteredCars.slice(0, q ? 5 : 9).map((car) => (
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

          {/* Articles section — only shown when query matches */}
          {!loading && filteredPosts.length > 0 && (
            <>
              <div className="search-section-label" style={{marginTop: 8}}>
                ARTICLES — {filteredPosts.length} résultat{filteredPosts.length > 1 ? "s" : ""}
              </div>
              <div className="search-results-list">
                {filteredPosts.slice(0, 4).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="search-result-item"
                    onClick={onClose}
                  >
                    <div className="search-result-thumb-wrap">
                      {post.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.thumb + "?w=120&h=80&fit=crop&auto=format"} alt="" className="search-result-thumb" loading="lazy" />
                      ) : (
                        <div className="search-result-thumb-placeholder" />
                      )}
                    </div>
                    <div className="search-result-info">
                      <span className="search-result-brand" style={{color:"var(--mid)"}}>Article</span>
                      <span className="search-result-model" style={{fontSize:13}}>{post.title}</span>
                    </div>
                    <span className="search-result-cat" style={{background:"#f0f0f0",color:"#555"}}>
                      {POST_CAT_LABEL[post.category] ?? post.category}
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
