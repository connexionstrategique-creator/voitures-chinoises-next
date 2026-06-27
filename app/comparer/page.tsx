import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getCars } from "@/sanity/queries";
import { carSlug } from "@/lib/slug";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparateur — Voitures Chinoises",
  description: "Comparez côte à côte les voitures chinoises disponibles.",
};

const WA = "8619587439774";

const SPEC_LABELS: Record<string, string> = {
  "Motorisation":     "Motorisation",
  "Moteur":           "Moteur",
  "Moteur avant":     "Moteur avant",
  "Moteur arrière":   "Moteur arrière",
  "Puissance":        "Puissance",
  "Puissance système":"Puissance système",
  "Couple":           "Couple",
  "Boîte":            "Boîte",
  "Transmission":     "Transmission",
  "Places":           "Places",
  "Longueur":         "Longueur",
  "Largeur":          "Largeur",
  "Hauteur":          "Hauteur",
  "Dimensions":       "Dimensions",
  "Empattement":      "Empattement",
  "Garde au sol":     "Garde au sol",
  "Poids":            "Poids",
  "Coffre":           "Coffre",
  "Réservoir":        "Réservoir",
  "Autonomie":        "Autonomie",
  "Autonomie élec.":  "Autonomie élec.",
  "Autonomie totale": "Autonomie totale",
  "Batterie":         "Batterie",
  "Recharge":         "Recharge",
  "Conso. mixte":     "Conso. mixte",
  "0-100 km/h":       "0-100 km/h",
  "Vitesse max":      "Vitesse max",
  "Pneus":            "Pneus",
  "Suspension":       "Suspension",
  "Remorquage":       "Remorquage",
  "Off-road":         "Off-road",
  "Écrans":           "Écrans",
  "Caméra":           "Caméra",
  "Audio":            "Audio",
  "Toit":             "Toit ouvrant",
};

export default async function ComparerPage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const params = await searchParams;
  const slugs = (params.v ?? "").split(",").filter(Boolean).slice(0, 3);
  const all = await getCars();
  const cars = slugs
    .map(s => all.find(c => carSlug(c.brand, c.model) === s))
    .filter(Boolean) as typeof all;

  if (cars.length === 0) {
    return (
      <>
        <Nav />
        <main style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "80px 24px" }}>
          <p style={{ color: "#555", fontSize: 18 }}>Aucun véhicule sélectionné.</p>
          <Link href="/catalogue" style={{ color: "#A01414", fontWeight: 600, textDecoration: "underline" }}>
            ← Retour au catalogue
          </Link>
        </main>
        <Footer minimal />
      </>
    );
  }

  const allKeys = Array.from(
    new Set(
      cars.flatMap(c => Object.keys(c.specs || {}))
        .filter(k => Object.keys(SPEC_LABELS).includes(k))
    )
  );
  const orderedKeys = Object.keys(SPEC_LABELS).filter(k => allKeys.includes(k));
  const cols = cars.length;

  return (
    <>
      <Nav />
      <main className="comparer-page">
        <div className="comparer-inner">
          <div className="comparer-header">
            <Link href="/catalogue" className="comparer-back">← Retour au catalogue</Link>
            <h1 className="comparer-title">Comparaison</h1>
          </div>

          <div className="comparer-body" style={{ "--cols": cols } as React.CSSProperties}>

            {/* Car header cards */}
            <div className="comparer-cars-row">
              <div className="comparer-label-spacer" />
              {cars.map(car => {
                const photo = car.photos?.[0]?.src;
                const slug = carSlug(car.brand, car.model);
                const waMsg = encodeURIComponent(`Bonjour, je suis intéressé par la ${car.brand} ${car.model}. Pouvez-vous me donner plus d'informations ?`);
                return (
                  <div key={car.id} className="comparer-car-card">
                    <div className="comparer-car-photo-wrap">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={`${car.brand} ${car.model}`}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 600px) 45vw, 220px"
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#f0f0f0" }} />
                      )}
                    </div>
                    <Link href={`/voitures/${slug}`} className="comparer-car-name-link">
                      <div className="comparer-car-brand">{car.brand}</div>
                      <div className="comparer-car-model">{car.model}</div>
                    </Link>
                    <div className="comparer-car-price">{car.price} <span>FCFA</span></div>
                    <a
                      href={`https://wa.me/${WA}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="comparer-wa-btn"
                    >Commander</a>
                  </div>
                );
              })}
            </div>

            {/* Spec rows */}
            {orderedKeys.map((key, i) => {
              const values = cars.map(c => c.specs?.[key] ?? "—");
              const allSame = values.every(v => v === values[0]);
              return (
                <div key={key} className={`comparer-spec-row${i % 2 === 0 ? " even" : ""}`}>
                  <div className="comparer-spec-label">{SPEC_LABELS[key]}</div>
                  <div className="comparer-spec-vals">
                    {values.map((val, j) => (
                      <div
                        key={j}
                        className={`comparer-spec-val${!allSame && val !== "—" ? " highlight" : ""}`}
                      >
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </main>
      <Footer minimal />
    </>
  );
}
