import { CARS } from "@/data/cars";

const bestSeller = CARS.find((c) => c.id === 12)!;

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-inner">
        <div className="hero-text-col">
          <div className="hero-eyebrow">Connexion Stratégique · Import Chine</div>
          <h1 className="hero-title">
            Voitures chinoises.<br />
            <em>Neuves.</em><br />
            <strong>Prix d&apos;usine.</strong>
          </h1>
          <p className="hero-sub">
            Des véhicules <strong>100% neufs</strong> importés directement depuis les meilleures usines chinoises.
            Nos prix sont <strong>CIF</strong> — coût, assurance et fret inclus jusqu&apos;à destination en Afrique francophone.
            Zéro intermédiaire, zéro compromis.
          </p>
          <div className="hero-cta-wrap">
            <a href="#catalogue" className="btn-red">Voir le catalogue complet</a>
            <a href="#pourquoi" className="btn-outline">Nos engagements</a>
          </div>
        </div>
      </div>
      <div className="hero-bestseller-wrap">
        <a href="#catalogue" className="hero-bestseller" style={{ textDecoration: "none", cursor: "pointer" }}>
          <div className="hbs-info">
            <div className="hbs-top">
              <span className="hbs-badge">🏆 Best Seller</span>
              <span className="hbs-year-tag">2026</span>
            </div>
            <div className="hbs-model">Jetour <strong>X70 Plus</strong></div>
            <div className="hbs-sub">SUV Familial · 7 Places · Neuf 0 km · Direct Usine</div>
            <div className="hbs-price">13 935 000 <sup>FCFA</sup></div>
            <div className="hbs-ports">📦 Même prix CIF — Cotonou · Lomé · Abidjan · Dakar</div>
            <div className="hbs-divider-line" />
            <div className="hbs-highlights">
              <div className="hbs-hl"><span className="hbs-hl-icon">👨‍👩‍👧‍👦</span><span className="hbs-hl-label">7 Places</span></div>
              <div className="hbs-hl"><span className="hbs-hl-icon">⛽</span><span className="hbs-hl-label">Essence</span></div>
              <div className="hbs-hl"><span className="hbs-hl-icon">🔑</span><span className="hbs-hl-label">Direct usine</span></div>
              <div className="hbs-hl"><span className="hbs-hl-icon">✅</span><span className="hbs-hl-label">Neuf 0 km</span></div>
              <div className="hbs-hl"><span className="hbs-hl-icon">🛡️</span><span className="hbs-hl-label">Garantie</span></div>
              <div className="hbs-hl"><span className="hbs-hl-icon">🌍</span><span className="hbs-hl-label">Livraison Afrique</span></div>
            </div>
            <div className="hbs-cta">Voir la fiche complète <span className="hbs-arrow">→</span></div>
          </div>
          <div className="hbs-img-wrap">
            {/* Placeholder SVG car */}
            <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
              <ellipse cx="300" cy="235" rx="240" ry="12" fill="rgba(0,0,0,0.3)" />
              <path d="M55 190 L90 140 L165 105 L275 92 L380 92 L460 108 L530 145 L555 185 L555 215 L55 215 Z" fill={bestSeller.color} />
              <path d="M130 190 L158 138 L230 110 L320 100 L410 102 L470 122 L498 155 L498 190 Z" fill="rgba(0,0,0,0.2)" />
              <path d="M160 138 L188 112 L270 100 L360 97 L430 102 L464 122 L478 140 L478 155 L160 155 Z" fill="#111" opacity="0.5" />
              <circle cx="155" cy="212" r="33" fill="#0a0a0a" /><circle cx="155" cy="212" r="24" fill="#222" /><circle cx="155" cy="212" r="12" fill="#555" /><circle cx="155" cy="212" r="5" fill={bestSeller.color} />
              <circle cx="448" cy="212" r="33" fill="#0a0a0a" /><circle cx="448" cy="212" r="24" fill="#222" /><circle cx="448" cy="212" r="12" fill="#555" /><circle cx="448" cy="212" r="5" fill={bestSeller.color} />
            </svg>
          </div>
        </a>
      </div>
    </section>
  );
}
