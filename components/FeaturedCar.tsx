import type { Car } from "@/data/types";
import { carSlug } from "@/lib/slug";
import Image from "next/image";
import Link from "next/link";

interface Props {
  car: Car;
  waNumber?: string;
}

export default function FeaturedCar({ car, waNumber }: Props) {
  const slug = carSlug(car.brand, car.model);
  const photo = car.photos?.[0]?.src || "";
  const wa = waNumber ?? "8619587439774";
  const waMsg = encodeURIComponent(`Bonjour, je suis intéressé par la ${car.brand} ${car.model}. Pouvez-vous me donner plus d'informations ?`);

  const mini = [
    { v: car.mini.v1, k: car.mini.k1 },
    { v: car.mini.v2, k: car.mini.k2 },
    { v: car.mini.v3, k: car.mini.k3 },
  ].filter((m) => m.v);

  // Split model name: text part + number/suffix in red italic
  const modelMatch = car.model.match(/^(.*?)(\s*\d[\w\s]*)$/);
  const modelText = modelMatch ? modelMatch[1] : car.model;
  const modelNum  = modelMatch ? modelMatch[2] : "";

  return (
    <section className="fdm-section">
      {/* Top bar */}
      <div className="fdm-topbar">
        <div className="fdm-topbar-left">
          <span className="fdm-topbar-line" />
          <span className="fdm-topbar-label">Notre offre du moment</span>
        </div>
        <span className="fdm-topbar-right">Sélection mise à jour chaque semaine</span>
      </div>
      <div className="fdm-topbar-divider" />

      {/* Main grid */}
      <div className="fdm-grid">

        {/* Left — photo */}
        <div className="fdm-photo-col">
          <div className="fdm-photo-box">
            <span className="fdm-badge">En vedette</span>
            {photo ? (
              <Image
                src={photo}
                alt={`${car.brand} ${car.model} ${car.year}`}
                fill
                style={{ objectFit: "contain", objectPosition: "center bottom", padding: "20px" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="fdm-photo-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                <span>Photo du véhicule</span>
              </div>
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
        </div>

      </div>
    </section>
  );
}
