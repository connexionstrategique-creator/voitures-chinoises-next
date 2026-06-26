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
        {/* Voiture animée qui traverse le hero */}
        <div className="hero-anim-overlay" aria-hidden="true">
          <div className="hero-car-inner">
          <svg className="hero-car-svg" viewBox="0 0 320 95" width="300" height="89" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Carrosserie SUV épuré */}
            <path d="M6 68 L6 46 Q6 38 14 38 L56 38 L88 16 L228 16 L254 38 L306 38 Q314 38 314 46 L314 68 Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
            {/* Vitres panoramiques */}
            <path d="M91 38 L91 18 L226 18 L252 38 Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
            {/* Montant central */}
            <line x1="158" y1="18" x2="158" y2="38" stroke="white" strokeWidth="1"/>
            {/* Phare avant LED */}
            <rect x="308" y="46" width="6" height="9" rx="1.5" stroke="white" strokeWidth="1.2"/>
            <line x1="308" y1="49" x2="314" y2="49" stroke="white" strokeWidth="0.8"/>
            {/* Feux arrière */}
            <rect x="6" y="47" width="4" height="7" rx="1" stroke="white" strokeWidth="1"/>

            {/* Roue arrière — rayons */}
            <g className="hero-wheel">
              <circle cx="72" cy="68" r="22" stroke="white" strokeWidth="1.6"/>
              <circle cx="72" cy="68" r="6" stroke="white" strokeWidth="1.2"/>
              <line x1="72" y1="46" x2="72" y2="62" stroke="white" strokeWidth="1.1"/>
              <line x1="72" y1="74" x2="72" y2="90" stroke="white" strokeWidth="1.1"/>
              <line x1="50" y1="68" x2="66" y2="68" stroke="white" strokeWidth="1.1"/>
              <line x1="78" y1="68" x2="94" y2="68" stroke="white" strokeWidth="1.1"/>
              <line x1="56.4" y1="52.4" x2="67.5" y2="63.5" stroke="white" strokeWidth="1.1"/>
              <line x1="76.5" y1="72.5" x2="87.6" y2="83.6" stroke="white" strokeWidth="1.1"/>
              <line x1="87.6" y1="52.4" x2="76.5" y2="63.5" stroke="white" strokeWidth="1.1"/>
              <line x1="67.5" y1="72.5" x2="56.4" y2="83.6" stroke="white" strokeWidth="1.1"/>
            </g>

            {/* Roue avant — rayons */}
            <g className="hero-wheel">
              <circle cx="240" cy="68" r="22" stroke="white" strokeWidth="1.6"/>
              <circle cx="240" cy="68" r="6" stroke="white" strokeWidth="1.2"/>
              <line x1="240" y1="46" x2="240" y2="62" stroke="white" strokeWidth="1.1"/>
              <line x1="240" y1="74" x2="240" y2="90" stroke="white" strokeWidth="1.1"/>
              <line x1="218" y1="68" x2="234" y2="68" stroke="white" strokeWidth="1.1"/>
              <line x1="246" y1="68" x2="262" y2="68" stroke="white" strokeWidth="1.1"/>
              <line x1="224.4" y1="52.4" x2="235.5" y2="63.5" stroke="white" strokeWidth="1.1"/>
              <line x1="244.5" y1="72.5" x2="255.6" y2="83.6" stroke="white" strokeWidth="1.1"/>
              <line x1="255.6" y1="52.4" x2="244.5" y2="63.5" stroke="white" strokeWidth="1.1"/>
              <line x1="235.5" y1="72.5" x2="224.4" y2="83.6" stroke="white" strokeWidth="1.1"/>
            </g>
          </svg>
          </div>{/* /hero-car-inner */}
        </div>{/* /hero-anim-overlay */}

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
