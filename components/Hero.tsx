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
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span>Import automobile neuf · Livré jusqu&apos;au maritime</span>
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
