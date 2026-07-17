"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import type { SparePart } from "@/data/types";

const CATEGORY_LABELS: Record<string, string> = {
  filtration:  "Filtration",
  freinage:    "Freinage",
  moteur:      "Moteur",
  suspension:  "Suspension",
  electricite: "Électricité",
  carrosserie: "Carrosserie",
  entretien:   "Entretien",
  accessoires: "Accessoires",
  autre:       "Autre",
};

const CATEGORY_ICONS: Record<string, string> = {
  filtration:  "🔵",
  freinage:    "🔴",
  moteur:      "⚙️",
  suspension:  "🔩",
  electricite: "⚡",
  carrosserie: "🚗",
  entretien:   "🛠️",
  accessoires: "✨",
  autre:       "📦",
};

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

export default function BoutiqueClient({
  parts,
  waNumber,
}: {
  parts: SparePart[];
  waNumber: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeCar, setActiveCar]           = useState<string>("all");
  const [search, setSearch]                 = useState("");

  // Build unique category list from parts
  const categories = useMemo(() => {
    const seen = new Set<string>();
    parts.forEach((p) => seen.add(p.category));
    return Array.from(seen);
  }, [parts]);

  // Build unique car list from all compatibleCars
  const cars = useMemo(() => {
    const map = new Map<string, { id: string; brand: string; model: string }>();
    parts.forEach((p) =>
      p.compatibleCars.forEach((c) => {
        if (!map.has(c.id)) map.set(c.id, c);
      })
    );
    return Array.from(map.values()).sort((a, b) =>
      `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
    );
  }, [parts]);

  const filtered = useMemo(() => {
    return parts.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (activeCar !== "all" && !p.compatibleCars.some((c) => c.id === activeCar)) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [parts, activeCategory, activeCar, search]);

  function buildWaMsg(part: SparePart) {
    const compatibles = part.compatibleCars.map((c) => `${c.brand} ${c.model}`).join(", ");
    const boutiqueUrl = `https://www.voitureschinoises.com/boutique`;
    return encodeURIComponent(
      `Bonjour, je souhaite commander la pièce suivante :\n\n` +
      `📦 ${part.name}${part.reference ? ` (Réf. ${part.reference})` : ""}\n` +
      `🚗 Compatible : ${compatibles || "—"}\n` +
      `💰 Prix de référence : ${formatPrice(part.price)} (hors transport)\n\n` +
      `🚚 Mode de transport souhaité : ✈️ Avion / 🚢 Bateau\n\n` +
      `🔗 ${boutiqueUrl}\n\n` +
      `Merci de confirmer la disponibilité et les délais.`
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>

      {/* ── Filtres ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32, alignItems: "flex-start" }}>
        {/* Recherche */}
        <input
          type="text"
          placeholder="Rechercher une pièce…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 16px",
            borderRadius: 100,
            border: "1.5px solid var(--border, #E0E0E0)",
            fontSize: 14,
            outline: "none",
            width: 240,
            fontFamily: "inherit",
          }}
        />

        {/* Catégories */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button
            onClick={() => setActiveCategory("all")}
            style={filterBtnStyle(activeCategory === "all")}
          >
            Toutes les catégories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={filterBtnStyle(activeCategory === cat)}
            >
              {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        {/* Filtre par voiture */}
        {cars.length > 0 && (
          <select
            value={activeCar}
            onChange={(e) => setActiveCar(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: 100,
              border: "1.5px solid var(--border, #E0E0E0)",
              fontSize: 14,
              background: activeCar !== "all" ? "#0D0D0D" : "#fff",
              color: activeCar !== "all" ? "#fff" : "#0D0D0D",
              cursor: "pointer",
              fontFamily: "inherit",
              outline: "none",
            }}
          >
            <option value="all">Toutes les voitures</option>
            {cars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.brand} {c.model}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ── Compteur ── */}
      <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>
        {filtered.length} pièce{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
        {activeCategory !== "all" || activeCar !== "all" || search ? " (filtrées)" : ""}
      </p>

      {/* ── Grille ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#999" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
          <p style={{ fontSize: 16 }}>Aucune pièce trouvée.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {filtered.map((part) => (
            <PartCard key={part.id} part={part} waNumber={waNumber} waMsg={buildWaMsg(part)} />
          ))}
        </div>
      )}
    </div>
  );
}

function filterBtnStyle(active: boolean): React.CSSProperties {
  return {
    padding: "9px 18px",
    borderRadius: 100,
    border: "1.5px solid " + (active ? "#0D0D0D" : "#E0E0E0"),
    background: active ? "#0D0D0D" : "#fff",
    color: active ? "#fff" : "#444",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all .15s",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  };
}

function PartCard({
  part,
  waNumber,
  waMsg,
}: {
  part: SparePart;
  waNumber: string;
  waMsg: string;
}) {
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      border: "1px solid var(--border, #E0E0E0)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "box-shadow .2s",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.10)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Photo */}
      <div style={{ position: "relative", height: 220, background: "#F5F5F5", flexShrink: 0 }}>
        {part.photos.length > 0 ? (
          <>
            <Image
              src={part.photos[imgIdx]?.src || part.photos[0].src}
              alt={part.name}
              fill
              style={{ objectFit: "contain", padding: 16 }}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {part.photos.length > 1 && (
              <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
                {part.photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: i === imgIdx ? "#0D0D0D" : "rgba(0,0,0,0.2)",
                      border: "none", cursor: "pointer", padding: 0,
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 48 }}>
            {CATEGORY_ICONS[part.category] ?? "🔩"}
          </div>
        )}

        {/* Badge catégorie */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "#0D0D0D", color: "#fff",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          padding: "4px 10px", borderRadius: 100,
        }}>
          {CATEGORY_LABELS[part.category] ?? part.category}
        </div>

        {/* Badge dispo */}
        {!part.inStock && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "#666", color: "#fff",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
            padding: "4px 10px", borderRadius: 100,
          }}>
            Délai allongé
          </div>
        )}
      </div>

      {/* Infos */}
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0D0D0D", lineHeight: 1.3, marginBottom: 6 }}>
          {part.name}
        </div>

        {part.reference && (
          <div style={{ fontSize: 11, color: "#999", letterSpacing: "0.1em", marginBottom: 8 }}>
            Réf. {part.reference}
          </div>
        )}

        {part.description && (
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5, margin: "0 0 12px" }}>
            {part.description}
          </p>
        )}

        {/* Voitures compatibles */}
        {part.compatibleCars.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#A01414", marginBottom: 6 }}>
              COMPATIBLE AVEC
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {part.compatibleCars.map((c) => (
                <span key={c.id} style={{
                  fontSize: 12, background: "#F5F5F5", borderRadius: 100,
                  padding: "3px 10px", color: "#333", fontWeight: 500,
                }}>
                  {c.brand} {c.model}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "auto" }}>
          {/* Prix */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.06em", marginBottom: 2 }}>
              PRIX DE RÉFÉRENCE
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0D0D0D", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
              {formatPrice(part.price)}
            </div>
            <div style={{ fontSize: 11, color: "#A01414", fontWeight: 600, marginTop: 4, letterSpacing: "0.04em" }}>
              Disponible sur commande · hors transport
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>
              Précisez : ✈️ avion ou 🚢 bateau
            </div>
          </div>

          {/* CTA WhatsApp */}
          <a
            href={`https://wa.me/${waNumber}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#A01414", color: "#fff",
              padding: "12px 20px", borderRadius: 8,
              fontWeight: 700, fontSize: 13, letterSpacing: "0.04em",
              textDecoration: "none", textTransform: "uppercase",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#8a1010")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#A01414")}
          >
            📱 Commander sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
