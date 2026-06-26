interface HeroProps {
  line1?: string;
  line2?: string;
  line3?: string;
  subtitle?: string;
  waNumber?: string;
}

export default function Hero({ line1, line2, line3, subtitle, waNumber }: HeroProps) {
  const t1 = line1 ?? "Voitures chinoises.";
  const t2 = line2 ?? "Neuves.";
  const t3 = line3 ?? "Direct Chine.";
  const sub = subtitle ?? "Une commande. Un suivi. Un véhicule neuf livré CIF à votre port — jusqu'au dédouanement et à l'immatriculation. Pas de compromis, pas d'approximation — juste le travail bien fait.";
  const wa = waNumber ?? "8619587439774";
  const waMsg = encodeURIComponent("Bonjour, je souhaite obtenir des informations sur vos véhicules.");

  return (
    <>
      <section className="hero" id="hero">
        {/* Voiture animée en arrière-plan */}
        <div className="hero-car-wrap" aria-hidden="true">
          <svg className="hero-car-svg" viewBox="0 0 320 95" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Carrosserie */}
            <path d="M8 68 L8 44 Q8 37 15 37 L62 37 L94 14 L218 14 L244 37 L305 37 Q312 37 312 44 L312 68 Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
            {/* Vitres */}
            <path d="M97 37 L97 16 L216 16 L242 37 Z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
            {/* Phare avant */}
            <rect x="306" y="46" width="6" height="10" rx="2" stroke="white" strokeWidth="1.2"/>
            {/* Roue avant */}
            <circle cx="72" cy="68" r="22" stroke="white" strokeWidth="1.6" className="hero-wheel"/>
            <circle cx="72" cy="68" r="9" stroke="white" strokeWidth="1.4"/>
            {/* Roue arrière */}
            <circle cx="240" cy="68" r="22" stroke="white" strokeWidth="1.6" className="hero-wheel"/>
            <circle cx="240" cy="68" r="9" stroke="white" strokeWidth="1.4"/>
          </svg>
        </div>

        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span>Import automobile neuf · Livré jusqu&apos;au port maritime de votre pays</span>
          </div>
          <h1 className="hero-title">
            <span className="hero-line-1">{t1}</span>
            <em>{t2}</em>
            <strong>{t3}</strong>
          </h1>
          <p className="hero-sub">{sub}</p>
          <div className="hero-cta-wrap">
            <a href="#catalogue" className="hero-btn-catalogue">Voir le catalogue</a>
          </div>
        </div>
      </section>
    </>
  );
}
